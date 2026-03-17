"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  AtSign,
  Check,
  ArrowUpRight,
  ArrowUp,
  Bot,
  Box,
  BrainCircuit,
  Circle,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  Cpu,
  Database,
  Clock3,
  Expand,
  MessageCircle,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { chatAgentCards, chatGalleryGradients, timelineEvents } from "./mock-data";
import { SideTabRail } from "./SideTabRail";
import type { AgentColor, ChatAgentCard, DemoMode } from "./types";

interface LeftPanelProps {
  mobile?: boolean;
  onClose?: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  onOpenAgentDetails?: (agent: ChatAgentCard) => void;
  onLocateAgentRuntime?: (agent: ChatAgentCard, nodeId: string) => void;
  demoMode?: DemoMode;
}

const agentDotScheme: Record<AgentColor, string> = {
  red: "bg-[linear-gradient(135deg,#ff9f97,#f43f5e)]",
  purple: "bg-[linear-gradient(135deg,#f5d0fe,#818cf8)]",
  blue: "bg-[linear-gradient(135deg,#bfdbfe,#93c5fd)]",
  orange: "bg-[linear-gradient(135deg,#fde68a,#fdba74)]",
  green: "bg-[linear-gradient(135deg,#86efac,#67e8f9)]",
};

const agentNameColorScheme: Record<AgentColor, string> = {
  red: "text-[#d9793f]",
  purple: "text-[#7b61d1]",
  blue: "text-[#4f87cb]",
  orange: "text-[#d9944b]",
  green: "text-[#4a9d73]",
};

function EventIcon({ type }: { type: (typeof timelineEvents)[number]["type"] }) {
  if (type === "thinking") {
    return <BrainCircuit className="h-4 w-4 text-[#9aa1ae]" />;
  }

  if (type === "search") {
    return <Search className="h-4 w-4 text-[#9aa1ae]" />;
  }

  if (type === "result") {
    return <Sparkles className="h-4 w-4 text-[#9aa1ae]" />;
  }

  return <ArrowUp className="h-4 w-4 rotate-45 text-[#8f97a8]" />;
}

function SandboxStatus({
  status,
}: {
  status: (typeof sandboxOperations)[number]["status"];
}) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#eaf8ef] px-2 py-1 text-[11px] font-semibold text-[#20894d]">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Done
      </span>
    );
  }

  if (status === "running") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#eaf2ff] px-2 py-1 text-[11px] font-semibold text-[#3368d6]">
        <CircleDashed className="h-3.5 w-3.5 animate-spin" />
        Running
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#f2f4f8] px-2 py-1 text-[11px] font-semibold text-[#7b8598]">
      <Clock3 className="h-3.5 w-3.5" />
      Queued
    </span>
  );
}

function ProcessingTaskStatusIcon({
  status,
}: {
  status: "done" | "running" | "queued";
}) {
  if (status === "done") {
    return <CheckCircle2 className="h-4 w-4 text-[#7d8aa2]" />;
  }

  if (status === "running") {
    return <CircleDashed className="h-4 w-4 animate-spin text-[#7d8aa2]" />;
  }

  return <Circle className="h-4 w-4 text-[#b1bac9]" />;
}

const DEFAULT_USER_PROMPT = "Generate a set of Gameboy-style pixel images from the picture.";
const INITIAL_FLOW_TYPING_LEAD = 1180;
const RESEND_FLOW_TYPING_LEAD = 620;

const summaryFlow = [
  {
    id: "summary-1",
    text: "Agent Teams is assembling your team",
  },
  {
    id: "summary-2",
    text: "Your goal: From product info to extract key selling points and generate an Instagram marketing poster + product video",
  },
  {
    id: "summary-3",
    text: "RoboNeo has assembled the following agent team and started collaborating:",
  },
] as const;

const flowSteps = [
  { kind: "show", id: "user-bubble", wait: 210 },
  { kind: "show", id: "summary-1", wait: 220 },
  { kind: "show", id: "summary-2", wait: 290 },
  { kind: "show", id: "summary-3", wait: 320 },
  { kind: "show", id: "agent-card-1", wait: 240 },
  { kind: "show", id: "agent-card-2", wait: 190 },
  { kind: "show", id: "agent-card-3", wait: 190 },
  { kind: "show", id: "agent-card-4", wait: 190 },
  { kind: "cue", label: "Market Scout is analyzing competitor sources...", wait: 280, hold: 900 },
  { kind: "show", id: "event-1", wait: 210 },
  { kind: "show", id: "event-2", wait: 280 },
  { kind: "cue", label: "Content Auditor is reviewing extraction quality...", wait: 260, hold: 840 },
  { kind: "show", id: "event-3", wait: 230 },
  { kind: "show", id: "event-4", wait: 320 },
] as const;

