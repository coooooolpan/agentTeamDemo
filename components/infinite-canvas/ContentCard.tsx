import { cn } from "@/lib/utils";
import type { CanvasCard } from "./types";
import { PlaceholderCard } from "./PlaceholderCard";

interface ContentCardProps {
  card: CanvasCard;
}

export function ContentCard({ card }: ContentCardProps) {
  if (card.kind === "placeholder") {
    return <PlaceholderCard size={card.size} />;
  }

  if (card.kind === "image") {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-[18px] border border-[#dce4f0]/85",
          card.size === "sm" && "h-[170px] w-[198px]",
          card.size === "lg" && "h-[186px] w-[220px]",
          (!card.size || card.size === "md") && "h-[182px] w-[178px]",
        )}
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#121728_0%,#2d3560_36%,#6f82b8_68%,#bfd0ea_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.34),transparent_35%),radial-gradient(circle_at_72%_74%,rgba(255,255,255,0.18),transparent_40%)]" />
      </div>
    );
  }

  return (
    <article className="w-[198px] rounded-[16px] border border-[#eceff4] bg-white/96 px-4 py-3.5 shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
      <h3 className="text-[20px] font-semibold leading-6 text-[#212734]">{card.title}</h3>
      <p className="mt-2 text-[10.5px] leading-4 text-[#9ba4b6]">{card.subtitle}</p>
      <ul className="mt-3 space-y-1.5 text-[10.5px] leading-4 text-[#9ba4b6]">
        {(card.lines ?? []).map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </article>
  );
}
