import { ContentCard } from "./ContentCard";
import type { FlowGroupData } from "./types";

interface FlowGroupProps {
  group: FlowGroupData;
}

export function FlowGroup({ group }: FlowGroupProps) {
  return (
    <section className="rounded-[24px] border border-dashed border-[#d8dee9] bg-white/24 p-3.5">
      {group.title ? (
        <p className="mb-2 text-xs font-medium text-[#a6afbf]">{group.title}</p>
      ) : null}
      <div className="flex items-start gap-3.5">
        {group.cards.map((card) => (
          <ContentCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
