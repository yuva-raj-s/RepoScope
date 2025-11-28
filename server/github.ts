import type { FileNode, RepositoryMetadata } from "@shared/schema";

const GITHUB_API_BASE = "https://api.github.com";

interface GitHubRepoResponse {
  name: string;
  full_name: string;
  description: string | null;
  owner: { login: string };
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  default_branch: string;
  updated_at: string;
  html_url: string;
}

interface GitHubContentItem {
  name: string;
  path: string;
  type: "file" | "dir";
  size?: number;
  download_url?: string;
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

async function fetchFromGitHub(endpoint: string): Promise<any> {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "RepoScope",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Repository not found. Make sure the URL is correct and the repository is public.");
    }
    if (response.status === 403) {
      throw new Error("GitHub API rate limit exceeded. Please try again later.");
    }
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getRepositoryMetadata(owner: string, repo: string): Promise<RepositoryMetadata> {
  const data: GitHubRepoResponse = await fetchFromGitHub(`/repos/${owner}/${repo}`);
  
  return {
    name: data.name,
    fullName: data.full_name,
    description: data.description,
    owner: data.owner.login,
    stars: data.stargazers_count,
    forks: data.forks_count,
    language: data.language,
    topics: data.topics || [],
    defaultBranch: data.default_branch,
    updatedAt: data.updated_at,
    url: data.html_url,
    hasReadme: false,
  };
}

export async function getRepositoryContents(
  owner: string, 
  repo: string, 
  path: string = ""
): Promise<GitHubContentItem[]> {
  try {
    const data = await fetchFromGitHub(`/repos/${owner}/${repo}/contents/${path}`);
    return Array.isArray(data) ? data : [data];
  } catch {
    return [];
  }
}

export async function getRepositoryTree(
  owner: string, 
  repo: string,
  maxDepth: number = 3
): Promise<FileNode[]> {
  async function buildTree(path: string = "", depth: number = 0): Promise<FileNode[]> {
    if (depth >= maxDepth) return [];
    
    const contents = await getRepositoryContents(owner, repo, path);
    const nodes: FileNode[] = [];

    const sortedContents = contents.sort((a, b) => {
      if (a.type === "dir" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "dir") return 1;
      return a.name.localeCompare(b.name);
    });

    for (const item of sortedContents) {
      if (item.name.startsWith(".") && item.name !== ".github") continue;
      if (["node_modules", "vendor", "dist", "build", "__pycache__", ".git"].includes(item.name)) continue;

      const node: FileNode = {
        name: item.name,
        path: item.path,
        type: item.type,
        size: item.size,
      };

      if (item.type === "dir" && depth < maxDepth - 1) {
        node.children = await buildTree(item.path, depth + 1);
      }

      nodes.push(node);
    }

    return nodes;
  }

  return buildTree();
}

export async function getReadmeContent(owner: string, repo: string): Promise<string | null> {
  const readmeNames = ["README.md", "readme.md", "README", "readme", "README.txt"];
  
  for (const name of readmeNames) {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${name}`
      );
      if (response.ok) {
        return response.text();
      }
    } catch {
      continue;
    }
  }
  
  return null;
}

export async function getFileContents(owner: string, repo: string, paths: string[]): Promise<Map<string, string>> {
  const contents = new Map<string, string>();
  
  const fetchPromises = paths.slice(0, 20).map(async (path) => {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${path}`
      );
      if (response.ok) {
        const text = await response.text();
        if (text.length < 50000) {
          contents.set(path, text);
        }
      }
    } catch {
    }
  });

  await Promise.all(fetchPromises);
  return contents;
}

export function extractKeyFiles(fileTree: FileNode[]): string[] {
  const keyFiles: string[] = [];
  const keyPatterns = [
    /^package\.json$/,
    /^requirements\.txt$/,
    /^Cargo\.toml$/,
    /^go\.mod$/,
    /^pom\.xml$/,
    /^build\.gradle$/,
    /^Gemfile$/,
    /^composer\.json$/,
    /^pyproject\.toml$/,
    /^setup\.py$/,
    /^Dockerfile$/,
    /^docker-compose\.ya?ml$/,
    /^\.github\/workflows\//,
    /^tsconfig\.json$/,
    /^vite\.config\./,
    /^webpack\.config\./,
    /^next\.config\./,
    /^tailwind\.config\./,
  ];

  function traverse(nodes: FileNode[]) {
    for (const node of nodes) {
      if (node.type === "file") {
        for (const pattern of keyPatterns) {
          if (pattern.test(node.path)) {
            keyFiles.push(node.path);
            break;
          }
        }
      }
      if (node.children) {
        traverse(node.children);
      }
    }
  }

  traverse(fileTree);
  return keyFiles.slice(0, 15);
}
