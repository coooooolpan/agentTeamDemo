export type OutputType = "doc" | "image" | "video" | "mixed";

export type AssetKind = "image" | "video" | "doc" | "placeholder";

export type OutputCardLayout = "doc" | "triplet" | "quad" | "strip" | "single";

export interface OutputAsset {
  id: string;
  kind: AssetKind;
  src?: string;
  title?: string;
  ratio?: "square" | "landscape" | "portrait";
}

export interface RoleMeta {
  id: string;
  name: string;
  color: string;
  avatarGradient: string;
}

export interface RoleOutputCard {
  id: string;
  outputBatchId: string;
  role: RoleMeta;
  outputType: OutputType;
  createdAt: string;
  versionIndex: number;
  title?: string;
  description?: string;
  layout?: OutputCardLayout;
  width?: number;
  height?: number;
  assets: OutputAsset[];
}

export interface StageRow {
  id: string;
  cards: RoleOutputCard[];
}

export interface StageCluster {
  id: string;
  title: string;
  top: number;
  rows: StageRow[];
}

export interface TaskCanvas {
  taskId: string;
  taskTitle: string;
  grouped: boolean;
  showCanvasBoundary: boolean;
  x: number;
  y: number;
  stages: StageCluster[];
}
