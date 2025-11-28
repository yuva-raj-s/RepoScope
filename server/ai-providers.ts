import { GoogleGenAI } from "@google/genai";
import type { AIAnalysis, FileNode, TechnologyInfo } from "@shared/schema";

export type Provider = "gemini" | "openai" | "claude" | "cohere";

interface AnalysisInput {
  repoName: string;
  description: string | null;
  language: string | null;
  topics: string[];
  readme: string | null;
  fileTree: FileNode[];
  keyFileContents: Map<string, string>;
}

function flattenFileTree(nodes: FileNode[], prefix: string = ""): string[] {
  const paths: string[] = [];
  for (const node of nodes) {
    const path = prefix ? `${prefix}/${node.name}` : node.name;
    if (node.type === "dir") {
      paths.push(`${path}/`);
      if (node.children) {
        paths.push(...flattenFileTree(node.children, path));
      }
    } else {
      paths.push(path);
    }
  }
  return paths;
}

function getAnalysisPrompt(input: AnalysisInput): string {
  const fileList = flattenFileTree(input.fileTree).slice(0, 100).join("\n");
  
  const keyFilesContent = Array.from(input.keyFileContents.entries())
    .map(([path, content]) => {
      const truncated = content.length > 3000 ? content.slice(0, 3000) + "\n...(truncated)" : content;
      return `--- ${path} ---\n${truncated}`;
    })
    .join("\n\n");

  return `# Professional GitHub Repository Analysis

You are an expert software engineer and technical architect. Analyze this GitHub repository with professional depth and provide a comprehensive technical assessment.

## Repository Information
- **Name**: ${input.repoName}
- **Primary Language**: ${input.language || "Unknown"}
- **Topics/Tags**: ${input.topics.join(", ") || "None"}
- **Description**: ${input.description || "No description provided"}

## File Structure (first 100 files)
\`\`\`
${fileList}
\`\`\`

## Project Documentation
${input.readme ? `### README Content\n${input.readme.slice(0, 5000)}` : "### README\nNo README found."}

## Key Configuration & Implementation Files
${keyFilesContent || "No configuration files found."}

---

## Analysis Requirements

Analyze this repository focusing on:

1. **Overview & Purpose**
   - What is the core purpose and primary function of this project?
   - What problem does it solve or what need does it address?
   - Who are the intended users/audience?

2. **Architecture & Design**
   - Describe the overall architecture and organizational structure
   - Identify major components, modules, and how they interact
   - Note any design patterns observed (MVC, microservices, monolithic, etc.)
   - How is code organized (by feature, by layer, hybrid)?
   - Is there separation of concerns (frontend/backend, client/server)?

3. **Technology Stack Detection**
   - Identify all significant technologies, frameworks, and libraries
   - Categorize each by its role and provide confidence levels
   - Look for patterns in the configuration files, dependencies, and code
   - Note language-specific ecosystem choices

4. **Key Features & Capabilities**
   - What are the primary features this project provides?
   - What makes this project noteworthy or unique?
   - Are there advanced features indicating project maturity?

5. **Code Quality & Practices**
   - Assessment of code organization and cleanliness
   - Testing strategy (presence of test files, test frameworks)
   - Build and development workflow (scripts, automation)
   - Configuration management and environment setup

6. **Observations & Insights**
   - Project maturity level and stage of development
   - Code quality indicators (complexity, modularity)
   - Notable patterns or best practices observed
   - Potential use cases or applications
   - Any security or scalability considerations evident from structure
   - Community/maintenance indicators if visible

---

## Response Format

Respond ONLY with valid JSON in this exact structure:

\`\`\`json
{
  "overview": "A comprehensive 2-3 sentence summary of what this repository is, its purpose, and primary value proposition",
  "purpose": "A detailed 3-4 sentence explanation of the project's purpose, the specific problem it solves, target users, and its unique positioning",
  "architecture": "A detailed 4-5 sentence description of the repository's architecture including: organizational structure, major components, how components interact, design patterns employed, and separation of concerns",
  "keyFeatures": [
    "Primary feature or capability 1",
    "Primary feature or capability 2",
    "Primary feature or capability 3",
    "Primary feature or capability 4",
    "Primary feature or capability 5"
  ],
  "technologies": [
    {"name": "Technology Name", "category": "frontend|backend|database|devops|testing|other", "confidence": 0.95},
    {"name": "Technology Name", "category": "frontend|backend|database|devops|testing|other", "confidence": 0.85}
  ],
  "insights": [
    "Specific observation about code quality, patterns, or architecture",
    "Assessment of project maturity and development stage",
    "Notable best practices or design decisions observed",
    "Scalability or performance considerations evident from structure",
    "Any other significant technical observations or recommendations"
  ]
}
\`\`\`

## Technology Categories Reference
- **frontend**: UI frameworks, CSS tools, templating, bundlers, state management (React, Vue, Angular, Tailwind, Webpack, Redux)
- **backend**: Server frameworks, APIs, middleware, routing (Express, Django, Flask, FastAPI, NestJS, Spring)
- **database**: Databases, ORMs, data stores (PostgreSQL, MongoDB, MySQL, Prisma, SQLAlchemy, Redis)
- **devops**: CI/CD, containers, orchestration, cloud platforms (Docker, Kubernetes, GitHub Actions, AWS, GCP)
- **testing**: Test frameworks, assertion libraries, test runners (Jest, Pytest, Mocha, Vitest, RSpec)
- **other**: Language runtimes, utilities, build tools, documentation generators

## Important Guidelines
- Be specific and detailed in your analysis - avoid generic statements
- Provide confidence levels for technologies based on evidence from configuration files and code patterns
- Focus on what makes this repository technically interesting or notable
- Ensure all text is professional, clear, and technically accurate
- Base all observations on evidence visible in the provided code and configuration`;
}

