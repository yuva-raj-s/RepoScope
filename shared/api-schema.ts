import { z } from "zod";

export type ApiProvider = "gemini" | "openai" | "claude" | "cohere";

export const analyzeRequestSchema = z.object({
  url: z.string().url(),
  apiProvider: z.enum(["gemini", "openai", "claude", "cohere"]),
  apiKey: z.string().min(1),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
