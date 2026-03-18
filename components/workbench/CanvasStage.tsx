"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
  type NodeTypes,
  useViewport,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileCode2,
  FileImage,
  FileText,
  Menu,
  Minus,
  Plus,
  Video,
  X,
} from "lucide-react";

import { buildCanvasNodes } from "./mock-data";
import {
  DocumentNode,
  GeneratingDocumentNode,
  MediaNode,
  PipelineStepNode,
  TaskNoteNode,
  VideoGenerationNode,
} from "./NodeCard";
import { CanvasCursorOverlay } from "./CanvasCursorOverlay";
import { FolderNode } from "./FolderNode";
import { Toolbar } from "./Toolbar";
import { EmbeddedInfiniteCanvas } from "../infinite-canvas/InfiniteCanvas";
import type {
  DemoMode,
  FolderNodeData,
  PipelineStepNodeData,
  WorkFile,
  WorkbenchNode,
} from "./types";

interface CanvasStageProps {
  onOpenSidebar: () => void;
  isPanelMinimized: boolean;
  demoMode: DemoMode;
  activeFile: WorkFile | null;
  focusNodeRequest?: {
    nodeId: string;
    nonce: number;
  } | null;
  onOpenFilePreview: (file: WorkFile) => void;
  onCloseFilePreview: () => void;
  onCanvasPaneClick: () => void;
}

const nodeTypes: NodeTypes = {
  "pipeline-step": PipelineStepNode,
  note: TaskNoteNode,
  document: DocumentNode,
  "document-generating": GeneratingDocumentNode,
  media: MediaNode,
  "video-generation": VideoGenerationNode,
  folder: FolderNode,
};

const demoBNodePositionById: Record<string, { x: number; y: number }> = {
  "doc-1": { x: 520, y: 138 },
  "doc-2": { x: 764, y: 138 },
  "doc-generating-1": { x: 1008, y: 138 },
  "media-1": { x: 164, y: 470 },
  "media-2": { x: 894, y: 470 },
  "video-generation-1": { x: 1128, y: 470 },
};

const demoBVisibleNodeTypes = new Set([
  "pipeline-step",
  "document",
  "media",
  "video-generation",
]);

const demoAOutputNodeTypes = new Set([
  "document",
  "document-generating",
  "media",
  "video-generation",
]);

type DemoAOutputNodeType = "document" | "document-generating" | "media" | "video-generation";

const demoAOutputSizeByType: Record<DemoAOutputNodeType, { width: number; height: number }> = {
  document: { width: 200, height: 292 },
  "document-generating": { width: 200, height: 306 },
  media: { width: 430, height: 248 },
  "video-generation": { width: 430, height: 248 },
};

const demoBPipelineSteps = [
  {
    id: "pipeline-step-1",
    position: { x: 84, y: 84 },
    data: {
      step: 1,
      title: "Story Outline",
      subtitle: "Design story details",
      parallelLabel: "Parallel Agents ×3",
      width: 1410,
      height: 248,
      boards: [{ id: "outline-board", slots: 4, slotHeight: 154 }],
    } satisfies PipelineStepNodeData,
  },
  {
    id: "pipeline-step-2",
    position: { x: 84, y: 414 },
    data: {
      step: 2,
      title: "Design Main Characters",
      subtitle: "Parallel character visual generation",
      parallelLabel: "Parallel Agents ×3",
      width: 1410,
      height: 272,
      boards: [
        {
          id: "character-board-a",
          title: "Animation Short Concept Design V1.0",
          slots: 3,
          slotHeight: 156,
        },
        {
          id: "character-board-b",
          title: "Animation Short Concept Design V1.0",
          slots: 3,
          slotHeight: 156,
        },
      ],
    } satisfies PipelineStepNodeData,
  },
  {
    id: "pipeline-step-3",
    position: { x: 84, y: 742 },
    data: {
      step: 3,
      title: "Design Storyboard Scenes",
      subtitle: "Compose storyboard scene frames",
      parallelLabel: "Parallel Agents ×2",
      width: 1410,
      height: 258,
      boards: [
        {
          id: "storyboard-scenes",
          title: "Animation Short Concept Design V1.0",
          slots: 4,
          slotHeight: 160,
        },
      ],
    } satisfies PipelineStepNodeData,
  },
  {
    id: "pipeline-step-4",
    position: { x: 84, y: 1064 },
    data: {
      step: 4,
      title: "Generate Storyboard Videos",
      subtitle: "Render parallel storyboard video drafts",
      parallelLabel: "Parallel Agents ×2",
      width: 1410,
      height: 254,
      boards: [
        {
          id: "storyboard-videos",
          title: "Animation Short Concept Design V1.0",
          slots: 4,
          slotHeight: 150,
        },
      ],
    } satisfies PipelineStepNodeData,
  },
  {
    id: "pipeline-step-5",
    position: { x: 84, y: 1386 },
    data: {
      step: 5,
      title: "Video Editing",
      subtitle: "Final assembly and export package",
      width: 1410,
      height: 244,
      boards: [{ id: "editing-output", slots: 1, slotHeight: 160 }],
    } satisfies PipelineStepNodeData,
  },
] as const;

