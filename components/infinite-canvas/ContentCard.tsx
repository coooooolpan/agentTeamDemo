import { memo, useCallback, useMemo, useRef, useState } from "react";
import { Copy, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  GeneratingCursorCloud,
  type GeneratingCursorEntry,
} from "@/components/workbench/GeneratingCursorCloud";
import { PlaceholderCard } from "./PlaceholderCard";
import type { OutputAsset, OutputCardLayout, RoleOutputCard } from "./types";

interface ContentCardProps {
  card: RoleOutputCard;
  ownerNodeId?: string;
  isDragging?: boolean;
}

export type AssetActionKind = "drag" | "copy";

export interface ContentCardAssetActionDetail {
  ownerNodeId: string;
  cardId: string;
  assetId: string;
  action: AssetActionKind;
  clientX?: number;
  clientY?: number;
}

export const INFINITE_CANVAS_ASSET_ACTION_EVENT = "infinite-canvas:asset-action";

function buildGeneratingCursorSequence(card: RoleOutputCard): GeneratingCursorEntry[] {
  const layout = card.layout ?? "triplet";
  const firstPlacement =
    layout === "strip"
      ? "left-[18px] -top-[34px]"
      : layout === "single"
        ? "left-[34px] -top-[34px]"
        : "left-[16px] -top-[32px]";
  const secondPlacement =
    layout === "strip"
      ? "right-[-118px] top-[26px]"
      : layout === "single"
        ? "right-[-114px] top-[22px]"
        : "right-[-110px] top-[28px]";
  const thirdPlacement =
    layout === "strip"
      ? "left-[-106px] top-[78px]"
      : layout === "single"
        ? "left-[-102px] top-[48px]"
        : "left-[-102px] top-[70px]";

  return [
    {
      id: `${card.id}-cursor-role`,
      label: card.role.name,
      color: "#7a34ff",
      badge: "bg-[#7a34ff]",
      placement: firstPlacement,
      xDrift: [0, 4, -1, 0],
      yDrift: [0, -3, 2, 0],
      rotation: [0, 0.8, -0.2, 0],
    },
    {
      id: `${card.id}-cursor-auditor`,
      label: "Content Auditor",
      color: "#fd9732",
      badge: "bg-[#fd9732]",
      placement: secondPlacement,
      xDrift: [0, -4, 1, 0],
      yDrift: [0, 3, -2, 0],
      rotation: [0, -0.8, 0.3, 0],
    },
    {
      id: `${card.id}-cursor-producer`,
      label: "Video Producer",
      color: "#06bc57",
      badge: "bg-[#06bc57]",
      placement: thirdPlacement,
      xDrift: [0, 5, -2, 0],
      yDrift: [0, -2, 2, 0],
      rotation: [0, 0.9, -0.2, 0],
    },
  ];
}

