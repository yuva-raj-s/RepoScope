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
import { notify } from "@/lib/notification";
import { exportAsMarkdown, downloadMarkdown, downloadJSON } from "@/lib/utils-enhanced";
import type { RepositoryAnalysis } from "@shared/schema";

interface AnalysisActionsProps {
  analysis: RepositoryAnalysis;
}

export function AnalysisActions({ analysis }: AnalysisActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(analysis.metadata.url);
      notify.success({
        title: "Copied!",
        description: "GitHub URL ready to paste",
      });
    } catch {
      notify.error({
        title: "Copy failed",
        description: "Could not copy to clipboard",
      });
    }
  };

  const handleExportMarkdown = () => {
    try {
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
      notify.success({
        title: "Downloaded!",
        description: "Analysis exported as Markdown file",
      });
    } catch {
      notify.error({
        title: "Export failed",
        description: "Could not export as Markdown",
      });
    }
    setIsOpen(false);
  };

  const handleExportJSON = () => {
    try {
      downloadJSON(analysis, `${analysis.metadata.name}-analysis.json`);
      notify.success({
        title: "Downloaded!",
        description: "Analysis exported as JSON file",
      });
    } catch {
      notify.error({
        title: "Export failed",
        description: "Could not export as JSON",
      });
    }
    setIsOpen(false);
  };

  const handleShare = async () => {
    const text = `Check out ${analysis.metadata.fullName} - analyzed with RepoScope\n${analysis.metadata.url}`;
    try {
      await navigator.clipboard.writeText(text);
      notify.success({
        title: "Share link copied!",
        description: "Ready to share with others",
      });
    } catch {
      notify.error({
        title: "Copy failed",
        description: "Could not copy share link",
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
