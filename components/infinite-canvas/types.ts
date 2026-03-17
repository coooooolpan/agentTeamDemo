export type CardKind = "text" | "image" | "placeholder";
export type CardSize = "sm" | "md" | "lg";

export interface CanvasCard {
  id: string;
  kind: CardKind;
  size?: CardSize;
  title?: string;
  subtitle?: string;
  lines?: string[];
}

export interface FlowGroupData {
  id: string;
  title?: string;
  cards: CanvasCard[];
}

export interface WorkflowSection {
  id: string;
  step: number;
  label: string;
  subtitle?: string;
  groupLayout?: "row" | "column";
  x: number;
  y: number;
  groups: FlowGroupData[];
}
