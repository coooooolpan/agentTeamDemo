"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, Blocks, Layers3, Search } from "lucide-react";

import { UnicornSceneEmbed } from "@/components/home/UnicornSceneEmbed";
import { ContentCard } from "@/components/infinite-canvas/ContentCard";
import { FlowGroup } from "@/components/infinite-canvas/FlowGroup";
import { PlaceholderCard } from "@/components/infinite-canvas/PlaceholderCard";
import { StepLabel } from "@/components/infinite-canvas/StepLabel";
import { taskCanvases } from "@/components/infinite-canvas/canvasData";
import type { RoleOutputCard } from "@/components/infinite-canvas/types";
import { AgentDetailPanel } from "@/components/workbench/AgentDetailPanel";
import {
  GeneratingCursorCloud,
  type GeneratingCursorEntry,
} from "@/components/workbench/GeneratingCursorCloud";
import { CanvasStage } from "@/components/workbench/CanvasStage";
import { FileCard } from "@/components/workbench/FileCard";
import { FolderNode } from "@/components/workbench/FolderNode";
import { LeftPanel } from "@/components/workbench/LeftPanel";
import { MiniChatDock } from "@/components/workbench/MiniChatDock";
import {
  DocumentNode,
  GeneratingDocumentNode,
  MediaNode,
  PipelineStepNode,
  TaskNoteNode,
  VideoGenerationNode,
} from "@/components/workbench/NodeCard";
import { SideTabRail } from "@/components/workbench/SideTabRail";
import { Toolbar } from "@/components/workbench/Toolbar";
import { chatAgentCards, generatedFileFolders } from "@/components/workbench/mock-data";
import type { WorkFile } from "@/components/workbench/types";

type ComponentCategory =
  | "Layout Shell"
  | "Navigation"
  | "Conversation"
  | "Canvas Nodes"
  | "Asset Output"
  | "Overlay";

interface LibraryItem {
  name: string;
  category: ComponentCategory;
  capability: string;
  source: string;
  pages: string[];
  tags: string[];
}

