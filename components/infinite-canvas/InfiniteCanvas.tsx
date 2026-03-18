"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  applyNodeChanges,
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
  type Node,
  type NodeChange,
  type NodeProps,
  type NodeTypes,
  useReactFlow,
  useViewport,
} from "@xyflow/react";
import { AnimatePresence, motion } from "framer-motion";
import { Link2, Menu, Minus, Plus } from "lucide-react";

import { ContentCard } from "./ContentCard";
import { taskCanvases } from "./canvasData";
import { StepLabel } from "./StepLabel";
import { DocumentNode } from "../workbench/NodeCard";
import { Toolbar } from "../workbench/Toolbar";
import type { AgentColor, DocumentNodeData, WorkFile } from "../workbench/types";
import type { OutputType, RoleOutputCard, TaskCanvas } from "./types";

type AssetResourceType = OutputType;

type TaskBoundaryData = {
  title: string;
  width: number;
  height: number;
};

type StageNodeData = {
  step: number;
  label: string;
  roleName?: string;
  roleColor?: string;
  avatarGradient?: string;
};

type GroupNodeData = {
  width: number;
  height: number;
};

type OutputNodeData = {
  card: RoleOutputCard;
  resourceType: AssetResourceType;
  width: number;
  height: number;
  entryDelay: number;
};

type TaskBoundaryNode = Node<TaskBoundaryData, "task-boundary">;
type StageNode = Node<StageNodeData, "stage-label">;
type GroupNode = Node<GroupNodeData, "stage-container">;
type OutputNode = Node<OutputNodeData, "output-batch">;
type CanvasNode = TaskBoundaryNode | StageNode | GroupNode | OutputNode;

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

const ROW_GAP = 16;
const CARD_GAP = 14;
const CONTAINER_INSET_X = 14;
const CONTAINER_INSET_Y = 14;
const STAGE_LABEL_HEIGHT = 30;
const LABEL_TO_CONTAINER_GAP = 16;
const TASK_BOUNDARY_PADDING_X = 18;
const TASK_BOUNDARY_PADDING_TOP = 22;
const TASK_BOUNDARY_PADDING_BOTTOM = 20;
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

function getCardDimensions(card: RoleOutputCard) {
  if (card.width && card.height) {
    return { width: card.width, height: card.height };
  }

  if (card.layout === "doc") {
    return { width: 200, height: 248 };
  }

  if (card.layout === "single") {
    return { width: 252, height: 170 };
  }

  if (card.layout === "strip") {
    return { width: 516, height: 168 };
  }

  if (card.layout === "quad") {
    return { width: 516, height: 222 };
  }

  return { width: 516, height: 222 };
}

function getAssetRect(node: OutputNode): Rect {
  return {
    x: node.position.x,
    y: node.position.y,
    width: node.data.width,
    height: node.data.height,
  };
}

