"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { AgentColor, ChatAgentCard } from "./types";

interface AgentDetailPanelProps {
  agent: ChatAgentCard | null;
  onClose: () => void;
}

const badgeColorMap: Record<AgentColor, string> = {
  red: "bg-[linear-gradient(135deg,#ff7b72,#ef4444)]",
  purple: "bg-[linear-gradient(135deg,#e9d5ff,#818cf8)]",
  blue: "bg-[linear-gradient(135deg,#bfdbfe,#93c5fd)]",
  orange: "bg-[linear-gradient(135deg,#fde68a,#fca5a5)]",
  green: "bg-[linear-gradient(135deg,#86efac,#67e8f9)]",
};

function AgentStatus({ status }: { status: ChatAgentCard["status"] }) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f8ef] px-2.5 py-1 text-[11px] font-semibold text-[#1d8a4a]">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Done
      </span>
    );
  }

  if (status === "running") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#e9f1ff] px-2.5 py-1 text-[11px] font-semibold text-[#3567d4]">
        <CircleDashed className="h-3.5 w-3.5 animate-spin" />
        Running
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#f1f3f7] px-2.5 py-1 text-[11px] font-semibold text-[#758096]">
      <Clock3 className="h-3.5 w-3.5" />
      Idle
    </span>
  );
}

export function AgentDetailPanel({ agent, onClose }: AgentDetailPanelProps) {
  return (
    <AnimatePresence>
      {agent ? (
        <motion.aside
          initial={{ opacity: 0, x: 44, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 34, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="pointer-events-auto absolute right-4 top-4 z-40 w-[min(94vw,420px)] rounded-[24px] border border-[#e6eaf2] bg-white/95 p-4 shadow-[0_22px_40px_rgba(15,23,42,0.22)] backdrop-blur-md md:right-6 md:top-6"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-full border border-white/75 shadow-[0_8px_18px_rgba(15,23,42,0.15)]",
                  badgeColorMap[agent.color],
                )}
              >
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.11em] text-[#8f98a9]">
                  Agent Profile
                </p>
                <h3 className="text-lg font-bold text-[#121925]">{agent.name}</h3>
                <p className="text-sm text-[#7d8698]">{agent.summary}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full bg-[#eef2f7] text-[#6f788a]"
              aria-label="Close agent details"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-2xl border border-[#e8ecf2] bg-[#f8fafd] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8a93a4]">
                Current Task
              </p>
              <AgentStatus status={agent.status} />
            </div>
            <p className="mt-2 text-sm leading-6 text-[#2e3745]">{agent.currentTask}</p>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#ebeff5] bg-white p-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#8290a6]">
                <Wrench className="h-3.5 w-3.5" />
                Tools
              </p>
              <div className="space-y-1.5">
                {agent.tools.map((tool) => (
                  <div key={tool} className="rounded-lg bg-[#f3f6fb] px-2 py-1 text-xs font-medium text-[#516078]">
                    {tool}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[#ebeff5] bg-white p-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#8290a6]">
                <Sparkles className="h-3.5 w-3.5" />
                Outputs
              </p>
              <div className="space-y-1.5">
                {agent.outputs.map((output) => (
                  <div
                    key={output}
                    className="rounded-lg border border-[#e7edf5] bg-[#f7faff] px-2 py-1 text-xs font-medium text-[#516078]"
                  >
                    {output}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-[#ebeff5] bg-[#fbfcff] p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#8290a6]">Recent Logs</p>
            <div className="space-y-2">
              {agent.recentLogs.map((log) => (
                <div key={log} className="flex items-start gap-2 text-xs text-[#5e6b82]">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#92a0b7]" />
                  <span className="leading-5">{log}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