const libraryItems: LibraryItem[] = [
  {
    name: "AppShell",
    category: "Layout Shell",
    capability: "主工作台容器，负责面板、画布、模式切换与全局状态协调。",
    source: "components/workbench/AppShell.tsx",
    pages: ["/"],
    tags: ["layout", "state", "shell"],
  },
  {
    name: "CanvasStage",
    category: "Layout Shell",
    capability: "承载主画布，分发 Demo 模式和预览逻辑。",
    source: "components/workbench/CanvasStage.tsx",
    pages: ["/"],
    tags: ["canvas", "stage"],
  },
  {
    name: "SideTabRail",
    category: "Navigation",
    capability: "左侧主导航轨道，提供页面级入口与状态高亮。",
    source: "components/workbench/SideTabRail.tsx",
    pages: ["/", "/home"],
    tags: ["nav", "rail"],
  },
  {
    name: "Toolbar",
    category: "Navigation",
    capability: "画布内工具栏，支持播放、回退、重做、模式动作。",
    source: "components/workbench/Toolbar.tsx",
    pages: ["/"],
    tags: ["toolbar", "controls"],
  },
  {
    name: "LeftPanel",
    category: "Conversation",
    capability: "对话流主面板，含任务进度、Agent 运行态、输入与文件管理。",
    source: "components/workbench/LeftPanel.tsx",
    pages: ["/"],
    tags: ["chat", "prompt", "agent-runtime"],
  },
  {
    name: "MiniChatDock",
    category: "Conversation",
    capability: "面板最小化后的快速展开入口。",
    source: "components/workbench/MiniChatDock.tsx",
    pages: ["/"],
    tags: ["chat", "dock"],
  },
  {
    name: "TaskNoteNode",
    category: "Canvas Nodes",
    capability: "任务说明卡片节点，用于展示任务目标与摘要。",
    source: "components/workbench/NodeCard.tsx",
    pages: ["/"],
    tags: ["node", "task"],
  },
  {
    name: "PipelineStepNode",
    category: "Canvas Nodes",
    capability: "流程阶段节点，展示阶段名称、状态与上下文。",
    source: "components/workbench/NodeCard.tsx",
    pages: ["/"],
    tags: ["pipeline", "node"],
  },
  {
    name: "DocumentNode",
    category: "Canvas Nodes",
    capability: "文档输出节点，支持标题、摘要与标签信息。",
    source: "components/workbench/NodeCard.tsx",
    pages: ["/"],
    tags: ["doc", "node"],
  },
  {
    name: "GeneratingDocumentNode",
    category: "Canvas Nodes",
    capability: "生成中文档节点，带进度与过程状态。",
    source: "components/workbench/NodeCard.tsx",
    pages: ["/"],
    tags: ["progress", "doc"],
  },
  {
    name: "GeneratingCursorCloud",
    category: "Canvas Nodes",
    capability: "生成中光标群通用控件，支持随机显隐、漂浮轨迹与标签气泡。",
    source: "components/workbench/GeneratingCursorCloud.tsx",
    pages: ["/"],
    tags: ["cursor", "generation", "reusable"],
  },
  {
    name: "MediaNode",
    category: "Asset Output",
    capability: "图片/媒体输出节点，支持预览与浮层操作。",
    source: "components/workbench/NodeCard.tsx",
    pages: ["/"],
    tags: ["image", "media"],
  },
  {
    name: "VideoGenerationNode",
    category: "Asset Output",
    capability: "视频生成节点，展示动态生成状态。",
    source: "components/workbench/NodeCard.tsx",
    pages: ["/"],
    tags: ["video", "generation"],
  },
  {
    name: "FolderNode",
    category: "Asset Output",
    capability: "输出文件夹节点，支持展开、折叠、状态提示。",
    source: "components/workbench/FolderNode.tsx",
    pages: ["/"],
    tags: ["folder", "output"],
  },
  {
    name: "FileCard",
    category: "Asset Output",
    capability: "文件卡片组件，用于文件列表与预览入口。",
    source: "components/workbench/FileCard.tsx",
    pages: ["/"],
    tags: ["file", "card"],
  },
  {
    name: "FlowGroup",
    category: "Canvas Nodes",
    capability: "无限画布分组容器，用于组织阶段模块。",
    source: "components/infinite-canvas/FlowGroup.tsx",
    pages: ["/"],
    tags: ["group", "canvas"],
  },
  {
    name: "StepLabel",
    category: "Canvas Nodes",
    capability: "步骤标签组件，展示阶段名与角色标识。",
    source: "components/infinite-canvas/StepLabel.tsx",
    pages: ["/"],
    tags: ["label", "step"],
  },
  {
    name: "ContentCard",
    category: "Asset Output",
    capability: "内容资产卡片，可用于图片、文档、视频成果展示。",
    source: "components/infinite-canvas/ContentCard.tsx",
    pages: ["/"],
    tags: ["asset", "card"],
  },
  {
    name: "PlaceholderCard",
    category: "Asset Output",
    capability: "占位卡片组件，用于空状态与待生成资源位。",
    source: "components/infinite-canvas/PlaceholderCard.tsx",
    pages: ["/"],
    tags: ["placeholder", "asset"],
  },
  {
    name: "AgentDetailPanel",
    category: "Overlay",
    capability: "Agent 详情浮层，展示角色能力与执行信息。",
    source: "components/workbench/AgentDetailPanel.tsx",
    pages: ["/"],
    tags: ["overlay", "agent"],
  },
  {
    name: "UnicornSceneEmbed",
    category: "Overlay",
    capability: "首页背景场景组件，用于全屏视觉氛围渲染。",
    source: "components/home/UnicornSceneEmbed.tsx",
    pages: ["/home"],
    tags: ["background", "scene"],
  },
];

const orderedCategories: ComponentCategory[] = [
  "Layout Shell",
  "Navigation",
  "Conversation",
  "Canvas Nodes",
  "Asset Output",
  "Overlay",
];

