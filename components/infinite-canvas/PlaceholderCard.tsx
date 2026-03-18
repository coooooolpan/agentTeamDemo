import { cn } from "@/lib/utils";

interface PlaceholderCardProps {
  ratio?: "square" | "landscape" | "portrait";
  className?: string;
}

export function PlaceholderCard({ ratio = "square", className }: PlaceholderCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[14px] border border-[#dce6f5]/80 bg-[linear-gradient(145deg,rgba(206,220,241,0.8),rgba(199,214,236,0.62),rgba(233,225,247,0.55))]",
        ratio === "square" && "aspect-square",
        ratio === "landscape" && "aspect-[16/9]",
        ratio === "portrait" && "aspect-[3/4]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.44),transparent_42%),radial-gradient(circle_at_84%_82%,rgba(255,255,255,0.18),transparent_34%)]" />
    </div>
  );
}
