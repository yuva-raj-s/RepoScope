import { GoogleGenAI } from "@google/genai";
import type { AIAnalysis, FileNode, TechnologyInfo } from "@shared/schema";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

let geminiClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured. Please add your GEMINI_API_KEY to use AI analysis.");
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

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

export async function analyzeRepository(input: AnalysisInput): Promise<AIAnalysis> {
  const fileList = flattenFileTree(input.fileTree).slice(0, 100).join("\n");
  
  const keyFilesContent = Array.from(input.keyFileContents.entries())
    .map(([path, content]) => {
      const truncated = content.length > 3000 ? content.slice(0, 3000) + "\n...(truncated)" : content;
      return `--- ${path} ---\n${truncated}`;
    })
    .join("\n\n");

  const prompt = `Analyze this GitHub repository and provide a comprehensive summary.

Repository: ${input.repoName}
Primary Language: ${input.language || "Unknown"}
Topics: ${input.topics.join(", ") || "None"}
Description: ${input.description || "No description provided"}

File Structure (first 100 files):
${fileList}

${input.readme ? `README Content:\n${input.readme.slice(0, 5000)}` : "No README found."}

Key Configuration Files:
${keyFilesContent || "No configuration files found."}

Provide your analysis in the following JSON format:
{
  "overview": "A 2-3 sentence summary of what this repository is and does",
  "purpose": "A detailed explanation of the project's purpose and what problem it solves",
  "architecture": "Description of the project's architecture, structure, and how components interact",
  "keyFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  "technologies": [
    {"name": "Technology Name", "category": "frontend|backend|database|devops|testing|other", "confidence": 0.9}
  ],
  "insights": ["Insight about code quality or patterns", "Insight about project maturity", "Any other notable observations"]
}

Categories for technologies:
- frontend: UI frameworks, CSS tools, bundlers (React, Vue, Tailwind, Webpack)
- backend: Server frameworks, APIs (Express, Django, Flask, FastAPI)
- database: Databases, ORMs (PostgreSQL, MongoDB, Prisma, Drizzle)
- devops: CI/CD, containers, cloud (Docker, GitHub Actions, AWS)
- testing: Test frameworks (Jest, Pytest, Mocha)
- other: Languages, utilities, other tools

Be thorough but concise. Focus on what makes this repository unique and useful.`;

  try {
    const ai = getGemini();
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "You are an expert software engineer analyzing GitHub repositories. Provide accurate, insightful analysis in JSON format. Always respond with valid JSON only.",
        responseMimeType: "application/json",
      },
      contents: prompt,
    });

    let content: string | undefined = response.text;
    
    if (!content && response.candidates && response.candidates[0]?.content?.parts) {
      const textPart = response.candidates[0].content.parts.find((p: any) => p.text);
      content = textPart?.text || undefined;
    }
    
    if (!content) {
      console.error("No content in Gemini response:", JSON.stringify(response, null, 2));
      throw new Error("No response from AI");
    }

    let result: any;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON response:", content);
      throw new Error("Invalid JSON response from AI");
    }
    
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
    return generateFallbackAnalysis(input);
  }
}

function generateFallbackAnalysis(input: AnalysisInput): AIAnalysis {
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
