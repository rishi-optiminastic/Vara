"use client"

import { useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { TooltipProps } from "recharts"
import type { DailyPoint } from "@/lib/dashboardMetrics"
import { centsToUsd, formatCompact } from "@/lib/money"

type MetricKey = "spend" | "impressions" | "clicks" | "walletConnects"

interface MetricDef {
  key: MetricKey
  label: string
  pick: (p: DailyPoint) => number
  format: (n: number) => string
}

const METRICS: MetricDef[] = [
  { key: "spend", label: "Spend", pick: (p) => p.spendUsdCents, format: (n) => centsToUsd(n) },
  { key: "impressions", label: "Impressions", pick: (p) => p.impressions, format: (n) => formatCompact(n) },
  { key: "clicks", label: "Clicks", pick: (p) => p.clicks, format: (n) => formatCompact(n) },
  { key: "walletConnects", label: "Wallet connects", pick: (p) => p.walletConnects, format: (n) => formatCompact(n) },
]

interface Props {
  series: DailyPoint[]
  initial?: MetricKey
  emptyLabel?: string
}

export function DailyTrendChart({ series, initial = "spend", emptyLabel = "No data in this range" }: Props): React.JSX.Element {
  const [active, setActive] = useState<MetricKey>(initial)
  const def = METRICS.find((m) => m.key === active) ?? METRICS[0]!

  const data = useMemo(
    () => series.map((p) => ({ date: p.date, value: def.pick(p) })),
    [series, def],
  )
  const total = useMemo(() => series.reduce((s, p) => s + def.pick(p), 0), [series, def])
  const avg = data.length > 0 ? data.reduce((s, d) => s + d.value, 0) / data.length : 0
  const hasData = data.some((d) => d.value > 0)

  return (
    <div className="bg-white">
      <div className="flex items-stretch border-b border-dashed border-[rgba(10,10,10,0.12)]">
        {METRICS.map((m, i) => {
          const isActive = m.key === active
          const value = series.reduce((s, p) => s + m.pick(p), 0)
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setActive(m.key)}
              className={`relative flex-1 px-3 py-2 text-left transition-colors ${
                i > 0 ? "border-l border-dashed border-[rgba(10,10,10,0.12)]" : ""
              } ${isActive ? "bg-white" : "bg-[#0A0A0A]/[0.015] hover:bg-white"}`}
            >
              {isActive && (
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-[#1F40CD]" />
              )}
              <div className={`text-[10px] font-semibold uppercase tracking-widest ${isActive ? "text-[#1F40CD]" : "text-[#0A0A0A]/55"}`}>
                {m.label}
              </div>
              <div className={`mt-0.5 text-[16px] font-medium tabular-nums tracking-[-0.01em] ${isActive ? "text-[#0A0A0A]" : "text-[#0A0A0A]/65"}`}>
                {m.format(value)}
              </div>
            </button>
          )
        })}
      </div>

      <div className="px-2 pt-2 pb-1.5">
        <div className="flex items-center justify-between mb-1 px-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#0A0A0A]/55">
            Daily {def.label.toLowerCase()}
          </span>
          {hasData && avg > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#0A0A0A]/[0.04] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[#0A0A0A]/60">
              <span className="size-[6px] rounded-full border border-[#0A0A0A]/30" aria-hidden />
              Avg {def.format(avg)}
            </span>
          )}
        </div>
        {hasData ? (
          <Chart data={data} def={def} avg={avg} />
        ) : (
          <div className="flex h-[200px] items-center justify-center text-[11px] text-muted-foreground">
            {emptyLabel}
          </div>
        )}
      </div>
    </div>
  )
}

interface ChartProps {
  data: { date: string; value: number }[]
  def: MetricDef
  avg: number
}

function Chart({ data, def, avg }: ChartProps): React.JSX.Element {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 16, right: 12, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1F40CD" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#1F40CD" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(10,10,10,0.06)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "rgba(10,10,10,0.55)" }}
          tickLine={false}
          axisLine={{ stroke: "rgba(10,10,10,0.12)" }}
          tickFormatter={(d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          minTickGap={24}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "rgba(10,10,10,0.55)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => def.format(v)}
          width={48}
        />
        <Tooltip
          cursor={{ stroke: "rgba(10,10,10,0.2)", strokeDasharray: "3 3" }}
          content={<TrendTooltip def={def} avg={avg} />}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#1F40CD"
          strokeWidth={1.75}
          fill="url(#trendFill)"
          dot={false}
          activeDot={{ r: 4, stroke: "white", strokeWidth: 2, fill: "#1F40CD" }}
          isAnimationActive
          animationDuration={550}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

type TooltipExtras = { def: MetricDef; avg: number }

function TrendTooltip({
  def,
  avg,
  active,
  payload,
  label,
}: TooltipProps<number, string> & TooltipExtras): React.JSX.Element | null {
  if (!active || !payload || payload.length === 0) return null
  const value = Number(payload[0]?.value ?? 0)
  const delta = avg > 0 ? ((value - avg) / avg) * 100 : 0
  const up = delta >= 0
  const date = new Date(String(label)).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  return (
    <div className="rounded-lg border border-[rgba(10,10,10,0.08)] bg-white px-3 py-2 shadow-[0_10px_28px_-10px_rgba(31,64,205,0.22)]">
      <div className="text-[9px] font-semibold uppercase tracking-widest text-[#0A0A0A]/55">{date}</div>
      <div className="mt-0.5 flex items-baseline gap-2">
        <span className="text-[15px] font-medium tabular-nums tracking-[-0.01em] text-[#0A0A0A]">{def.format(value)}</span>
        {avg > 0 && (
          <span className={`text-[10px] font-medium tabular-nums ${up ? "text-[#0A0A0A]/65" : "text-[#0A0A0A]/45"}`}>
            {up ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}% vs avg
          </span>
        )}
      </div>
    </div>
  )
}