function getAssetsBounds(nodes: OutputNode[]): Rect {
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

function rectsOverlap(a: Rect, b: Rect, padding = 16) {
  return !(
    a.x + a.width + padding <= b.x ||
    b.x + b.width + padding <= a.x ||
    a.y + a.height + padding <= b.y ||
    b.y + b.height + padding <= a.y
  );
}

function findPlacementOffset(sourceBounds: Rect, existingRects: Rect[]) {
  const baseOffsetX = sourceBounds.width + 80;
  let offsetX = baseOffsetX;
  let offsetY = 0;

  for (let attempt = 0; attempt < 100; attempt += 1) {
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

    offsetY += 32;
    if (attempt > 0 && attempt % 12 === 0) {
      offsetX += 84;
      offsetY = 0;
    }
  }

  return { x: offsetX, y: offsetY };
}

function createCanvasNodesFromTasks(tasks: TaskCanvas[]): CanvasNode[] {
  const boundaryNodes: CanvasNode[] = [];
  const stageNodes: CanvasNode[] = [];
  const outputNodes: CanvasNode[] = [];

  tasks.forEach((task) => {
    let taskMinX = Number.POSITIVE_INFINITY;
    let taskMinY = Number.POSITIVE_INFINITY;
    let taskMaxX = Number.NEGATIVE_INFINITY;
    let taskMaxY = Number.NEGATIVE_INFINITY;

    task.stages.forEach((stage, stageIndex) => {
      const stageLabelX = task.x + 14;
      const stageLabelY = task.y + stage.top;
      const stageContainerX = task.x + 12;
      const stageContainerY = stageLabelY + STAGE_LABEL_HEIGHT + LABEL_TO_CONTAINER_GAP;
      const rowStartX = stageContainerX + CONTAINER_INSET_X;

      let cursorY = stageContainerY + CONTAINER_INSET_Y;
      let widestRow = 0;

      stage.rows.forEach((row) => {
        let cursorX = rowStartX;
        let rowHeight = 0;

        row.cards.forEach((card, cardIndex) => {
          const dimensions = getCardDimensions(card);
          const entryDelay = stageIndex * 0.08 + cardIndex * 0.05;

          outputNodes.push({
            id: card.id,
            type: "output-batch",
            position: { x: cursorX, y: cursorY },
            data: {
              card,
              width: dimensions.width,
              height: dimensions.height,
              resourceType: card.outputType,
              entryDelay,
            },
            draggable: true,
            selectable: true,
            style: { zIndex: 12 },
          });

          cursorX += dimensions.width + CARD_GAP;
          rowHeight = Math.max(rowHeight, dimensions.height);
        });

        const rowWidth = Math.max(0, cursorX - rowStartX - CARD_GAP);
        widestRow = Math.max(widestRow, rowWidth);
        cursorY += rowHeight + ROW_GAP;
      });

      const contentHeight = Math.max(150, cursorY - (stageContainerY + CONTAINER_INSET_Y) - ROW_GAP);
      const stageContainerWidth = Math.max(320, widestRow + CONTAINER_INSET_X * 2);
      const stageContainerHeight = contentHeight + CONTAINER_INSET_Y * 2;
      const primaryCard = stage.rows[0]?.cards[0];

      stageNodes.push({
        id: `stage-container-${task.taskId}-${stage.id}`,
        type: "stage-container",
        position: { x: stageContainerX, y: stageContainerY },
        data: {
          width: stageContainerWidth,
          height: stageContainerHeight,
        },
        draggable: false,
        selectable: false,
        style: { zIndex: 2, pointerEvents: "none" },
      });

      stageNodes.push({
        id: `stage-label-${task.taskId}-${stage.id}`,
        type: "stage-label",
        position: { x: stageLabelX, y: stageLabelY },
        data: {
          step: stageIndex + 1,
          label: stage.title,
          roleName: primaryCard?.role.name,
          roleColor: primaryCard?.role.color,
          avatarGradient: primaryCard?.role.avatarGradient,
        },
        draggable: false,
        selectable: false,
        style: { zIndex: 6, pointerEvents: "none" },
      });

      taskMinX = Math.min(taskMinX, stageContainerX);
      taskMinY = Math.min(taskMinY, stageLabelY);
      taskMaxX = Math.max(taskMaxX, stageContainerX + stageContainerWidth);
      taskMaxY = Math.max(taskMaxY, stageContainerY + stageContainerHeight);
    });

    if (task.grouped && task.showCanvasBoundary) {
      const boundaryX = taskMinX - TASK_BOUNDARY_PADDING_X;
      const boundaryY = taskMinY - TASK_BOUNDARY_PADDING_TOP;
      const boundaryWidth = taskMaxX - taskMinX + TASK_BOUNDARY_PADDING_X * 2;
      const boundaryHeight = taskMaxY - boundaryY + TASK_BOUNDARY_PADDING_BOTTOM;

      boundaryNodes.push({
        id: `task-boundary-${task.taskId}`,
        type: "task-boundary",
        position: { x: boundaryX, y: boundaryY },
        data: {
          title: task.taskTitle,
          width: boundaryWidth,
          height: boundaryHeight,
        },
        draggable: false,
        selectable: false,
        style: { zIndex: 1, pointerEvents: "none" },
      });
    }
  });

  return [...boundaryNodes, ...stageNodes, ...outputNodes];
}

function TaskBoundaryNodeView({ data }: NodeProps<TaskBoundaryNode>) {
  return (
    <div className="nodrag nopan pointer-events-none relative" style={{ width: data.width, height: data.height }}>
      <div className="absolute -top-10 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/78 px-2.5 py-1 text-[11px] font-medium text-[#a2acbc] shadow-[0_6px_14px_rgba(15,23,42,0.05)]">
        <span className="truncate">{data.title}</span>
        <Link2 className="h-3 w-3" />
      </div>
      <div className="h-full w-full rounded-[24px] border border-dashed border-[#d7deea] bg-white/[0.06]" />
    </div>
  );
}

function StageLabelNodeView({ data }: NodeProps<StageNode>) {
  return (
    <div className="nodrag nopan pointer-events-none w-fit">
      <StepLabel
        step={data.step}
        label={data.label}
        roleName={data.roleName}
        roleColor={data.roleColor}
        avatarGradient={data.avatarGradient}
      />
    </div>
  );
}

function StageContainerNodeView({ data }: NodeProps<GroupNode>) {
  return (
    <div
      className="nodrag nopan pointer-events-none rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.06))] ring-1 ring-inset ring-white/10"
      style={{ width: data.width, height: data.height }}
    />
  );
}

function OutputBatchNodeView({ data, selected }: NodeProps<OutputNode>) {
  const DocumentNodeRenderer = DocumentNode as unknown as React.ComponentType<{
    data: DocumentNodeData;
  }>;
  const roleColorMap: Record<string, AgentColor> = {
    "role-research": "orange",
    "role-copy": "purple",
    "role-character": "blue",
    "role-storyboard": "green",
    "role-editor": "red",
  };

  const documentPreviewFile: WorkFile = {
    id: `${data.card.id}-preview`,
    title: data.card.title ?? "Story Outline",
    kind: "doc",
    updatedAt: data.card.createdAt,
    note: data.card.description ?? "Generated document draft",
  };

  const documentNodeData: DocumentNodeData = {
    title: data.card.title ?? "Story Outline",
    subtitle: "A Sample Research Document",
    excerpt: [
      data.card.description ?? "Narrative and audience analysis draft",
      "line-2",
      "line-3",
    ],
    tag: {
      label: data.card.role.name,
      color: roleColorMap[data.card.role.id] ?? "blue",
    },
    previewFile: documentPreviewFile,
    entryDelay: data.entryDelay,
    isDimmed: false,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.32, delay: data.entryDelay, ease: "easeOut" }}
      className={
        selected
          ? "rounded-[18px] ring-2 ring-[#9fb7ff]/65 shadow-[0_12px_24px_rgba(85,114,196,0.2)]"
          : "rounded-[18px]"
      }
      style={{ width: data.width, height: data.height }}
    >
      {data.card.layout === "doc" ? (
        <DocumentNodeRenderer data={documentNodeData} />
      ) : (
        <ContentCard card={data.card} />
      )}
    </motion.div>
  );
}

