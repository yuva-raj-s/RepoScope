import { Code2, Sparkles, GitBranch, Cpu, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

interface WelcomeProps {
  onGetStarted: () => void;
}

export function Welcome({ onGetStarted }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-background gradient-light-bulb flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Code2 className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold text-lg">RepoScope</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10 overflow-y-auto">
        <div className="max-w-2xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium code-badge mb-6">
              <Sparkles className="h-3.5 w-3.5 tech-icon-glow" />
              Welcome to RepoScope
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4 animate-slide-up">
              Understand any GitHub repo
              <span className="block bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-slide-up" style={{ animationDelay: "0.1s" }}>
                in seconds
              </span>
            </h1>

            <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed mb-6 font-mono text-xs">
              <span className="text-primary">→</span> Get intelligent summaries of any GitHub repository including purpose, 
              architecture, tech stack, and key insights powered by AI.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            <div className="p-4 rounded-lg glow-card animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-chart-1/15 flex-shrink-0">
                  <GitBranch className="h-4 w-4 text-chart-1 tech-icon-glow" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-semibold mb-0.5">Repository Scanning</h3>
                  <p className="text-xs text-muted-foreground">Fetches file structure and dependencies.</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg glow-card animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-chart-2/15 flex-shrink-0">
                  <Cpu className="h-4 w-4 text-chart-2 tech-icon-glow" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-semibold mb-0.5">AI Analysis</h3>
                  <p className="text-xs text-muted-foreground">Gemini, OpenAI, or Claude powered.</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg glow-card animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-chart-3/15 flex-shrink-0">
                  <Zap className="h-4 w-4 text-chart-3 tech-icon-glow" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-semibold mb-0.5">Tech Detection</h3>
                  <p className="text-xs text-muted-foreground">Identifies tech stack automatically.</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg glow-card animate-scale-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-chart-5/15 flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-chart-5 tech-icon-glow" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-semibold mb-0.5">Smart Insights</h3>
                  <p className="text-xs text-muted-foreground">Code quality and best practices.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-card to-card rounded-xl p-6 border border-primary/20 text-center animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <h2 className="text-xl font-bold mb-2">Ready to get started?</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Set up your AI API key to start analyzing repositories.
            </p>
            <Button
              onClick={onGetStarted}
              className="gap-2 w-full"
              data-testid="button-get-started"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              API key stored securely in your browser.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-xs text-muted-foreground">
            <div className="h-px w-12 mx-auto mb-3 accent-line"></div>
            <p>Bring your own AI provider key</p>
          </div>
        </div>
      </main>
    </div>
  );
}
