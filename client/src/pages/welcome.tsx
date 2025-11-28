import { Code2, Sparkles, GitBranch, Cpu, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeProps {
  onGetStarted: () => void;
}

export function Welcome({ onGetStarted }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-background gradient-light-bulb flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-start gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Code2 className="h-5 w-5 text-primary" />
          </div>
          <span className="font-semibold text-lg">RepoScope</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="max-w-2xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium code-badge mb-6">
              <Sparkles className="h-3.5 w-3.5 tech-icon-glow" />
              Welcome to RepoScope
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6 animate-slide-up">
              Understand any GitHub repo
              <span className="block bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-slide-up" style={{ animationDelay: "0.1s" }}>
                in seconds
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8 font-mono text-sm">
              <span className="text-primary">→</span> Get intelligent summaries of any GitHub repository including purpose, 
              architecture, tech stack, and key insights powered by AI.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div className="p-6 rounded-xl glow-card animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-chart-1/15 flex-shrink-0">
                  <GitBranch className="h-5 w-5 text-chart-1 tech-icon-glow" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold mb-1 code-badge inline-block">Repository Scanning</h3>
                  <p className="text-sm text-muted-foreground">Automatically fetches and analyzes the entire file structure and dependencies.</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl glow-card animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-chart-2/15 flex-shrink-0">
                  <Cpu className="h-5 w-5 text-chart-2 tech-icon-glow" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold mb-1 code-badge inline-block">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">Powered by Google Gemini, OpenAI, or Claude for comprehensive insights.</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl glow-card animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-chart-3/15 flex-shrink-0">
                  <Zap className="h-5 w-5 text-chart-3 tech-icon-glow" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold mb-1 code-badge inline-block">Tech Detection</h3>
                  <p className="text-sm text-muted-foreground">Automatically identifies frameworks, libraries, and the entire tech stack.</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl glow-card animate-scale-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-chart-5/15 flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-chart-5 tech-icon-glow" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold mb-1 code-badge inline-block">Smart Insights</h3>
                  <p className="text-sm text-muted-foreground">Get actionable insights about code quality, architecture, and best practices.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-card to-card rounded-2xl p-8 border border-primary/20 text-center animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <h2 className="text-2xl font-bold mb-3">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6">
              Set up your AI API key (bring your own from Google, OpenAI, Anthropic, or Cohere) to start analyzing repositories.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="gap-2"
                data-testid="button-get-started"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Your API key is stored securely in your browser. Never sent to our servers.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-xs text-muted-foreground">
            <div className="h-px w-12 mx-auto mb-4 accent-line"></div>
            <p>Analyze public repositories with your own AI API provider</p>
          </div>
        </div>
      </main>
    </div>
  );
}
