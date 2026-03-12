"use client";

import { memo, useEffect, useMemo, useState } from "react";
import type { NodeProps } from "@xyflow/react";
import { CheckCircle2, CirclePlay, FileText } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type {
  DocumentNodeData,
  MediaNodeData,
  NoteNodeData,
  VideoGenerationNodeData,
} from "./types";

function getEntryDelay(data: Record<string, unknown>) {
  return typeof data.entryDelay === "number" ? data.entryDelay : 0;
}

export const TaskNoteNode = memo(function TaskNoteNode({
  data,
}: NodeProps) {
  const nodeData = data as NoteNodeData;
  const entryDelay = getEntryDelay(nodeData);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="relative w-[268px] cursor-grab rounded-[20px] border border-[#9fd7b8] bg-[#b8f2cc] p-5 shadow-[0_20px_30px_rgba(22,163,74,0.14)] active:cursor-grabbing"
      whileHover={{
        y: -4,
        transition: { type: "spring", stiffness: 300, damping: 24, delay: 0 },
      }}
      transition={{ type: "spring", stiffness: 280, damping: 24, delay: entryDelay }}
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
  const entryDelay = getEntryDelay(nodeData);

  const handleClick = () => {
    nodeData.onOpenPreview?.(nodeData.previewFile);
  };

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="relative w-[200px] cursor-grab rounded-[20px] border border-[#eceef2] bg-white p-4 text-left shadow-[0_18px_32px_rgba(15,23,42,0.12)] active:cursor-grabbing"
      whileHover={{
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 24, delay: 0 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 24, delay: entryDelay }}
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
  const entryDelay = getEntryDelay(nodeData);

  const handleClick = () => {
    nodeData.onOpenPreview?.(nodeData.previewFile);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="relative w-[430px] cursor-grab rounded-[24px] border border-[#e7eaf0] bg-white p-4 text-left shadow-[0_20px_35px_rgba(15,23,42,0.08)] active:cursor-grabbing"
      whileHover={{
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 24, delay: 0 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 24, delay: entryDelay }}
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

type AgentCursorEntry = {
  id: string;
  label: string;
  color: string;
  badge: string;
  placement: string;
  xDrift: number[];
  yDrift: number[];
  rotation: number[];
};

const agentCursorSequence: AgentCursorEntry[] = [
  {
    id: "video-producer",
    label: "Video Producer",
    color: "#ff4f45",
    badge: "bg-[#ff4f45]",
    placement: "left-[286px] top-[152px]",
    xDrift: [0, 8, 1, -4, 0],
    yDrift: [0, -5, -2, 3, 0],
    rotation: [0, 1.8, 0.3, -1, 0],
  },
  {
    id: "market-scout",
    label: "Market Scout",
    color: "#7a34ff",
    badge: "bg-[#7a34ff]",
    placement: "left-[166px] top-[-48px]",
    xDrift: [0, -6, 2, 8, 0],
    yDrift: [0, 4, -2, 3, 0],
    rotation: [0, -1.6, -0.2, 1.2, 0],
  },
  {
    id: "campaign-designer",
    label: "Campaign Designer",
    color: "#1d90f5",
    badge: "bg-[#1d90f5]",
    placement: "left-[-90px] top-[154px]",
    xDrift: [0, 7, 1, -5, 0],
    yDrift: [0, -4, 3, -2, 0],
    rotation: [0, 1.4, 0, -1.2, 0],
  },
  {
    id: "brand-copywriter",
    label: "Brand Copywriter",
    color: "#06bc57",
    badge: "bg-[#06bc57]",
    placement: "left-[-76px] top-[-26px]",
    xDrift: [0, 6, -1, -6, 0],
    yDrift: [0, -3, 2, 4, 0],
    rotation: [0, -1.2, 0.1, 1.2, 0],
  },
  {
    id: "content-auditor",
    label: "Content Auditor",
    color: "#fd9732",
    badge: "bg-[#fd9732]",
    placement: "left-[322px] top-[-58px]",
    xDrift: [0, -8, -2, 6, 0],
    yDrift: [0, 5, -1, -4, 0],
    rotation: [0, 1.4, -0.1, -1.1, 0],
  },
];

function isSameCursorSet(previousIds: string[], nextIds: string[]) {
  if (previousIds.length !== nextIds.length) {
    return false;
  }

  const previousSet = new Set(previousIds);
  return nextIds.every((id) => previousSet.has(id));
}

function pickRandomCursorIds(previousIds: string[]) {
  const allIds = agentCursorSequence.map((cursor) => cursor.id);
  const maxVisibleCount = Math.min(2, allIds.length);
  const nextCount = Math.random() < 0.56 ? maxVisibleCount : 1;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const shuffled = [...allIds].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, nextCount);
    if (!isSameCursorSet(previousIds, picked)) {
      return picked;
    }
  }

  return allIds.slice(0, nextCount);
}

function AgentCursor({
  cursor,
  reduceMotion,
}: {
  cursor: AgentCursorEntry;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute z-30 flex items-center gap-2 ${cursor.placement}`}
      initial={{ opacity: 0, scale: 0.88 }}
      exit={{ opacity: 0, scale: 0.92 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: reduceMotion ? 0 : cursor.xDrift,
        y: reduceMotion ? 0 : cursor.yDrift,
        rotate: reduceMotion ? 0 : cursor.rotation,
      }}
      transition={{
        opacity: {
          duration: 0.35,
          ease: [0.2, 1, 0.32, 1],
        },
        scale: {
          duration: 0.35,
          ease: [0.2, 1, 0.32, 1],
        },
        x: {
          duration: 4.3,
          repeat: Infinity,
          ease: "easeInOut",
        },
        y: {
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
        },
        rotate: {
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      <svg
        viewBox="0 0 32 32"
        className="h-8 w-8 shrink-0 drop-shadow-[0_2px_6px_rgba(15,23,42,0.34)]"
        aria-hidden
      >
        <path
          d="M5.4 3.2L26.6 11.9L15.8 15.8L12 26.6L5.4 3.2Z"
          fill={cursor.color}
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
      <div
        className={`rounded-full px-5 py-2 text-[13px] font-semibold text-white shadow-[0_16px_26px_rgba(15,23,42,0.22)] ${cursor.badge}`}
      >
        {cursor.label}
      </div>
    </motion.div>
  );
}

export const VideoGenerationNode = memo(function VideoGenerationNode({
  data,
}: NodeProps) {
  const nodeData = data as VideoGenerationNodeData;
  const entryDelay = getEntryDelay(nodeData);
  const reduceMotion = useReducedMotion();
  const [activeCursorIds, setActiveCursorIds] = useState<string[]>([
    agentCursorSequence[0].id,
  ]);

  const handleClick = () => {
    nodeData.onOpenPreview?.(nodeData.previewFile);
  };

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    let disposed = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const scheduleNext = () => {
      const nextDelay = 2400 + Math.random() * 2000;
      timeoutId = setTimeout(() => {
        if (disposed) {
          return;
        }
        setActiveCursorIds((previousIds) => pickRandomCursorIds(previousIds));
        scheduleNext();
      }, nextDelay);
    };

    scheduleNext();

    return () => {
      disposed = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [reduceMotion]);

  const visibleCursorSet = useMemo(
    () =>
      new Set(
        reduceMotion ? [agentCursorSequence[0].id] : Array.from(activeCursorIds),
      ),
    [activeCursorIds, reduceMotion],
  );

  return (
    <div className="relative w-[430px]">
      <AnimatePresence initial={false}>
        {agentCursorSequence
          .filter((cursor) => visibleCursorSet.has(cursor.id))
          .map((cursor) => (
            <AgentCursor key={cursor.id} cursor={cursor} reduceMotion={!!reduceMotion} />
          ))}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={handleClick}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-20 w-[430px] cursor-grab rounded-[24px] border border-[#e7eaf0] bg-white p-4 text-left shadow-[0_20px_35px_rgba(15,23,42,0.08)] active:cursor-grabbing"
        whileHover={{
          y: -4,
          transition: { type: "spring", stiffness: 300, damping: 24, delay: 0 },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24, delay: entryDelay }}
      >
        <div
          className="relative h-[136px] overflow-hidden rounded-[18px] border border-white/60"
          style={{
            backgroundImage:
              "linear-gradient(135deg,#1f1f2e 2%,#4f46e5 38%,#60a5fa 68%,#f5d0fe 100%)",
          }}
        >
          <motion.div
            className="absolute -left-14 -top-12 h-40 w-40 rounded-full bg-white/45 blur-3xl"
            animate={
              reduceMotion
                ? { opacity: 0.32 }
                : { x: [0, 118, 8], y: [0, 34, 2], opacity: [0.32, 0.22, 0.34] }
            }
            transition={{ duration: 6.8, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-10 right-[-24px] h-36 w-36 rounded-full bg-[#93c5fd]/42 blur-3xl"
            animate={
              reduceMotion
                ? { opacity: 0.34 }
                : { x: [0, -84, -6], y: [0, -26, 0], opacity: [0.28, 0.38, 0.3] }
            }
            transition={{
              duration: 7.2,
              repeat: reduceMotion ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.42),transparent_42%),radial-gradient(circle_at_84%_82%,rgba(255,255,255,0.22),transparent_45%)]"
            animate={reduceMotion ? { opacity: 0.72 } : { opacity: [0.62, 0.86, 0.66] }}
            transition={{ duration: 3.2, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/52 px-2.5 py-1 text-[11px] font-medium text-white"
            animate={reduceMotion ? { opacity: 1 } : { opacity: [0.88, 1, 0.88] }}
            transition={{ duration: 1.8, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
          >
            <CirclePlay className="h-3.5 w-3.5" />
            Generating {nodeData.progress}%
          </motion.div>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-[#7e8798]">
          <div>
            <p className="text-[11px] text-[#8b93a2]">{nodeData.eta}</p>
            <div className="font-semibold text-[#202733]">{nodeData.title}</div>
          </div>
          <FileText className="h-4 w-4" />
        </div>
      </motion.button>
    </div>
  );
});
