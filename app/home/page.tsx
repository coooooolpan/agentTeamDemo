"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUp,
  Bot,
  CircleDashed,
  Compass,
  FolderOpen,
  Home,
  Image,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Video,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";

type MenuItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
};

type ToolChip = {
  label: string;
  icon: LucideIcon;
};

type SandboxStatus = "done" | "running" | "queued";

type SandboxOperation = {
  title: string;
  owner: string;
  status: SandboxStatus;
};

const menuItems: MenuItem[] = [
  { label: "Home", icon: Home, active: true },
  { label: "Agent Square", icon: Compass },
  { label: "Community", icon: Sparkles },
  { label: "My Projects", icon: FolderOpen },
];

const promptTools: ToolChip[] = [
  { label: "Design", icon: WandSparkles },
  { label: "Video", icon: Video },
  { label: "Brand", icon: ShieldCheck },
  { label: "Research", icon: Search },
];

const chatEvents = [
  "Market Scout scanned 32 competitor pages.",
  "Brand Copywriter extracted top conversion hooks.",
  "Campaign Designer prepared poster visual directions.",
  "Video Producer generated 15s promo storyboard draft.",
  "Content Auditor started compliance review.",
];

const sandboxOperations: SandboxOperation[] = [
  {
    title: "Fetch competitor snapshots",
    owner: "Market Scout",
    status: "done",
  },
  {
    title: "Extract and rank USPs",
    owner: "Brand Copywriter",
    status: "running",
  },
  {
    title: "Generate poster + motion keyframes",
    owner: "Campaign Designer",
    status: "running",
  },
  {
    title: "Run final policy checks",
    owner: "Content Auditor",
    status: "queued",
  },
];

function StatusPill({ status }: { status: SandboxStatus }) {
  if (status === "done") {
    return (
      <span className="rounded-full bg-[#e7f8ef] px-2 py-1 text-[11px] font-semibold text-[#23764f]">
        Done
      </span>
    );
  }

  if (status === "running") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#eaf2ff] px-2 py-1 text-[11px] font-semibold text-[#365fc5]">
        <CircleDashed className="h-3.5 w-3.5 animate-spin" />
        Running
      </span>
    );
  }

  return (
    <span className="rounded-full bg-[#f2f4f8] px-2 py-1 text-[11px] font-semibold text-[#7a8599]">
      Queued
    </span>
  );
}