const chatAgentFlowIds = ["agent-card-1", "agent-card-2", "agent-card-3", "agent-card-4"] as const;

const allFlowIds = [
  "user-bubble",
  ...summaryFlow.map((item) => item.id),
  ...chatAgentFlowIds,
  ...timelineEvents.map((item) => item.id),
];

const sandboxOperations = [
  {
    id: "op-1",
    title: "Fetch competitor snapshots",
    tool: "Market Scout",
    detail: "scanning 32 sources · 4 channels",
    status: "done",
  },
  {
    id: "op-2",
    title: "Extract conversion hooks",
    tool: "Brand Copywriter",
    detail: "ranking USP candidates with confidence scores",
    status: "running",
  },
  {
    id: "op-3",
    title: "Generate visual keyframes",
    tool: "Campaign Designer",
    detail: "poster variants: 3 · motion frames: 12",
    status: "queued",
  },
  {
    id: "op-4",
    title: "Compose promo sequence",
    tool: "Video Producer",
    detail: "timeline length 00:15 · beat markers synced",
    status: "running",
  },
  {
    id: "op-5",
    title: "Run policy compliance checks",
    tool: "Content Auditor",
    detail: "pending legal phrase review",
    status: "queued",
  },
] as const;

const chatProcessingTaskLabels = [
  "Collect product context",
  "Scan competitor signals",
  "Extract conversion hooks",
  "Generate storyboard scenes",
  "Render promo sequence",
] as const;

const agentRuntimeTargetById: Record<
  string,
  {
    nodeId: string;
    location: string;
  }
> = {
  "agent-research": {
    nodeId: "asset-section-story-outline-outline-group-outline-b",
    location: "Story Outline · Research Brief",
  },
  "agent-marketing": {
    nodeId: "asset-section-story-outline-outline-group-outline-a",
    location: "Story Outline · Copy Direction",
  },
  "agent-generation": {
    nodeId: "asset-section-character-design-character-group-a-character-img-1",
    location: "Character Design · Visual Draft",
  },
  "agent-review": {
    nodeId: "asset-section-character-design-character-group-b-character-img-2",
    location: "Character Design · QA Review",
  },
};