function AssetThumb({ asset, compact = false }: { asset: OutputAsset; compact?: boolean }) {
  if (asset.kind === "placeholder") {
    return <PlaceholderCard ratio={asset.ratio ?? "square"} className="h-full w-full" />;
  }

  if (asset.kind === "doc") {
    return (
      <div className="h-full w-full rounded-[12px] border border-[#e8edf5] bg-white p-2.5">
        <div className="h-2.5 w-20 rounded-full bg-[#e9eef6]" />
        <div className="mt-2 space-y-1.5">
          <div className="h-1.5 rounded-full bg-[#edf2f8]" />
          <div className="h-1.5 rounded-full bg-[#edf2f8]" />
          <div className="h-1.5 w-3/4 rounded-full bg-[#edf2f8]" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[12px] border border-[#d9e4f3]/80 bg-[#e7edf8]">
      {asset.src ? (
        <img
          src={asset.src}
          alt={asset.title ?? "asset"}
          className="h-full w-full object-cover"
          loading="lazy"
          draggable={false}
        />
      ) : (
        <PlaceholderCard ratio={asset.ratio ?? "square"} className="h-full w-full rounded-none" />
      )}

      {asset.kind === "video" ? (
        <div className={cn("absolute inset-0 grid place-items-center", compact && "scale-90")}>
          <span className="grid h-7 w-7 place-items-center rounded-full border border-white/60 bg-black/32 text-white backdrop-blur-sm">
            <Play className="h-3.5 w-3.5 fill-current" />
          </span>
        </div>
      ) : null}
    </div>
  );
}

function AssetTile({
  asset,
  compact,
  selected,
  selectable,
  onSelect,
  onAssetAction,
}: {
  asset: OutputAsset;
  compact?: boolean;
  selected?: boolean;
  selectable?: boolean;
  onSelect?: (assetId: string) => void;
  onAssetAction?: (
    assetId: string,
    action: AssetActionKind,
    coordinates?: { clientX: number; clientY: number },
  ) => void;
}) {
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    hasDragged: boolean;
  } | null>(null);
  const ignoreClickRef = useRef(false);
  const dragThreshold = 7;

  if (!selectable) {
    return <AssetThumb asset={asset} compact={compact} />;
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onPointerDown={(event) => {
        event.stopPropagation();
        if (!onAssetAction || event.button !== 0) {
          return;
        }

        dragStateRef.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          hasDragged: false,
        };

        const handlePointerMove = (moveEvent: PointerEvent) => {
          const state = dragStateRef.current;
          if (!state || state.pointerId !== moveEvent.pointerId) {
            return;
          }

          const deltaX = moveEvent.clientX - state.startX;
          const deltaY = moveEvent.clientY - state.startY;
          if (!state.hasDragged && Math.hypot(deltaX, deltaY) >= dragThreshold) {
            state.hasDragged = true;
            ignoreClickRef.current = true;
          }
        };

        const cleanupPointerHandlers = () => {
          window.removeEventListener("pointermove", handlePointerMove);
          window.removeEventListener("pointerup", handlePointerUp);
          window.removeEventListener("pointercancel", handlePointerCancel);
        };

        const handlePointerCancel = (cancelEvent: PointerEvent) => {
          const state = dragStateRef.current;
          if (!state || state.pointerId !== cancelEvent.pointerId) {
            return;
          }
          dragStateRef.current = null;
          cleanupPointerHandlers();
        };

        const handlePointerUp = (upEvent: PointerEvent) => {
          const state = dragStateRef.current;
          if (!state || state.pointerId !== upEvent.pointerId) {
            return;
          }

          if (state.hasDragged) {
            onAssetAction(asset.id, "drag", {
              clientX: upEvent.clientX,
              clientY: upEvent.clientY,
            });
          }

          dragStateRef.current = null;
          cleanupPointerHandlers();
        };

        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("pointerup", handlePointerUp);
        window.addEventListener("pointercancel", handlePointerCancel);
      }}
      onClick={(event) => {
        event.stopPropagation();
        if (ignoreClickRef.current) {
          ignoreClickRef.current = false;
          return;
        }
        onSelect?.(asset.id);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.(asset.id);
        }
      }}
      className="nodrag group relative block h-full w-full rounded-[12px] text-left outline-none"
      aria-label={asset.title ? `Select ${asset.title}` : "Select asset"}
    >
      <AssetThumb asset={asset} compact={compact} />
      {onAssetAction ? (
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onAssetAction(asset.id, "copy");
          }}
          className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full border border-white/85 bg-white/86 text-[#6f7d93] opacity-0 shadow-[0_8px_12px_rgba(15,23,42,0.12)] backdrop-blur-sm transition group-hover:opacity-100 hover:bg-white"
          aria-label="Copy asset to canvas"
        >
          <Copy className="h-2.5 w-2.5" />
        </button>
      ) : null}
      <span
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[12px] ring-1 ring-inset transition-all",
          selected
            ? "ring-[#92aef9] shadow-[0_0_0_2px_rgba(146,174,249,0.28)_inset]"
            : "ring-[#d6e0ef]/70",
        )}
      />
    </div>
  );
}