const allOutputCards: RoleOutputCard[] = taskCanvases.flatMap((task) =>
  task.stages.flatMap((stage) => stage.rows.flatMap((row) => row.cards)),
);
const sampleDocCard = allOutputCards.find((card) => (card.layout ?? "triplet") === "doc") ?? allOutputCards[0];
const sampleAssetCard =
  allOutputCards.find((card) => (card.layout ?? "triplet") !== "doc") ?? allOutputCards[0];

const sampleFiles = generatedFileFolders.flatMap((folder) => folder.files);
const fallbackFile: WorkFile = {
  id: "preview-fallback",
  title: "Preview File",
  kind: "doc",
  updatedAt: "just now",
  note: "Demo preview file",
};
const sampleDocFile = sampleFiles.find((file) => file.kind === "doc") ?? sampleFiles[0] ?? fallbackFile;
const sampleImageFile = sampleFiles.find((file) => file.kind === "image") ?? sampleFiles[0] ?? fallbackFile;
const sampleVideoFile = sampleFiles.find((file) => file.kind === "video") ?? sampleFiles[0] ?? fallbackFile;
const sampleFolder = generatedFileFolders[0];

const TaskNotePreview = TaskNoteNode as unknown as React.ComponentType<{ data: Record<string, unknown> }>;
const PipelineStepPreview = PipelineStepNode as unknown as React.ComponentType<{ data: Record<string, unknown> }>;
const DocumentPreview = DocumentNode as unknown as React.ComponentType<{ data: Record<string, unknown> }>;
const GeneratingDocumentPreview = GeneratingDocumentNode as unknown as React.ComponentType<{
  data: Record<string, unknown>;
}>;
const MediaPreview = MediaNode as unknown as React.ComponentType<{ data: Record<string, unknown> }>;
const VideoGenerationPreview = VideoGenerationNode as unknown as React.ComponentType<{
  data: Record<string, unknown>;
}>;
const FolderPreview = FolderNode as unknown as React.ComponentType<{ data: Record<string, unknown> }>;
const sampleGeneratingCursorSequence: GeneratingCursorEntry[] = [
  {
    id: "cursor-a",
    label: "Market Scout",
    color: "#7a34ff",
    badge: "bg-[#7a34ff]",
    placement: "left-[196px] top-[22px]",
    xDrift: [0, 5, -2, 0],
    yDrift: [0, -4, 2, 0],
    rotation: [0, 1.2, -0.2, 0],
  },
  {
    id: "cursor-b",
    label: "Brand Copywriter",
    color: "#06bc57",
    badge: "bg-[#06bc57]",
    placement: "left-[16px] top-[88px]",
    xDrift: [0, -4, 2, 0],
    yDrift: [0, 3, -2, 0],
    rotation: [0, -1, 0.4, 0],
  },
  {
    id: "cursor-c",
    label: "Content Auditor",
    color: "#fd9732",
    badge: "bg-[#fd9732]",
    placement: "left-[210px] top-[142px]",
    xDrift: [0, 4, -1, 0],
    yDrift: [0, -3, 2, 0],
    rotation: [0, 0.8, -0.3, 0],
  },
];

function PreviewShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mt-3 overflow-hidden rounded-2xl border border-[#e5ebf5] bg-[#f7f9fd] ${className ?? ""}`}>
      {children}
    </div>
  );
}

