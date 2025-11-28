import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, FileCode, FileJson, File, FileType } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FileNode } from "@shared/schema";

interface FileTreeProps {
  nodes: FileNode[];
  level?: number;
}

const getFileIcon = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "py":
    case "rb":
    case "go":
    case "rs":
    case "java":
    case "c":
    case "cpp":
    case "h":
      return <FileCode className="h-4 w-4 text-chart-1" />;
    case "json":
    case "yaml":
    case "yml":
    case "toml":
      return <FileJson className="h-4 w-4 text-chart-4" />;
    case "md":
    case "mdx":
    case "txt":
      return <FileText className="h-4 w-4 text-chart-2" />;
    case "css":
    case "scss":
    case "less":
      return <FileType className="h-4 w-4 text-chart-3" />;
    default:
      return <File className="h-4 w-4 text-muted-foreground" />;
  }
};

function FileTreeNode({ node, level = 0 }: { node: FileNode; level?: number }) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const isDirectory = node.type === "dir";
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer hover-elevate",
          "text-sm font-mono transition-colors"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => isDirectory && setIsExpanded(!isExpanded)}
        data-testid={`tree-node-${node.path.replace(/\//g, "-")}`}
      >
        {isDirectory ? (
          <>
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )
            ) : (
              <span className="w-4" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 text-chart-4 flex-shrink-0" />
            ) : (
              <Folder className="h-4 w-4 text-chart-4 flex-shrink-0" />
            )}
          </>
        ) : (
          <>
            <span className="w-4" />
            {getFileIcon(node.name)}
          </>
        )}
        <span className="truncate">{node.name}</span>
        {node.size !== undefined && node.type === "file" && (
          <span className="ml-auto text-xs text-muted-foreground flex-shrink-0">
            {formatFileSize(node.size)}
          </span>
        )}
      </div>
      {isDirectory && isExpanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <FileTreeNode key={child.path} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileTree({ nodes }: FileTreeProps) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No files found
      </div>
    );
  }

  return (
    <div className="font-mono text-sm bg-gradient-to-b from-card/50 to-card rounded-lg p-4" data-testid="file-tree">
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3 opacity-75">← File Structure</div>
      {nodes.map((node) => (
        <FileTreeNode key={node.path} node={node} />
      ))}
    </div>
  );
}