export const LeftPanel = memo(function LeftPanel({
  mobile = false,
  onClose,
  isMinimized = false,
  onToggleMinimize,
  onOpenAgentDetails,
  onLocateAgentRuntime,
  demoMode = "A",
}: LeftPanelProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<"chat" | "sandbox">("chat");
  const [showIntroTyping, setShowIntroTyping] = useState(false);
  const [visibleFlowIds, setVisibleFlowIds] = useState<string[]>([]);
  const [agentCue, setAgentCue] = useState<string | null>(null);
  const [composerValue, setComposerValue] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return new URLSearchParams(window.location.search).get("prompt")?.trim() ?? "";
  });
  const [activePromptText, setActivePromptText] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_USER_PROMPT;
    }

    const promptFromUrl = new URLSearchParams(window.location.search).get("prompt")?.trim();
    return promptFromUrl || DEFAULT_USER_PROMPT;
  });
  const [selectedAgentId, setSelectedAgentId] = useState(chatAgentCards[0]?.id ?? "");
  const [isAgentPickerOpen, setIsAgentPickerOpen] = useState(false);
  const [isRuntimeCapsuleExpanded, setIsRuntimeCapsuleExpanded] = useState(false);
  const [isTaskMenuExpanded, setIsTaskMenuExpanded] = useState(true);
  const agentPickerRef = useRef<HTMLDivElement | null>(null);
  const timersRef = useRef<number[]>([]);
  const rafsRef = useRef<number[]>([]);
  const previousDemoModeRef = useRef<DemoMode>(demoMode);

  const isHomeActive = pathname === "/home";
  const selectedAgent =
    chatAgentCards.find((agent) => agent.id === selectedAgentId) ?? chatAgentCards[0];

  const clearScheduledFlow = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    rafsRef.current.forEach((raf) => window.cancelAnimationFrame(raf));
    timersRef.current = [];
    rafsRef.current = [];
  }, []);

  const scheduleFlowTimer = useCallback((delay: number, callback: () => void) => {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
  }, []);

  const scheduleFlowRaf = useCallback((callback: () => void) => {
    const raf = window.requestAnimationFrame(callback);
    rafsRef.current.push(raf);
  }, []);

  const revealFlowImmediately = useCallback(() => {
    scheduleFlowRaf(() => {
      setShowIntroTyping(false);
      setAgentCue(null);
      setVisibleFlowIds(allFlowIds);
    });
  }, [scheduleFlowRaf]);

  const runFlowSequence = useCallback(
    (typingLead: number) => {
      clearScheduledFlow();

      scheduleFlowRaf(() => {
        setShowIntroTyping(true);
        setAgentCue(null);
        setVisibleFlowIds([]);
      });

      let elapsed = typingLead;
      scheduleFlowTimer(elapsed, () => setShowIntroTyping(false));

      flowSteps.forEach((step) => {
        elapsed += step.wait;

        if (step.kind === "show") {
          scheduleFlowTimer(elapsed, () => {
            setVisibleFlowIds((prev) => (prev.includes(step.id) ? prev : [...prev, step.id]));
          });
        } else {
          scheduleFlowTimer(elapsed, () => setAgentCue(step.label));
          elapsed += step.hold;
          scheduleFlowTimer(elapsed, () => setAgentCue(null));
        }
      });
    },
    [clearScheduledFlow, scheduleFlowRaf, scheduleFlowTimer],
  );

  useEffect(() => {
    if (activeTab !== "chat") {
      revealFlowImmediately();
      return clearScheduledFlow;
    }

    if (pathname !== "/") {
      revealFlowImmediately();
      return clearScheduledFlow;
    }

    runFlowSequence(INITIAL_FLOW_TYPING_LEAD);
    return clearScheduledFlow;
  }, [activeTab, clearScheduledFlow, pathname, revealFlowImmediately, runFlowSequence]);

  useEffect(() => {
    const previousDemoMode = previousDemoModeRef.current;
    previousDemoModeRef.current = demoMode;

    if (previousDemoMode === demoMode) {
      return;
    }

    if (demoMode !== "B" || activeTab !== "chat" || pathname !== "/") {
      return;
    }

    runFlowSequence(RESEND_FLOW_TYPING_LEAD);
  }, [activeTab, demoMode, pathname, runFlowSequence]);

  useEffect(() => {
    if (!isAgentPickerOpen && !isRuntimeCapsuleExpanded) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        agentPickerRef.current &&
        !agentPickerRef.current.contains(event.target as Node)
      ) {
        setIsAgentPickerOpen(false);
        setIsRuntimeCapsuleExpanded(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAgentPickerOpen(false);
        setIsRuntimeCapsuleExpanded(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isAgentPickerOpen, isRuntimeCapsuleExpanded]);

  const isVisible = (id: string) => visibleFlowIds.includes(id);
  const hasAnyTimelineItem = timelineEvents.some((event) => isVisible(event.id));
  const hasVisibleAgentCards = chatAgentFlowIds.some((id) => isVisible(id));
  const processingTasks = useMemo(() => {
    if (activeTab === "sandbox") {
      return sandboxOperations.map((operation) => ({
        id: operation.id,
        label: operation.title,
        status: operation.status,
      })) as Array<{
        id: string;
        label: string;
        status: "done" | "running" | "queued";
      }>;
    }

    const flowProgress = visibleFlowIds.includes("event-4")
      ? 5
      : visibleFlowIds.includes("event-3")
        ? 4
        : visibleFlowIds.includes("event-2")
          ? 3
          : visibleFlowIds.includes("summary-3")
            ? 2
            : visibleFlowIds.includes("summary-1")
              ? 1
              : 0;

    return chatProcessingTaskLabels.map((label, index) => {
      let status: "done" | "running" | "queued" = "queued";

      if (index < flowProgress) {
        status = "done";
      } else if (index === flowProgress && flowProgress < chatProcessingTaskLabels.length) {
        status = "running";
      }

      return {
        id: `task-${index + 1}`,
        label,
        status,
      };
    });
  }, [activeTab, visibleFlowIds]);
  const completedTaskCount = processingTasks.filter((task) => task.status === "done").length;
  const activeProcessingTask = useMemo(
    () =>
      processingTasks.find((task) => task.status === "running") ??
      processingTasks.find((task) => task.status === "queued") ??
      processingTasks[processingTasks.length - 1],
    [processingTasks],
  );
  const runtimeAgents = useMemo(
    () =>
      chatAgentCards.map((agent) => ({
        agent,
        runtimeTarget: agentRuntimeTargetById[agent.id],
      })),
    [],
  );
  const runningRuntimeAgentCount = runtimeAgents.filter(
    (item) => item.agent.status === "running",
  ).length;
  const headerControlButtonClass =
    "grid h-7 w-7 place-items-center rounded-full border border-[#e2e6ee] bg-[#eceff4] text-[#8e97a7] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition hover:bg-[#e8ecf3] hover:text-[#6f7a8d]";

  const handleSendPrompt = () => {
    const normalizedPrompt = composerValue.trim();

    if (!normalizedPrompt) {
      return;
    }

    setActivePromptText(normalizedPrompt);

    if (activeTab === "chat" && pathname === "/") {
      runFlowSequence(RESEND_FLOW_TYPING_LEAD);
      return;
    }

    revealFlowImmediately();
  };

  const handleRuntimeAgentLocate = (agent: ChatAgentCard) => {
    const runtimeTarget = agentRuntimeTargetById[agent.id];
    if (runtimeTarget) {
      onLocateAgentRuntime?.(agent, runtimeTarget.nodeId);
    } else {
      onOpenAgentDetails?.(agent);
    }
    setIsRuntimeCapsuleExpanded(false);
  };

  return (
    <div className={cn("flex h-full", !isHomeActive && "gap-3")}>
      {!isHomeActive ? <SideTabRail className="hidden sm:flex" /> : null}

      <section className="relative flex min-w-0 flex-1 flex-col rounded-[26px] border border-[#e3e6ed] bg-[linear-gradient(180deg,#f9fafc_0%,#f6f7fa_100%)] p-1.5 shadow-[0_18px_28px_rgba(15,23,42,0.09)]">
        <header className="flex items-start justify-between">
          <div className="inline-flex rounded-full border border-[#e2e6ee] bg-[#eceff4] p-0.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={cn(
                  "flex h-7 min-w-[60px] items-center justify-center gap-1 rounded-full px-2 text-[10px] font-semibold transition",
                activeTab === "chat"
                  ? "bg-white text-[#141821] shadow-[0_2px_8px_rgba(15,23,42,0.08)]"
                  : "text-[#adb3bf] hover:text-[#8e96a5]",
              )}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Chat
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sandbox")}
              className={cn(
                  "flex h-7 min-w-[60px] items-center justify-center gap-1 rounded-full px-2 text-[10px] font-semibold transition",
                activeTab === "sandbox"
                  ? "bg-white text-[#141821] shadow-[0_2px_8px_rgba(15,23,42,0.08)]"
                  : "text-[#adb3bf] hover:text-[#8e96a5]",
              )}
            >
              <Box className="h-3.5 w-3.5" />
              SandBox
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className={headerControlButtonClass}
              onClick={() => {
                onToggleMinimize?.();
                if (mobile) {
                  onClose?.();
                }
              }}
              aria-label={isMinimized ? "Expand panel" : "Minimize panel"}
            >
              <Expand className="h-3.5 w-3.5" />
            </button>
            {mobile ? (
              <button
                type="button"
                className={headerControlButtonClass}
                onClick={onClose}
                aria-label="Close panel"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </header>

        <div className="chat-scrollbar mt-2 flex-1 overflow-y-auto pr-0">
          {activeTab === "chat" ? (
            <div className="space-y-3 rounded-2xl px-0.5 py-1">
              <div className="rounded-2xl border border-[#e5e9f1] bg-white/85 p-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.07)]">
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-2">
                    <div className="h-7 w-7 rounded-full bg-[linear-gradient(135deg,#c084fc,#60a5fa)] ring-2 ring-white" />
                    <div className="h-7 w-7 rounded-full bg-[linear-gradient(135deg,#34d399,#93c5fd)] ring-2 ring-white" />
                    <div className="h-7 w-7 rounded-full bg-[linear-gradient(135deg,#bfdbfe,#fde68a)] ring-2 ring-white" />
                    <div className="h-7 w-7 rounded-full bg-[linear-gradient(135deg,#dbeafe,#f5d0fe)] ring-2 ring-white" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-[15px] font-bold leading-6 text-[#141821]">Agent Team</h2>
                    <p className="mt-0.5 text-[11px] text-[#8f98a8]">Updated 3 minutes ago</p>
                  </div>
                </div>

                <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                  {chatGalleryGradients.map((gradient, index) => (
                    <div
                      key={`${gradient}-${index}`}
                      className="h-12 rounded-xl border border-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
                      style={{ backgroundImage: gradient }}
                    />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {showIntroTyping ? (
                  <motion.div
                    key="typing-bubble"
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="max-w-[92%] rounded-2xl border border-[#dfe5ef] bg-[#edf1f7] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
                  >
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-[#3d4758]">
                      <span>AI Agent Team is generating...</span>
                      <div className="flex items-end gap-1">
                        {[0, 1, 2].map((dot) => (
                          <motion.span
                            key={dot}
                            className="h-1.5 w-1.5 rounded-full bg-[#5b6678]"
                            animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: dot * 0.15,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-2.5 space-y-1.5">
                      <motion.div
                        className="h-1.5 rounded-full bg-[#d2d9e6]"
                        animate={{ width: ["40%", "92%", "62%"] }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.div
                        className="h-1.5 rounded-full bg-[#d8deea]"
                        animate={{ width: ["56%", "84%", "48%"] }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                          delay: 0.12,
                        }}
                      />
                    </div>
                  </motion.div>
                ) : isVisible("user-bubble") ? (
                  <div className="flex justify-end">
                    <motion.div
                      key="result-bubble"
                      initial={{ opacity: 0, y: 18, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 240, damping: 22 }}
                      className="max-w-[92%] rounded-2xl border border-[#e2e6ee] bg-[#f1f3f7] px-3 py-2 text-[12px] font-semibold leading-5 text-[#252b35] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                    >
                      {activePromptText}
                    </motion.div>
                  </div>
                ) : null}
              </AnimatePresence>

              <div className="rounded-2xl border border-[#e4e8f0] bg-white/78 p-2.5">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8a93a3]">
                  Mission Brief
                </p>
                <div className="space-y-1.5">
                  <AnimatePresence initial={false}>
                    {summaryFlow.map((item, index) =>
                      isVisible(item.id) ? (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ type: "spring", stiffness: 250, damping: 24 }}
                          className="flex items-start gap-2 rounded-xl bg-[#f3f6fb] px-2 py-1.5 text-[11px] leading-5 text-[#253044]"
                        >
                          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-[#7f899c]">
                            {index + 1}
                          </span>
                          <p>{item.text}</p>
                        </motion.div>
                      ) : null,
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {hasVisibleAgentCards ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ type: "spring", stiffness: 250, damping: 24 }}
                    className="rounded-2xl border border-[#e4e8f0] bg-white/80 p-2.5"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#8b93a2]">
                        Agent Calls
                      </p>
                      <span className="text-[10px] font-semibold text-[#99a1b0]">
                        {chatAgentFlowIds.filter((id) => isVisible(id)).length}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {chatAgentCards.map((agent, index) => {
                        const flowId = chatAgentFlowIds[index];

                        if (!flowId || !isVisible(flowId)) {
                          return null;
                        }

                        return (
                          <motion.button
                            type="button"
                            key={agent.id}
                            initial={{ opacity: 0, y: 10, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 280,
                              damping: 24,
                              delay: index * 0.04,
                            }}
                            whileHover={{ y: -2 }}
                            onClick={() => onOpenAgentDetails?.(agent)}
                            className="rounded-2xl border border-[#eceff4] bg-white/92 p-2 text-left shadow-[0_8px_18px_rgba(15,23,42,0.08)] transition hover:shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
                          >
                            <div className="flex items-center gap-1.5">
                              <span
                                className={cn(
                                  "h-6 w-6 rounded-full border border-white/70 shadow-[0_3px_10px_rgba(15,23,42,0.16)]",
                                  agentDotScheme[agent.color],
                                )}
                              />
                              <p className="text-[12px] font-bold leading-5 text-[#151b25]">
                                {agent.name}
                              </p>
                            </div>
                            <p className="mt-1 text-[10px] leading-4 text-[#8e98a8]">
                              {agent.summary}
                            </p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <AnimatePresence initial={false}>
                {agentCue ? (
                  <motion.div
                    key={agentCue}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="rounded-xl border border-[#e2e6ee] bg-white/75 px-2.5 py-2"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-medium text-[#738096]">
                      <span>{agentCue}</span>
                      <div className="ml-1 flex items-center gap-1">
                        {[0, 1, 2].map((dot) => (
                          <motion.span
                            key={`${agentCue}-${dot}`}
                            className="h-1.5 w-1.5 rounded-full bg-[#8a95a8]"
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{
                              duration: 0.9,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: dot * 0.14,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="rounded-2xl border border-[#e4e8f0] bg-white/74 p-2.5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8b93a2]">
                    Execution Log
                  </p>
                  <span className="text-[10px] font-semibold text-[#9ea6b5]">
                    {timelineEvents.filter((event) => isVisible(event.id)).length}/{timelineEvents.length}
                  </span>
                </div>

                <div className="space-y-1.5 border-l border-[#d8dde6] pl-2.5">
                  <AnimatePresence initial={false}>
                    {timelineEvents.map((event) =>
                      isVisible(event.id) ? (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 12, filter: "blur(3px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ type: "spring", stiffness: 250, damping: 24 }}
                          className="flex items-start gap-2 text-[#95a0af]"
                        >
                          <span className="mt-0.5">
                            <EventIcon type={event.type} />
                          </span>
                          <p className="text-[12px] leading-5">{event.text}</p>
                        </motion.div>
                      ) : null,
                    )}
                  </AnimatePresence>
                </div>

                {!hasAnyTimelineItem ? (
                  <div className="mt-2 rounded-xl border border-[#e2e6ee] bg-white/80 p-2.5">
                    <div className="flex items-center gap-2 text-xs text-[#8f98a8]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#9aa3b3]" />
                      Waiting for agent logs...
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2 pl-1 text-[#c3c9d5]" aria-label="Agent thinking">
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={`footer-thinking-dot-${dot}`}
                    className="h-1.5 w-1.5 rounded-full bg-current"
                    animate={{ opacity: [0.35, 1, 0.35], y: [0, -2, 0], scale: [0.9, 1.15, 0.9] }}
                    transition={{
                      duration: 1.1,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: dot * 0.16,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="rounded-2xl px-0.5 py-1.5"
            >
              <div className="rounded-2xl border border-[#e3e7ef] bg-white/88 p-4 shadow-[0_10px_25px_rgba(15,23,42,0.08)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#eef3ff] text-[#3d66d3]">
                      <Terminal className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#141821]">Sandbox Live Ops</p>
                      <p className="text-xs text-[#8a93a3]">Agent backend action preview</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#edf3ff] px-2 py-1 text-[11px] font-semibold text-[#3a64d2]">
                    Live
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {sandboxOperations.map((operation, index) => (
                    <motion.div
                      key={operation.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 24,
                        delay: index * 0.08,
                      }}
                      className="rounded-xl border border-[#e7ecf5] bg-[#f9fbff] p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-[#1f2734]">{operation.title}</p>
                          <p className="mt-0.5 text-xs text-[#768198]">{operation.tool}</p>
                        </div>
                        <SandboxStatus status={operation.status} />
                      </div>
                      <p className="mt-2 text-xs leading-5 text-[#5e6a82]">{operation.detail}</p>
                      <div className="mt-2 rounded-lg border border-[#dde5f2] bg-white px-2 py-1.5 font-mono text-[11px] text-[#5b6578]">
                        <span className="mr-1 text-[#6f7d95]">$</span>
                        {operation.status === "done"
                          ? "operation completed"
                          : operation.status === "running"
                            ? "operation running..."
                            : "waiting in queue"}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-[#e7ecf5] bg-[#f6f9ff] p-3">
                    <div className="flex items-center gap-2 text-[#5d6f92]">
                      <Database className="h-4 w-4" />
                      <span className="text-xs font-medium">Artifacts</span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-[#1d2b46]">12 generated files</p>
                  </div>
                  <div className="rounded-xl border border-[#e7ecf5] bg-[#f6f9ff] p-3">
                    <div className="flex items-center gap-2 text-[#5d6f92]">
                      <Cpu className="h-4 w-4" />
                      <span className="text-xs font-medium">Workers</span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-[#1d2b46]">5 agents online</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <footer className="pt-1">
          <div ref={agentPickerRef} className="relative">
            <div className="mb-2">
              <div className="relative inline-flex">
                <button
                  type="button"
                  onClick={() => {
                    setIsRuntimeCapsuleExpanded((prev) => !prev);
                    setIsAgentPickerOpen(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-[#e4e9f1] bg-white/85 px-2.5 py-1.5 shadow-[0_6px_12px_rgba(15,23,42,0.06)] backdrop-blur-sm transition hover:bg-white"
                  aria-expanded={isRuntimeCapsuleExpanded}
                  aria-label="Toggle agent runtime list"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-[#e5e9f0] bg-[#f7f9fc] text-[#a1aabd]">
                    <Bot className="h-3.5 w-3.5" />
                  </span>
                  <div className="text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8e97a8]">
                      Agent Runtime
                    </p>
                    <p className="text-[11px] font-medium text-[#4f5b71]">
                      {runningRuntimeAgentCount} background agents
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-[#98a1b2] transition-transform",
                      isRuntimeCapsuleExpanded && "rotate-180",
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isRuntimeCapsuleExpanded ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 280, damping: 24 }}
                      className="absolute bottom-[calc(100%+10px)] left-0 z-50 w-[320px] rounded-2xl border border-white/70 bg-white/62 p-2 shadow-[0_10px_20px_rgba(15,23,42,0.12)] backdrop-blur-xl"
                    >
                      <div className="flex items-center justify-between px-1 pb-1">
                        <p className="text-[10px] font-semibold text-[#8f98a9]">
                          {runtimeAgents.length} background agents (@ to tag agents)
                        </p>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-[10px] font-medium text-[#a0a8b7] transition hover:text-[#7f8a9d]"
                          aria-label="Runtime settings"
                        >
                          Settings
                          <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="space-y-0.5">
                        {runtimeAgents.map(({ agent, runtimeTarget }) => {
                          const statusText =
                            agent.status === "running"
                              ? "is thinking"
                              : agent.status === "done"
                                ? "is ready"
                                : "is awaiting instruction";

                          return (
                            <button
                              key={`runtime-row-${agent.id}`}
                              type="button"
                              onClick={() => handleRuntimeAgentLocate(agent)}
                              className="group flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-left transition hover:bg-[#f5f8fc]"
                            >
                              <span className="min-w-0 flex-1 truncate text-[12px]">
                                <span className={cn("font-semibold", agentNameColorScheme[agent.color])}>
                                  {agent.name}
                                </span>{" "}
                                <span className="text-[#9ba4b4]">{statusText}</span>
                              </span>
                              <span className="ml-3 inline-flex items-center gap-1 text-[11px] font-medium text-[#a3acbb] transition group-hover:text-[#7e8aa0]">
                                Open
                                <ArrowUpRight className="h-3 w-3" />
                              </span>
                              <span className="sr-only">
                                Locate {agent.name} at {runtimeTarget?.location ?? "canvas node"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="px-2 pt-1 text-[10px] text-[#b0b8c6]">
                        Click an agent to locate its working position on canvas.
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            <div className="rounded-[22px] border border-[#e2e5eb] bg-[#f4f5f7] p-2.5 shadow-[0_8px_18px_rgba(15,23,42,0.08)]">
              <button
                type="button"
                onClick={() => setIsTaskMenuExpanded((prev) => !prev)}
                className="flex w-full items-center justify-between gap-2 rounded-xl px-1 py-0.5 text-left"
                aria-expanded={isTaskMenuExpanded}
                aria-label="Toggle processing tasks"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <ProcessingTaskStatusIcon status={activeProcessingTask?.status ?? "queued"} />
                  <span className="truncate text-[11px] font-medium text-[#8c94a3]">
                    {activeProcessingTask?.label ?? "No active task"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-[#9aa2b0]">
                    {completedTaskCount}/{processingTasks.length}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-[#98a0ae] transition-transform",
                      isTaskMenuExpanded && "rotate-180",
                    )}
                  />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isTaskMenuExpanded ? (
                  <motion.ul
                    initial={{ opacity: 0, y: 6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: 4, height: 0 }}
                    transition={{ type: "spring", stiffness: 250, damping: 24 }}
                    className="mt-1.5 space-y-0.5 overflow-hidden border-t border-[#e6e9ef] pt-1.5"
                  >
                    {processingTasks.map((task) => (
                      <li key={task.id} className="flex items-center gap-2 rounded-lg px-1.5 py-0.5">
                        <ProcessingTaskStatusIcon status={task.status} />
                        <span
                          className={cn(
                            "truncate text-[11px]",
                            task.status === "done"
                              ? "text-[#9aa2b0]"
                              : task.status === "running"
                                ? "font-medium text-[#59657a]"
                                : "text-[#b0b8c6]",
                          )}
                        >
                          {task.label}
                        </span>
                      </li>
                    ))}
                  </motion.ul>
                ) : null}
              </AnimatePresence>

              <div className="mt-1.5 border-t border-[#e6e9ef] pt-1.5">
                <div className="flex h-7 items-center gap-2 px-1">
                  <AtSign className="h-3.5 w-3.5 text-[#a6adba]" />
                  <input
                    value={composerValue}
                    onChange={(event) => setComposerValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        handleSendPrompt();
                      }
                    }}
                    className="h-full flex-1 border-none bg-transparent text-[13px] text-[#636c7e] placeholder:text-[#a8afbc] outline-none"
                    placeholder="@ an agent · Ask me anything..."
                    aria-label="Ask me anything"
                  />
                </div>

                <div className="mt-1.5 flex items-center justify-between gap-2 px-1">
                  <div className="relative flex items-center gap-2">
                    <AnimatePresence>
                      {isAgentPickerOpen ? (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 280, damping: 24 }}
                          className="absolute bottom-[calc(100%+10px)] left-0 z-50 w-[252px] rounded-2xl border border-[#e3e8f1] bg-white p-2 shadow-[0_16px_30px_rgba(15,23,42,0.16)]"
                        >
                          <p className="px-2 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8b95a7]">
                            Agent Role
                          </p>
                          <div className="space-y-1">
                            {chatAgentCards.map((agent) => (
                              <button
                                key={agent.id}
                                type="button"
                                onClick={() => {
                                  setSelectedAgentId(agent.id);
                                  setIsAgentPickerOpen(false);
                                }}
                                className={cn(
                                  "flex w-full items-start gap-2 rounded-xl px-2 py-2 text-left transition",
                                  selectedAgentId === agent.id
                                    ? "bg-[#eef4ff]"
                                    : "hover:bg-[#f4f7fc]",
                                )}
                              >
                                <span
                                  className={cn(
                                    "mt-0.5 h-6 w-6 shrink-0 rounded-full border border-white/70 shadow-[0_2px_8px_rgba(15,23,42,0.12)]",
                                    agentDotScheme[agent.color],
                                  )}
                                />
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-sm font-semibold text-[#1b2332]">
                                    {agent.name}
                                  </span>
                                  <span className="block truncate text-xs text-[#7a869b]">
                                    {agent.summary}
                                  </span>
                                </span>
                                {selectedAgentId === agent.id ? (
                                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#3a64d2]" />
                                ) : null}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    <button
                      type="button"
                      className="grid h-8 w-8 place-items-center rounded-full bg-[#e4e6eb] text-[#2f3643] transition hover:bg-[#d9dde5]"
                      aria-label="Attach"
                    >
                      <Plus className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAgentPickerOpen((prev) => !prev);
                        setIsRuntimeCapsuleExpanded(false);
                      }}
                      className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e4e6eb] text-[#2f3643] transition hover:bg-[#d9dde5]"
                      aria-label="Choose agent role"
                      aria-expanded={isAgentPickerOpen}
                    >
                      <span
                        className={cn(
                          "h-5 w-5 rounded-full border border-white/70",
                          selectedAgent ? agentDotScheme[selectedAgent.color] : "bg-[#cbd5e1]",
                        )}
                      />
                    </button>

                    <button
                      type="button"
                      className="grid h-8 w-8 place-items-center rounded-full bg-[#e4e6eb] text-[#2f3643] transition hover:bg-[#d9dde5]"
                      aria-label="Composer options"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendPrompt}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0f1117] text-white shadow-[0_8px_16px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-[#161a22]"
                    aria-label="Send"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
});
