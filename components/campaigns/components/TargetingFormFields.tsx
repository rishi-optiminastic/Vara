"use client"

import type { WalletSegment } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface SectionProps {
  icon: React.ElementType
  tint: string
  title: string
  hint?: string | undefined
  description?: string
  children: React.ReactNode
}

export function Section({
  icon: Icon,
  tint,
  title,
  hint,
  description,
  children,
}: SectionProps): React.JSX.Element {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className={`flex size-5 items-center justify-center rounded-md ${tint}`}>
          <Icon className="size-3" />
        </span>
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[#37322F]">
          {title}
        </h3>
        {hint && <span className="text-[10px] text-muted-foreground/70">· {hint}</span>}
        {description && (
          <span className="text-[10px] text-muted-foreground/65 ml-auto">{description}</span>
        )}
      </div>
      {children}
    </div>
  )
}

interface PillProps {
  label: string
  active: boolean
  onClick: () => void
  icon?: React.ReactNode
}

export function Pill({ label, active, onClick, icon }: PillProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-7 inline-flex items-center gap-1.5 rounded-full border px-3 text-[11px] font-medium transition-colors ${
        active
          ? "bg-[#37322F] text-[#FAFAF8] border-[#37322F]"
          : "bg-white border-[rgba(55,50,47,0.16)] text-[#37322F] hover:bg-[#F0ECE6] hover:border-[rgba(55,50,47,0.3)]"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

interface FieldInputProps {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  prefix?: string
  suffix?: string
}

export function FieldInput(p: FieldInputProps): React.JSX.Element {
  return (
    <div className="space-y-1">
      {p.label && (
        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {p.label}
        </Label>
      )}
      <div className="relative">
        {p.prefix && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground select-none">
            {p.prefix}
          </span>
        )}
        <Input
          type={p.type ?? "text"}
          value={p.value}
          onChange={(e) => p.onChange(e.target.value)}
          placeholder={p.placeholder}
          className={`h-8 text-xs ${p.prefix ? "pl-6" : ""} ${p.suffix ? "pr-12" : ""}`}
        />
        {p.suffix && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground uppercase tracking-wider select-none">
            {p.suffix}
          </span>
        )}
      </div>
    </div>
  )
}

interface SegmentListProps {
  segments: WalletSegment[]
  selected: string[]
  onToggle: (id: string) => void
}

export function SegmentList({
  segments,
  selected,
  onToggle,
}: SegmentListProps): React.JSX.Element {
  if (segments.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-[rgba(55,50,47,0.18)] bg-[#FFFFFF] py-4 px-3 text-center">
        <p className="text-[11px] text-muted-foreground">
          No segments seeded yet. You can still target by wallet age, portfolio, or contract
          holdings below.
        </p>
      </div>
    )
  }
  return (
    <div className="grid gap-1 max-h-56 overflow-y-auto rounded-md border border-[rgba(55,50,47,0.1)] bg-white p-1.5">
      {segments.map((s) => {
        const active = selected.includes(s.id)
        return (
          <label
            key={s.id}
            className={`flex items-start gap-2 rounded-md p-1.5 cursor-pointer transition-colors ${
              active ? "bg-[#F5EFFF]" : "hover:bg-[#FFFFFF]"
            }`}
          >
            <Checkbox checked={active} onCheckedChange={() => onToggle(s.id)} className="mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-[#37322F]">{s.name}</span>
                {s.chain && (
                  <span className="rounded-full bg-[#EAF1FF] px-1.5 py-px text-[8px] font-semibold uppercase tracking-widest text-[#1E40AF]">
                    {s.chain}
                  </span>
                )}
                <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
                  ~{(s.estSize / 1000).toFixed(1)}k
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                {s.description}
              </p>
            </div>
          </label>
        )
      })}
    </div>
  )
}

interface AddressTokenInputProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  tone?: "default" | "danger"
}

function shortAddress(addr: string): string {
  if (addr.length <= 14) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export function AddressTokenInput({
  value,
  onChange,
  placeholder,
  tone = "default",
}: AddressTokenInputProps): React.JSX.Element {
  const tokens = value
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
  const tokenStyle =
    tone === "danger"
      ? "bg-[#FFE8E8] text-[#B91C1C] border-[#B91C1C]/15"
      : "bg-[#F5EFFF] text-[#6D28D9] border-[#6D28D9]/15"

  const removeAt = (idx: number): void => {
    const next = tokens.filter((_, i) => i !== idx)
    onChange(next.join(", "))
  }

  return (
    <div className="space-y-1.5">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 text-xs font-mono"
      />
      {tokens.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tokens.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-mono tabular-nums ${tokenStyle}`}
              title={t}
            >
              {shortAddress(t)}
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label={`Remove ${t}`}
                className="opacity-60 hover:opacity-100"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
