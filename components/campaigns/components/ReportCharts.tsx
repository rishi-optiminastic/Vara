"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { centsToUsd, formatCompact } from "@/lib/money"

export interface DailyPoint {
  date: string
  impressions: number
  clicks: number
  walletConnects: number
  onChainConvs: number
  spendUsdCents: number
}

interface Totals {
  impressions: number
  clicks: number
  walletConnects: number
  onChainConvs: number
}

interface Props {
  series: DailyPoint[]
  totals: Totals
}

const COLOR = {
  spend: "#C2410C",
  impressions: "#1E40AF",
  clicks: "#6D28D9",
  wallets: "#15803D",
  onchain: "#A16207",
  ink: "#37322F",
}

function dayLabel(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

const TOOLTIP_BASE =
  "rounded-md border border-[rgba(55,50,47,0.12)] bg-white/95 backdrop-blur-sm px-2.5 py-1.5 shadow-[0_4px_12px_-4px_rgba(55,50,47,0.18)]"

interface TipPayload {
  name?: string | number
  value?: number
  color?: string
  dataKey?: string | number
}

function MoneyTip({ active, payload, label }: { active?: boolean; payload?: TipPayload[]; label?: string }): React.JSX.Element | null {
  if (!active || !payload?.length) return null
  return (
    <div className={TOOLTIP_BASE}>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">
        {label ? dayLabel(label) : ""}
      </div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-[11px] text-[#37322F] tabular-nums">
          <span className="size-1.5 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}</span>
          <span className="ml-auto font-medium">{centsToUsd(Number(p.value ?? 0))}</span>
        </div>
      ))}
    </div>
  )
}

function CountTip({ active, payload, label }: { active?: boolean; payload?: TipPayload[]; label?: string }): React.JSX.Element | null {
  if (!active || !payload?.length) return null
  return (
    <div className={TOOLTIP_BASE}>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">
        {label ? dayLabel(label) : ""}
      </div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-[11px] text-[#37322F] tabular-nums">
          <span className="size-1.5 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}</span>
          <span className="ml-auto font-medium">{formatCompact(Number(p.value ?? 0))}</span>
        </div>
      ))}
    </div>
  )
}

function ChartCard({
  title,
  hint,
  children,
  className,
}: {
  title: string
  hint?: string
  children: React.ReactNode
  className?: string
}): React.JSX.Element {
  return (
    <Card className={`py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)] ${className ?? ""}`}>
      <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.12)] px-3.5 py-2">
        <h3 className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">{title}</h3>
        {hint && <span className="text-[10px] text-muted-foreground tabular-nums">{hint}</span>}
      </div>
      <CardContent className="px-2 py-3">{children}</CardContent>
    </Card>
  )
}

export function ReportCharts({ series, totals }: Props): React.JSX.Element {
  const funnel = [
    { name: "Impressions", value: totals.impressions, color: COLOR.impressions },
    { name: "Clicks", value: totals.clicks, color: COLOR.clicks },
    { name: "Wallets", value: totals.walletConnects, color: COLOR.wallets },
    { name: "On-chain", value: totals.onChainConvs, color: COLOR.onchain },
  ].filter((f) => f.value > 0)

  const axisProps = {
    stroke: "rgba(55,50,47,0.4)",
    fontSize: 10,
    tickLine: false,
    axisLine: false,
  }

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <ChartCard title="Spend trend" hint="Daily · USD">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLOR.spend} stopOpacity={0.28} />
                <stop offset="100%" stopColor={COLOR.spend} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(55,50,47,0.06)" vertical={false} />
            <XAxis dataKey="date" tickFormatter={dayLabel} interval={4} {...axisProps} />
            <YAxis tickFormatter={(v) => centsToUsd(Number(v))} width={56} {...axisProps} />
            <Tooltip content={<MoneyTip />} cursor={{ stroke: "rgba(55,50,47,0.18)", strokeDasharray: 3 }} />
            <Area
              type="monotone"
              dataKey="spendUsdCents"
              name="Spend"
              stroke={COLOR.spend}
              strokeWidth={1.75}
              fill="url(#spendFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Impressions vs Clicks" hint="Daily">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(55,50,47,0.06)" vertical={false} />
            <XAxis dataKey="date" tickFormatter={dayLabel} interval={4} {...axisProps} />
            <YAxis tickFormatter={(v) => formatCompact(Number(v))} width={40} {...axisProps} />
            <Tooltip content={<CountTip />} cursor={{ stroke: "rgba(55,50,47,0.18)", strokeDasharray: 3 }} />
            <Line type="monotone" dataKey="impressions" name="Impressions" stroke={COLOR.impressions} strokeWidth={1.75} dot={false} />
            <Line type="monotone" dataKey="clicks" name="Clicks" stroke={COLOR.clicks} strokeWidth={1.75} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="On-chain engagement" hint="Wallets & conversions / day">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(55,50,47,0.06)" vertical={false} />
            <XAxis dataKey="date" tickFormatter={dayLabel} interval={4} {...axisProps} />
            <YAxis tickFormatter={(v) => formatCompact(Number(v))} width={40} {...axisProps} />
            <Tooltip content={<CountTip />} cursor={{ fill: "rgba(55,50,47,0.04)" }} />
            <Bar dataKey="walletConnects" name="Wallet connects" fill={COLOR.wallets} radius={[3, 3, 0, 0]} maxBarSize={14} />
            <Bar dataKey="onChainConvs" name="On-chain conv." fill={COLOR.onchain} radius={[3, 3, 0, 0]} maxBarSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Funnel breakdown" hint="Last 30 days">
        {funnel.length === 0 ? (
          <div className="flex h-[220px] items-center justify-center text-[11px] text-muted-foreground">
            No funnel data yet.
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_1fr] items-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={funnel}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={84}
                  paddingAngle={2}
                  stroke="white"
                  strokeWidth={2}
                >
                  {funnel.map((f) => (
                    <Cell key={f.name} fill={f.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <ul className="flex flex-col gap-1.5 pr-3">
              {funnel.map((f) => (
                <li key={f.name} className="flex items-center gap-2 text-[11px] text-[#37322F]">
                  <span className="size-1.5 rounded-full" style={{ background: f.color }} />
                  <span className="text-muted-foreground">{f.name}</span>
                  <span className="ml-auto font-medium tabular-nums">{formatCompact(f.value)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </ChartCard>
    </div>
  )
}
