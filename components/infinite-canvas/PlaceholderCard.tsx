import { cn } from "@/lib/utils";

interface PlaceholderCardProps {
  size?: "sm" | "md" | "lg";
}

export function PlaceholderCard({ size = "md" }: PlaceholderCardProps) {
  return (
    <div
      className={cn(
        "rounded-[18px] border border-[#dce4f0]/85 bg-[linear-gradient(180deg,rgba(215,228,245,0.85),rgba(202,218,240,0.82))]",
        size === "sm" && "h-[170px] w-[198px]",
        size === "md" && "h-[182px] w-[178px]",
        size === "lg" && "h-[162px] w-[212px]",
      )}
    />
  );
}
