"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { CheckCircle2, CirclePlay, FileText } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type {
  AgentColor,
  AgentPlacement,
  DocumentNodeData,
  MediaNodeData,
  NoteNodeData,
} from "./types";

const pillScheme: Record<AgentColor, string> = {
  red: "bg-[#ff5f55] text-white",
  purple: "bg-[#7C3AED] text-white",
  blue: "bg-[#1d96ff] text-white",
  orange: "bg-[#fb9334] text-white",
  green: "bg-[#16ba67] text-white",
};

function placementClass(placement: AgentPlacement) {
  if (placement === "right") {
    return {
      wrapper: "-right-40 top-1/2 -translate-y-1/2",
      pointer: "-left-1.5 top-1/2 -translate-y-1/2",
    };
  }

  if (placement === "top-right") {
    return {
      wrapper: "right-2 -top-14",
      pointer: "left-6 -bottom-1.5",
    };
  }

  return {
    wrapper: "left-1/2 -translate-x-1/2 -bottom-14",
    pointer: "left-1/2 -translate-x-1/2 -top-1.5",
  };
}

export function AgentPill({
  label,
  color,
  placement = "bottom",
}: {
  label: string;
  color: AgentColor;
  placement?: AgentPlacement;
}) {
  const placementStyles = placementClass(placement);

  return (
    <div className={cn("pointer-events-none absolute z-20", placementStyles.wrapper)}>
      <div
        className={cn(
          "relative rounded-full px-5 py-2 text-xs font-semibold shadow-[0_8px_20px_rgba(17,24,39,0.16)]",
          pillScheme[color],
        )}
      >
        <span className="text-xs tracking-[0.01em]">{label}</span>
        <span
          className={cn(
            "absolute h-3 w-3 rotate-45 rounded-[2px]",
            pillScheme[color],
            placementStyles.pointer,
          )}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export const TaskNoteNode = memo(function TaskNoteNode({
  data,
}: NodeProps) {
  const nodeData = data as NoteNodeData;

  return (
    <motion.div
      layout
      className="relative w-[268px] cursor-grab rounded-[20px] border border-[#9fd7b8] bg-[#b8f2cc] p-5 shadow-[0_20px_30px_rgba(22,163,74,0.14)] active:cursor-grabbing"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
    >
      <h3 className="pr-3 text-[27px] font-bold leading-6 text-[#0f3523]">
        {nodeData.title}
      </h3>
      <ul className="mt-4 space-y-2.5 text-[11px] leading-4 text-[#317457]">
        {nodeData.checklist.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4ca97b]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <AgentPill
        label={nodeData.tag.label}
        color={nodeData.tag.color}
        placement={nodeData.tag.placement}
      />
    </motion.div>
  );
});

export const DocumentNode = memo(function DocumentNode({
  data,
}: NodeProps) {
  const nodeData = data as DocumentNodeData;

  const handleClick = () => {
    nodeData.onOpenPreview?.(nodeData.previewFile);
  };

  return (
    <motion.button
      type="button"
      className="relative w-[200px] cursor-grab rounded-[20px] border border-[#eceef2] bg-white p-4 text-left shadow-[0_18px_32px_rgba(15,23,42,0.12)] active:cursor-grabbing"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      onClick={handleClick}
    >
      <p className="text-[11px] font-medium text-[#b8bdc8]">{nodeData.excerpt[0]}</p>
      <h3 className="mt-1 text-[16px] font-bold leading-5 text-[#14181f]">
        {nodeData.title}
      </h3>
      <p className="text-[15px] font-semibold leading-5 text-[#222a36]">
        {nodeData.subtitle}
      </p>

      <div className="mt-3 space-y-1.5 text-[10px] text-[#8e95a3]">
        {nodeData.excerpt.map((line) => (
          <div key={line} className="h-1.5 rounded-full bg-[#e9ecf3] first:w-[92%] last:w-[70%]" />
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-[#eef2f6] bg-[#fbfcfe] p-2 text-[10px] text-[#8d95a3]">
        Research excerpt preview
      </div>

      <AgentPill
        label={nodeData.tag.label}
        color={nodeData.tag.color}
        placement={nodeData.tag.placement}
      />
    </motion.button>
  );
});

export const MediaNode = memo(function MediaNode({
  data,
}: NodeProps) {
  const nodeData = data as MediaNodeData;

  const handleClick = () => {
    nodeData.onOpenPreview?.(nodeData.previewFile);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className="relative w-[430px] cursor-grab rounded-[24px] border border-[#e7eaf0] bg-white p-4 text-left shadow-[0_20px_35px_rgba(15,23,42,0.08)] active:cursor-grabbing"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <div
        className="relative h-[136px] overflow-hidden rounded-[18px] border border-white/60"
        style={{ backgroundImage: nodeData.gradient }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.3),transparent_35%)]" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white">
          <CirclePlay className="h-3.5 w-3.5" />
          {nodeData.kindLabel}
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between text-xs text-[#7e8798]">
        <div className="font-semibold text-[#202733]">{nodeData.title}</div>
        <FileText className="h-4 w-4" />
      </div>

      <AgentPill
        label={nodeData.tag.label}
        color={nodeData.tag.color}
        placement={nodeData.tag.placement}
      />
    </motion.button>
  );
});
