"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

interface CanvasCursorOverlayProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

export function CanvasCursorOverlay({ containerRef }: CanvasCursorOverlayProps) {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const hiddenCursorValue = "url('/canvas-empty-cursor.svg?v=1') 0 0, none";

  useEffect(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;
    const html = document.documentElement;
    const body = document.body;
    if (!container || !cursor) {
      return;
    }

    let frameId = 0;
    let latestX = 0;
    let latestY = 0;

    const paintCursor = () => {
      frameId = 0;
      cursor.style.transform = `translate3d(${latestX}px, ${latestY}px, 0)`;
    };

    const schedulePaint = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(paintCursor);
    };

    const forceHideNativeCursor = () => {
      html.classList.add("canvas-native-cursor-hidden");
      body.classList.add("canvas-native-cursor-hidden");
      html.style.cursor = hiddenCursorValue;
      body.style.cursor = hiddenCursorValue;
      container.style.cursor = hiddenCursorValue;
    };

    const restoreNativeCursor = () => {
      html.classList.remove("canvas-native-cursor-hidden");
      body.classList.remove("canvas-native-cursor-hidden");
      html.style.removeProperty("cursor");
      body.style.removeProperty("cursor");
      container.style.removeProperty("cursor");
    };

    const updateCursorPosition = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      latestX = event.clientX - rect.left;
      latestY = event.clientY - rect.top;
      forceHideNativeCursor();
      cursor.style.opacity = "1";
      schedulePaint();
    };

    const hideCursor = () => {
      restoreNativeCursor();
      cursor.style.opacity = "0";
    };

    container.addEventListener("pointerenter", updateCursorPosition);
    container.addEventListener("pointermove", updateCursorPosition);
    container.addEventListener("pointerleave", hideCursor);
    window.addEventListener("blur", hideCursor);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      restoreNativeCursor();
      container.removeEventListener("pointerenter", updateCursorPosition);
      container.removeEventListener("pointermove", updateCursorPosition);
      container.removeEventListener("pointerleave", hideCursor);
      window.removeEventListener("blur", hideCursor);
    };
  }, [containerRef, hiddenCursorValue]);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-[70] h-8 w-8 -translate-x-[5px] -translate-y-[3px] opacity-0 transition-opacity duration-100"
      style={{
        backgroundImage: "url('/canvas-agent-cursor.svg?v=12')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "32px 32px",
        willChange: "transform",
      }}
    />
  );
}
