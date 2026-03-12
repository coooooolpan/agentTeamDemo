"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { CheckCircle2, CirclePlay, FileText } from "lucide-react";
import { motion } from "framer-motion";

import type {
  DocumentNodeData,
  MediaNodeData,
  NoteNodeData,
} from "./types";

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
    </motion.button>
  );
});
