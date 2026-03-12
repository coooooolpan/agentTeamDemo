"use client";

import { memo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUp,
  Box,
  BrainCircuit,
  Expand,
  History,
  Home,
  MessageCircle,
  Paperclip,
  Search,
  Sparkles,
  SquarePlus,
  Layers,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { chatGalleryGradients, sideRailIcons, timelineEvents } from "./mock-data";

interface LeftPanelProps {
  mobile?: boolean;
  onClose?: () => void;
}

function SideRailIcon({ name }: { name: (typeof sideRailIcons)[number] }) {
  if (name === "home") {
    return <Home className="h-5 w-5" />;
  }

  if (name === "sparkles") {
    return <Sparkles className="h-5 w-5" />;
  }

  if (name === "square-plus") {
    return <SquarePlus className="h-5 w-5" />;
  }

  if (name === "layers") {
    return <Layers className="h-5 w-5" />;
  }

  return <History className="h-5 w-5" />;
}

function EventIcon({ type }: { type: (typeof timelineEvents)[number]["type"] }) {
  if (type === "thinking") {
    return <BrainCircuit className="h-4 w-4 text-[#9aa1ae]" />;
  }

  if (type === "search") {
    return <Search className="h-4 w-4 text-[#9aa1ae]" />;
  }

  if (type === "result") {
    return <Sparkles className="h-4 w-4 text-[#9aa1ae]" />;
  }

  return <ArrowUp className="h-4 w-4 rotate-45 text-[#8f97a8]" />;
}

export const LeftPanel = memo(function LeftPanel({
  mobile = false,
  onClose,
}: LeftPanelProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isHomeActive = pathname === "/home";
  const isWorkbenchActive = pathname === "/";

  return (
    <div className="flex h-full gap-3">
      <aside className="hidden w-[76px] flex-col items-center rounded-[30px] border border-[#e6e8ee] bg-[#f2f4f7] py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] sm:flex">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-lg">
          <span className="text-xs font-bold tracking-[0.14em]">AI</span>
        </div>

        <div className="mt-6 flex w-full flex-1 flex-col items-center gap-3">
          {sideRailIcons.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => {
                if (item === "home") {
                  router.push("/home");
                  return;
                }

                if (item === "sparkles") {
                  router.push("/");
                }
              }}
              className={cn(
                "grid h-12 w-12 place-items-center rounded-full text-[#98a0af] transition",
                (item === "home" && isHomeActive) ||
                  (item === "sparkles" && isWorkbenchActive)
                  ? "bg-[#353b47] text-white shadow-[0_8px_20px_rgba(17,24,39,0.25)]"
                  : "bg-[#eceff4] hover:bg-[#dfe4eb]",
              )}
              aria-label={item}
            >
              <SideRailIcon name={item} />
            </button>
          ))}
        </div>

        <div className="h-11 w-11 rounded-full bg-[linear-gradient(135deg,#fb923c,#0ea5e9)] p-[2px]">
          <div className="h-full w-full rounded-full bg-white" />
        </div>
      </aside>

      <section className="relative flex min-w-0 flex-1 flex-col rounded-[30px] border border-[#e3e6ed] bg-[linear-gradient(180deg,#f9fafc_0%,#f6f7fa_100%)] p-4 shadow-[0_22px_34px_rgba(15,23,42,0.09)]">
        <header className="flex items-start justify-between">
          <div className="inline-flex rounded-2xl bg-[#eceff4] p-1">
            <button
              type="button"
              className="flex h-14 min-w-[86px] items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#141821] shadow-sm"
            >
              <MessageCircle className="h-4 w-4" />
              Chat
            </button>
            <button
              type="button"
              className="flex h-14 min-w-[86px] items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-[#adb3bf]"
            >
              <Box className="h-4 w-4" />
              SandBox
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eceff4] text-[#8e97a7]"
              aria-label="Expand panel"
            >
              <Expand className="h-[18px] w-[18px]" />
            </button>
            {mobile ? (
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eceff4] text-[#8e97a7]"
                onClick={onClose}
                aria-label="Close panel"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            ) : null}
          </div>
        </header>

        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          <div className="rounded-2xl px-3 py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                <div className="h-9 w-9 rounded-full bg-[linear-gradient(135deg,#c084fc,#60a5fa)] ring-2 ring-white" />
                <div className="h-9 w-9 rounded-full bg-[linear-gradient(135deg,#34d399,#93c5fd)] ring-2 ring-white" />
                <div className="h-9 w-9 rounded-full bg-[linear-gradient(135deg,#bfdbfe,#fde68a)] ring-2 ring-white" />
                <div className="h-9 w-9 rounded-full bg-[linear-gradient(135deg,#dbeafe,#f5d0fe)] ring-2 ring-white" />
              </div>
              <div>
                <h2 className="text-[20px] font-bold leading-8 text-[#141821]">Agent Team</h2>
                <p className="mt-1 text-xs text-[#9aa2b0]">Updated 3 minutes ago</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              {chatGalleryGradients.map((gradient, index) => (
                <div
                  key={`${gradient}-${index}`}
                  className="h-16 w-16 rounded-2xl border border-white/80"
                  style={{ backgroundImage: gradient }}
                />
              ))}
            </div>

            <div className="mt-4 rounded-3xl bg-[#eceef2] p-4 text-[15px] font-semibold leading-7 text-[#252b35] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
              Generate a set of Gameboy-style pixel images from the picture.
            </div>

            <div className="mt-4 space-y-1 text-[14px] leading-6 text-[#1a2029]">
              <p>Agent Teams is assembling your team</p>
              <p>
                Your goal: From product info to extract key selling points and generate
                an Instagram marketing poster + product video
              </p>
              <p>RoboNeo has assembled the following agent team and started collaborating:</p>
            </div>

            <div className="mt-4 space-y-3 border-l border-[#d8dde6] pl-4">
              {timelineEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-2.5 text-[#95a0af]">
                  <span className="mt-0.5">
                    <EventIcon type={event.type} />
                  </span>
                  <p className="text-[14px] leading-6">{event.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 text-[#ced2db]">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
            </div>
          </div>
        </div>

        <footer className="pt-4">
          <div className="flex items-center gap-2 rounded-[18px] border border-[#3d4453] bg-[#2c333f] p-2 shadow-[0_14px_26px_rgba(15,23,42,0.3)]">
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full text-[#c5cbd7] hover:bg-white/10"
              aria-label="Attach"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              className="h-10 flex-1 border-none bg-transparent text-base text-[#f3f4f6] placeholder:text-[#9099a9] outline-none"
              placeholder="Ask me anything..."
              aria-label="Ask me anything"
            />
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#171923]"
              aria-label="Send"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
});
