"use client";

import { motion } from "framer-motion";
import { FileCode2, FileImage, FileText, Video } from "lucide-react";

import { cn } from "@/lib/utils";
import type { WorkFile } from "./types";

interface FileCardProps {
  file: WorkFile;
  index: number;
  onOpen: (file: WorkFile) => void;
}

const kindConfig = {
  doc: {
    icon: FileText,
    badge: "DOC",
    surface: "bg-[linear-gradient(135deg,#ffffff,#f2f5fa)]",
  },
  image: {
    icon: FileImage,
    badge: "IMG",
    surface:
      "bg-[linear-gradient(135deg,#dbeafe_0%,#bfdbfe_35%,#cffafe_70%,#ecfccb_100%)]",
  },
  video: {
    icon: Video,
    badge: "VID",
    surface:
      "bg-[linear-gradient(135deg,#0f172a_0%,#312e81_42%,#2563eb_73%,#f5d0fe_100%)]",
  },
  markdown: {
    icon: FileCode2,
    badge: "MD",
    surface: "bg-[linear-gradient(135deg,#111827,#374151)]",
  },
} as const;

export function FileCard({ file, index, onOpen }: FileCardProps) {
  const config = kindConfig[file.kind];
  const Icon = config.icon;

  return (
    <motion.button
      type="button"
      layout
      onClick={(event) => {
        event.stopPropagation();
        onOpen(file);
      }}
      initial={{ opacity: 0, y: 34, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.9 }}
      transition={{
        type: "spring",
        damping: 24,
        stiffness: 280,
        delay: index * 0.04,
      }}
      whileHover={{ y: -6 }}
      className="nodrag nopan w-[174px] rounded-[18px] border border-[#e8ebf1] bg-white p-2.5 text-left shadow-[0_12px_28px_rgba(15,23,42,0.14)]"
    >
      <div className={cn("relative h-[86px] overflow-hidden rounded-[14px]", config.surface)}>
        <span className="absolute right-2 top-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#4b5563]">
          {config.badge}
        </span>
      </div>

      <div className="mt-2 flex items-start justify-between gap-2">
        <div>
          <p className="line-clamp-2 text-xs font-semibold leading-4 text-[#1c2431]">
            {file.title}
          </p>
          <p className="mt-1 text-[10px] text-[#99a0ae]">{file.updatedAt}</p>
        </div>
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#7d8798]" />
      </div>
    </motion.button>
  );
}
