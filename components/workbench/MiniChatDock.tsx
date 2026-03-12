"use client";

import { motion } from "framer-motion";
import { ArrowUp, Expand, Paperclip } from "lucide-react";

interface MiniChatDockProps {
  onExpand: () => void;
}

export function MiniChatDock({ onExpand }: MiniChatDockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="pointer-events-auto absolute bottom-7 left-7 z-40 w-[min(560px,calc(100%-56px))]"
    >
      <div className="flex items-center gap-2 rounded-[20px] border border-[#3d4453] bg-[#2c333f]/95 p-2 shadow-[0_16px_30px_rgba(15,23,42,0.34)] backdrop-blur-md">
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-full text-[#c5cbd7] hover:bg-white/10"
          aria-label="Attach"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <input
          className="h-10 min-w-0 flex-1 border-none bg-transparent text-base text-[#f3f4f6] placeholder:text-[#9099a9] outline-none"
          placeholder="Ask me anything..."
          aria-label="Ask me anything"
        />

        <button
          type="button"
          onClick={onExpand}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-[#d4d9e5] hover:bg-white/20"
          aria-label="Expand chat panel"
        >
          <Expand className="h-4 w-4" />
        </button>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#171923]"
          aria-label="Send"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
