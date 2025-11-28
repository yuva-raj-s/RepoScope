import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { GitBranch, Code2, Brain, Sparkles, Zap, Cpu, GitFork, Layers3, Database, Gauge, Settings } from "lucide-react";
import { Welcome } from "./welcome";
import { RepositoryInput } from "@/components/repository-input";
import { AnalysisProgress } from "@/components/analysis-progress";
import { AnalysisResults } from "@/components/analysis-results";
import { ThemeToggle } from "@/components/theme-toggle";
import { ApiSetupModal } from "@/components/api-setup-modal";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { RepositoryAnalysis, AnalysisProgress as AnalysisProgressType } from "@shared/schema";
import type { ApiProvider } from "@shared/api-schema";

interface ApiConfig {
  provider: ApiProvider;
  apiKey: string;
}

export default function Home() {
  const { toast } = useToast();
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
    toast({
      title: "Success!",
      description: `${provider.charAt(0).toUpperCase() + provider.slice(1)} API key configured`,
    });
  };

  const handleGetStarted = () => {
    setShowApiModal(true);
  };

  if (isLoading) {
    return null;
  }

  if (!apiConfig) {
    return (
      <>
        <Welcome onGetStarted={handleGetStarted} />
        <ApiSetupModal 
          open={showApiModal}
          onOpenChange={setShowApiModal}
          onSave={handleSaveApi}
        />
      </>
    );
  }

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      if (!apiConfig) {
        throw new Error("API configuration required");
      }
      setAnalysis(null);
      setProgress({ stage: "fetching", message: "Connecting to GitHub...", progress: 10 });
      
      const response = await apiRequest("POST", "/api/analyze", { 
        url,
        apiProvider: apiConfig.provider,
        apiKey: apiConfig.apiKey,
      });
      const data = await response.json();
      return data as RepositoryAnalysis;
    },
    onSuccess: (data) => {
      setProgress({ stage: "complete", message: "Analysis complete!", progress: 100 });
      setTimeout(() => {
        setProgress(null);
        setAnalysis(data);
      }, 500);
    },
    onError: (error: Error) => {
      setProgress({ 
        stage: "error", 
        message: error.message || "Failed to analyze repository", 
        progress: 0 
      });
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze the repository. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = (url: string) => {
    analyzeMutation.mutate(url);
  };

  return (
    <div className="min-h-screen bg-background gradient-light-bulb">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Code2 className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold text-lg">RepoScope</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowApiModal(true)}
              className="gap-2"
              data-testid="button-api-settings"
            >
              <Settings className="h-4 w-4" />
              {apiConfig ? `${apiConfig.provider}` : "Setup API"}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <ApiSetupModal 
        open={showApiModal}
        onOpenChange={setShowApiModal}
        onSave={handleSaveApi}
      />

      <main className="px-4 py-8 relative z-10">
        {!analysis && !progress && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <section className="text-center py-12 space-y-6 gradient-hero rounded-2xl px-4 py-12 md:px-8 md:py-16">
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

            <section className="py-16">
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

      <footer className="border-t py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>RepoScope — AI-powered GitHub repository analysis</p>
        </div>
      </footer>
    </div>
  );
}
