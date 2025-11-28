import type { Express } from "express";
import { createServer, type Server } from "http";
import { 
  parseGitHubUrl, 
  getRepositoryMetadata, 
  getRepositoryTree, 
  getReadmeContent,
  getFileContents,
  extractKeyFiles
} from "./github";
import { analyzeRepository } from "./openai";
import { repositoryAnalysisRequestSchema } from "@shared/schema";
import type { RepositoryAnalysis } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/analyze", async (req, res) => {
    try {
      const parseResult = repositoryAnalysisRequestSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: parseResult.error.errors[0]?.message || "Invalid request" 
        });
      }

      const { url } = parseResult.data;
      const parsed = parseGitHubUrl(url);
      
      if (!parsed) {
        return res.status(400).json({ 
          error: "Invalid GitHub URL format. Please use: https://github.com/owner/repo" 
        });
      }

      const { owner, repo } = parsed;

      const [metadata, fileTree, readme] = await Promise.all([
        getRepositoryMetadata(owner, repo),
        getRepositoryTree(owner, repo),
        getReadmeContent(owner, repo),
      ]);

      metadata.hasReadme = readme !== null;

      const keyFilePaths = extractKeyFiles(fileTree);
      const keyFileContents = await getFileContents(owner, repo, keyFilePaths);

      const aiAnalysis = await analyzeRepository({
        repoName: metadata.fullName,
        description: metadata.description,
        language: metadata.language,
        topics: metadata.topics,
        readme,
        fileTree,
        keyFileContents,
      });

      const analysis: RepositoryAnalysis = {
        metadata,
        fileTree,
        readme,
        aiAnalysis,
        analyzedAt: new Date().toISOString(),
      };

      res.json(analysis);
    } catch (error) {
      console.error("Analysis error:", error);
      const message = error instanceof Error ? error.message : "Failed to analyze repository";
      res.status(500).json({ error: message });
    }
  });

  return httpServer;
}
