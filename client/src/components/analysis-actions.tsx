import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Download, Copy, Share2, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportAsMarkdown, downloadMarkdown, downloadJSON } from "@/lib/utils-enhanced";
import type { RepositoryAnalysis } from "@shared/schema";

interface AnalysisActionsProps {
  analysis: RepositoryAnalysis;
}

export function AnalysisActions({ analysis }: AnalysisActionsProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(analysis.metadata.url);
      toast({
        title: "Copied!",
        description: "GitHub URL copied to clipboard",
      });
    } catch {
      toast({
        title: "Failed to copy",
        variant: "destructive",
      });
    }
  };

  const handleExportMarkdown = () => {
    const markdown = exportAsMarkdown(
      analysis.metadata.fullName,
      analysis.aiAnalysis.overview,
      analysis.aiAnalysis.purpose,
      analysis.aiAnalysis.architecture,
      analysis.aiAnalysis.technologies,
      analysis.aiAnalysis.keyFeatures,
      analysis.aiAnalysis.insights
    );
    downloadMarkdown(markdown, `${analysis.metadata.name}-analysis.md`);
    toast({
      title: "Downloaded!",
      description: "Analysis exported as Markdown",
    });
    setIsOpen(false);
  };

  const handleExportJSON = () => {
    downloadJSON(analysis, `${analysis.metadata.name}-analysis.json`);
    toast({
      title: "Downloaded!",
      description: "Analysis exported as JSON",
    });
    setIsOpen(false);
  };

  const handleShare = async () => {
    const text = `Check out ${analysis.metadata.fullName} - analyzed with RepoScope\n${analysis.metadata.url}`;
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Share link copied to clipboard",
      });
    } catch {
      toast({
        title: "Failed to copy",
        variant: "destructive",
      });
    }
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" data-testid="button-analysis-actions">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopyUrl} data-testid="action-copy-url">
          <Copy className="h-4 w-4 mr-2" />
          Copy Repository URL
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShare} data-testid="action-share">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportMarkdown} data-testid="action-export-md">
          <Download className="h-4 w-4 mr-2" />
          Export as Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON} data-testid="action-export-json">
          <Download className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
