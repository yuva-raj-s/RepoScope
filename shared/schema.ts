import { z } from "zod";

export const repositoryAnalysisRequestSchema = z.object({
  url: z.string().url().refine(
    (url) => {
      const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/?$/;
      return githubRegex.test(url);
    },
    { message: "Please enter a valid GitHub repository URL" }
  ),
});

export type RepositoryAnalysisRequest = z.infer<typeof repositoryAnalysisRequestSchema>;

export interface FileNode {
  name: string;
  path: string;
  type: "file" | "dir";
  size?: number;
  children?: FileNode[];
}

export interface TechnologyInfo {
  name: string;
  category: "frontend" | "backend" | "devops" | "testing" | "database" | "other";
  confidence: number;
}

export interface RepositoryMetadata {
  name: string;
  fullName: string;
  description: string | null;
  owner: string;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  defaultBranch: string;
  updatedAt: string;
  url: string;
  hasReadme: boolean;
}

export interface AIAnalysis {
  overview: string;
  purpose: string;
  architecture: string;
  keyFeatures: string[];
  technologies: TechnologyInfo[];
  insights: string[];
}

export interface RepositoryAnalysis {
  metadata: RepositoryMetadata;
  fileTree: FileNode[];
  readme: string | null;
  aiAnalysis: AIAnalysis;
  analyzedAt: string;
}

export interface AnalysisProgress {
  stage: "fetching" | "scanning" | "analyzing" | "complete" | "error";
  message: string;
  progress: number;
}