function buildDemoBPipelineNodes(): WorkbenchNode[] {
  return demoBPipelineSteps.map((step) => ({
    id: step.id,
    type: "pipeline-step",
    position: step.position,
    data: step.data,
    draggable: false,
    selectable: false,
    style: { zIndex: 0, pointerEvents: "none" },
  })) as WorkbenchNode[];
}

function isDemoAOutputNode(node: WorkbenchNode): node is WorkbenchNode & { type: DemoAOutputNodeType } {
  return demoAOutputNodeTypes.has(node.type);
}

function getTimelineOrder(node: WorkbenchNode) {
  if (!isDemoAOutputNode(node)) {
    return Number.MAX_SAFE_INTEGER;
  }
  const order = (node.data as { timelineOrder?: number }).timelineOrder;
  return typeof order === "number" ? order : Number.MAX_SAFE_INTEGER;
}

function getBatchId(node: WorkbenchNode) {
  if (!isDemoAOutputNode(node)) {
    return "";
  }
  const batchId = (node.data as { batchId?: string }).batchId;
  return typeof batchId === "string" ? batchId : "";
}

function layoutNodesForDemoA(sourceNodes: WorkbenchNode[]): WorkbenchNode[] {
  const outputNodes = sourceNodes
    .filter(isDemoAOutputNode)
    .sort((left, right) => {
      const orderDiff = getTimelineOrder(left) - getTimelineOrder(right);
      if (orderDiff !== 0) {
        return orderDiff;
      }
      return left.id.localeCompare(right.id);
    });

  const positionedNodeMap = new Map<string, { x: number; y: number }>();
  const layoutStartX = 348;
  const layoutStartY = 108;
  const maxTrackWidth = 940;
  const sameBatchGap = 14;
  const nextBatchGap = 38;
  const rowGap = 86;

  let cursorX = layoutStartX;
  let cursorY = layoutStartY;
  let rowMaxHeight = 0;
  let hasPlacedItem = false;
  let previousBatchId = "";

  outputNodes.forEach((node) => {
    const estimatedSize = demoAOutputSizeByType[node.type];
    const batchId = getBatchId(node);
    const baseGap = !hasPlacedItem
      ? 0
      : batchId.length > 0 && previousBatchId === batchId
        ? sameBatchGap
        : nextBatchGap;
    let candidateX = cursorX + baseGap;

    if (
      hasPlacedItem &&
      candidateX + estimatedSize.width - layoutStartX > maxTrackWidth
    ) {
      cursorX = layoutStartX;
      cursorY += rowMaxHeight + rowGap;
      rowMaxHeight = 0;
      previousBatchId = "";
      candidateX = layoutStartX;
    }

    positionedNodeMap.set(node.id, { x: candidateX, y: cursorY });
    cursorX = candidateX + estimatedSize.width;
    rowMaxHeight = Math.max(rowMaxHeight, estimatedSize.height);
    hasPlacedItem = true;
    previousBatchId = batchId;
  });

  const timelineBottom = cursorY + rowMaxHeight;
  const noteNode = sourceNodes.find((node) => node.type === "note");
  if (noteNode) {
    positionedNodeMap.set(noteNode.id, { x: 52, y: 82 });
  }

  const folderNodes = sourceNodes
    .filter((node) => node.type === "folder")
    .sort((left, right) => left.id.localeCompare(right.id));

  const folderWidth = 360;
  const folderGap = 28;
  const folderRowGap = 56;
  let folderX = layoutStartX;
  let folderY = timelineBottom + 156;

  folderNodes.forEach((node) => {
    if (folderX + folderWidth - layoutStartX > maxTrackWidth && folderX !== layoutStartX) {
      folderX = layoutStartX;
      folderY += 248 + folderRowGap;
    }
    positionedNodeMap.set(node.id, { x: folderX, y: folderY });
    folderX += folderWidth + folderGap;
  });

  return sourceNodes.map((node) => {
    const nextPosition = positionedNodeMap.get(node.id);
    if (isDemoAOutputNode(node)) {
      return {
        ...node,
        position: nextPosition ?? node.position,
        data: {
          ...node.data,
          showOutputMeta: true,
        },
      } as WorkbenchNode;
    }

    if (nextPosition) {
      return {
        ...node,
        position: nextPosition,
      };
    }

    return node;
  });
}

