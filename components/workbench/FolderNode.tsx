"use client";

import { memo, useMemo, useState } from "react";
import type { NodeProps } from "@xyflow/react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock3, FolderOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import { FileCard } from "./FileCard";
import type { FolderNodeData } from "./types";

export const FolderNode = memo(function FolderNode({
  data,
}: NodeProps) {
  const nodeData = data as FolderNodeData;
  const [expanded, setExpanded] = useState(false);

  const statusUi = useMemo(() => {
    if (nodeData.status === "thinking") {
      return {
        label: "Thinking",
        icon: Clock3,
        text: "text-[#8c93a1]",
      };
    }

    return {
      label: "Finished",
      icon: CheckCircle2,
      text: "text-[#a4aab8]",
    };
  }, [nodeData.status]);

  const StatusIcon = statusUi.icon;

  return (
    <div className="relative w-[360px]">
      <AnimatePresence>
        {expanded ? (
          <motion.div
            layout
            initial={{ opacity: 0, y: 34, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 26, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 270, damping: 24 }}
            className="nodrag nopan absolute -top-[188px] left-0 z-20 flex items-end gap-3"
          >
            {nodeData.files.map((file, index) => (
              <FileCard
                key={file.id}
                file={file}
                index={index}
                onOpen={(selected) => nodeData.onOpenPreview?.(selected)}
              />
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="absolute inset-x-4 -top-8 h-[172px] rounded-[24px] border border-[#e8ebf1] bg-white/70 shadow-[0_12px_22px_rgba(15,23,42,0.08)]" />
      <div className="absolute left-8 -top-[22px] h-8 w-[146px] rounded-t-[16px] border border-[#e8ebf1] border-b-transparent bg-white/80" />

      <motion.div
        layout
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="relative z-10 cursor-grab rounded-[22px] border border-[#e7ebf2] bg-white p-5 shadow-[0_18px_34px_rgba(15,23,42,0.12)] active:cursor-grabbing"
      >
        <button
          type="button"
          className="w-full cursor-grab text-left active:cursor-grabbing"
          onClick={(event) => {
            event.stopPropagation();
            setExpanded((prev) => !prev);
          }}
        >
          <div className={cn("mb-4 flex items-center gap-2 text-sm font-semibold", statusUi.text)}>
            <StatusIcon className="h-4 w-4" />
            {statusUi.label}
          </div>

          <h3 className="text-[18px] font-bold leading-8 tracking-[-0.01em] text-[#141a24]">
            {nodeData.title}
          </h3>

          <div className="mt-7 flex items-center gap-3 text-sm text-[#a2a9b7]">
            <span>{nodeData.filesCount} Files</span>
            <span>|</span>
            <span>{nodeData.updatedAt}</span>
            <span className="ml-auto rounded-full bg-[#f2f4f8] p-2 text-[#8e96a4]">
              <FolderOpen className="h-4 w-4" />
            </span>
          </div>
        </button>
      </motion.div>
    </div>
  );
});
