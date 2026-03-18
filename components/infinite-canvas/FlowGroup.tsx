import type { ReactNode } from "react";

interface FlowGroupProps {
  title?: string;
  children: ReactNode;
}

export function FlowGroup({ title, children }: FlowGroupProps) {
  return (
    <section className="rounded-[24px] border border-dashed border-[#d7deea] bg-white/20 p-3.5">
      {title ? <p className="mb-2 text-xs font-medium text-[#a5afbf]">{title}</p> : null}
      {children}
    </section>
  );
}
