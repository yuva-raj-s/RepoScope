import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, GitBranch, FolderSearch, Brain, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalysisProgress as AnalysisProgressType } from "@shared/schema";

interface AnalysisProgressProps {
  progress: AnalysisProgressType;
}

const stageConfig = {
  fetching: {
    icon: GitBranch,
    label: "Fetching repository...",
    color: "text-chart-1",
  },
  scanning: {
    icon: FolderSearch,
    label: "Scanning file structure...",
    color: "text-chart-2",
  },
  analyzing: {
    icon: Brain,
    label: "AI analyzing content...",
    color: "text-chart-3",
  },
  complete: {
    icon: CheckCircle2,
    label: "Analysis complete!",
    color: "text-chart-2",
  },
  error: {
    icon: XCircle,
    label: "Analysis failed",
    color: "text-destructive",
  },
};

export function AnalysisProgress({ progress }: AnalysisProgressProps) {
  const config = stageConfig[progress.stage];
  const Icon = config.icon;
  const isComplete = progress.stage === "complete";
  const isError = progress.stage === "error";

  return (
    <Card className="w-full max-w-2xl mx-auto border-card-border" data-testid="analysis-progress">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg bg-card", config.color)}>
            <Icon
              className={cn(
                "h-5 w-5",
                !isComplete && !isError && "animate-pulse"
              )}
            />
          </div>
          <div className="flex-1">
            <p className={cn("font-medium", config.color)}>{config.label}</p>
            <p className="text-sm text-muted-foreground">{progress.message}</p>
          </div>
          {!isComplete && !isError && (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          )}
        </div>
        <Progress
          value={progress.progress}
          className={cn(
            "h-2",
            isError && "[&>div]:bg-destructive"
          )}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(progress.progress)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
