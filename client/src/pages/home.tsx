import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { GitBranch, Code2, Brain, Sparkles, Zap } from "lucide-react";
import { RepositoryInput } from "@/components/repository-input";
import { AnalysisProgress } from "@/components/analysis-progress";
import { AnalysisResults } from "@/components/analysis-results";
import { ThemeToggle } from "@/components/theme-toggle";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { RepositoryAnalysis, AnalysisProgress as AnalysisProgressType } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [progress, setProgress] = useState<AnalysisProgressType | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      setAnalysis(null);
      setProgress({ stage: "fetching", message: "Connecting to GitHub...", progress: 10 });
      
      const response = await apiRequest("POST", "/api/analyze", { url });
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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Code2 className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold text-lg">RepoScope</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="px-4 py-8">
        {!analysis && !progress && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <section className="text-center py-12 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Analysis
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight animate-slide-up">
                Understand any GitHub repo
                <span className="block text-primary animate-slide-up" style={{ animationDelay: "0.1s" }}>in seconds</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Paste a repository URL and get an intelligent summary of its purpose, 
                technologies, architecture, and key insights — without reading every file.
              </p>

              <div className="pt-4">
                <RepositoryInput 
                  onSubmit={handleAnalyze} 
                  isLoading={analyzeMutation.isPending} 
                />
              </div>
            </section>

            <section className="py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-card border border-card-border hover-elevate transition-all animate-scale-in" style={{ animationDelay: "0.1s" }}>
                  <div className="p-2 rounded-lg bg-chart-1/10 w-fit mb-4">
                    <GitBranch className="h-5 w-5 text-chart-1" />
                  </div>
                  <h3 className="font-semibold mb-2">Repository Scanning</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically fetches and maps the entire file structure, identifying key components and dependencies.
                  </p>
                </div>
                
                <div className="p-6 rounded-xl bg-card border border-card-border hover-elevate transition-all animate-scale-in" style={{ animationDelay: "0.2s" }}>
                  <div className="p-2 rounded-lg bg-chart-2/10 w-fit mb-4">
                    <Brain className="h-5 w-5 text-chart-2" />
                  </div>
                  <h3 className="font-semibold mb-2">AI-Powered Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced AI analyzes code patterns, technologies, and architecture to provide meaningful summaries.
                  </p>
                </div>
                
                <div className="p-6 rounded-xl bg-card border border-card-border hover-elevate transition-all animate-scale-in" style={{ animationDelay: "0.3s" }}>
                  <div className="p-2 rounded-lg bg-chart-3/10 w-fit mb-4">
                    <Code2 className="h-5 w-5 text-chart-3" />
                  </div>
                  <h3 className="font-semibold mb-2">Tech Stack Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Identifies frameworks, libraries, and tools used in the project with categorized technology badges.
                  </p>
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
