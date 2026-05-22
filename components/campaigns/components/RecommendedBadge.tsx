interface BadgeProps {
  label?: string
  tone?: "default" | "subtle"
}

export function RecommendedBadge({ label = "Recommended", tone = "default" }: BadgeProps): React.JSX.Element {
  const toneClasses = tone === "subtle"
    ? "bg-[#ECEAE2] text-[#0A0A0A] border-[rgba(10,10,10,0.18)]"
    : "bg-[#1F40CD] text-white border-[#1F40CD]"
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-px text-[8px] font-semibold uppercase tracking-widest leading-none ${toneClasses}`}
    >
      <span aria-hidden className="text-[8px] leading-none">✦</span>
      {label}
    </span>
  )
}