export async function analyzeWithGemini(input: AnalysisInput, apiKey: string): Promise<AIAnalysis> {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "You are an expert software engineer analyzing GitHub repositories. Provide accurate, insightful analysis in JSON format. Always respond with valid JSON only.",
        responseMimeType: "application/json",
      },
      contents: getAnalysisPrompt(input),
    });

    let content = response.text;
    
    if (!content && response.candidates && response.candidates[0]?.content?.parts) {
      const textPart = response.candidates[0].content.parts.find((p: any) => p.text);
      content = textPart?.text || undefined;
    }
    
    if (!content) {
      throw new Error("No response from Gemini API");
    }

    const result = JSON.parse(content);
    
    const technologies: TechnologyInfo[] = (result.technologies || []).map((tech: any) => ({
      name: tech.name,
      category: ["frontend", "backend", "database", "devops", "testing", "other"].includes(tech.category) 
        ? tech.category 
        : "other",
      confidence: Math.max(0, Math.min(1, tech.confidence || 0.8)),
    }));

    return {
      overview: result.overview || "Unable to generate overview.",
      purpose: result.purpose || "Unable to determine purpose.",
      architecture: result.architecture || "Architecture details not available.",
      keyFeatures: Array.isArray(result.keyFeatures) ? result.keyFeatures.slice(0, 8) : [],
      technologies,
      insights: Array.isArray(result.insights) ? result.insights.slice(0, 5) : [],
    };
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw new Error(`Gemini API error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function analyzeWithOpenAI(input: AnalysisInput, apiKey: string): Promise<AIAnalysis> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert software engineer analyzing GitHub repositories. Provide accurate, insightful analysis in JSON format. Always respond with valid JSON only.",
          },
          {
            role: "user",
            content: getAnalysisPrompt(input),
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No response from OpenAI API");
    }

    const result = JSON.parse(content);
    
    const technologies: TechnologyInfo[] = (result.technologies || []).map((tech: any) => ({
      name: tech.name,
      category: ["frontend", "backend", "database", "devops", "testing", "other"].includes(tech.category) 
        ? tech.category 
        : "other",
      confidence: Math.max(0, Math.min(1, tech.confidence || 0.8)),
    }));

    return {
      overview: result.overview || "Unable to generate overview.",
      purpose: result.purpose || "Unable to determine purpose.",
      architecture: result.architecture || "Architecture details not available.",
      keyFeatures: Array.isArray(result.keyFeatures) ? result.keyFeatures.slice(0, 8) : [],
      technologies,
      insights: Array.isArray(result.insights) ? result.insights.slice(0, 5) : [],
    };
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function analyzeWithClaude(input: AnalysisInput, apiKey: string): Promise<AIAnalysis> {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2048,
        system: "You are an expert software engineer analyzing GitHub repositories. Provide accurate, insightful analysis in JSON format. Always respond with valid JSON only.",
        messages: [
          {
            role: "user",
            content: getAnalysisPrompt(input),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.content[0]?.text;

    if (!content) {
      throw new Error("No response from Claude API");
    }

    const result = JSON.parse(content);
    
    const technologies: TechnologyInfo[] = (result.technologies || []).map((tech: any) => ({
      name: tech.name,
      category: ["frontend", "backend", "database", "devops", "testing", "other"].includes(tech.category) 
        ? tech.category 
        : "other",
      confidence: Math.max(0, Math.min(1, tech.confidence || 0.8)),
    }));

    return {
      overview: result.overview || "Unable to generate overview.",
      purpose: result.purpose || "Unable to determine purpose.",
      architecture: result.architecture || "Architecture details not available.",
      keyFeatures: Array.isArray(result.keyFeatures) ? result.keyFeatures.slice(0, 8) : [],
      technologies,
      insights: Array.isArray(result.insights) ? result.insights.slice(0, 5) : [],
    };
  } catch (error) {
    console.error("Claude analysis error:", error);
    throw new Error(`Claude API error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function analyzeRepository(input: AnalysisInput, provider: Provider, apiKey: string): Promise<AIAnalysis> {
  switch (provider) {
    case "gemini":
      return analyzeWithGemini(input, apiKey);
    case "openai":
      return analyzeWithOpenAI(input, apiKey);
    case "claude":
      return analyzeWithClaude(input, apiKey);
    case "cohere":
      throw new Error("Cohere support coming soon");
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export function generateFallbackAnalysis(input: AnalysisInput): AIAnalysis {
  const technologies: TechnologyInfo[] = [];
  
  const techDetection: Record<string, { name: string; category: TechnologyInfo["category"] }> = {
    "package.json": { name: "Node.js", category: "backend" },
    "requirements.txt": { name: "Python", category: "backend" },
    "Cargo.toml": { name: "Rust", category: "backend" },
    "go.mod": { name: "Go", category: "backend" },
    "pom.xml": { name: "Java/Maven", category: "backend" },
    "Gemfile": { name: "Ruby", category: "backend" },
    "composer.json": { name: "PHP", category: "backend" },
    "Dockerfile": { name: "Docker", category: "devops" },
    "docker-compose.yml": { name: "Docker Compose", category: "devops" },
    "tsconfig.json": { name: "TypeScript", category: "frontend" },
  };

  function scanForTech(nodes: FileNode[]) {
    for (const node of nodes) {
      if (node.type === "file" && techDetection[node.name]) {
        const tech = techDetection[node.name];
        if (!technologies.find((t) => t.name === tech.name)) {
          technologies.push({ ...tech, confidence: 0.9 });
        }
      }
      if (node.children) {
        scanForTech(node.children);
      }
    }
  }

  scanForTech(input.fileTree);

  if (input.language) {
    const langCategory = ["JavaScript", "TypeScript", "CSS", "HTML"].includes(input.language)
      ? "frontend"
      : "backend";
    if (!technologies.find((t) => t.name === input.language)) {
      technologies.push({ name: input.language, category: langCategory, confidence: 1 });
    }
  }

  return {
    overview: input.description || `A ${input.language || "software"} project on GitHub.`,
    purpose: input.description || "Purpose not determined. Please check the README for more details.",
    architecture: "Architecture analysis requires AI processing. The file structure indicates a standard project layout.",
    keyFeatures: input.topics.length > 0 
      ? input.topics.slice(0, 5).map((t) => t.charAt(0).toUpperCase() + t.slice(1).replace(/-/g, " "))
      : ["See repository documentation for features"],
    technologies,
    insights: [
      `Primary language: ${input.language || "Unknown"}`,
      input.readme ? "Has README documentation" : "No README found",
      `${input.fileTree.length} top-level items in repository`,
    ],
  };
}
