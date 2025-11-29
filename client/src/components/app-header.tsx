import { Code2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

interface AppHeaderProps {
  onLogoClick: () => void;
  onApiSettings: () => void;
  apiProvider?: string;
  currentView?: "home" | "input" | "analyzing" | "results";
}

export function AppHeader({
  onLogoClick,
  onApiSettings,
  apiProvider,
  currentView = "home",
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 dark:bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:supports-[backdrop-filter]:bg-black/30">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo Section */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 hover-elevate rounded-lg px-2 transition-all"
          data-testid="button-logo-home"
          title="Back to home"
        >
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Code2 className="h-5 w-5 text-primary" />
          </div>
          <span className="font-semibold text-lg">RepoScope</span>
        </button>


        {/* Right Section */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={onApiSettings}
            className="gap-2"
            data-testid="button-api-settings"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">{apiProvider ? apiProvider : "Setup API"}</span>
          </Button>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
