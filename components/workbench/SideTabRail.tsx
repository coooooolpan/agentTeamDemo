"use client";

import { History, Home, Layers, Sparkles, SquarePlus } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { sideRailIcons } from "./mock-data";

interface SideTabRailProps {
  className?: string;
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

export function SideTabRail({ className }: SideTabRailProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isHomeActive = pathname === "/home";
  const isWorkbenchActive = pathname === "/";

  return (
    <aside
      className={cn(
        "w-[76px] flex-col items-center rounded-[999px] border border-[#e6e8ee] bg-[#f2f4f7] py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black shadow-lg">
        <Image
          src="/k2-space-mark.svg"
          alt="K2 Space mark"
          width={26}
          height={26}
          className="h-[26px] w-[26px]"
          priority
        />
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center gap-3">
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
              (item === "home" && isHomeActive) || (item === "sparkles" && isWorkbenchActive)
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
  );
}
