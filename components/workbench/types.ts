import type { Node } from "@xyflow/react";

export type AgentColor = "red" | "purple" | "blue" | "orange" | "green";

export type AgentPlacement = "right" | "bottom" | "top-right";

export interface AgentTag {
  label: string;
  color: AgentColor;
  placement?: AgentPlacement;
}

export type FileKind = "doc" | "image" | "video" | "markdown";

export interface WorkFile {
  id: string;
  title: string;
  kind: FileKind;
  updatedAt: string;
  note: string;
}

export type AgentRuntimeStatus = "running" | "idle" | "done";

export interface ChatAgentCard {
  id: string;
  name: string;
  summary: string;
  color: AgentColor;
  status: AgentRuntimeStatus;
  currentTask: string;
  tools: string[];
  outputs: string[];
  recentLogs: string[];
}

export interface NoteNodeData extends Record<string, unknown> {
  title: string;
  checklist: string[];
  tag: AgentTag;
  entryDelay?: number;
}

export interface DocumentNodeData extends Record<string, unknown> {
  title: string;
  subtitle: string;
  excerpt: string[];
  tag: AgentTag;
  previewFile: WorkFile;
  onOpenPreview?: (file: WorkFile) => void;
  entryDelay?: number;
}

export interface MediaNodeData extends Record<string, unknown> {
  title: string;
  kindLabel: string;
  gradient: string;
  tag: AgentTag;
  previewFile: WorkFile;
  onOpenPreview?: (file: WorkFile) => void;
  entryDelay?: number;
}

export interface VideoGenerationNodeData extends Record<string, unknown> {
  title: string;
  subtitle: string;
  progress: number;
  eta: string;
  previewFile: WorkFile;
  onOpenPreview?: (file: WorkFile) => void;
  entryDelay?: number;
}

export interface FolderNodeData extends Record<string, unknown> {
  title: string;
  filesCount: number;
  updatedAt: string;
  status: "thinking" | "finished";
  files: WorkFile[];
  onOpenPreview?: (file: WorkFile) => void;
  entryDelay?: number;
}

export type WorkbenchNode =
  | Node<NoteNodeData, "note">
  | Node<DocumentNodeData, "document">
  | Node<MediaNodeData, "media">
  | Node<VideoGenerationNodeData, "video-generation">
  | Node<FolderNodeData, "folder">;
