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

export interface NoteNodeData extends Record<string, unknown> {
  title: string;
  checklist: string[];
  tag: AgentTag;
}

export interface DocumentNodeData extends Record<string, unknown> {
  title: string;
  subtitle: string;
  excerpt: string[];
  tag: AgentTag;
  previewFile: WorkFile;
  onOpenPreview?: (file: WorkFile) => void;
}

export interface MediaNodeData extends Record<string, unknown> {
  title: string;
  kindLabel: string;
  gradient: string;
  tag: AgentTag;
  previewFile: WorkFile;
  onOpenPreview?: (file: WorkFile) => void;
}

export interface FolderNodeData extends Record<string, unknown> {
  title: string;
  filesCount: number;
  updatedAt: string;
  status: "thinking" | "finished";
  files: WorkFile[];
  onOpenPreview?: (file: WorkFile) => void;
}

export type WorkbenchNode =
  | Node<NoteNodeData, "note">
  | Node<DocumentNodeData, "document">
  | Node<MediaNodeData, "media">
  | Node<FolderNodeData, "folder">;
