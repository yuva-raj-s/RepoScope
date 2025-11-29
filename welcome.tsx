import { Button } from "@/components/ui/button";
import { Sparkles, Code, Brain, Cpu } from "lucide-react";

interface WelcomeProps {
  onGetStarted: () => void;
}

export function Welcome({ onGetStarted }: WelcomeProps) {
  return (
    <div className="container mx-auto px-4 py-12 text-center animate-fade-in">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
        <Sparkles className="h-5 w-5" />
        <span className="font-semibold">Welcome to RepoScope</span>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
        Unlock Code Intelligence
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
        Analyze any public GitHub repository with the power of AI. Get instant insights into architecture, technology stacks, and key features without reading a single line of code.
      </p>
      <div className="flex justify-center items-center gap-6 text-muted-foreground mb-12">
        <div className="flex items-center gap-2"><Code className="h-5 w-5" /> Smart Scanning</div>
        <div className="flex items-center gap-2"><Brain className="h-5 w-5" /> AI Analysis</div>
        <div className="flex items-center gap-2"><Cpu className="h-5 w-5" /> Tech Detection</div>
      </div>
      <Button size="lg" onClick={onGetStarted} className="gap-2">
        Get Started
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </Button>
      <p className="text-sm text-muted-foreground mt-4">
        You'll need an API key from Google Gemini, OpenAI, or another provider.
      </p>
    </div>
  );
}