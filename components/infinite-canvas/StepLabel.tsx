interface StepLabelProps {
  step: number;
  label: string;
  roleName?: string;
  roleColor?: string;
  avatarGradient?: string;
}

export function StepLabel({ step, label, roleName, roleColor, avatarGradient }: StepLabelProps) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="sr-only">Step {step}</span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e8edf5] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,247,252,0.9))] px-2.5 py-1 text-[10px] font-medium text-[#9aa6bb]">
        {roleName ? (
          <span
            className="h-3.5 w-3.5 rounded-full border border-white/85"
            style={{
              backgroundImage:
                avatarGradient ??
                `linear-gradient(135deg,${roleColor ?? "#dbe3f2"},#ffffff)`,
            }}
          />
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-[#bcc6d6]" />
        )}
        <span>{label}</span>
      </span>
    </div>
  );
}
