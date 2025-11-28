import { useToast } from "@/hooks/use-toast";

export function copyToClipboard(text: string, label: string = "Text") {
  const { toast } = useToast();
  
  return async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };
}

export function exportAsMarkdown(repoName: string, overview: string, purpose: string, architecture: string, technologies: any[], keyFeatures: string[], insights: string[]): string {
  const techsByCategory: Record<string, string[]> = {};
  technologies.forEach(tech => {
    if (!techsByCategory[tech.category]) {
      techsByCategory[tech.category] = [];
    }
    techsByCategory[tech.category].push(tech.name);
  });

  let markdown = `# ${repoName}\n\n`;
  markdown += `## Overview\n${overview}\n\n`;
  markdown += `## Purpose\n${purpose}\n\n`;
  markdown += `## Architecture\n${architecture}\n\n`;
  
  if (keyFeatures.length > 0) {
    markdown += `## Key Features\n`;
    keyFeatures.forEach(feature => {
      markdown += `- ${feature}\n`;
    });
    markdown += '\n';
  }

  if (Object.keys(techsByCategory).length > 0) {
    markdown += `## Technology Stack\n`;
    Object.entries(techsByCategory).forEach(([category, techs]) => {
      markdown += `\n### ${category.charAt(0).toUpperCase() + category.slice(1)}\n`;
      techs.forEach(tech => {
        markdown += `- ${tech}\n`;
      });
    });
    markdown += '\n';
  }

  if (insights.length > 0) {
    markdown += `## Insights\n`;
    insights.forEach(insight => {
      markdown += `- ${insight}\n`;
    });
  }

  return markdown;
}

export function downloadMarkdown(content: string, filename: string) {
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/markdown;charset=utf-8," + encodeURIComponent(content));
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function downloadJSON(data: any, filename: string) {
  const element = document.createElement("a");
  element.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2)));
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function animateCounter(target: number, duration: number = 600): Promise<number> {
  return new Promise((resolve) => {
    let current = 0;
    const increment = target / (duration / 16);
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(interval);
        resolve(current);
      }
    }, 16);
  });
}
