"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, Settings2 } from "lucide-react";

import { AgentDetailPanel } from "./AgentDetailPanel";
import { CanvasStage } from "./CanvasStage";
import { LeftPanel } from "./LeftPanel";
import { MiniChatDock } from "./MiniChatDock";
import { SideTabRail } from "./SideTabRail";
import type { ChatAgentCard, DemoMode, WorkFile } from "./types";

const Agentation = dynamic(
  () => import("agentation").then((mod) => mod.Agentation),
  { ssr: false },
);
const UnicornScene = dynamic(() => import("unicornstudio-react"), { ssr: false });

export function AppShell() {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  const [hideUnicornScene, setHideUnicornScene] = useState(false);
  const [activeAgent, setActiveAgent] = useState<ChatAgentCard | null>(null);
  const [activeFile, setActiveFile] = useState<WorkFile | null>(null);
  const [demoMode, setDemoMode] = useState<DemoMode>("A");
  const [focusNodeRequest, setFocusNodeRequest] = useState<{
    nodeId: string;
    nonce: number;
  } | null>(null);
  const [isTopMoreMenuOpen, setIsTopMoreMenuOpen] = useState(false);
  const topMoreMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isTopMoreMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        topMoreMenuRef.current &&
        !topMoreMenuRef.current.contains(event.target as Node)
      ) {
        setIsTopMoreMenuOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsTopMoreMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isTopMoreMenuOpen]);

  const handleLocateAgentRuntime = useCallback((agent: ChatAgentCard, nodeId: string) => {
    setActiveFile(null);
    setActiveAgent(agent);
    setFocusNodeRequest({
      nodeId,
      nonce: Date.now(),
    });
  }, []);

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
            className="absolute inset-y-0 left-0 z-30 hidden w-[450px] p-4 xl:block"
          >
            <LeftPanel
              demoMode={demoMode}
              isMinimized={isPanelMinimized}
              onToggleMinimize={() => setIsPanelMinimized((prev) => !prev)}
              onOpenAgentDetails={(agent) => {
                setActiveFile(null);
                setActiveAgent(agent);
              }}
              onLocateAgentRuntime={handleLocateAgentRuntime}
            />
          </motion.aside>
        ) : null}
      </AnimatePresence>

      {isPanelMinimized ? (
        <SideTabRail className="absolute inset-y-4 left-4 z-30 hidden xl:flex" />
      ) : null}

      <div className="pointer-events-none absolute right-5 top-4 z-50">
        <div className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-[#e1e7f1] bg-white/92 p-1 shadow-[0_10px_18px_rgba(15,23,42,0.14)] backdrop-blur">
          <span className="inline-flex h-8 items-center rounded-full px-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#7f8797]">
            Demo
          </span>
          {(["A", "B"] as const).map((mode) => {
            const active = demoMode === mode;

            return (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setDemoMode(mode);
                  setActiveAgent(null);
                  setActiveFile(null);
                  setFocusNodeRequest(null);
                  setIsTopMoreMenuOpen(false);
                }}
                className={`inline-flex h-8 min-w-[52px] items-center justify-center rounded-full px-3 text-[13px] font-semibold transition ${
                  active
                    ? "bg-[#1f2a3d] text-white shadow-[0_6px_14px_rgba(15,23,42,0.22)]"
                    : "bg-[#eef2f8] text-[#5f6b80] hover:bg-[#e8edf6]"
                }`}
                aria-pressed={active}
                aria-label={`Switch to demo ${mode}`}
              >
                {mode}
              </button>
            );
          })}
          <div ref={topMoreMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsTopMoreMenuOpen((prev) => !prev)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d8e0ec] bg-white text-[#5f6b80] transition hover:bg-[#f3f6fb]"
              aria-label="Settings"
              aria-expanded={isTopMoreMenuOpen}
            >
              <Settings2 className="h-3.5 w-3.5" />
            </button>

            <AnimatePresence>
              {isTopMoreMenuOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 280, damping: 24 }}
                  className="absolute right-0 top-[calc(100%+10px)] w-[240px] rounded-2xl border border-[#e4e8f1] bg-white/95 p-2 shadow-[0_18px_30px_rgba(15,23,42,0.16)] backdrop-blur"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsTopMoreMenuOpen(false);
                      router.push("/component-library");
                    }}
                    className="flex w-full items-start gap-2 rounded-xl px-2 py-2 text-left transition hover:bg-[#f3f6fb]"
                  >
                    <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#dee4ee] bg-white text-[#5d6a81]">
                      <LayoutGrid className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[#1b2332]">控件库</span>
                      <span className="block text-xs text-[#8190a8]">
                        查看全部可复用组件与功能分类
                      </span>
                    </span>
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <main
        className={`relative h-full xl:[will-change:padding-left] xl:transition-[padding-left] xl:duration-[360ms] xl:ease-[cubic-bezier(0.22,1,0.36,1)] ${isPanelMinimized ? "xl:pl-0" : "xl:pl-[450px]"}`}
      >
        <CanvasStage
          onOpenSidebar={() => setMobileSidebarOpen(true)}
          isPanelMinimized={isPanelMinimized}
          demoMode={demoMode}
          activeFile={activeFile}
          focusNodeRequest={focusNodeRequest}
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
              className="fixed inset-y-0 left-0 z-50 w-[min(95vw,450px)] p-3 xl:hidden"
            >
              <LeftPanel
                mobile
                demoMode={demoMode}
                isMinimized={isPanelMinimized}
                onClose={() => setMobileSidebarOpen(false)}
                onToggleMinimize={() => setIsPanelMinimized((prev) => !prev)}
                onOpenAgentDetails={(agent) => {
                  setActiveFile(null);
                  setActiveAgent(agent);
                }}
                onLocateAgentRuntime={handleLocateAgentRuntime}
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
