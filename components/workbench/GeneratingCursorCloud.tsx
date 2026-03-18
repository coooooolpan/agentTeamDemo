"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type GeneratingCursorEntry = {
  id: string;
  label: string;
  color: string;
  badge: string;
  placement: string;
  xDrift: number[];
  yDrift: number[];
  rotation: number[];
};

interface GeneratingCursorCloudProps {
  sequence: GeneratingCursorEntry[];
  requestedVisibleCount?: number;
  minDelayMs?: number;
  maxDelayMs?: number;
  defaultVisibleIds?: string[];
  size?: "default" | "sm";
}

function isSameCursorSet(previousIds: string[], nextIds: string[]) {
  if (previousIds.length !== nextIds.length) {
    return false;
  }

  const previousSet = new Set(previousIds);
  return nextIds.every((id) => previousSet.has(id));
}

function pickRandomCursorIds(
  previousIds: string[],
  sequence: GeneratingCursorEntry[],
  requestedVisibleCount: number,
) {
  const allIds = sequence.map((cursor) => cursor.id);
  const maxVisibleCount = Math.min(Math.max(1, requestedVisibleCount), allIds.length);
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
  size = "default",
}: {
  cursor: GeneratingCursorEntry;
  reduceMotion: boolean;
  size?: "default" | "sm";
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
        className={`shrink-0 drop-shadow-[0_2px_6px_rgba(15,23,42,0.34)] ${size === "sm" ? "h-6 w-6" : "h-8 w-8"}`}
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
        className={`rounded-full font-semibold text-white shadow-[0_16px_26px_rgba(15,23,42,0.22)] ${
          size === "sm" ? "px-3 py-1 text-[11px]" : "px-5 py-2 text-[13px]"
        } ${cursor.badge}`}
      >
        {cursor.label}
      </div>
    </motion.div>
  );
}

export function GeneratingCursorCloud({
  sequence,
  requestedVisibleCount = 2,
  minDelayMs = 2200,
  maxDelayMs = 3900,
  defaultVisibleIds,
  size = "default",
}: GeneratingCursorCloudProps) {
  const reduceMotion = useReducedMotion();
  const fallbackVisibleIds = useMemo(
    () => sequence.slice(0, Math.max(1, Math.min(requestedVisibleCount, sequence.length))).map((item) => item.id),
    [requestedVisibleCount, sequence],
  );
  const initialVisibleIds = useMemo(
    () => defaultVisibleIds?.filter(Boolean) ?? fallbackVisibleIds,
    [defaultVisibleIds, fallbackVisibleIds],
  );
  const [activeCursorIds, setActiveCursorIds] = useState<string[]>(initialVisibleIds);

  useEffect(() => {
    setActiveCursorIds(initialVisibleIds);
  }, [initialVisibleIds]);

  useEffect(() => {
    if (reduceMotion || sequence.length <= 1) {
      return;
    }

    let disposed = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const scheduleNext = () => {
      const randomDelay = minDelayMs + Math.random() * Math.max(0, maxDelayMs - minDelayMs);
      timeoutId = setTimeout(() => {
        if (disposed) {
          return;
        }
        setActiveCursorIds((previousIds) =>
          pickRandomCursorIds(previousIds, sequence, requestedVisibleCount),
        );
        scheduleNext();
      }, randomDelay);
    };

    scheduleNext();

    return () => {
      disposed = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [maxDelayMs, minDelayMs, reduceMotion, requestedVisibleCount, sequence]);

  const visibleCursorSet = useMemo(
    () =>
      new Set(
        reduceMotion ? [initialVisibleIds[0] ?? sequence[0]?.id].filter(Boolean) : Array.from(activeCursorIds),
      ),
    [activeCursorIds, initialVisibleIds, reduceMotion, sequence],
  );

  return (
    <AnimatePresence initial={false}>
      {sequence
        .filter((cursor) => visibleCursorSet.has(cursor.id))
        .map((cursor) => (
          <AgentCursor key={cursor.id} cursor={cursor} reduceMotion={!!reduceMotion} size={size} />
        ))}
    </AnimatePresence>
  );
}
