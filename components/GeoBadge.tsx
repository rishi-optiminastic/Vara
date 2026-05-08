import { countryName, flagEmoji } from "@/lib/geoFlag"

type Size = "sm" | "md"

interface Props {
  code: string
  size?: Size
}

const SIZE_CLASS: Record<Size, { wrap: string; flag: string; text: string }> = {
  sm: { wrap: "h-5 px-1.5 gap-1", flag: "text-[11px]", text: "text-[9px]" },
  md: { wrap: "h-6 px-2 gap-1.5", flag: "text-[13px]", text: "text-[10px]" },
}

export function GeoBadge({ code, size = "md" }: Props): React.JSX.Element {
  const cc = code.trim().toUpperCase()
  const flag = flagEmoji(cc)
  const cls = SIZE_CLASS[size]
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[rgba(55,50,47,0.1)] bg-[#FAFAF8] text-[#37322F] ${cls.wrap}`}
      title={countryName(cc)}
    >
      {flag && <span className={`leading-none ${cls.flag}`} aria-hidden>{flag}</span>}
      <span className={`font-semibold tabular-nums ${cls.text}`}>{cc}</span>
    </span>
  )
}
