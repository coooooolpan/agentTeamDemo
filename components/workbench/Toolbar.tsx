"use client";

import { motion } from "framer-motion";
import {
  ChevronDown,
  Play,
  RotateCcw,
  RotateCw,
  ScanSearch,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { DemoMode } from "./types";

interface ToolbarProps {
  mode?: DemoMode;
  onCenter: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onRun: () => void;
}

const buttons = [
  {
    id: "run",
    icon: Play,
    onPress: (props: ToolbarProps) => props.onRun(),
    className: "text-[#30384a]",
    withChevron: true,
  },
  {
    id: "undo",
    icon: RotateCcw,
    onPress: (props: ToolbarProps) => props.onUndo(),
    className: "text-[#4f5868]",
    withChevron: false,
  },
  {
    id: "redo",
    icon: RotateCw,
    onPress: (props: ToolbarProps) => props.onRedo(),
    className: "text-[#4f5868]",
    withChevron: false,
  },
  {
    id: "center",
    icon: ScanSearch,
    onPress: (props: ToolbarProps) => props.onCenter(),
    className: "text-[#4f5868]",
    withChevron: false,
  },
] as const;

const demoBButtons = [
  {
    id: "run",
    icon: Play,
    onPress: (props: ToolbarProps) => props.onRun(),
    className: "text-[#374257]",
    withChevron: true,
  },
  {
    id: "agents",
    icon: Users,
    onPress: (props: ToolbarProps) => props.onCenter(),
    className: "text-[#4f5c74]",
    withChevron: false,
  },
  {
    id: "undo",
    icon: RotateCcw,
    onPress: (props: ToolbarProps) => props.onUndo(),
    className: "text-[#4f5c74]",
    withChevron: false,
  },
  {
    id: "redo",
    icon: RotateCw,
    onPress: (props: ToolbarProps) => props.onRedo(),
    className: "text-[#b6bdca]",
    withChevron: false,
  },
] as const;

export function Toolbar(props: ToolbarProps) {
  const mode = props.mode ?? "A";
  const activeButtons = mode === "B" ? demoBButtons : buttons;

  return (
    <div className="pointer-events-none absolute bottom-4 left-1/2 z-40 -translate-x-1/2">
      <div
        className={cn(
          "pointer-events-auto flex items-center gap-1 rounded-full border border-white/90 bg-white/95 backdrop-blur-md",
          "p-1 shadow-[0_14px_28px_rgba(15,23,42,0.14)]",
        )}
      >
        {activeButtons.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              type="button"
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              onClick={() => item.onPress(props)}
              className={cn(
                "flex items-center gap-1 rounded-full text-sm font-semibold transition-colors",
                "h-9 px-2.5",
                "hover:bg-[#f2f4f8]",
                item.className,
              )}
              aria-label={item.id}
            >
              <Icon className="h-4 w-4" />
              {item.withChevron ? <ChevronDown className="h-3.5 w-3.5" /> : null}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
