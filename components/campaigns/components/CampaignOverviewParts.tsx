import { Card, CardContent } from "@/components/ui/card"

export type Kpi = { label: string; value: string; icon: React.ElementType; tint: string }

export function KpiStrip({ kpis, rangeDays }: { kpis: Kpi[]; rangeDays: number }): React.JSX.Element {
  return (
    <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.08)] px-3 py-1.5">
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Performance</span>
        <span className="text-[10px] text-muted-foreground tabular-nums">Last {rangeDays} days</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-[rgba(55,50,47,0.08)]">
        {kpis.map((k) => (
          <div key={k.label} className="px-3 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{k.label}</span>
              <div className={`flex h-5 w-5 items-center justify-center rounded-md ${k.tint}`}>
                <k.icon className="size-3" />
              </div>
            </div>
            <div className="text-[20px] font-medium tracking-tight tabular-nums text-[#37322F] leading-none">{k.value}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}

interface PacingCardProps {
  icon: React.ElementType
  label: string
  primary: string
  sub: string
  pct: number
  warn?: boolean
  neutral?: boolean
  rightLabel: string
  rightValue: string
}

export function PacingCard({ icon: Icon, label, primary, sub, pct, warn, neutral, rightLabel, rightValue }: PacingCardProps): React.JSX.Element {
  const barColor = neutral ? "bg-[rgba(55,50,47,0.4)]" : warn ? "bg-[#C2410C]" : "bg-[#37322F]"
  return (
    <Card className="py-3 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <CardContent className="px-3.5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            <Icon className="size-3" />
            {label}
          </div>
          <div className="text-right">
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{rightLabel}</div>
            <div className="text-xs font-medium text-[#37322F] tabular-nums">{rightValue}</div>
          </div>
        </div>
        <div className="text-[15px] font-medium tracking-tight text-[#37322F] tabular-nums">{primary}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[rgba(55,50,47,0.08)]">
          <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
        </div>
      </CardContent>
    </Card>
  )
}

export function SectionCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <div className="flex items-center gap-1.5 border-b border-[rgba(55,50,47,0.12)] px-3.5 py-2">
        <Icon className="size-3 text-muted-foreground" />
        <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{title}</h3>
      </div>
      <CardContent className="p-3.5">{children}</CardContent>
    </Card>
  )
}

export function MetaRow({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="flex items-center justify-between border-t border-dashed border-[rgba(55,50,47,0.1)] pt-2 col-span-1 lg:col-span-2">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-[11px] font-medium text-[#37322F] tabular-nums">{value}</span>
    </div>
  )
}

export function Field({ label, value, mono, capitalize }: { label: string; value: string; mono?: boolean; capitalize?: boolean }): React.JSX.Element {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`text-xs font-medium text-[#37322F] mt-1 ${mono ? "font-mono" : ""} ${capitalize ? "capitalize" : ""} truncate`}>{value}</div>
    </div>
  )
}

export function dateLabel(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function truncate(s: string | null): string | null {
  if (!s) return null
  return s.length > 14 ? `${s.slice(0, 6)}…${s.slice(-4)}` : s
}