export default function HomePage() {
  const [composerTab, setComposerTab] = useState<"canvas" | "workflow">("canvas");
  const [mainTab, setMainTab] = useState<"chat" | "sandbox">("chat");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f3f4f7]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-12%] h-[320px] w-[320px] rounded-full bg-[#dce6ff] opacity-70 blur-3xl" />
        <div className="absolute right-[-10%] top-[12%] h-[320px] w-[320px] rounded-full bg-[#ffe2e8] opacity-60 blur-3xl" />
        <div className="absolute bottom-[-14%] left-[18%] h-[280px] w-[280px] rounded-full bg-[#dff7ee] opacity-55 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1480px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[260px_minmax(0,1fr)_360px]">
          <aside className="rounded-[24px] border border-[#e3e8f0] bg-white/80 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                  <Sparkles className="h-4 w-4" />
                </span>
                <span className="text-lg font-semibold text-[#161b25]">RoboNeo</span>
              </div>
            </div>

            <button
              type="button"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111827] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b1220]"
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>

            <div className="mt-5 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`flex w-full items-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                      item.active
                        ? "bg-[#edf1f7] text-[#151a24]"
                        : "text-[#6f7a8f] hover:bg-[#f4f6fa]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-[#e8edf4] bg-[#fafcff] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8d97aa]">
                AI Tools
              </p>
              <p className="mt-2 text-sm leading-6 text-[#5f6b80]">
                Poster generation, video editing, and brand copy automation in one workflow.
              </p>
            </div>
          </aside>

          <section className="rounded-[24px] border border-[#e3e8f0] bg-white/78 p-5 shadow-[0_14px_32px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-[#7f8898]">Welcome back to RoboNeo Agent Teams</p>
              <h1 className="mt-2 text-balance text-3xl font-semibold tracking-[-0.02em] text-[#111722] sm:text-5xl">
                What do you want to create today?
              </h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: "easeOut" }}
              className="mx-auto mt-8 max-w-4xl rounded-[28px] border border-[#e6ebf3] bg-[#f8faff] p-3 shadow-[0_16px_36px_rgba(15,23,42,0.1)]"
            >
              <div className="rounded-[22px] border border-[#e9eef6] bg-white p-4 sm:p-5">
                <div className="inline-flex rounded-2xl bg-[#edf1f7] p-1">
                  <button
                    type="button"
                    onClick={() => setComposerTab("canvas")}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      composerTab === "canvas"
                        ? "bg-white text-[#151a24] shadow-sm"
                        : "text-[#8490a5] hover:text-[#5a667a]"
                    }`}
                  >
                    Canvas
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposerTab("workflow")}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      composerTab === "workflow"
                        ? "bg-white text-[#151a24] shadow-sm"
                        : "text-[#8490a5] hover:text-[#5a667a]"
                    }`}
                  >
                    Workflow
                  </button>
                </div>

                <div className="mt-4 rounded-2xl border border-[#ebeff6] bg-[#fafcff] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#2b3344]">
                        Help me extract the key selling points from product info,
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#2b3344]">
                        then generate an Instagram poster and a 15s promo video.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#111827] text-white"
                      aria-label="Submit task"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-[#e3e8f0] bg-white px-3 py-1.5 text-xs font-semibold text-[#5b667a]"
                    >
                      <Bot className="h-3.5 w-3.5" />
                      Agent Teams
                    </button>
                    {promptTools.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          type="button"
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#e7ebf2] bg-white px-3 py-1.5 text-xs font-medium text-[#6d788c]"
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                "Multi-agent coordination",
                "USP extraction",
                "Poster generation",
                "Video draft workflow",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#e8edf4] bg-white/86 px-3 py-2.5 text-sm font-medium text-[#5e6a7f]"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                {
                  title: "Campaign Visual Sheet",
                  tone: "from-[#dff0ff] to-[#edf9f2]",
                },
                {
                  title: "Promo Storyboard",
                  tone: "from-[#ece7ff] to-[#e7f1ff]",
                },
                {
                  title: "Brand Hook Matrix",
                  tone: "from-[#ffece7] to-[#fff6df]",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="overflow-hidden rounded-2xl border border-[#e8edf4] bg-white"
                >
                  <div className={`h-24 bg-gradient-to-br ${card.tone}`} />
                  <div className="p-3">
                    <p className="text-sm font-semibold text-[#1e2532]">{card.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-[24px] border border-[#e3e8f0] bg-white/82 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8893a7]">Main Tab</p>

            <div className="mt-3 inline-flex rounded-2xl bg-[#eceff4] p-1">
              <button
                type="button"
                onClick={() => setMainTab("chat")}
                className={`flex h-11 min-w-[92px] items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${
                  mainTab === "chat"
                    ? "bg-white text-[#141821] shadow-sm"
                    : "text-[#adb3bf] hover:text-[#8e96a5]"
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                Chat
              </button>
              <button
                type="button"
                onClick={() => setMainTab("sandbox")}
                className={`flex h-11 min-w-[92px] items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${
                  mainTab === "sandbox"
                    ? "bg-white text-[#141821] shadow-sm"
                    : "text-[#adb3bf] hover:text-[#8e96a5]"
                }`}
              >
                <Image className="h-4 w-4" />
                SandBox
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-[#e8edf4] bg-[#fafcff] p-3">
              {mainTab === "chat" ? (
                <div>
                  <p className="text-sm font-semibold text-[#1d2533]">Live Collaboration</p>
                  <div className="chat-scrollbar mt-3 max-h-[420px] space-y-2 overflow-y-auto pr-1">
                    {chatEvents.map((event, index) => (
                      <div
                        key={event}
                        className="rounded-xl border border-[#edf1f6] bg-white p-2.5 text-sm text-[#5b677c]"
                      >
                        <span className="mr-2 text-xs font-semibold text-[#8a95a8]">0{index + 1}</span>
                        {event}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-[#1d2533]">Execution Sandbox</p>
                  <div className="chat-scrollbar mt-3 max-h-[420px] space-y-2 overflow-y-auto pr-1">
                    {sandboxOperations.map((operation) => (
                      <div
                        key={operation.title}
                        className="rounded-xl border border-[#edf1f6] bg-white p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium text-[#2b3445]">{operation.title}</p>
                            <p className="mt-1 text-xs text-[#778196]">{operation.owner}</p>
                          </div>
                          <StatusPill status={operation.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between rounded-2xl border border-[#e8edf4] bg-white/85 px-3 py-2.5 text-xs text-[#728097]">
              <span className="inline-flex items-center gap-1.5">
                <WandSparkles className="h-3.5 w-3.5" />
                Agent team is still thinking
              </span>
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={`home-thinking-${dot}`}
                    className="h-1.5 w-1.5 rounded-full bg-[#9ca6b8]"
                    animate={{ opacity: [0.28, 1, 0.28], y: [0, -2, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: dot * 0.14,
                    }}
                  />
                ))}
              </div>
            </div>

            <Link
              href="/"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111827] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b1220]"
            >
              Open Infinite Canvas
              <ArrowUp className="h-4 w-4 rotate-45" />
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
