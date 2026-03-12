"use client";

import { memo, useEffect, useMemo, useState } from "react";
import type { NodeProps } from "@xyflow/react";
import { CheckCircle2, Circle, CirclePlay, FileText } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type {
  DocumentNodeData,
  GeneratingDocumentNodeData,
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
  const nodeOpacity = nodeData.isDimmed ? 0.3 : 1;
  const reduceMotion = useReducedMotion();
  const checklistLength = nodeData.checklist.length;
  const completionSequence = useMemo(() => {
    if (checklistLength <= 0) {
      return [0];
    }

    const forwardSequence = Array.from({ length: checklistLength + 1 }, (_, index) => index);
    return [...forwardSequence, checklistLength, checklistLength, 0];
  }, [checklistLength]);
  const [completionTick, setCompletionTick] = useState(0);

  useEffect(() => {
    if (reduceMotion || completionSequence.length <= 1) {
      return;
    }

    const intervalId = setInterval(() => {
      setCompletionTick((previous) => previous + 1);
    }, 1120);

    return () => {
      clearInterval(intervalId);
    };
  }, [completionSequence.length, reduceMotion]);

  const completedCount = reduceMotion
    ? checklistLength
    : (completionSequence[completionTick % completionSequence.length] ?? 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="relative w-[268px] cursor-grab rounded-[20px] border border-[#9fd7b8] bg-[#b8f2cc] p-5 shadow-[0_20px_30px_rgba(22,163,74,0.14)] transition-opacity duration-300 active:cursor-grabbing"
      style={{ opacity: nodeOpacity }}
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
        {nodeData.checklist.map((item, index) => {
          const completed = index < completedCount;

          return (
            <motion.li
              key={item}
              className="flex items-start gap-2"
              animate={{
                opacity: completed ? 1 : 0.72,
                x: completed ? 0 : 2,
              }}
              transition={{
                duration: 0.34,
                delay: completed ? index * 0.06 : 0,
                ease: [0.2, 1, 0.32, 1],
              }}
            >
              <div className="relative mt-0.5 h-3.5 w-3.5 shrink-0">
                {completed ? (
                  <>
                    <motion.span
                      className="absolute inset-0 rounded-full bg-[#4ca97b]/40"
                      animate={reduceMotion ? { scale: 1, opacity: 0 } : { scale: [1, 1.7], opacity: [0.42, 0] }}
                      transition={{ duration: 0.78, ease: "easeOut" }}
                    />
                    <CheckCircle2 className="relative h-3.5 w-3.5 text-[#4ca97b]" />
                  </>
                ) : (
                  <Circle className="h-3.5 w-3.5 text-[#6ea98a]" />
                )}
              </div>
              <span className={completed ? "text-[#1f6a49] line-through decoration-[#4ca97b]/70 decoration-2" : "text-[#317457]"}>
                {item}
              </span>
            </motion.li>
          );
        })}
      </ul>
      <motion.div
        className="mt-3 inline-flex items-center rounded-full border border-[#93cfac] bg-white/50 px-2.5 py-1 text-[10px] font-semibold text-[#2f7e58]"
        animate={reduceMotion ? { opacity: 1 } : { opacity: [0.72, 1, 0.72] }}
        transition={{ duration: 1.8, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
      >
        {Math.min(completedCount, checklistLength)}/{checklistLength} tasks completed
      </motion.div>
    </motion.div>
  );
});

export const DocumentNode = memo(function DocumentNode({
  data,
}: NodeProps) {
  const nodeData = data as DocumentNodeData;
  const entryDelay = getEntryDelay(nodeData);
  const nodeOpacity = nodeData.isDimmed ? 0.3 : 1;

  const handleClick = () => {
    nodeData.onOpenPreview?.(nodeData.previewFile);
  };

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="relative w-[200px] cursor-grab rounded-[20px] border border-[#eceef2] bg-white p-4 text-left shadow-[0_18px_32px_rgba(15,23,42,0.12)] transition-opacity duration-300 active:cursor-grabbing"
      style={{ opacity: nodeOpacity }}
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

const documentGeneratingCursorSequence: AgentCursorEntry[] = [
  {
    id: "doc-market-scout",
    label: "Market Scout",
    color: "#7a34ff",
    badge: "bg-[#7a34ff]",
    placement: "left-[124px] top-[-54px]",
    xDrift: [0, 5, -2, 0],
    yDrift: [0, -4, 2, 0],
    rotation: [0, 1.4, -0.4, 0],
  },
  {
    id: "doc-brand-copywriter",
    label: "Brand Copywriter",
    color: "#06bc57",
    badge: "bg-[#06bc57]",
    placement: "left-[-168px] top-[22px]",
    xDrift: [0, -5, 2, 0],
    yDrift: [0, 4, -2, 0],
    rotation: [0, -1.2, 0.5, 0],
  },
  {
    id: "doc-content-auditor",
    label: "Content Auditor",
    color: "#fd9732",
    badge: "bg-[#fd9732]",
    placement: "left-[134px] top-[148px]",
    xDrift: [0, 4, -1, 0],
    yDrift: [0, -3, 2, 0],
    rotation: [0, 1.2, -0.4, 0],
  },
];

export const GeneratingDocumentNode = memo(function GeneratingDocumentNode({
  data,
}: NodeProps) {
  const nodeData = data as GeneratingDocumentNodeData;
  const entryDelay = getEntryDelay(nodeData);
  const nodeOpacity = nodeData.isDimmed ? 0.3 : 1;
  const reduceMotion = useReducedMotion();
  const [activeCursorIds, setActiveCursorIds] = useState<string[]>([
    documentGeneratingCursorSequence[0].id,
    documentGeneratingCursorSequence[1].id,
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
      const nextDelay = 2200 + Math.random() * 1700;
      timeoutId = setTimeout(() => {
        if (disposed) {
          return;
        }
        setActiveCursorIds((previousIds) =>
          pickRandomCursorIds(previousIds, documentGeneratingCursorSequence, 2),
        );
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
        reduceMotion
          ? [documentGeneratingCursorSequence[0].id]
          : Array.from(activeCursorIds),
      ),
    [activeCursorIds, reduceMotion],
  );

  return (
    <div className="relative w-[200px] transition-opacity duration-300" style={{ opacity: nodeOpacity }}>
      <AnimatePresence initial={false}>
        {documentGeneratingCursorSequence
          .filter((cursor) => visibleCursorSet.has(cursor.id))
          .map((cursor) => (
            <AgentCursor key={cursor.id} cursor={cursor} reduceMotion={!!reduceMotion} />
          ))}
      </AnimatePresence>

      <motion.button
        type="button"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-20 w-[200px] cursor-grab rounded-[20px] border border-[#e9edf4] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-4 text-left shadow-[0_20px_34px_rgba(15,23,42,0.14)] active:cursor-grabbing"
        whileHover={{
          y: -5,
          transition: { type: "spring", stiffness: 300, damping: 24, delay: 0 },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24, delay: entryDelay }}
        onClick={handleClick}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[20px]"
          animate={reduceMotion ? { opacity: 0 } : { opacity: [0.2, 0.34, 0.2] }}
          transition={{ duration: 2.2, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-y-[-16%] -left-[62%] w-[54%] rotate-[16deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.72),transparent)]"
            animate={reduceMotion ? { x: 0 } : { x: ["0%", "300%"] }}
            transition={{
              duration: 1.9,
              repeat: reduceMotion ? 0 : Infinity,
              ease: "linear",
              repeatDelay: 0.7,
            }}
          />
        </motion.div>

        <p className="text-[11px] font-medium text-[#b8bdc8]">{nodeData.excerpt[0]}</p>
        <h3 className="mt-1 text-[16px] font-bold leading-5 text-[#14181f]">
          {nodeData.title}
        </h3>
        <p className="text-[15px] font-semibold leading-5 text-[#222a36]">
          {nodeData.subtitle}
        </p>

        <div className="mt-3 space-y-1.5 text-[10px] text-[#8e95a3]">
          {nodeData.excerpt.map((line, index) => (
            <div
              key={line}
              className={`relative h-1.5 overflow-hidden rounded-full bg-[#e9ecf3] ${
                index === 0 ? "w-[92%]" : index === nodeData.excerpt.length - 1 ? "w-[70%]" : "w-full"
              }`}
            >
              <motion.div
                className="pointer-events-none absolute inset-y-0 -left-[48%] w-[52%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.86),transparent)]"
                animate={reduceMotion ? { x: 0 } : { x: ["0%", "285%"] }}
                transition={{
                  duration: 1.35,
                  delay: index * 0.1,
                  repeat: reduceMotion ? 0 : Infinity,
                  ease: "linear",
                  repeatDelay: 0.56,
                }}
              />
            </div>
          ))}
        </div>

        <div className="relative mt-3 overflow-hidden rounded-xl border border-[#eef2f6] bg-[#fbfcfe] p-2 text-[10px] text-[#8d95a3]">
          <span>Research excerpt preview</span>
          <motion.div
            className="pointer-events-none absolute inset-y-0 -left-[45%] w-[50%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.88),transparent)]"
            animate={reduceMotion ? { x: 0 } : { x: ["0%", "280%"] }}
            transition={{
              duration: 1.4,
              repeat: reduceMotion ? 0 : Infinity,
              ease: "linear",
              repeatDelay: 0.7,
            }}
          />
        </div>

        <motion.div
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d7edf8] bg-[#eff9ff] px-2.5 py-1 text-[10px] font-semibold text-[#1f789f]"
          animate={reduceMotion ? { opacity: 1 } : { opacity: [0.74, 1, 0.74] }}
          transition={{ duration: 1.6, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
        >
          <span className="relative flex h-2 w-2">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-[#2ca8d8]"
              animate={reduceMotion ? { scale: 1, opacity: 0.8 } : { scale: [1, 1.8], opacity: [0.8, 0] }}
              transition={{ duration: 1.1, repeat: reduceMotion ? 0 : Infinity, ease: "easeOut" }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2ca8d8]" />
          </span>
          Generating {nodeData.progress}% · {nodeData.eta}
        </motion.div>
      </motion.button>
    </div>
  );
});

export const MediaNode = memo(function MediaNode({
  data,
}: NodeProps) {
  const nodeData = data as MediaNodeData;
  const entryDelay = getEntryDelay(nodeData);
  const nodeOpacity = nodeData.isDimmed ? 0.3 : 1;

  const handleClick = () => {
    nodeData.onOpenPreview?.(nodeData.previewFile);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="relative w-[430px] cursor-grab rounded-[24px] border border-[#e7eaf0] bg-white p-4 text-left shadow-[0_20px_35px_rgba(15,23,42,0.08)] transition-opacity duration-300 active:cursor-grabbing"
      style={{ opacity: nodeOpacity }}
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

function pickRandomCursorIds(
  previousIds: string[],
  cursorSequence: AgentCursorEntry[],
  requestedVisibleCount = 2,
) {
  const allIds = cursorSequence.map((cursor) => cursor.id);
  const maxVisibleCount = Math.min(requestedVisibleCount, allIds.length);
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
  const nodeOpacity = nodeData.isDimmed ? 0.3 : 1;
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
        setActiveCursorIds((previousIds) =>
          pickRandomCursorIds(previousIds, agentCursorSequence, 2),
        );
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
    <div className="relative w-[430px] transition-opacity duration-300" style={{ opacity: nodeOpacity }}>
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
        >
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(130deg,#0f1020 5%,#3730a3 34%,#0ea5e9 58%,#f472b6 100%)",
              backgroundSize: "220% 220%",
            }}
            animate={
              reduceMotion
                ? { backgroundPosition: "50% 50%" }
                : {
                    backgroundPosition: [
                      "0% 50%",
                      "95% 50%",
                      "50% 5%",
                      "0% 50%",
                    ],
                  }
            }
            transition={{
              duration: 7.2,
              repeat: reduceMotion ? 0 : Infinity,
              ease: "linear",
            }}
          />
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
