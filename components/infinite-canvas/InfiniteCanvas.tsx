"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  applyNodeChanges,
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
  type NodeChange,
  type Node,
  type NodeProps,
  type NodeTypes,
  useReactFlow,
  useViewport,
} from "@xyflow/react";
import { Menu, Minus, Plus } from "lucide-react";

import { ContentCard } from "./ContentCard";
import { StepLabel } from "./StepLabel";
import { workflowSections } from "./canvasData";
import type { CanvasCard, WorkflowSection } from "./types";

type AssetResourceType = "doc" | "image" | "video";

type StepNodeData = {
  step: number;
  label: string;
  subtitle?: string;
};

type GroupNodeData = {
  title?: string;
  width: number;
  height: number;
};

type AssetNodeData = {
  card: CanvasCard;
  resourceType: AssetResourceType;
  width: number;
  height: number;
};

type StepNode = Node<StepNodeData, "step-label">;
type GroupNode = Node<GroupNodeData, "group-container">;
type AssetNode = Node<AssetNodeData, "asset">;
type CanvasNode = StepNode | GroupNode | AssetNode;

type EditorAction = {
  id: string;
  label: string;
  tone?: "danger";
};

interface InfiniteCanvasProps {
  onOpenSidebar?: () => void;
  onPaneClick?: () => void;
  focusNodeRequest?: {
    nodeId: string;
    nonce: number;
  } | null;
}

const GROUP_PADDING_X = 14;
const GROUP_PADDING_BOTTOM = 14;
const GROUP_CARD_GAP = 12;
const GROUP_GAP = 16;
const SECTION_TOP_OFFSET = 42;
const HISTORY_LIMIT = 80;

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function cloneNodesSnapshot<T>(nodes: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(nodes);
  }

  return JSON.parse(JSON.stringify(nodes)) as T;
}

function getAssetRect(node: AssetNode): Rect {
  return {
    x: node.position.x,
    y: node.position.y,
    width: node.data.width,
    height: node.data.height,
  };
}

