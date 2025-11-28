import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  GitFork, 
  Code2, 
  ExternalLink, 
  Calendar, 
  Sparkles, 
  FolderTree, 
  BookOpen,
  Lightbulb,
  Layers,
  Target,
  Zap,
  Copy
} from "lucide-react";
import { FileTree } from "./file-tree";
import { TechnologyBadges } from "./technology-badges";
import { AnalysisActions } from "./analysis-actions";
import { useToast } from "@/hooks/use-toast";
import type { RepositoryAnalysis } from "@shared/schema";

interface AnalysisResultsProps {
  analysis: RepositoryAnalysis;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const { metadata, fileTree, readme, aiAnalysis } = analysis;
  const { toast } = useToast();
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
      setTimeout(() => setCopiedText(null), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-slide-up" data-testid="analysis-results">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-card-border hover-elevate transition-all">
            <div className="flex items-center justify-between mb-2">
              <span></span>
              <AnalysisActions analysis={analysis} />
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2 w-full">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-xl font-bold truncate" data-testid="text-repo-name">
                    {metadata.name}
                  </CardTitle>
                  <div className="flex items-center gap-1 mt-1">
                    <p className="text-sm text-muted-foreground font-mono truncate cursor-pointer hover-elevate px-2 py-1 rounded" 
                       onClick={() => handleCopy(metadata.fullName, "Repository name")}
                       data-testid="text-repo-fullname">
                      {metadata.fullName}
                    </p>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0"
                      onClick={() => handleCopy(metadata.fullName, "Repository name")}
                      data-testid="button-copy-name"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <a
                  href={metadata.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  data-testid="link-github"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {metadata.description && (
                <p className="text-sm text-muted-foreground" data-testid="text-description">
                  {metadata.description}
                </p>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center p-3 rounded-lg bg-card border border-card-border">
                  <Star className="h-4 w-4 text-chart-4 mb-1" />
                  <span className="text-lg font-semibold" data-testid="text-stars">
                    {formatNumber(metadata.stars)}
                  </span>
                  <span className="text-xs text-muted-foreground">Stars</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg bg-card border border-card-border">
                  <GitFork className="h-4 w-4 text-chart-1 mb-1" />
                  <span className="text-lg font-semibold" data-testid="text-forks">
                    {formatNumber(metadata.forks)}
                  </span>
                  <span className="text-xs text-muted-foreground">Forks</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg bg-card border border-card-border">
                  <Code2 className="h-4 w-4 text-chart-2 mb-1" />
                  <span className="text-lg font-semibold truncate max-w-full" data-testid="text-language">
                    {metadata.language || "N/A"}
                  </span>
                  <span className="text-xs text-muted-foreground">Language</span>
                </div>
              </div>

              {metadata.topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {metadata.topics.slice(0, 8).map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs" data-testid={`badge-topic-${topic}`}>
                      {topic}
                    </Badge>
                  ))}
                </div>
              )}

              <Separator />

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>Updated {formatDate(metadata.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-card-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Layers className="h-4 w-4 text-chart-3" />
                Tech Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TechnologyBadges technologies={aiAnalysis.technologies} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-card-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-chart-3" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-chart-1" />
                  <h3 className="font-semibold">Overview</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-overview">
                  {aiAnalysis.overview}
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-chart-4" />
                  <h3 className="font-semibold">Purpose</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-purpose">
                  {aiAnalysis.purpose}
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-chart-2" />
                  <h3 className="font-semibold">Architecture</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-architecture">
                  {aiAnalysis.architecture}
                </p>
              </div>

              {aiAnalysis.keyFeatures.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-chart-3" />
                      <h3 className="font-semibold">Key Features</h3>
                    </div>
                    <ul className="space-y-2" data-testid="list-features">
                      {aiAnalysis.keyFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-chart-2 mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {aiAnalysis.insights.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-chart-5" />
                      <h3 className="font-semibold">Insights</h3>
                    </div>
                    <ul className="space-y-2" data-testid="list-insights">
                      {aiAnalysis.insights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-chart-5 mt-1">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="structure" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="structure" className="gap-2" data-testid="tab-structure">
                <FolderTree className="h-4 w-4" />
                File Structure
              </TabsTrigger>
              <TabsTrigger value="readme" className="gap-2" data-testid="tab-readme" disabled={!readme}>
                <BookOpen className="h-4 w-4" />
                README
              </TabsTrigger>
            </TabsList>
            <TabsContent value="structure">
              <Card className="border-card-border">
                <CardContent className="pt-4">
                  <ScrollArea className="h-[400px] pr-4">
                    <FileTree nodes={fileTree} />
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="readme">
              <Card className="border-card-border">
                <CardContent className="pt-4">
                  {readme ? (
                    <ScrollArea className="h-[400px] pr-4">
                      <div 
                        className="prose prose-sm dark:prose-invert max-w-none font-mono text-sm whitespace-pre-wrap"
                        data-testid="text-readme"
                      >
                        {readme}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mb-4 opacity-50" />
                      <p>No README found in this repository</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
