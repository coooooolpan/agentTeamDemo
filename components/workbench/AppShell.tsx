"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";

import { AgentDetailPanel } from "./AgentDetailPanel";
import { CanvasStage } from "./CanvasStage";
import { LeftPanel } from "./LeftPanel";
import { MiniChatDock } from "./MiniChatDock";
import { SideTabRail } from "./SideTabRail";
import type { ChatAgentCard, WorkFile } from "./types";

const Agentation = dynamic(
  () => import("agentation").then((mod) => mod.Agentation),
  { ssr: false },
);
const UnicornScene = dynamic(() => import("unicornstudio-react"), { ssr: false });

export function AppShell() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  const [hideUnicornScene, setHideUnicornScene] = useState(false);
  const [activeAgent, setActiveAgent] = useState<ChatAgentCard | null>(null);
  const [activeFile, setActiveFile] = useState<WorkFile | null>(null);

  return (
    <div className="relative h-screen overflow-hidden bg-[#eef1f5]">
      {!hideUnicornScene ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <UnicornScene
            projectId="1QGYeRxCGg5uq6vwZwSp"
            width="100%"
            height="100%"
            scale={1}
            dpi={1.5}
            placeholder={<div className="h-full w-full" />}
            showPlaceholderOnError
            showPlaceholderWhileLoading={false}
            onError={() => setHideUnicornScene(true)}
            sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@2.1.3/dist/unicornStudio.umd.js"
          />
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left_top,rgba(255,255,255,0.92),rgba(238,241,245,0.7)_30%,transparent_70%)]" />

      <AnimatePresence initial={false}>
        {!isPanelMinimized ? (
          <motion.aside
            initial={{ x: -28, opacity: 0.7 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -28, opacity: 0.7 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 left-0 z-30 hidden w-[500px] p-4 xl:block"
          >
            <LeftPanel
              isMinimized={isPanelMinimized}
              onToggleMinimize={() => setIsPanelMinimized((prev) => !prev)}
              onOpenAgentDetails={(agent) => {
                setActiveFile(null);
                setActiveAgent(agent);
              }}
            />
          </motion.aside>
        ) : null}
      </AnimatePresence>

      {isPanelMinimized ? (
        <SideTabRail className="absolute inset-y-4 left-4 z-30 hidden xl:flex" />
      ) : null}

      <main
        className={`relative h-full xl:transition-[padding-left] xl:duration-500 xl:ease-[cubic-bezier(0.22,1,0.36,1)] ${isPanelMinimized ? "xl:pl-0" : "xl:pl-[500px]"}`}
      >
        <CanvasStage
          onOpenSidebar={() => setMobileSidebarOpen(true)}
          isPanelMinimized={isPanelMinimized}
          activeFile={activeFile}
          onOpenFilePreview={(file) => {
            setActiveAgent(null);
            setActiveFile(file);
          }}
          onCloseFilePreview={() => setActiveFile(null)}
          onCanvasPaneClick={() => {
            setActiveAgent(null);
            setActiveFile(null);
          }}
        />
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
              className="fixed inset-y-0 left-0 z-50 w-[min(95vw,500px)] p-3 xl:hidden"
            >
              <LeftPanel
                mobile
                isMinimized={isPanelMinimized}
                onClose={() => setMobileSidebarOpen(false)}
                onToggleMinimize={() => setIsPanelMinimized((prev) => !prev)}
                onOpenAgentDetails={(agent) => {
                  setActiveFile(null);
                  setActiveAgent(agent);
                }}
              />
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isPanelMinimized ? (
          <MiniChatDock onExpand={() => setIsPanelMinimized(false)} />
        ) : null}
      </AnimatePresence>

      <AgentDetailPanel agent={activeAgent} onClose={() => setActiveAgent(null)} />

      {process.env.NODE_ENV !== "production" ? <Agentation /> : null}
    </div>
  );
}
