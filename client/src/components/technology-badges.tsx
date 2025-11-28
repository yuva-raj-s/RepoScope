import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TechnologyInfo } from "@shared/schema";

interface TechnologyBadgesProps {
  technologies: TechnologyInfo[];
}

const categoryColors: Record<TechnologyInfo["category"], string> = {
  frontend: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  backend: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  database: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  devops: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  testing: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  other: "bg-muted text-muted-foreground border-muted-border",
};

const categoryLabels: Record<TechnologyInfo["category"], string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  devops: "DevOps",
  testing: "Testing",
  other: "Other",
};

const categoryIcons: Record<TechnologyInfo["category"], string> = {
  frontend: "◆",
  backend: "▲",
  database: "⬟",
  devops: "⬢",
  testing: "◇",
  other: "●",
};

export function TechnologyBadges({ technologies }: TechnologyBadgesProps) {
  const grouped = technologies.reduce(
    (acc, tech) => {
      if (!acc[tech.category]) {
        acc[tech.category] = [];
      }
      acc[tech.category].push(tech);
      return acc;
    },
    {} as Record<TechnologyInfo["category"], TechnologyInfo[]>
  );

  const orderedCategories: TechnologyInfo["category"][] = [
    "frontend",
    "backend",
    "database",
    "devops",
    "testing",
    "other",
  ];

  return (
    <div className="space-y-3" data-testid="technology-badges">
      {orderedCategories.map((category) => {
        const techs = grouped[category];
        if (!techs || techs.length === 0) return null;

        return (
          <div key={category} className="space-y-1.5">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono font-medium">
              {categoryIcons[category]} {categoryLabels[category].toUpperCase()}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {techs.map((tech) => (
                <Badge
                  key={tech.name}
                  variant="outline"
                  className={cn(
                    "text-xs font-medium border",
                    categoryColors[category]
                  )}
                  data-testid={`badge-tech-${tech.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {tech.name}
                </Badge>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
