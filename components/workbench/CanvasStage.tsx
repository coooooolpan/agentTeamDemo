"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
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
  Video,
  X,
} from "lucide-react";

import { buildCanvasNodes } from "./mock-data";
import {
  DocumentNode,
  GeneratingDocumentNode,
  MediaNode,
  TaskNoteNode,
  VideoGenerationNode,
} from "./NodeCard";
import { FolderNode } from "./FolderNode";
import { Toolbar } from "./Toolbar";
import type { WorkFile, WorkbenchNode } from "./types";

interface CanvasStageProps {
  onOpenSidebar: () => void;
  isPanelMinimized: boolean;
  activeFile: WorkFile | null;
  onOpenFilePreview: (file: WorkFile) => void;
  onCloseFilePreview: () => void;
  onCanvasPaneClick: () => void;
}

const nodeTypes: NodeTypes = {
  note: TaskNoteNode,
  document: DocumentNode,
  "document-generating": GeneratingDocumentNode,
  media: MediaNode,
  "video-generation": VideoGenerationNode,
  folder: FolderNode,
};

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

  const initialNodes = useMemo(() => buildCanvasNodes(openPreview), [openPreview]);
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkbenchNode>(initialNodes);
  const { fitView, setCenter } = useReactFlow<WorkbenchNode>();
  const { zoom } = useViewport();
  const hasAnimatedLayoutTransition = useRef(false);
  const initialPadding = 0.3;
  const layoutSettleDelayMs = 460;
  const zoomForDotScale = Math.max(zoom, 1);
  const backgroundDotGap = 48 / zoomForDotScale;
  const backgroundDotSize = 2.2 / zoomForDotScale;

  useEffect(() => {
    const animation = requestAnimationFrame(() => {
      fitView({ padding: initialPadding, duration: 0 });
    });

    return () => cancelAnimationFrame(animation);
  }, [fitView, initialPadding]);

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
    <div className="relative h-full w-full overflow-hidden">
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
        className="canvas-custom-cursor"
        style={{ cursor: "url('/canvas-agent-cursor.svg?v=5') 7 5, auto" }}
        nodes={nodes}
        edges={[]}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.42}
        maxZoom={1.8}
        panOnDrag
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        zoomOnDoubleClick
        nodesConnectable={false}
        elementsSelectable={false}
        onNodeDoubleClick={onNodeDoubleClick}
        onPaneClick={() => {
          onCloseFilePreview();
          onCanvasPaneClick();
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="rgba(160,169,186,0.45)"
          gap={backgroundDotGap}
          size={backgroundDotSize}
        />
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

      <Toolbar
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
    </div>
  );
}

export function CanvasStage({
  onOpenSidebar,
  isPanelMinimized,
  activeFile,
  onOpenFilePreview,
  onCloseFilePreview,
  onCanvasPaneClick,
}: CanvasStageProps) {
  return (
    <ReactFlowProvider>
      <CanvasContent
        onOpenSidebar={onOpenSidebar}
        isPanelMinimized={isPanelMinimized}
        activeFile={activeFile}
        onOpenFilePreview={onOpenFilePreview}
        onCloseFilePreview={onCloseFilePreview}
        onCanvasPaneClick={onCanvasPaneClick}
      />
    </ReactFlowProvider>
  );
}
