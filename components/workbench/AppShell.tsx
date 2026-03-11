"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { CanvasStage } from "./CanvasStage";
import { LeftPanel } from "./LeftPanel";

export function AppShell() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="relative h-screen overflow-hidden bg-[#eef1f5]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left_top,rgba(255,255,255,0.92),rgba(238,241,245,0.7)_30%,transparent_70%)]" />

      <aside className="absolute inset-y-0 left-0 z-30 hidden w-[440px] p-4 xl:block">
        <LeftPanel />
      </aside>

      <main className="relative h-full xl:pl-[440px]">
        <CanvasStage onOpenSidebar={() => setMobileSidebarOpen(true)} />
      </main>

      <AnimatePresence>
        {mobileSidebarOpen ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-[#0f172a]/30 xl:hidden"
              aria-label="Close overlay"
            />
            <motion.div
              initial={{ x: "-102%", opacity: 0.6 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-102%", opacity: 0.6 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="fixed inset-y-0 left-0 z-50 w-[min(95vw,440px)] p-3 xl:hidden"
            >
              <LeftPanel mobile onClose={() => setMobileSidebarOpen(false)} />
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