function AssetGrid({
  card,
  selectedAssetId,
  onSelectAsset,
  onAssetAction,
}: {
  card: RoleOutputCard;
  selectedAssetId?: string | null;
  onSelectAsset?: (assetId: string) => void;
  onAssetAction?: (
    assetId: string,
    action: AssetActionKind,
    coordinates?: { clientX: number; clientY: number },
  ) => void;
}) {
  const layout: OutputCardLayout = card.layout ?? "triplet";
  const selectable = card.assets.length > 1;

  if (layout === "single") {
    const singleAsset = card.assets[0] ?? { id: `${card.id}-placeholder`, kind: "placeholder" as const };
    return (
      <div className="h-full w-full">
        <AssetTile asset={singleAsset} selected selectable={false} />
      </div>
    );
  }

  if (layout === "strip") {
    return (
      <div className="grid h-full w-full grid-cols-4 gap-2">
        {card.assets.slice(0, 4).map((asset) => (
          <div key={asset.id} className="min-h-0">
            <AssetTile
              asset={asset}
              compact
              selected={selectedAssetId === asset.id}
              selectable={selectable}
              onSelect={onSelectAsset}
              onAssetAction={onAssetAction}
            />
          </div>
        ))}
      </div>
    );
  }

  if (layout === "quad") {
    return (
      <div className="grid h-full w-full grid-cols-2 gap-2">
        {card.assets.slice(0, 4).map((asset) => (
          <div key={asset.id} className="min-h-0">
            <AssetTile
              asset={asset}
              selected={selectedAssetId === asset.id}
              selectable={selectable}
              onSelect={onSelectAsset}
              onAssetAction={onAssetAction}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid h-full w-full grid-cols-3 gap-2">
      {card.assets.slice(0, 3).map((asset) => (
        <div key={asset.id} className="min-h-0">
          <AssetTile
            asset={asset}
            selected={selectedAssetId === asset.id}
            selectable={selectable}
            onSelect={onSelectAsset}
            onAssetAction={onAssetAction}
          />
        </div>
      ))}
    </div>
  );
}

export const ContentCard = memo(function ContentCard({
  card,
  ownerNodeId,
  isDragging = false,
}: ContentCardProps) {
  const isDocumentCard = (card.layout ?? "triplet") === "doc";
  const fallbackDocAsset: OutputAsset = { id: `${card.id}-doc`, kind: "doc" };
  const supportsSubAssetSelection = !isDocumentCard && card.assets.length > 1;
  const isGenerating = card.assets.some((asset) => asset.kind === "placeholder");
  const generatingCursorSequence = useMemo(
    () => (isGenerating ? buildGeneratingCursorSequence(card) : []),
    [card, isGenerating],
  );
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(
    supportsSubAssetSelection ? card.assets[0]?.id ?? null : null,
  );
  const dispatchAssetAction = useCallback(
    (
      assetId: string,
      action: AssetActionKind,
      coordinates?: { clientX: number; clientY: number },
    ) => {
      if (!ownerNodeId || typeof window === "undefined") {
        return;
      }

      window.dispatchEvent(
        new CustomEvent<ContentCardAssetActionDetail>(INFINITE_CANVAS_ASSET_ACTION_EVENT, {
          detail: {
            ownerNodeId,
            cardId: card.id,
            assetId,
            action,
            clientX: coordinates?.clientX,
            clientY: coordinates?.clientY,
          },
        }),
      );
    },
    [card.id, ownerNodeId],
  );

  return (
    <article className="group relative h-full w-full rounded-[18px]">
      {isGenerating ? (
        <GeneratingCursorCloud
          sequence={generatingCursorSequence}
          requestedVisibleCount={1}
          minDelayMs={1700}
          maxDelayMs={3200}
          defaultVisibleIds={[generatingCursorSequence[0]?.id ?? ""]}
          size="sm"
        />
      ) : null}

      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-[18px]",
          isDragging && "transition-none",
        )}
      >
        {isDocumentCard ? (
          <AssetThumb asset={card.assets[0] ?? fallbackDocAsset} />
        ) : (
          <AssetGrid
            card={card}
            selectedAssetId={selectedAssetId}
            onSelectAsset={setSelectedAssetId}
            onAssetAction={dispatchAssetAction}
          />
        )}

        <div className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-inset ring-[#d7e2f1]/72 transition-colors duration-200 group-hover:ring-[#bdcdea]/85" />

        <div className="pointer-events-none absolute left-2.5 top-2.5 inline-flex translate-y-1 items-center gap-1.5 rounded-full border border-white/85 bg-white/85 px-2 py-1 text-[9.5px] font-semibold text-[#5f6b82] opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <span
            className="h-3 w-3 shrink-0 rounded-full border border-white/80"
            style={{ backgroundImage: card.role.avatarGradient }}
          />
          <span className="truncate">{card.role.name}</span>
        </div>

        <div className="pointer-events-none absolute right-2.5 top-2.5 inline-flex translate-y-1 items-center rounded-full border border-white/80 bg-white/86 px-1.5 py-0.5 text-[9px] font-semibold text-[#6c7890] opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          V{card.versionIndex}
        </div>

        <div className="pointer-events-none absolute bottom-2.5 left-2.5 max-w-[78%] translate-y-1 rounded-full border border-white/75 bg-white/84 px-2 py-1 text-[9px] font-medium text-[#657187] opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="truncate">{card.title ?? "Output Batch"}</span>
          <span className="ml-1 text-[#95a2b8]">{card.createdAt}</span>
        </div>
      </div>
    </article>
  );
});