const nodeTypes: NodeTypes = {
  "task-boundary": TaskBoundaryNodeView,
  "stage-label": StageLabelNodeView,
  "stage-container": StageContainerNodeView,
  "output-batch": OutputBatchNodeView,
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

  if (type === "video") {
    return [
      { id: "trim", label: "Trim" },
      { id: "captions", label: "Captions" },
      { id: "copy", label: "Copy" },
      { id: "duplicate", label: "Duplicate" },
      { id: "delete", label: "Delete", tone: "danger" },
    ];
  }

  return [
    { id: "adapt", label: "Adapt" },
    { id: "copy", label: "Copy" },
    { id: "duplicate", label: "Duplicate" },
    { id: "delete", label: "Delete", tone: "danger" },
  ];
}

function CanvasInner({ onOpenSidebar, onPaneClick, focusNodeRequest }: InfiniteCanvasProps) {
  const initialNodes = useMemo(() => createCanvasNodesFromTasks(taskCanvases), []);
  const [nodes, setNodes] = useState<CanvasNode[]>(initialNodes);
  const [clipboardNodes, setClipboardNodes] = useState<OutputNode[]>([]);
  const { fitView, flowToScreenPosition, setCenter, zoomIn, zoomOut } = useReactFlow<CanvasNode>();
  const viewport = useViewport();
  const canvasRootRef = useRef<HTMLDivElement | null>(null);
  const [canvasOrigin, setCanvasOrigin] = useState({ left: 0, top: 0 });
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
    const root = canvasRootRef.current;
    if (!root) {
      return;
    }

    const updateOrigin = () => {
      const rect = root.getBoundingClientRect();
      setCanvasOrigin({ left: rect.left, top: rect.top });
    };

    updateOrigin();

    const resizeObserver = new ResizeObserver(updateOrigin);
    resizeObserver.observe(root);
    window.addEventListener("resize", updateOrigin);
    window.addEventListener("scroll", updateOrigin, true);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateOrigin);
      window.removeEventListener("scroll", updateOrigin, true);
    };
  }, []);

  useEffect(() => {
    if (!focusNodeRequest) {
      return;
    }

    if (lastHandledFocusNonceRef.current === focusNodeRequest.nonce) {
      return;
    }

    const targetNode = nodes.find((node) => node.id === focusNodeRequest.nodeId);
    if (!targetNode || targetNode.type !== "output-batch") {
      return;
    }

    lastHandledFocusNonceRef.current = focusNodeRequest.nonce;

    const animationId = requestAnimationFrame(() => {
      setNodes((previousNodes) =>
        previousNodes.map((node) =>
          node.type === "output-batch"
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
        zoom: Math.max(0.92, viewport.zoom),
        duration: 420,
      },
    );

    return () => cancelAnimationFrame(animationId);
  }, [focusNodeRequest, nodes, setCenter, viewport.zoom]);

  const selectedOutputNodes = useMemo(
    () => nodes.filter((node): node is OutputNode => node.type === "output-batch" && !!node.selected),
    [nodes],
  );

  const selectedResourceTypes = useMemo(
    () => new Set(selectedOutputNodes.map((node) => node.data.resourceType)),
    [selectedOutputNodes],
  );

  const editorActions = useMemo(
    () => buildEditorActions(selectedResourceTypes),
    [selectedResourceTypes],
  );

  const duplicateOutputs = useCallback(
    (sourceOutputs: OutputNode[]) => {
      if (sourceOutputs.length === 0) {
        return;
      }

      setNodes((previousNodes) => {
        const existingOutputs = previousNodes.filter(
          (node): node is OutputNode => node.type === "output-batch",
        );
        const sourceBounds = getAssetsBounds(sourceOutputs);
        const placementOffset = findPlacementOffset(sourceBounds, existingOutputs.map(getAssetRect));
        const timestamp = Date.now().toString(36);

        const clonedNodes: OutputNode[] = sourceOutputs.map((node, index) => ({
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
              outputBatchId: `${node.data.card.outputBatchId}-copy-${timestamp}-${index}`,
            },
            entryDelay: 0,
          },
        }));

        pushHistorySnapshot(previousNodes);

        return [
          ...previousNodes.map((node) =>
            node.type === "output-batch" ? { ...node, selected: false } : node,
          ),
          ...clonedNodes,
        ];
      });
    },
    [pushHistorySnapshot],
  );

  const copySelectedOutputs = useCallback(() => {
    if (selectedOutputNodes.length === 0) {
      return;
    }

    setClipboardNodes(
      selectedOutputNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          card: {
            ...node.data.card,
            role: { ...node.data.card.role },
            assets: node.data.card.assets.map((asset) => ({ ...asset })),
          },
        },
      })),
    );
  }, [selectedOutputNodes]);

  const deleteSelectedOutputs = useCallback(() => {
    if (selectedOutputNodes.length === 0) {
      return;
    }

    const selectedIds = new Set(selectedOutputNodes.map((node) => node.id));
    setNodes((previousNodes) => {
      pushHistorySnapshot(previousNodes);
      return previousNodes.filter((node) => !selectedIds.has(node.id));
    });
  }, [pushHistorySnapshot, selectedOutputNodes]);

  const handleEditorAction = useCallback(
    (actionId: string) => {
      if (actionId === "copy") {
        copySelectedOutputs();
        return;
      }

      if (actionId === "duplicate") {
        duplicateOutputs(selectedOutputNodes);
        return;
      }

      if (actionId === "delete") {
        deleteSelectedOutputs();
      }
    },
    [copySelectedOutputs, deleteSelectedOutputs, duplicateOutputs, selectedOutputNodes],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }

      const withMeta = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      if (withMeta && key === "c") {
        event.preventDefault();
        copySelectedOutputs();
        return;
      }

      if (withMeta && key === "v") {
        event.preventDefault();
        duplicateOutputs(clipboardNodes);
        return;
      }

      if (withMeta && key === "d") {
        event.preventDefault();
        duplicateOutputs(selectedOutputNodes);
        return;
      }

      if (withMeta && key === "z" && !event.shiftKey) {
        event.preventDefault();
        applyHistoryUndo();
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        deleteSelectedOutputs();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    applyHistoryUndo,
    clipboardNodes,
    copySelectedOutputs,
    deleteSelectedOutputs,
    duplicateOutputs,
    selectedOutputNodes,
  ]);

  const floatingBarPosition = useMemo(() => {
    if (selectedOutputNodes.length === 0) {
      return null;
    }

    const minX = Math.min(...selectedOutputNodes.map((node) => node.position.x));
    const minY = Math.min(...selectedOutputNodes.map((node) => node.position.y));
    const maxX = Math.max(
      ...selectedOutputNodes.map(
        (node) => node.position.x + (node.measured?.width ?? node.data.width),
      ),
    );

    const centerX = (minX + maxX) / 2;
    const screenPosition = flowToScreenPosition({ x: centerX, y: minY });

    return {
      left: screenPosition.x - canvasOrigin.left,
      top: Math.max(10, screenPosition.y - canvasOrigin.top - 40),
    };
  }, [canvasOrigin.left, canvasOrigin.top, flowToScreenPosition, selectedOutputNodes]);

  const zoomLabel = `${Math.round(viewport.zoom * 100)}%`;
  const dotGap = 36 / Math.max(viewport.zoom, 1);
  const dotSize = 1.6 / Math.max(viewport.zoom, 1);

  return (
    <div
      ref={canvasRootRef}
      className="canvas-custom-cursor relative h-full w-full overflow-hidden bg-[#f6f8fc]"
    >
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
        minZoom={0.12}
        maxZoom={4.2}
        fitView
        onPaneClick={() => {
          onPaneClick?.();
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="rgba(160,170,188,0.34)"
          gap={dotGap}
          size={dotSize}
        />
      </ReactFlow>

      <AnimatePresence>
        {floatingBarPosition ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="pointer-events-none absolute z-40"
            style={{
              left: floatingBarPosition.left,
              top: floatingBarPosition.top,
              transform: "translateX(-50%)",
            }}
          >
            <div className="pointer-events-auto inline-flex items-center gap-0.5 rounded-full border border-white/90 bg-white/96 p-0.5 shadow-[0_10px_18px_rgba(15,23,42,0.14)] backdrop-blur-sm">
              {editorActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleEditorAction(action.id)}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition ${
                    action.tone === "danger"
                      ? "text-[#cb3f5d] hover:bg-[#fff0f3]"
                      : "text-[#5f6b80] hover:bg-[#f2f5fa]"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Toolbar
        mode="B"
        onRun={() => {}}
        onUndo={() => {
          applyHistoryUndo();
        }}
        onRedo={() => {}}
        onCenter={() => {
          fitView({ padding: 0.14, duration: 320 });
        }}
      />

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
