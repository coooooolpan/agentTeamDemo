import type { Node } from "@xyflow/react";

export type DemoMode = "A" | "B";

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
  level?: "primary" | "sub";
  parentAgentId?: string;
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
  isDimmed?: boolean;
}

export interface DocumentNodeData extends Record<string, unknown> {
  title: string;
  subtitle: string;
  excerpt: string[];
  tag: AgentTag;
  actorName?: string;
  versionTag?: string;
  batchId?: string;
  timelineOrder?: number;
  showOutputMeta?: boolean;
  previewFile: WorkFile;
  onOpenPreview?: (file: WorkFile) => void;
  entryDelay?: number;
  isDimmed?: boolean;
}

export interface MediaNodeData extends Record<string, unknown> {
  title: string;
  kindLabel: string;
  gradient: string;
  previewImageSrc?: string;
  previewImagePosition?: string;
  tag: AgentTag;
  actorName?: string;
  versionTag?: string;
  batchId?: string;
  timelineOrder?: number;
  showOutputMeta?: boolean;
  previewFile: WorkFile;
  onOpenPreview?: (file: WorkFile) => void;
  duplicateable?: boolean;
  onDuplicate?: () => void;
  variant?: "default" | "compact";
  entryDelay?: number;
  isDimmed?: boolean;
}

export interface VideoGenerationNodeData extends Record<string, unknown> {
  title: string;
  subtitle: string;
  progress: number;
  eta: string;
  actorName?: string;
  versionTag?: string;
  batchId?: string;
  timelineOrder?: number;
  showOutputMeta?: boolean;
  previewFile: WorkFile;
  onOpenPreview?: (file: WorkFile) => void;
  duplicateable?: boolean;
  onDuplicate?: () => void;
  variant?: "default" | "compact";
  compactAgentLabel?: string;
  compactAgentColor?: string;
  entryDelay?: number;
  isDimmed?: boolean;
}

export interface GeneratingDocumentNodeData extends Record<string, unknown> {
  title: string;
  subtitle: string;
  excerpt: string[];
  actorName?: string;
  versionTag?: string;
  batchId?: string;
  timelineOrder?: number;
  showOutputMeta?: boolean;
  previewFile: WorkFile;
  onOpenPreview?: (file: WorkFile) => void;
  progress: number;
  eta: string;
  entryDelay?: number;
  isDimmed?: boolean;
}

export interface PipelineStepNodeData extends Record<string, unknown> {
  step: number;
  title: string;
  subtitle: string;
  parallelLabel?: string;
  width: number;
  height: number;
  boards?: Array<{
    id: string;
    title?: string;
    slots: number;
    slotHeight?: number;
  }>;
}

export interface FolderNodeData extends Record<string, unknown> {
  title: string;
  filesCount: number;
  updatedAt: string;
  status: "thinking" | "finished";
  files: WorkFile[];
  onOpenPreview?: (file: WorkFile) => void;
  entryDelay?: number;
  isDimmed?: boolean;
  isExpanded?: boolean;
  onToggleExpanded?: (expanded: boolean) => void;
}

export type WorkbenchNode =
  | Node<NoteNodeData, "note">
  | Node<PipelineStepNodeData, "pipeline-step">
  | Node<DocumentNodeData, "document">
  | Node<GeneratingDocumentNodeData, "document-generating">
  | Node<MediaNodeData, "media">
  | Node<VideoGenerationNodeData, "video-generation">
  | Node<FolderNodeData, "folder">;
