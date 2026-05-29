"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ASSET_LIMITS } from "@/components/ads/types"

interface Props {
  label: string
  hint: string
  values: string[]
  onChange: (index: number, value: string) => void
  limitKey: keyof typeof ASSET_LIMITS
}

/// Stamps out N text inputs (used for headlines + descriptions) with a
/// shared char-count limit and a small count badge so the user knows at a
/// glance how many slots they've filled vs. the format's minimum.
export function ResponsiveAdTextRows(props: Props): React.JSX.Element {
  const { label, hint, values, onChange, limitKey } = props
  const limit = ASSET_LIMITS[limitKey] ?? 30
  const filled = values.filter((v) => v.trim().length > 0).length

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Label className="text-[10px] uppercase tracking-widest">{label}</Label>
          <span className="rounded-full border border-[rgba(10,10,10,0.12)] bg-white px-1.5 py-px text-[9px] font-mono tabular-nums text-muted-foreground">
            {filled}/{values.length}
          </span>
        </div>
        <span className="text-[9px] text-muted-foreground">{hint}</span>
      </div>
      <div className="space-y-1.5">
        {values.map((v, i) => (
          <TextRow
            key={i}
            value={v}
            index={i}
            limit={limit}
            placeholder={`${label.replace(/s$/, "")} ${i + 1}`}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  )
}

interface RowProps {
  value: string
  index: number
  limit: number
  placeholder: string
  onChange: (index: number, value: string) => void
}

function TextRow({ value, index, limit, placeholder, onChange }: RowProps): React.JSX.Element {
  const filled = value.trim().length > 0
  const ringClass = filled
    ? "border-[rgba(10,10,10,0.2)]"
    : "border-[rgba(10,10,10,0.08)] bg-[rgba(10,10,10,0.02)]"
  return (
    <div className="relative">
      <Input
        value={value}
        maxLength={limit}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder={placeholder}
        className={`h-8 pr-14 text-xs ${ringClass}`}
      />
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[9px] tabular-nums text-muted-foreground/70">
        {value.length}/{limit}
      </span>
    </div>
  )
}
