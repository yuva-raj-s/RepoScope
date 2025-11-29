import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Code2, Brain, Sparkles, Cpu, GitFork, Layers3, Database, Gauge } from "lucide-react";
import { Welcome } from "./welcome";
import { RepositoryInput } from "@/components/repository-input";
import { AnalysisProgress } from "@/components/analysis-progress";
import { AnalysisResults } from "@/components/analysis-results";
import { AppHeader } from "@/components/app-header";
import { ApiSetupModal } from "@/components/api-setup-modal";
import Aurora from "@/components/Aurora";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notification";
import { analyzeRepository } from "@/lib/ai-analysis-client";
import { parseGitHubUrl, getRepositoryMetadata, getRepositoryTree, getReadmeContent, getFileContents, extractKeyFiles } from "@/lib/github-client";
import type { RepositoryAnalysis, AnalysisProgress as AnalysisProgressType } from "@shared/schema";
import type { ApiProvider } from "@shared/api-schema";

interface ApiConfig {
  provider: ApiProvider;
  apiKey: string;
}

export default function Home() {
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [progress, setProgress] = useState<AnalysisProgressType | null>(null);
  const [apiConfig, setApiConfig] = useState<ApiConfig | null>(null);
  const [showApiModal, setShowApiModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("repoScope_apiConfig");
    if (stored) {
      try {
        setApiConfig(JSON.parse(stored));
      } catch {
        localStorage.removeItem("repoScope_apiConfig");
      }
    }
    setIsLoading(false);
  }, []);

  const handleSaveApi = (provider: ApiProvider, apiKey: string) => {
    const config = { provider, apiKey };
    setApiConfig(config);
    localStorage.setItem("repoScope_apiConfig", JSON.stringify(config));
    setShowApiModal(false);
    notify.success({
      title: "API configured!",
      description: `${provider === "gemini" ? "Google Gemini" : provider === "openai" ? "OpenAI" : provider === "claude" ? "Anthropic Claude" : "Cohere"} is ready to use`,
    });
  };

  const handleGetStarted = () => {
    setShowApiModal(true);
  };

  const handleLogoClick = () => {
    setAnalysis(null);
    setProgress(null);
  };

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      if (!apiConfig) {
        throw new Error("API configuration required");
      }
      setAnalysis(null);
      setProgress({ stage: "fetching", message: "Connecting to GitHub...", progress: 10 });
      
      const parsed = parseGitHubUrl(url);
      if (!parsed) {
        throw new Error("Invalid GitHub URL format. Please use: https://github.com/owner/repo");
      }

      const { owner, repo } = parsed;

      setProgress({ stage: "fetching", message: "Fetching repository metadata...", progress: 20 });
      const [metadata, fileTree, readme] = await Promise.all([
        getRepositoryMetadata(owner, repo),
        getRepositoryTree(owner, repo),
        getReadmeContent(owner, repo),
      ]);

      metadata.hasReadme = readme !== null;

      setProgress({ stage: "fetching", message: "Analyzing repository structure...", progress: 40 });
      const keyFilePaths = extractKeyFiles(fileTree);
      const keyFileContents = await getFileContents(owner, repo, keyFilePaths);

      setProgress({ stage: "analyzing", message: "Running AI analysis...", progress: 60 });
      const aiAnalysis = await analyzeRepository({
        repoName: metadata.fullName,
        description: metadata.description,
        language: metadata.language,
        topics: metadata.topics,
        readme,
        fileTree,
        keyFileContents,
      }, apiConfig.provider, apiConfig.apiKey);

      const analysis: RepositoryAnalysis = {
        metadata,
        fileTree,
        readme,
        aiAnalysis,
        analyzedAt: new Date().toISOString(),
      };

      return analysis;
    },
    onSuccess: (data) => {
      setProgress({ stage: "complete", message: "Analysis complete!", progress: 100 });
      setTimeout(() => {
        setProgress(null);
        setAnalysis(data);
      }, 500);
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to analyze repository";
      setProgress({ 
        stage: "error", 
        message: errorMessage, 
        progress: 0 
      });
      notify.error({
        title: "Analysis failed",
        description: errorMessage.includes("rate limit") 
          ? "API rate limit reached. Please try again later."
          : errorMessage.includes("401") || errorMessage.includes("API key")
          ? "Invalid API key. Please check your configuration."
          : errorMessage.includes("404")
          ? "Repository not found. Please check the URL."
          : "Could not complete the analysis. Please try again.",
      });
    },
  });

  const handleAnalyze = (url: string) => {
    analyzeMutation.mutate(url);
  };

  if (isLoading) {
    return null;
  }

  if (!apiConfig) {
    return (
      <>
        <AppHeader
          onLogoClick={handleLogoClick}
          onApiSettings={() => setShowApiModal(true)}
          currentView="home"
        />
        <Welcome onGetStarted={handleGetStarted} />
        <ApiSetupModal 
          open={showApiModal}
          onOpenChange={setShowApiModal}
          onSave={handleSaveApi}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background dark:bg-[#020617] relative overflow-hidden">
      {/* Light Mode: Aurora Animation */}
      <div className="fixed inset-0 z-0 dark:hidden">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>
      
      {/* Dark Mode: Grid Background */}
      <div
        className="absolute inset-0 z-0 hidden dark:block"
        style={{
          background: "#020617",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)
          `,
          backgroundSize: "32px 32px, 32px 32px, 100% 100%",
        }}
      />
      
      <div className="relative z-10">
        <AppHeader
        onLogoClick={handleLogoClick}
        onApiSettings={() => setShowApiModal(true)}
        apiProvider={apiConfig?.provider}
        currentView={
          progress?.stage === "error" || progress?.stage === "complete" ? "results" :
          progress ? "analyzing" : 
          analysis ? "results" : "input"
        }
      />

      <ApiSetupModal 
        open={showApiModal}
        onOpenChange={setShowApiModal}
        onSave={handleSaveApi}
      />

      <main className="px-4 py-6">
        {!analysis && !progress && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <section className="text-center py-8 space-y-6 gradient-hero rounded-2xl px-4 py-8 md:px-8 md:py-12">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-px w-8 accent-line"></div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium code-badge">
                  <Sparkles className="h-3.5 w-3.5 tech-icon-glow" />
                  AI-Powered Analysis
                </div>
                <div className="h-px w-8 accent-line"></div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight animate-slide-up leading-tight">
                Understand any GitHub repo
                <span className="block bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-slide-up" style={{ animationDelay: "0.1s" }}>in seconds</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-mono text-sm">
                <span className="text-primary">→</span> Paste a repository URL and get an intelligent summary of its purpose, 
                technologies, architecture, and key insights — without reading every file.
              </p>

              <div className="pt-4">
                {apiConfig ? (
                  <RepositoryInput 
                    onSubmit={handleAnalyze} 
                    isLoading={analyzeMutation.isPending} 
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p className="mb-4">Please configure your API key to get started</p>
                    <Button onClick={() => setShowApiModal(true)}>
                      Configure API
                    </Button>
                  </div>
                )}
              </div>
            </section>

            <section className="py-12">
              <h2 className="text-2xl font-bold text-center mb-2">Powerful Features</h2>
              <div className="h-px max-w-xs mx-auto mb-12 accent-line"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl glow-card hover-elevate transition-all animate-scale-in group" style={{ animationDelay: "0.1s" }}>
                  <div className="p-3 rounded-lg bg-chart-1/15 w-fit mb-4 group-hover:bg-chart-1/25 transition-colors">
                    <Layers3 className="h-5 w-5 text-chart-1 tech-icon-glow" />
                  </div>
                  <h3 className="font-semibold mb-2 code-badge inline-block">Repository Scanning</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                    Automatically fetches and maps the entire file structure, identifying key components and dependencies in milliseconds.
                  </p>
                </div>
                
                <div className="p-6 rounded-xl glow-card hover-elevate transition-all animate-scale-in group" style={{ animationDelay: "0.2s" }}>
                  <div className="p-3 rounded-lg bg-chart-2/15 w-fit mb-4 group-hover:bg-chart-2/25 transition-colors">
                    <Brain className="h-5 w-5 text-chart-2 tech-icon-glow" />
                  </div>
                  <h3 className="font-semibold mb-2 code-badge inline-block">AI-Powered Insights</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                    Advanced Gemini AI analyzes code patterns, technologies, and architecture to provide meaningful insights.
                  </p>
                </div>
                
                <div className="p-6 rounded-xl glow-card hover-elevate transition-all animate-scale-in group" style={{ animationDelay: "0.3s" }}>
                  <div className="p-3 rounded-lg bg-chart-3/15 w-fit mb-4 group-hover:bg-chart-3/25 transition-colors">
                    <Cpu className="h-5 w-5 text-chart-3 tech-icon-glow" />
                  </div>
                  <h3 className="font-semibold mb-2 code-badge inline-block">Tech Stack Detection</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                    Intelligently identifies frameworks, libraries, and tools with categorized technology badges.
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-border/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-4 rounded-lg bg-card/50 border border-border/30">
                    <Database className="h-6 w-6 text-chart-4 mb-2" />
                    <span className="text-xs font-mono text-muted-foreground uppercase">File Analysis</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-card/50 border border-border/30">
                    <Gauge className="h-6 w-6 text-chart-5 mb-2" />
                    <span className="text-xs font-mono text-muted-foreground uppercase">Performance</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-card/50 border border-border/30">
                    <GitFork className="h-6 w-6 text-chart-1 mb-2" />
                    <span className="text-xs font-mono text-muted-foreground uppercase">Dependencies</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-card/50 border border-border/30">
                    <Code2 className="h-6 w-6 text-chart-2 mb-2" />
                    <span className="text-xs font-mono text-muted-foreground uppercase">Code Quality</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {progress && !analysis && (
          <div className="py-12">
            <AnalysisProgress progress={progress} />
          </div>
        )}

        {analysis && (
          <div className="py-6 animate-fade-in">
            <div className="max-w-6xl mx-auto mb-6 animate-slide-up">
              <RepositoryInput 
                onSubmit={handleAnalyze} 
                isLoading={analyzeMutation.isPending} 
              />
            </div>
            <AnalysisResults analysis={analysis} />
          </div>
        )}
      </main>

      </div>
      <footer className="border-t py-6 mt-12 relative z-10">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>RepoScope — AI-powered GitHub repository analysis</p>
        </div>
      </footer>
    </div>
  );
}