function renderLivePreview(name: string) {
  if (name === "AppShell") {
    return (
      <PreviewShell className="h-[220px] p-2">
        <iframe
          src="/"
          title="AppShell Live Preview"
          className="h-full w-full rounded-xl border border-[#dfe6f2] bg-white"
          loading="lazy"
        />
      </PreviewShell>
    );
  }

  if (name === "CanvasStage") {
    return (
      <PreviewShell className="h-[220px]">
        <div className="pointer-events-none origin-top-left scale-[0.22]">
          <div className="h-[980px] w-[1650px]">
            <CanvasStage
              onOpenSidebar={() => {}}
              isPanelMinimized={false}
              demoMode="A"
              activeFile={null}
              focusNodeRequest={null}
              onOpenFilePreview={() => {}}
              onCloseFilePreview={() => {}}
              onCanvasPaneClick={() => {}}
            />
          </div>
        </div>
      </PreviewShell>
    );
  }

  if (name === "SideTabRail") {
    return (
      <PreviewShell className="h-[220px]">
        <div className="grid h-full place-items-center">
          <div className="pointer-events-none">
            <SideTabRail />
          </div>
        </div>
      </PreviewShell>
    );
  }

  if (name === "Toolbar") {
    return (
      <PreviewShell className="h-[220px]">
        <div className="pointer-events-none relative h-full bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.95),rgba(235,240,248,0.7)_65%)]">
          <Toolbar mode="B" onCenter={() => {}} onUndo={() => {}} onRedo={() => {}} onRun={() => {}} />
        </div>
      </PreviewShell>
    );
  }

  if (name === "LeftPanel") {
    return (
      <PreviewShell className="h-[220px]">
        <div className="pointer-events-none origin-top-left scale-[0.37]">
          <LeftPanel
            isMinimized={false}
            onToggleMinimize={() => {}}
            onOpenAgentDetails={() => {}}
            onLocateAgentRuntime={() => {}}
            demoMode="B"
          />
        </div>
      </PreviewShell>
    );
  }

  if (name === "MiniChatDock") {
    return (
      <PreviewShell className="h-[220px]">
        <div className="pointer-events-none relative h-full bg-[linear-gradient(180deg,#f2f5fb,#ecf1f8)]">
          <MiniChatDock onExpand={() => {}} />
        </div>
      </PreviewShell>
    );
  }

  if (name === "TaskNoteNode") {
    return (
      <PreviewShell className="h-[220px] p-3">
        <div className="pointer-events-none origin-top-left scale-[0.62]">
          <TaskNotePreview
            data={{
              title: "Build campaign kit",
              checklist: [
                "Research 10 competitors",
                "Extract conversion hooks",
                "Generate visual direction",
              ],
              tag: { label: "Research", color: "green" },
            }}
          />
        </div>
      </PreviewShell>
    );
  }

  if (name === "PipelineStepNode") {
    return (
      <PreviewShell className="h-[220px] p-3">
        <div className="pointer-events-none origin-top-left scale-[0.42]">
          <PipelineStepPreview
            data={{
              step: 2,
              title: "Design Main Characters",
              subtitle: "Parallel generation boards",
              width: 860,
              height: 280,
              parallelLabel: "parallel",
              boards: [
                { id: "a", title: "V1", slots: 3 },
                { id: "b", title: "V2", slots: 3 },
              ],
            }}
          />
        </div>
      </PreviewShell>
    );
  }

  if (name === "DocumentNode") {
    return (
      <PreviewShell className="h-[220px] p-3">
        <div className="pointer-events-none origin-top-left scale-[0.74]">
          <DocumentPreview
            data={{
              title: "Product Research Brief",
              subtitle: "A Sample Research Document",
              excerpt: ["Audience profile", "Competitor insight", "Hook map"],
              tag: { label: "Screenwriter", color: "purple" },
              previewFile: sampleDocFile,
              onOpenPreview: () => {},
            }}
          />
        </div>
      </PreviewShell>
    );
  }

  if (name === "GeneratingDocumentNode") {
    return (
      <PreviewShell className="h-[220px] p-3">
        <div className="pointer-events-none origin-top-left scale-[0.72]">
          <GeneratingDocumentPreview
            data={{
              title: "Campaign Research Brief",
              subtitle: "Synthesis in progress",
              excerpt: ["Market scan", "Audience profile", "Competitor strategy"],
              previewFile: sampleDocFile,
              onOpenPreview: () => {},
              progress: 63,
              eta: "ETA 00:18",
            }}
          />
        </div>
      </PreviewShell>
    );
  }

  if (name === "GeneratingCursorCloud") {
    return (
      <PreviewShell className="h-[220px] p-3">
        <div className="relative h-full overflow-hidden rounded-xl border border-[#dfe6f2] bg-[radial-gradient(circle_at_28%_18%,#f7f9fd,#eef2f8_62%)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="pointer-events-none absolute left-[72px] top-[54px] h-[124px] w-[136px] rounded-[16px] border border-[#e9edf4] bg-white/96 p-2 shadow-[0_10px_20px_rgba(15,23,42,0.08)]">
            <div className="h-2 w-20 rounded-full bg-[#e7edf7]" />
            <div className="mt-2 space-y-1.5">
              <div className="h-1.5 rounded-full bg-[#eef2f8]" />
              <div className="h-1.5 rounded-full bg-[#eef2f8]" />
              <div className="h-1.5 w-2/3 rounded-full bg-[#eef2f8]" />
            </div>
          </div>
          <GeneratingCursorCloud
            sequence={sampleGeneratingCursorSequence}
            requestedVisibleCount={2}
            minDelayMs={1600}
            maxDelayMs={2800}
            defaultVisibleIds={["cursor-a", "cursor-b"]}
          />
        </div>
      </PreviewShell>
    );
  }

  if (name === "MediaNode") {
    return (
      <PreviewShell className="h-[220px] p-3">
        <div className="pointer-events-none origin-top-left scale-[0.7]">
          <MediaPreview
            data={{
              title: "Campaign Visual Sheet",
              kindLabel: "Image Pack",
              gradient: "linear-gradient(135deg,#d9ebff,#46d4a8,#d2f0df)",
              tag: { label: "Designer", color: "blue" },
              previewFile: sampleImageFile,
              duplicateable: true,
              onDuplicate: () => {},
              onOpenPreview: () => {},
            }}
          />
        </div>
      </PreviewShell>
    );
  }

  if (name === "VideoGenerationNode") {
    return (
      <PreviewShell className="h-[220px] p-3">
        <div className="pointer-events-none origin-top-left scale-[0.7]">
          <VideoGenerationPreview
            data={{
              title: "Poster Assets + Promo Video Generation",
              subtitle: "Video Draft Sequence",
              progress: 71,
              eta: "ETA 00:22",
              previewFile: sampleVideoFile,
              duplicateable: true,
              onDuplicate: () => {},
              onOpenPreview: () => {},
            }}
          />
        </div>
      </PreviewShell>
    );
  }

  if (name === "FolderNode") {
    return (
      <PreviewShell className="h-[220px] p-3">
        <div className="pointer-events-none origin-top-left scale-[0.55]">
          <FolderPreview
            data={{
              title: sampleFolder?.title ?? "Deliverables",
              filesCount: sampleFolder?.files.length ?? 3,
              updatedAt: "2 min ago",
              status: "finished",
              files: sampleFolder?.files ?? [sampleDocFile, sampleImageFile, sampleVideoFile],
              isExpanded: false,
              onToggleExpanded: () => {},
              onOpenPreview: () => {},
            }}
          />
        </div>
      </PreviewShell>
    );
  }

  if (name === "FileCard") {
    return (
      <PreviewShell className="h-[220px] p-3">
        <div className="pointer-events-none origin-top-left scale-[0.9]">
          <FileCard file={sampleImageFile} index={0} onOpen={() => {}} />
        </div>
      </PreviewShell>
    );
  }

  if (name === "FlowGroup") {
    return (
      <PreviewShell className="h-[220px] p-3">
        <FlowGroup title="Storyboard Assets">
          <div className="grid grid-cols-3 gap-2">
            <PlaceholderCard ratio="portrait" />
            <PlaceholderCard ratio="portrait" />
            <PlaceholderCard ratio="portrait" />
          </div>
        </FlowGroup>
      </PreviewShell>
    );
  }

  if (name === "StepLabel") {
    return (
      <PreviewShell className="h-[220px] p-3">
        <div className="pt-1">
          <StepLabel
            step={3}
            label="Design storyboard scenes"
            roleName="Storyboard Artist"
            roleColor="#56bf95"
            avatarGradient="linear-gradient(135deg,#d7f6e6,#56bf95)"
          />
        </div>
      </PreviewShell>
    );
  }

  if (name === "ContentCard") {
    return (
      <PreviewShell className="h-[220px] p-3">
        <div className="h-full w-full">
          <ContentCard card={sampleAssetCard ?? sampleDocCard} />
        </div>
      </PreviewShell>
    );
  }

  if (name === "PlaceholderCard") {
    return (
      <PreviewShell className="h-[220px] p-3">
        <div className="grid h-full grid-cols-3 gap-2">
          <PlaceholderCard ratio="square" />
          <PlaceholderCard ratio="portrait" />
          <PlaceholderCard ratio="landscape" />
        </div>
      </PreviewShell>
    );
  }

  if (name === "AgentDetailPanel") {
    return (
      <PreviewShell className="h-[220px] p-2">
        <div className="pointer-events-none relative h-full overflow-hidden rounded-xl border border-[#dfe6f2] bg-[#edf2f9]">
          <AgentDetailPanel agent={chatAgentCards[0] ?? null} onClose={() => {}} />
        </div>
      </PreviewShell>
    );
  }

  if (name === "UnicornSceneEmbed") {
    return (
      <PreviewShell className="h-[220px] p-2">
        <div className="h-full overflow-hidden rounded-xl border border-[#dfe6f2] bg-black">
          <UnicornSceneEmbed />
        </div>
      </PreviewShell>
    );
  }

  return (
    <PreviewShell className="h-[220px] p-3">
      <div className="grid h-full place-items-center rounded-xl border border-dashed border-[#d6deea] bg-white text-xs text-[#94a0b5]">
        Preview unavailable
      </div>
    </PreviewShell>
  );
}

export default function ComponentLibraryPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | "All">("All");

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return libraryItems.filter((item) => {
      const passCategory = activeCategory === "All" || item.category === activeCategory;
      if (!passCategory) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      const searchable = `${item.name} ${item.capability} ${item.category} ${item.tags.join(" ")} ${item.source}`.toLowerCase();
      return searchable.includes(normalized);
    });
  }, [activeCategory, query]);

  const groupedByCategory = useMemo(
    () =>
      orderedCategories
        .map((category) => ({
          category,
          items: filteredItems
            .filter((item) => item.category === category)
            .sort((a, b) => a.name.localeCompare(b.name)),
        }))
        .filter((group) => group.items.length > 0),
    [filteredItems],
  );

  const sortedByName = useMemo(
    () => [...filteredItems].sort((a, b) => a.name.localeCompare(b.name)),
    [filteredItems],
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f2f5fb] text-[#0f172a]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-14%] h-[420px] w-[420px] rounded-full bg-[#d8e7ff] opacity-70 blur-3xl" />
        <div className="absolute right-[-12%] top-[12%] h-[400px] w-[400px] rounded-full bg-[#ffe6ef] opacity-60 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.14)_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      <div className="relative mx-auto max-w-[1380px] px-6 py-8 lg:px-10">
        <header className="rounded-3xl border border-[#dbe4f2] bg-white/88 p-6 shadow-[0_20px_40px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-[#dfe6f2] bg-white px-3 py-1.5 text-xs font-semibold text-[#5a667d] transition hover:bg-[#f5f8fd]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                返回画布
              </Link>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#121826]">控件库 / Component Library</h1>
                <p className="mt-1 text-sm text-[#6c7891]">
                  每个控件均提供实时样式预览，按功能分类管理，支持快速检索与复用。
                </p>
              </div>
            </div>

            <div className="grid min-w-[260px] grid-cols-2 gap-2 rounded-2xl border border-[#e2e9f4] bg-[#f8fbff] p-2">
              <div className="rounded-xl border border-[#e1e9f6] bg-white p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8691a5]">
                  Reusable Components
                </p>
                <p className="mt-1 text-2xl font-bold text-[#1b2436]">{libraryItems.length}</p>
              </div>
              <div className="rounded-xl border border-[#e1e9f6] bg-white p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8691a5]">
                  Function Groups
                </p>
                <p className="mt-1 text-2xl font-bold text-[#1b2436]">{orderedCategories.length}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-[420px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#97a3ba]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索组件名、功能或关键词..."
                className="h-11 w-full rounded-2xl border border-[#dee6f3] bg-white pl-10 pr-4 text-sm text-[#1a2336] outline-none transition focus:border-[#9fb6e8] focus:ring-2 focus:ring-[#b8caf0]/45"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory("All")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  activeCategory === "All"
                    ? "border-[#c7d6f2] bg-[#eaf2ff] text-[#355eb8]"
                    : "border-[#dde5f2] bg-white text-[#6d7891] hover:border-[#ced9ec]"
                }`}
              >
                All
              </button>
              {orderedCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    activeCategory === category
                      ? "border-[#c7d6f2] bg-[#eaf2ff] text-[#355eb8]"
                      : "border-[#dde5f2] bg-white text-[#6d7891] hover:border-[#ced9ec]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </header>

        <section className="mt-6 space-y-6">
          {groupedByCategory.map((group) => (
            <div
              key={group.category}
              className="rounded-3xl border border-[#dfe6f3] bg-white/86 p-5 shadow-[0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur"
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#1a2233]">
                  <Blocks className="h-4 w-4 text-[#6e7f9c]" />
                  {group.category}
                </h2>
                <span className="rounded-full border border-[#dde5f2] bg-white px-2.5 py-1 text-xs font-semibold text-[#6f7b91]">
                  {group.items.length} components
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                {group.items.map((item) => (
                  <article
                    key={`${group.category}-${item.name}`}
                    className="rounded-2xl border border-[#e5ebf5] bg-[linear-gradient(180deg,#ffffff_0%,#f9fbff_100%)] p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-[#162033]">{item.name}</h3>
                      <span className="rounded-full bg-[#edf3ff] px-2 py-0.5 text-[10px] font-semibold text-[#4e6fb2]">
                        {item.category}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[#69768f]">{item.capability}</p>

                    {renderLivePreview(item.name)}

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.pages.map((page) => (
                        <span
                          key={`${item.name}-${page}`}
                          className="rounded-full border border-[#e2e8f2] bg-white px-2 py-0.5 text-[10px] font-medium text-[#71819d]"
                        >
                          {page}
                        </span>
                      ))}
                      {item.tags.slice(0, 3).map((tag) => (
                        <span
                          key={`${item.name}-${tag}`}
                          className="rounded-full bg-[#f1f5fb] px-2 py-0.5 text-[10px] font-medium text-[#7a869d]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 truncate rounded-lg border border-[#e6ebf4] bg-white px-2 py-1 font-mono text-[10px] text-[#6f7d95]">
                      {item.source}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-3xl border border-[#dfe6f3] bg-white/84 p-5 shadow-[0_14px_28px_rgba(15,23,42,0.05)] backdrop-blur">
          <h2 className="mb-3 inline-flex items-center gap-2 text-base font-bold text-[#1a2233]">
            <Layers3 className="h-4 w-4 text-[#6e7f9c]" />
            名称索引（A-Z）
          </h2>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {sortedByName.map((item) => (
              <div
                key={`name-${item.name}`}
                className="flex items-center justify-between gap-2 rounded-xl border border-[#e5ebf5] bg-white px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#1d2639]">{item.name}</p>
                  <p className="truncate text-[11px] text-[#78849a]">{item.category}</p>
                </div>
                <span className="rounded-full bg-[#eff4ff] px-2 py-0.5 text-[10px] font-semibold text-[#4e6fb2]">
                  {item.pages.join(", ")}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
