interface StepLabelProps {
  step: number;
  label: string;
}

export function StepLabel({ step, label }: StepLabelProps) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-full border border-[#e5e8f0] bg-white/85 text-[11px] font-semibold text-[#96a0b1] shadow-[0_4px_10px_rgba(15,23,42,0.06)]">
        {step}
      </span>
      <span className="inline-flex items-center rounded-full border border-[#e7eaf1] bg-[linear-gradient(180deg,#f8faff,#f2f5fb)] px-3 py-1 text-[11px] font-medium text-[#a0abc0]">
        {label}
      </span>
    </div>
  );
}
