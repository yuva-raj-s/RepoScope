import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { repositoryAnalysisRequestSchema, type RepositoryAnalysisRequest } from "@shared/schema";

interface RepositoryInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const exampleRepos = [
  { name: "facebook/react", url: "https://github.com/facebook/react" },
  { name: "vercel/next.js", url: "https://github.com/vercel/next.js" },
  { name: "tailwindlabs/tailwindcss", url: "https://github.com/tailwindlabs/tailwindcss" },
];

export function RepositoryInput({ onSubmit, isLoading }: RepositoryInputProps) {
  const form = useForm<RepositoryAnalysisRequest>({
    resolver: zodResolver(repositoryAnalysisRequestSchema),
    defaultValues: {
      url: "",
    },
  });

  const handleSubmit = (data: RepositoryAnalysisRequest) => {
    onSubmit(data.url);
  };

  const handleExampleClick = (url: string) => {
    form.setValue("url", url);
    onSubmit(url);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex items-center">
                    <Github className="absolute left-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      {...field}
                      placeholder="https://github.com/owner/repository"
                      className="pl-12 pr-32 h-14 text-base font-mono bg-card border-card-border"
                      disabled={isLoading}
                      data-testid="input-repository-url"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="absolute right-2 gap-2"
                      data-testid="button-analyze"
                    >
                      {isLoading ? (
                        <>
                          <Search className="h-4 w-4 animate-pulse" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Analyze
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="text-muted-foreground">Try:</span>
        {exampleRepos.map((repo) => (
          <Button
            key={repo.name}
            variant="outline"
            size="sm"
            onClick={() => handleExampleClick(repo.url)}
            disabled={isLoading}
            className="font-mono text-xs"
            data-testid={`button-example-${repo.name.replace("/", "-")}`}
          >
            {repo.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
