"use client";

import { memo, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUp,
  Box,
  BrainCircuit,
  CheckCircle2,
  CircleDashed,
  Cpu,
  Database,
  Clock3,
  Expand,
  History,
  Home,
  MessageCircle,
  Paperclip,
  Search,
  Sparkles,
  SquarePlus,
  Terminal,
  Layers,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { chatAgentCards, chatGalleryGradients, sideRailIcons, timelineEvents } from "./mock-data";
import type { AgentColor, ChatAgentCard } from "./types";

interface LeftPanelProps {
  mobile?: boolean;
  onClose?: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  onOpenAgentDetails?: (agent: ChatAgentCard) => void;
}

const agentDotScheme: Record<AgentColor, string> = {
  red: "bg-[linear-gradient(135deg,#ff9f97,#f43f5e)]",
  purple: "bg-[linear-gradient(135deg,#f5d0fe,#818cf8)]",
  blue: "bg-[linear-gradient(135deg,#bfdbfe,#93c5fd)]",
  orange: "bg-[linear-gradient(135deg,#fde68a,#fdba74)]",
  green: "bg-[linear-gradient(135deg,#86efac,#67e8f9)]",
};

function SideRailIcon({ name }: { name: (typeof sideRailIcons)[number] }) {
  if (name === "home") {
    return <Home className="h-5 w-5" />;
  }

  if (name === "sparkles") {
    return <Sparkles className="h-5 w-5" />;
  }

  if (name === "square-plus") {
    return <SquarePlus className="h-5 w-5" />;
  }

  if (name === "layers") {
    return <Layers className="h-5 w-5" />;
  }

  return <History className="h-5 w-5" />;
}

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

const INTRO_ANIMATION_KEY = "agent-team-intro-played-v2";

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

export const LeftPanel = memo(function LeftPanel({
  mobile = false,
  onClose,
  isMinimized = false,
  onToggleMinimize,
  onOpenAgentDetails,
}: LeftPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<"chat" | "sandbox">("chat");
  const [showIntroTyping, setShowIntroTyping] = useState(false);
  const [visibleFlowIds, setVisibleFlowIds] = useState<string[]>([]);
  const [agentCue, setAgentCue] = useState<string | null>(null);

  const isHomeActive = pathname === "/home";
  const isWorkbenchActive = pathname === "/";

  useEffect(() => {
    const timers: number[] = [];
    const rafs: number[] = [];

    const schedule = (delay: number, callback: () => void) => {
      const timer = window.setTimeout(callback, delay);
      timers.push(timer);
    };

    const scheduleRaf = (callback: () => void) => {
      const raf = window.requestAnimationFrame(callback);
      rafs.push(raf);
    };

    const revealAll = () => {
      scheduleRaf(() => {
        setShowIntroTyping(false);
        setAgentCue(null);
        setVisibleFlowIds(allFlowIds);
      });
    };

    if (activeTab !== "chat") {
      revealAll();
      return () => {
        timers.forEach((timer) => window.clearTimeout(timer));
        rafs.forEach((raf) => window.cancelAnimationFrame(raf));
      };
    }

    if (pathname !== "/") {
      revealAll();
      return () => {
        timers.forEach((timer) => window.clearTimeout(timer));
        rafs.forEach((raf) => window.cancelAnimationFrame(raf));
      };
    }

    const hasPlayed = window.sessionStorage.getItem(INTRO_ANIMATION_KEY) === "1";

    if (hasPlayed) {
      revealAll();
      return () => {
        timers.forEach((timer) => window.clearTimeout(timer));
        rafs.forEach((raf) => window.cancelAnimationFrame(raf));
      };
    }

    scheduleRaf(() => {
      setShowIntroTyping(true);
      setAgentCue(null);
      setVisibleFlowIds([]);
    });

    let elapsed = 1180;
    schedule(elapsed, () => setShowIntroTyping(false));

    flowSteps.forEach((step) => {
      elapsed += step.wait;

      if (step.kind === "show") {
        schedule(elapsed, () => {
          setVisibleFlowIds((prev) => (prev.includes(step.id) ? prev : [...prev, step.id]));
        });
      } else {
        schedule(elapsed, () => setAgentCue(step.label));
        elapsed += step.hold;
        schedule(elapsed, () => setAgentCue(null));
      }
    });

    schedule(elapsed + 80, () => {
      window.sessionStorage.setItem(INTRO_ANIMATION_KEY, "1");
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      rafs.forEach((raf) => window.cancelAnimationFrame(raf));
    };
  }, [pathname, activeTab]);

  const isVisible = (id: string) => visibleFlowIds.includes(id);
  const hasAnyTimelineItem = timelineEvents.some((event) => isVisible(event.id));
  const hasVisibleAgentCards = chatAgentFlowIds.some((id) => isVisible(id));

  return (
    <div className={cn("flex h-full", !isHomeActive && "gap-3")}>
      {!isHomeActive ? (
        <aside className="hidden w-[76px] flex-col items-center rounded-[999px] border border-[#e6e8ee] bg-[#f2f4f7] py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] sm:flex">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg">
            <span className="text-xs font-bold tracking-[0.14em]">AI</span>
          </div>

          <div className="flex w-full flex-1 flex-col items-center justify-center gap-3">
            {sideRailIcons.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => {
                  if (item === "home") {
                    router.push("/home");
                    return;
                  }

                  if (item === "sparkles") {
                    router.push("/");
                  }
                }}
                className={cn(
                  "grid h-12 w-12 place-items-center rounded-full text-[#98a0af] transition",
                  (item === "home" && isHomeActive) ||
                    (item === "sparkles" && isWorkbenchActive)
                    ? "bg-[#353b47] text-white shadow-[0_8px_20px_rgba(17,24,39,0.25)]"
                    : "bg-[#eceff4] hover:bg-[#dfe4eb]",
                )}
                aria-label={item}
              >
                <SideRailIcon name={item} />
              </button>
            ))}
          </div>

          <div className="h-11 w-11 rounded-full bg-[linear-gradient(135deg,#fb923c,#0ea5e9)] p-[2px]">
            <div className="h-full w-full rounded-full bg-white" />
          </div>
        </aside>
      ) : null}

      <section className="relative flex min-w-0 flex-1 flex-col rounded-[30px] border border-[#e3e6ed] bg-[linear-gradient(180deg,#f9fafc_0%,#f6f7fa_100%)] p-4 shadow-[0_22px_34px_rgba(15,23,42,0.09)]">
        <header className="flex items-start justify-between">
          <div className="inline-flex rounded-xl bg-[#eceff4] p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={cn(
                "flex h-11 min-w-[74px] items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition",
                activeTab === "chat"
                  ? "bg-white text-[#141821] shadow-sm"
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
                "flex h-11 min-w-[74px] items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition",
                activeTab === "sandbox"
                  ? "bg-white text-[#141821] shadow-sm"
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
              className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eceff4] text-[#8e97a7]"
              onClick={() => {
                onToggleMinimize?.();
                if (mobile) {
                  onClose?.();
                }
              }}
              aria-label={isMinimized ? "Expand panel" : "Minimize panel"}
            >
              <Expand className="h-[18px] w-[18px]" />
            </button>
            {mobile ? (
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eceff4] text-[#8e97a7]"
                onClick={onClose}
                aria-label="Close panel"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            ) : null}
          </div>
        </header>

        <div className="chat-scrollbar mt-4 flex-1 overflow-y-auto pr-0.5">
          {activeTab === "chat" ? (
            <div className="rounded-2xl px-2 py-2">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <div className="h-9 w-9 rounded-full bg-[linear-gradient(135deg,#c084fc,#60a5fa)] ring-2 ring-white" />
                  <div className="h-9 w-9 rounded-full bg-[linear-gradient(135deg,#34d399,#93c5fd)] ring-2 ring-white" />
                  <div className="h-9 w-9 rounded-full bg-[linear-gradient(135deg,#bfdbfe,#fde68a)] ring-2 ring-white" />
                  <div className="h-9 w-9 rounded-full bg-[linear-gradient(135deg,#dbeafe,#f5d0fe)] ring-2 ring-white" />
                </div>
                <div>
                  <h2 className="text-[20px] font-bold leading-8 text-[#141821]">Agent Team</h2>
                  <p className="mt-1 text-xs text-[#9aa2b0]">Updated 3 minutes ago</p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                {chatGalleryGradients.map((gradient, index) => (
                  <div
                    key={`${gradient}-${index}`}
                    className="h-16 w-16 rounded-2xl border border-white/80"
                    style={{ backgroundImage: gradient }}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {showIntroTyping ? (
                  <motion.div
                    key="typing-bubble"
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="mt-3 rounded-3xl bg-[#e9edf4] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
                  >
                    <div className="flex items-center gap-2 text-[12px] font-semibold text-[#3d4758]">
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
                  <motion.div
                    key="result-bubble"
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 22 }}
                    className="mt-3 rounded-3xl bg-[#eceef2] p-3 text-[14px] font-semibold leading-6 text-[#252b35] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                  >
                    Generate a set of Gameboy-style pixel images from the picture.
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="mt-3 space-y-0.5 text-[13px] leading-5 text-[#1a2029]">
                <AnimatePresence initial={false}>
                  {summaryFlow.map((item) =>
                    isVisible(item.id) ? (
                      <motion.p
                        key={item.id}
                        initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ type: "spring", stiffness: 250, damping: 24 }}
                      >
                        {item.text}
                      </motion.p>
                    ) : null,
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence initial={false}>
                {hasVisibleAgentCards ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ type: "spring", stiffness: 250, damping: 24 }}
                    className="mt-2.5"
                  >
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#8b93a2]">
                      Agent Calls
                    </p>
                    <div className="grid grid-cols-2 gap-2">
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
                            className="rounded-[18px] border border-[#eceff4] bg-white/90 p-3 text-left shadow-[0_8px_18px_rgba(15,23,42,0.08)] transition hover:shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "h-8 w-8 rounded-full border border-white/70 shadow-[0_3px_10px_rgba(15,23,42,0.16)]",
                                  agentDotScheme[agent.color],
                                )}
                              />
                              <p className="text-[14px] font-bold leading-5 text-[#151b25]">
                                {agent.name}
                              </p>
                            </div>
                            <p className="mt-2 text-[12px] leading-4 text-[#9ca4b2]">
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
                    className="mt-2.5 rounded-2xl border border-[#e2e6ee] bg-white/55 p-2.5"
                  >
                    <div className="flex items-center gap-2 text-xs font-medium text-[#738096]">
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

              <div className="mt-2.5 space-y-2 border-l border-[#d8dde6] pl-3">
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
                        <p className="text-[13px] leading-5">{event.text}</p>
                      </motion.div>
                    ) : null,
                  )}
                </AnimatePresence>

                {!hasAnyTimelineItem ? (
                  <div className="rounded-2xl border border-[#e2e6ee] bg-white/55 p-2.5">
                    <div className="flex items-center gap-2 text-xs text-[#8f98a8]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#9aa3b3]" />
                      Waiting for agent logs...
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-3 flex items-center gap-2 text-[#ced2db]" aria-label="Agent thinking">
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
              className="rounded-2xl px-3 py-2.5"
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

        <footer className="pt-4">
          <div className="flex items-center gap-2 rounded-[18px] border border-[#3d4453] bg-[#2c333f] p-2 shadow-[0_14px_26px_rgba(15,23,42,0.3)]">
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full text-[#c5cbd7] hover:bg-white/10"
              aria-label="Attach"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              className="h-10 flex-1 border-none bg-transparent text-base text-[#f3f4f6] placeholder:text-[#9099a9] outline-none"
              placeholder="Ask me anything..."
              aria-label="Ask me anything"
            />
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#171923]"
              aria-label="Send"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
});