function getAssetsBounds(nodes: AssetNode[]): Rect {
  const minX = Math.min(...nodes.map((node) => node.position.x));
  const minY = Math.min(...nodes.map((node) => node.position.y));
  const maxX = Math.max(...nodes.map((node) => node.position.x + node.data.width));
  const maxY = Math.max(...nodes.map((node) => node.position.y + node.data.height));

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function rectsOverlap(a: Rect, b: Rect, padding = 14) {
  return !(
    a.x + a.width + padding <= b.x ||
    b.x + b.width + padding <= a.x ||
    a.y + a.height + padding <= b.y ||
    b.y + b.height + padding <= a.y
  );
}

function findPlacementOffset(sourceBounds: Rect, existingRects: Rect[]) {
  const baseOffsetX = sourceBounds.width + 72;
  const baseOffsetY = 0;
  let offsetX = baseOffsetX;
  let offsetY = baseOffsetY;

  for (let attempt = 0; attempt < 90; attempt += 1) {
    const nextBounds: Rect = {
      x: sourceBounds.x + offsetX,
      y: sourceBounds.y + offsetY,
      width: sourceBounds.width,
      height: sourceBounds.height,
    };

    const collision = existingRects.some((rect) => rectsOverlap(nextBounds, rect));
    if (!collision) {
      return { x: offsetX, y: offsetY };
    }

    offsetY += 34;
    if (attempt > 0 && attempt % 14 === 0) {
      offsetX += 72;
      offsetY = 0;
    }
  }

  return { x: offsetX, y: offsetY };
}

function getCardMetrics(card: CanvasCard, section: WorkflowSection) {
  if (card.kind === "text") {
    return {
      width: 198,
      height: 188,
      resourceType: "doc" as AssetResourceType,
    };
  }

  if (card.kind === "image") {
    return {
      width: card.size === "lg" ? 220 : 178,
      height: card.size === "lg" ? 186 : 182,
      resourceType: "image" as AssetResourceType,
    };
  }

  return {
    width: card.size === "lg" ? 212 : card.size === "sm" ? 198 : 178,
    height: card.size === "lg" ? 162 : card.size === "sm" ? 170 : 182,
    resourceType: section.step >= 4 ? ("video" as AssetResourceType) : ("image" as AssetResourceType),
  };
}

function createCanvasNodesFromSections(sections: WorkflowSection[]): CanvasNode[] {
  const nodes: CanvasNode[] = [];

  sections.forEach((section) => {
    const stepNodeId = `step-${section.id}`;
    nodes.push({
      id: stepNodeId,
      type: "step-label",
      position: { x: section.x, y: section.y },
      data: {
        step: section.step,
        label: section.label,
        subtitle: section.subtitle,
      },
      draggable: false,
      selectable: false,
      style: { zIndex: 2, pointerEvents: "none" },
    });

    const groupTop = section.y + SECTION_TOP_OFFSET;
    let currentX = section.x;
    let currentY = groupTop;

    section.groups.forEach((group) => {
      const cardsWithMetrics = group.cards.map((card) => {
        const metrics = getCardMetrics(card, section);
        return { card, ...metrics };
      });

      const contentTop = group.title ? 30 : 14;
      const cardsHeight = Math.max(...cardsWithMetrics.map((item) => item.height));
      const cardsWidth = cardsWithMetrics.reduce((sum, item) => sum + item.width, 0);
      const cardsGapWidth = Math.max(0, cardsWithMetrics.length - 1) * GROUP_CARD_GAP;
      const groupWidth = GROUP_PADDING_X * 2 + cardsWidth + cardsGapWidth;
      const groupHeight = contentTop + cardsHeight + GROUP_PADDING_BOTTOM;

      const groupX = section.groupLayout === "row" ? currentX : section.x;
      const groupY = section.groupLayout === "row" ? groupTop : currentY;

      nodes.push({
        id: `group-${section.id}-${group.id}`,
        type: "group-container",
        position: { x: groupX, y: groupY },
        data: {
          title: group.title,
          width: groupWidth,
          height: groupHeight,
        },
        draggable: false,
        selectable: false,
        style: { zIndex: 1, pointerEvents: "none" },
      });

      let cardX = groupX + GROUP_PADDING_X;
      const cardY = groupY + contentTop;

      cardsWithMetrics.forEach((item) => {
        nodes.push({
          id: `asset-${section.id}-${group.id}-${item.card.id}`,
          type: "asset",
          position: { x: cardX, y: cardY },
          data: {
            card: item.card,
            width: item.width,
            height: item.height,
            resourceType: item.resourceType,
          },
          draggable: true,
          selectable: true,
          style: { zIndex: 6 },
        });

        cardX += item.width + GROUP_CARD_GAP;
      });

      if (section.groupLayout === "row") {
        currentX += groupWidth + GROUP_GAP;
      } else {
        currentY += groupHeight + GROUP_GAP;
      }
    });
  });

  return nodes;
}

function StepLabelNode({ data }: NodeProps<StepNode>) {
  return (
    <div className="nodrag nopan pointer-events-none w-fit">
      <StepLabel step={data.step} label={data.label} />
      {data.subtitle ? (
        <p className="mt-1 text-[11px] font-medium text-[#a4aebe]">{data.subtitle}</p>
      ) : null}
    </div>
  );
}

function GroupContainerNode({ data }: NodeProps<GroupNode>) {
  return (
    <div
      className="nodrag nopan pointer-events-none rounded-[24px] border border-dashed border-[#d8dee9] bg-white/24 p-3.5"
      style={{ width: data.width, height: data.height }}
    >
      {data.title ? (
        <p className="text-xs font-medium text-[#a6afbf]">{data.title}</p>
      ) : null}
    </div>
  );
}

function AssetCardNode({ data, selected }: NodeProps<AssetNode>) {
  return (
    <div
      className={`rounded-[22px] p-1 transition-shadow ${
        selected
          ? "ring-2 ring-[#9eb8ff]/65 shadow-[0_10px_18px_rgba(82,114,196,0.22)]"
          : "shadow-[0_4px_10px_rgba(15,23,42,0.08)]"
      }`}
      style={{ width: data.width + 8, minHeight: data.height + 8 }}
    >
      <ContentCard card={data.card} />
    </div>
  );
}

const nodeTypes: NodeTypes = {
  "step-label": StepLabelNode,
  "group-container": GroupContainerNode,
  asset: AssetCardNode,
};

function buildEditorActions(resourceTypes: Set<AssetResourceType>): EditorAction[] {
  if (resourceTypes.size > 1) {
    return [
      { id: "copy", label: "Copy" },
      { id: "duplicate", label: "Duplicate" },
      { id: "delete", label: "Delete", tone: "danger" },
    ];
  }

  const type = Array.from(resourceTypes)[0];
  if (type === "doc") {
    return [
      { id: "summarize", label: "Summarize" },
      { id: "rewrite", label: "Rewrite" },
      { id: "copy", label: "Copy" },
      { id: "duplicate", label: "Duplicate" },
      { id: "delete", label: "Delete", tone: "danger" },
    ];
  }

  if (type === "image") {
    return [
      { id: "enhance", label: "Enhance" },
      { id: "variations", label: "Variations" },
      { id: "copy", label: "Copy" },
      { id: "duplicate", label: "Duplicate" },
      { id: "delete", label: "Delete", tone: "danger" },
    ];
  }

  return [
    { id: "trim", label: "Trim" },
    { id: "captions", label: "Captions" },
    { id: "copy", label: "Copy" },
    { id: "duplicate", label: "Duplicate" },
    { id: "delete", label: "Delete", tone: "danger" },
  ];
}

function CanvasInner({ onOpenSidebar, onPaneClick, focusNodeRequest }: InfiniteCanvasProps) {
  const initialNodes = useMemo(() => createCanvasNodesFromSections(workflowSections), []);
  const [nodes, setNodes] = useState<CanvasNode[]>(initialNodes);
  const [clipboardNodes, setClipboardNodes] = useState<AssetNode[]>([]);
  const { fitView, setCenter, zoomIn, zoomOut } = useReactFlow<CanvasNode>();
  const viewport = useViewport();
  const lastHandledFocusNonceRef = useRef<number | null>(null);
  const historyRef = useRef<CanvasNode[][]>([]);
  const isHistoryApplyingRef = useRef(false);

  const pushHistorySnapshot = useCallback((snapshot: CanvasNode[]) => {
    historyRef.current.push(cloneNodesSnapshot(snapshot));
    if (historyRef.current.length > HISTORY_LIMIT) {
      historyRef.current.shift();
    }
  }, []);

  const applyHistoryUndo = useCallback(() => {
    const previousSnapshot = historyRef.current.pop();
    if (!previousSnapshot) {
      return;
    }

    isHistoryApplyingRef.current = true;
    setNodes(cloneNodesSnapshot(previousSnapshot));
    queueMicrotask(() => {
      isHistoryApplyingRef.current = false;
    });
  }, [setNodes]);

  const onNodesChange = useCallback(
    (changes: NodeChange<CanvasNode>[]) => {
      setNodes((previousNodes) => {
        if (!isHistoryApplyingRef.current) {
          const shouldPushHistory = changes.some((change) => {
            if (change.type === "add" || change.type === "remove" || change.type === "replace") {
              return true;
            }

            if (change.type === "position") {
              return change.dragging === false;
            }

            return false;
          });

          if (shouldPushHistory) {
            pushHistorySnapshot(previousNodes);
          }
        }

        return applyNodeChanges(changes, previousNodes) as CanvasNode[];
      });
    },
    [pushHistorySnapshot],
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      fitView({
        padding: 0.14,
        duration: 0,
      });
    });

    return () => cancelAnimationFrame(id);
  }, [fitView]);

  useEffect(() => {
    if (!focusNodeRequest) {
      return;
    }

    if (lastHandledFocusNonceRef.current === focusNodeRequest.nonce) {
      return;
    }

    const targetNode = nodes.find((node) => node.id === focusNodeRequest.nodeId);
    if (!targetNode || targetNode.type !== "asset") {
      return;
    }

    lastHandledFocusNonceRef.current = focusNodeRequest.nonce;

    const animationId = requestAnimationFrame(() => {
      setNodes((previousNodes) =>
        previousNodes.map((node) =>
          node.type === "asset"
            ? {
                ...node,
                selected: node.id === targetNode.id,
              }
            : node,
        ),
      );
    });

    setCenter(
      targetNode.position.x + targetNode.data.width / 2,
      targetNode.position.y + targetNode.data.height / 2,
      {
        zoom: Math.max(0.88, viewport.zoom),
        duration: 420,
      },
    );
    return () => cancelAnimationFrame(animationId);
  }, [focusNodeRequest, nodes, setCenter, setNodes, viewport.zoom]);

  const selectedAssetNodes = useMemo(
    () => nodes.filter((node): node is AssetNode => node.type === "asset" && !!node.selected),
    [nodes],
  );

  const selectedResourceTypes = useMemo(
    () => new Set(selectedAssetNodes.map((node) => node.data.resourceType)),
    [selectedAssetNodes],
  );

  const editorActions = useMemo(
    () => buildEditorActions(selectedResourceTypes),
    [selectedResourceTypes],
  );

  const duplicateAssets = useCallback(
    (sourceAssets: AssetNode[]) => {
      if (sourceAssets.length === 0) {
        return;
      }

      setNodes((previousNodes) => {
        const existingAssets = previousNodes.filter(
          (node): node is AssetNode => node.type === "asset",
        );
        const sourceBounds = getAssetsBounds(sourceAssets);
        const placementOffset = findPlacementOffset(
          sourceBounds,
          existingAssets.map(getAssetRect),
        );
        const timestamp = Date.now().toString(36);
        const clonedNodes: AssetNode[] = sourceAssets.map((node, index) => ({
          ...node,
          id: `${node.id}-copy-${timestamp}-${index}`,
          selected: true,
          position: {
            x: node.position.x + placementOffset.x,
            y: node.position.y + placementOffset.y,
          },
          data: {
            ...node.data,
            card: {
              ...node.data.card,
              id: `${node.data.card.id}-copy-${timestamp}-${index}`,
            },
          },
        }));

        pushHistorySnapshot(previousNodes);

        return [
          ...previousNodes.map((node) =>
            node.type === "asset"
              ? { ...node, selected: false }
              : node,
          ),
          ...clonedNodes,
        ];
      });
    },
    [pushHistorySnapshot],
  );

  const copySelectedAssets = useCallback(() => {
    if (selectedAssetNodes.length === 0) {
      return;
    }

    setClipboardNodes(
      selectedAssetNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          card: {
            ...node.data.card,
          },
        },
      })),
    );
  }, [selectedAssetNodes]);

  const deleteSelectedAssets = useCallback(() => {
    if (selectedAssetNodes.length === 0) {
      return;
    }

    const selectedIds = new Set(selectedAssetNodes.map((node) => node.id));
    setNodes((previousNodes) => {
      pushHistorySnapshot(previousNodes);
      return previousNodes.filter((node) => !selectedIds.has(node.id));
    });
  }, [pushHistorySnapshot, selectedAssetNodes]);

  const handleEditorAction = useCallback(
    (actionId: string) => {
      if (actionId === "copy") {
        copySelectedAssets();
        return;
      }

      if (actionId === "duplicate") {
        duplicateAssets(selectedAssetNodes);
        return;
      }

      if (actionId === "delete") {
        deleteSelectedAssets();
      }
    },
    [copySelectedAssets, deleteSelectedAssets, duplicateAssets, selectedAssetNodes],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const withMeta = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      if (withMeta && key === "c") {
        event.preventDefault();
        copySelectedAssets();
        return;
      }

      if (withMeta && key === "v") {
        event.preventDefault();
        duplicateAssets(clipboardNodes);
        return;
      }

      if (withMeta && key === "d") {
        event.preventDefault();
        duplicateAssets(selectedAssetNodes);
        return;
      }

      if (withMeta && key === "z" && !event.shiftKey) {
        event.preventDefault();
        applyHistoryUndo();
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        deleteSelectedAssets();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    applyHistoryUndo,
    clipboardNodes,
    copySelectedAssets,
    deleteSelectedAssets,
    duplicateAssets,
    selectedAssetNodes,
  ]);

  const floatingBarPosition = useMemo(() => {
    if (selectedAssetNodes.length === 0) {
      return null;
    }

    const minX = Math.min(...selectedAssetNodes.map((node) => node.position.x));
    const minY = Math.min(...selectedAssetNodes.map((node) => node.position.y));
    const maxX = Math.max(
      ...selectedAssetNodes.map((node) => node.position.x + node.data.width),
    );

    const centerX = (minX + maxX) / 2;
    const x = centerX * viewport.zoom + viewport.x;
    const y = minY * viewport.zoom + viewport.y;

    return {
      left: x,
      top: Math.max(10, y - 44),
    };
  }, [selectedAssetNodes, viewport.x, viewport.y, viewport.zoom]);

  const zoomLabel = `${Math.round(viewport.zoom * 100)}%`;
  const dotGap = 28 / Math.max(viewport.zoom, 1);
  const dotSize = 1.8 / Math.max(viewport.zoom, 1);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f4f6fa]">
      {onOpenSidebar ? (
        <button
          type="button"
          onClick={onOpenSidebar}
          className="absolute left-4 top-4 z-30 grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-white/95 text-[#4e5767] shadow-[0_12px_24px_rgba(15,23,42,0.12)] xl:hidden"
          aria-label="Open chat sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      ) : null}

      <ReactFlow
        className="canvas-custom-cursor"
        style={{ cursor: "url('/canvas-agent-cursor.svg?v=5') 7 5, auto" }}
        nodes={nodes}
        edges={[]}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        selectionOnDrag
        selectionMode={SelectionMode.Partial}
        panOnDrag={false}
        panActivationKeyCode="Space"
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        zoomOnDoubleClick={false}
        minZoom={0.2}
        maxZoom={3}
        fitView
        onPaneClick={() => {
          onPaneClick?.();
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="rgba(150,160,180,0.34)"
          gap={dotGap}
          size={dotSize}
        />
      </ReactFlow>

      {floatingBarPosition ? (
        <div
          className="pointer-events-none absolute z-40"
          style={{
            left: floatingBarPosition.left,
            top: floatingBarPosition.top,
            transform: "translateX(-50%)",
          }}
        >
          <div className="pointer-events-auto inline-flex items-center gap-0.5 rounded-full border border-white/85 bg-white/95 p-0.5 shadow-[0_10px_18px_rgba(15,23,42,0.14)] backdrop-blur-sm">
            {editorActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => handleEditorAction(action.id)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                  action.tone === "danger"
                    ? "text-[#cb3f5d] hover:bg-[#fff0f3]"
                    : "text-[#5f6b80] hover:bg-[#f2f5fa]"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none absolute bottom-4 right-4 z-20">
        <div className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-white/80 bg-white/88 p-1 shadow-[0_10px_20px_rgba(15,23,42,0.12)] backdrop-blur-sm">
          <button
            type="button"
            onClick={() => zoomOut({ duration: 180 })}
            className="grid h-8 w-8 place-items-center rounded-full text-[#7d8798] transition hover:bg-[#f0f3f8]"
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => fitView({ padding: 0.14, duration: 220 })}
            className="rounded-full px-2 text-xs font-semibold text-[#8b95a7]"
            aria-label="Reset zoom"
          >
            {zoomLabel}
          </button>
          <button
            type="button"
            onClick={() => zoomIn({ duration: 180 })}
            className="grid h-8 w-8 place-items-center rounded-full text-[#7d8798] transition hover:bg-[#f0f3f8]"
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function InfiniteCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}

export function EmbeddedInfiniteCanvas(props: InfiniteCanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  );
}