function layoutNodesByDemoMode(
  sourceNodes: WorkbenchNode[],
  demoMode: DemoMode,
): WorkbenchNode[] {
  if (demoMode === "A") {
    return layoutNodesForDemoA(sourceNodes);
  }

  const contentNodes: WorkbenchNode[] = sourceNodes
    .filter(
      (node) =>
        node.type === "document" ||
        node.type === "media" ||
        node.type === "video-generation",
    )
    .map((node): WorkbenchNode => {
      const mappedPosition = demoBNodePositionById[node.id];
      if (!mappedPosition) {
        return {
          ...node,
          data: {
            ...node.data,
            showOutputMeta: false,
          },
        } as WorkbenchNode;
      }

      return {
        ...node,
        position: mappedPosition,
        data: {
          ...node.data,
          showOutputMeta: false,
        },
      } as WorkbenchNode;
    });

  return [...buildDemoBPipelineNodes(), ...contentNodes];
}

function PreviewPanel({
  activeFile,
  onClose,
}: {
  activeFile: WorkFile;
  onClose: () => void;
}) {
  const icon =
    activeFile.kind === "doc"
      ? FileText
      : activeFile.kind === "image"
        ? FileImage
        : activeFile.kind === "video"
          ? Video
          : FileCode2;
  const Icon = icon;

  const surfaceClass =
    activeFile.kind === "doc"
      ? "bg-[linear-gradient(180deg,#ffffff,#f2f4f8)]"
      : activeFile.kind === "image"
        ? "bg-[linear-gradient(135deg,#bfdbfe,#a7f3d0,#fef3c7)]"
        : activeFile.kind === "video"
          ? "bg-[linear-gradient(135deg,#111827,#1d4ed8,#e879f9)]"
          : "bg-[linear-gradient(135deg,#0f172a,#334155)]";

  return (
    <motion.aside
      initial={{ opacity: 0, x: 42, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 36, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 280, damping: 25 }}
      className="pointer-events-auto absolute right-6 top-6 z-40 w-[380px] rounded-[24px] border border-[#e8ecf2] bg-white/95 p-4 shadow-[0_22px_40px_rgba(15,23,42,0.2)] backdrop-blur-md"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8f98a9]">
            Preview
          </p>
          <h3 className="text-lg font-bold text-[#131926]">{activeFile.title}</h3>
          <p className="text-sm text-[#8892a4]">{activeFile.updatedAt}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-9 w-9 place-items-center rounded-full bg-[#edf1f6] text-[#6e7789]"
          aria-label="Close preview"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div
        className={`relative h-[240px] overflow-hidden rounded-[18px] border border-white/70 ${surfaceClass}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(255,255,255,0.65),transparent_35%),radial-gradient(circle_at_78%_80%,rgba(255,255,255,0.35),transparent_35%)]" />
        {activeFile.kind === "video" ? (
          <div className="absolute inset-0 grid place-items-center">
            <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white">
              00:15 Social Reel Preview
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-3 rounded-2xl bg-[#f5f7fb] p-3">
        <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-[#2d3645]">
          <Icon className="h-4 w-4 text-[#7e8799]" />
          {activeFile.kind.toUpperCase()} File
        </div>
        <p className="text-sm leading-6 text-[#677287]">{activeFile.note}</p>
      </div>
    </motion.aside>
  );
}

function CanvasContent({
  onOpenSidebar,
  isPanelMinimized,
  demoMode,
  activeFile,
  onOpenFilePreview,
  onCloseFilePreview,
  onCanvasPaneClick,
}: CanvasStageProps) {
  const openPreview = useCallback(
    (file: WorkFile) => {
      onOpenFilePreview(file);
    },
    [onOpenFilePreview],
  );

  const baseNodes = useMemo(() => buildCanvasNodes(openPreview), [openPreview]);
  const initialNodes = useMemo(
    () => layoutNodesByDemoMode(baseNodes, demoMode),
    [baseNodes, demoMode],
  );
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkbenchNode>(initialNodes);
  const [expandedFolderId, setExpandedFolderId] = useState<string | null>(null);
  const { fitView, setCenter, zoomIn, zoomOut } = useReactFlow<WorkbenchNode>();
  const { zoom } = useViewport();
  const canvasRootRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedLayoutTransition = useRef(false);
  const initialPadding = demoMode === "B" ? 0.14 : 0.24;
  const layoutSettleDelayMs = 460;
  const zoomForDotScale = Math.max(zoom, 1);
  const backgroundDotGap = 48 / zoomForDotScale;
  const backgroundDotSize = 2.2 / zoomForDotScale;
  const zoomLabel = `${Math.round(zoom * 100)}%`;
  const visibleNodes = useMemo(
    () =>
      demoMode === "B"
        ? nodes.filter((node) => demoBVisibleNodeTypes.has(node.type))
        : nodes,
    [demoMode, nodes],
  );

  useEffect(() => {
    const animation = requestAnimationFrame(() => {
      fitView({ padding: initialPadding, duration: 0 });
    });

    return () => cancelAnimationFrame(animation);
  }, [fitView, initialPadding]);

  const handleFolderToggle = useCallback((folderId: string, expanded: boolean) => {
    setExpandedFolderId((current) => {
      if (expanded) {
        return folderId;
      }
      return current === folderId ? null : current;
    });
  }, []);

  const duplicateGeneratedNode = useCallback(
    (sourceNodeId: string) => {
      setNodes((previousNodes) => {
        const sourceNode = previousNodes.find((node) => node.id === sourceNodeId);
        if (!sourceNode) {
          return previousNodes;
        }

        if (sourceNode.type !== "media" && sourceNode.type !== "video-generation") {
          return previousNodes;
        }

        const nextId = `${sourceNode.type}-${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2, 7)}`;

        const copiedNode = {
          ...sourceNode,
          id: nextId,
          position: {
            x: sourceNode.position.x + 124 + Math.round(Math.random() * 36),
            y: sourceNode.position.y + 72 + Math.round(Math.random() * 26),
          },
          selected: false,
          dragging: false,
          data: {
            ...sourceNode.data,
            entryDelay: 0,
            isDimmed: false,
          },
        } as WorkbenchNode;

        return [...previousNodes, copiedNode];
      });
    },
    [setNodes],
  );

  useEffect(() => {
    setNodes((previousNodes) =>
      (demoMode === "B"
        ? previousNodes.filter(
            (node) =>
              node.type === "pipeline-step" ||
              node.type === "document" ||
              node.type === "media" ||
              node.type === "video-generation",
          )
        : previousNodes
      ).map((node) => {
        const isFocusedFolder = expandedFolderId !== null && node.id === expandedFolderId;
        const isDimmed = expandedFolderId !== null && !isFocusedFolder;
        const isDuplicateTarget =
          demoMode === "B" &&
          (node.type === "media" || node.type === "video-generation");
        const isCompactAsset =
          demoMode === "B" &&
          (node.type === "media" || node.type === "video-generation");

        if (node.type === "folder") {
          return {
            ...node,
            style: {
              ...node.style,
              opacity: isDimmed ? 0.3 : 1,
              transition: "opacity 280ms ease",
            },
            data: {
              ...(node.data as FolderNodeData),
              isDimmed,
              isExpanded: isFocusedFolder,
              onToggleExpanded: (expanded: boolean) => handleFolderToggle(node.id, expanded),
            },
          } as WorkbenchNode;
        }

        if (node.type === "pipeline-step") {
          return {
            ...node,
            style: {
              ...node.style,
              opacity: 1,
            },
          } as WorkbenchNode;
        }

        return {
          ...node,
          style: {
            ...node.style,
            opacity: isDimmed ? 0.3 : 1,
            transition: "opacity 280ms ease",
          },
          data: {
            ...node.data,
            isDimmed,
            ...(node.type === "media"
              ? { variant: isCompactAsset ? "compact" : "default" }
              : {}),
            ...(node.type === "video-generation"
              ? {
                  variant: isCompactAsset ? "compact" : "default",
                  compactAgentLabel: isCompactAsset ? "Content Auditor" : undefined,
                  compactAgentColor: isCompactAsset ? "#fd9732" : undefined,
                }
              : {}),
            duplicateable: demoMode === "B" ? false : isDuplicateTarget,
            onDuplicate: demoMode === "B"
              ? undefined
              : isDuplicateTarget
              ? () => duplicateGeneratedNode(node.id)
              : undefined,
          },
        } as WorkbenchNode;
      }) as WorkbenchNode[],
    );
  }, [demoMode, duplicateGeneratedNode, expandedFolderId, handleFolderToggle, setNodes]);

  useEffect(() => {
    if (!hasAnimatedLayoutTransition.current) {
      hasAnimatedLayoutTransition.current = true;
      return;
    }

    const timeout = window.setTimeout(() => {
      fitView({ padding: initialPadding, duration: 0 });
    }, layoutSettleDelayMs);

    return () => window.clearTimeout(timeout);
  }, [fitView, initialPadding, isPanelMinimized, layoutSettleDelayMs]);

  const onNodeDoubleClick = useCallback(
    (_event: React.MouseEvent, node: WorkbenchNode) => {
      const width = node.measured?.width ?? 280;
      const height = node.measured?.height ?? 220;
      const absoluteX = node.position.x;
      const absoluteY = node.position.y;

      setCenter(absoluteX + width / 2, absoluteY + height / 2, {
        zoom: 1.18,
        duration: 360,
      });
    },
    [setCenter],
  );

  return (
    <div
      ref={canvasRootRef}
      className="canvas-custom-cursor relative h-full w-full overflow-hidden"
    >
      <button
        type="button"
        onClick={onOpenSidebar}
        className="absolute left-4 top-4 z-30 grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-white/95 text-[#4e5767] shadow-[0_12px_24px_rgba(15,23,42,0.12)] xl:hidden"
        aria-label="Open chat sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/**
       * Canvas library choice: React Flow.
       * Reason: it provides robust infinite pan/zoom and draggable node primitives out of the box,
       * which fits this workbench mock without implementing viewport math manually.
       */}
      <ReactFlow
        nodes={visibleNodes}
        edges={[]}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.12}
        maxZoom={4.2}
        nodesDraggable
        elementsSelectable
        selectionOnDrag
        selectionMode={SelectionMode.Partial}
        panOnDrag={false}
        panActivationKeyCode="Space"
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        zoomOnDoubleClick={false}
        nodesConnectable={false}
        onNodeDoubleClick={onNodeDoubleClick}
        onPaneClick={() => {
          onCloseFilePreview();
          onCanvasPaneClick();
        }}
      >
        {demoMode === "A" ? (
          <Background
            variant={BackgroundVariant.Dots}
            color="rgba(160,169,186,0.45)"
            gap={backgroundDotGap}
            size={backgroundDotSize}
          />
        ) : (
          <>
            <Background
              id="demo-b-lines"
              variant={BackgroundVariant.Lines}
              color="rgba(155,164,180,0.18)"
              gap={120 / zoomForDotScale}
            />
            <Background
              id="demo-b-dots"
              variant={BackgroundVariant.Dots}
              color="rgba(160,169,186,0.3)"
              gap={32 / zoomForDotScale}
              size={1.6 / zoomForDotScale}
            />
          </>
        )}
      </ReactFlow>

      {/**
       * Key interaction: folder expand/collapse and preview use spring-driven motion.
       * Files slide out from the folder anchor and can be collapsed back into the folder stack.
       */}
      <AnimatePresence>
        {activeFile ? (
          <PreviewPanel activeFile={activeFile} onClose={onCloseFilePreview} />
        ) : null}
      </AnimatePresence>

      {demoMode === "A" ? (
        <Toolbar
          mode={demoMode}
          onRun={() => {
            onCloseFilePreview();
          }}
          onUndo={() => {
            setNodes((prev) => prev.map((node) => ({ ...node })));
          }}
          onRedo={() => {
            setNodes((prev) => prev.map((node) => ({ ...node })));
          }}
          onCenter={() => {
            fitView({ padding: initialPadding, duration: 380 });
          }}
        />
      ) : null}

      {demoMode === "A" ? (
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
              onClick={() => fitView({ padding: initialPadding, duration: 220 })}
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
      ) : null}

      <CanvasCursorOverlay containerRef={canvasRootRef} />
    </div>
  );
}

export function CanvasStage({
  onOpenSidebar,
  isPanelMinimized,
  demoMode,
  activeFile,
  focusNodeRequest,
  onOpenFilePreview,
  onCloseFilePreview,
  onCanvasPaneClick,
}: CanvasStageProps) {
  if (demoMode === "B") {
    return (
      <EmbeddedInfiniteCanvas
        onOpenSidebar={onOpenSidebar}
        onPaneClick={onCanvasPaneClick}
        focusNodeRequest={focusNodeRequest}
      />
    );
  }

  return (
    <ReactFlowProvider>
      <CanvasContent
        key="demo-a"
        onOpenSidebar={onOpenSidebar}
        isPanelMinimized={isPanelMinimized}
        demoMode="A"
        activeFile={activeFile}
        onOpenFilePreview={onOpenFilePreview}
        onCloseFilePreview={onCloseFilePreview}
        onCanvasPaneClick={onCanvasPaneClick}
      />
    </ReactFlowProvider>
  );
}
