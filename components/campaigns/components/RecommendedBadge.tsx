interface BadgeProps {
  label?: string
  tone?: "default" | "subtle"
}

export function RecommendedBadge({ label = "Recommended", tone = "default" }: BadgeProps): React.JSX.Element {
  const toneClasses = tone === "subtle"
    ? "bg-[#F0ECE6] text-[#37322F] border-[rgba(55,50,47,0.18)]"
    : "bg-[#37322F] text-[#FAFAF8] border-[#37322F]"
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-px text-[8px] font-semibold uppercase tracking-widest leading-none ${toneClasses}`}
    >
      <span aria-hidden className="text-[8px] leading-none">✦</span>
      {label}
    </span>
  )
}
