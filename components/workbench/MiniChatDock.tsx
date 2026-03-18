"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Check, Expand, Paperclip, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { chatAgentCards } from "./mock-data";
import type { AgentColor } from "./types";

interface MiniChatDockProps {
  onExpand: () => void;
}

const agentDotScheme: Record<AgentColor, string> = {
  red: "bg-[linear-gradient(135deg,#ff9f97,#f43f5e)]",
  purple: "bg-[linear-gradient(135deg,#f5d0fe,#818cf8)]",
  blue: "bg-[linear-gradient(135deg,#bfdbfe,#93c5fd)]",
  orange: "bg-[linear-gradient(135deg,#fde68a,#fdba74)]",
  green: "bg-[linear-gradient(135deg,#86efac,#67e8f9)]",
};

export function MiniChatDock({ onExpand }: MiniChatDockProps) {
  const [composerValue, setComposerValue] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState(chatAgentCards[0]?.id ?? "");
  const [isAgentPickerOpen, setIsAgentPickerOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement | null>(null);

  const selectedAgent = useMemo(
    () => chatAgentCards.find((agent) => agent.id === selectedAgentId) ?? chatAgentCards[0],
    [selectedAgentId],
  );

  useEffect(() => {
    if (!isAgentPickerOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(event.target as Node)) {
        setIsAgentPickerOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAgentPickerOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isAgentPickerOpen]);

  const handleSend = () => {
    if (!composerValue.trim()) {
      return;
    }

    onExpand();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="pointer-events-auto absolute bottom-7 left-4 z-40 w-[min(460px,calc(100%-32px))] xl:left-28 xl:w-[420px]"
    >
      <div
        ref={dockRef}
        className="rounded-[22px] border border-[#e2e5eb] bg-[#f4f5f7] p-2 shadow-[0_8px_18px_rgba(15,23,42,0.08)]"
      >
        <div className="flex h-6 items-center px-1">
          <input
            value={composerValue}
            onChange={(event) => setComposerValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            className="h-full min-w-0 flex-1 border-none bg-transparent text-[13px] text-[#636c7e] placeholder:text-[#a8afbc] outline-none"
            placeholder="@ an agent · Ask me anything..."
            aria-label="Ask me anything"
          />
        </div>

        <div className="mt-1 flex items-center justify-between gap-2 px-1">
          <div className="relative flex items-center gap-2">
            <AnimatePresence>
              {isAgentPickerOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 280, damping: 24 }}
                  className="absolute bottom-[calc(100%+8px)] left-0 z-50 w-[228px] rounded-xl border border-[#e3e8f1] bg-white p-1.5 shadow-[0_10px_20px_rgba(15,23,42,0.12)]"
                >
                  <p className="px-1.5 pb-0.5 pt-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8b95a7]">
                    Agent / Sub Agent
                  </p>
                  <div className="space-y-0.5">
                    {chatAgentCards.map((agent) => {
                      const isSubAgent = agent.level === "sub";

                      return (
                        <button
                          key={agent.id}
                          type="button"
                          onClick={() => {
                            setSelectedAgentId(agent.id);
                            setIsAgentPickerOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-start gap-1.5 rounded-lg px-1.5 py-1.5 text-left transition",
                            selectedAgentId === agent.id
                              ? "bg-[#eef4ff]"
                              : "hover:bg-[#f4f7fc]",
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 h-5 w-5 shrink-0 rounded-full border border-white/70 shadow-[0_2px_6px_rgba(15,23,42,0.1)]",
                              agentDotScheme[agent.color],
                            )}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-semibold leading-5 text-[#1b2332]">
                              {agent.name}
                              {isSubAgent ? (
                                <span className="ml-1 rounded-full bg-[#e8eefb] px-1 py-0.5 text-[9px] font-semibold uppercase tracking-[0.04em] text-[#6075b1]">
                                  Sub
                                </span>
                              ) : null}
                            </span>
                            <span className="block truncate text-[11px] leading-4 text-[#7a869b]">
                              {agent.summary}
                            </span>
                          </span>
                          {selectedAgentId === agent.id ? (
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3a64d2]" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <button
              type="button"
              className="grid h-8 w-8 place-items-center rounded-full bg-[#e4e6eb] text-[#2f3643] transition hover:bg-[#d9dde5]"
              aria-label="Attach"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsAgentPickerOpen((prev) => !prev)}
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

            <button
              type="button"
              onClick={onExpand}
              className="grid h-8 w-8 place-items-center rounded-full bg-[#e4e6eb] text-[#2f3643] transition hover:bg-[#d9dde5]"
              aria-label="Expand chat panel"
            >
              <Expand className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleSend}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0f1117] text-white shadow-[0_8px_16px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-[#161a22]"
            aria-label="Send"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
