"use client"

import { useMemo, useState } from "react"
import type { DailyPoint } from "@/lib/dashboardMetrics"
import { centsToUsd, formatCompact } from "@/lib/money"
import { PerformanceChartCanvas } from "@/components/dashboard/PerformanceChartCanvas"

type MetricKey = "spend" | "impressions" | "clicks" | "ctr" | "walletConnects"

interface MetricDef {
  key: MetricKey
  label: string
  format: (n: number) => string
  pick: (p: DailyPoint) => number
}

const METRICS: MetricDef[] = [
  { key: "spend", label: "Spend", format: (n) => `${centsToUsd(n)}`, pick: (p) => p.spendUsdCents },
  { key: "impressions", label: "Impressions", format: (n) => formatCompact(n), pick: (p) => p.impressions },
  { key: "clicks", label: "Clicks", format: (n) => formatCompact(n), pick: (p) => p.clicks },
  { key: "ctr", label: "CTR", format: (n) => `${n.toFixed(2)}%`, pick: (p) => (p.impressions > 0 ? (p.clicks / p.impressions) * 100 : 0) },
  { key: "walletConnects", label: "Wallet connects", format: (n) => formatCompact(n), pick: (p) => p.walletConnects },
]

interface Props {
  series: DailyPoint[]
  rangeDays: number
}

function totalFor(series: DailyPoint[], def: MetricDef): number {
  if (def.key === "ctr") {
    const imp = series.reduce((a, p) => a + p.impressions, 0)
    const clk = series.reduce((a, p) => a + p.clicks, 0)
    return imp > 0 ? (clk / imp) * 100 : 0
  }
  return series.reduce((a, p) => a + def.pick(p), 0)
}

function trendPct(values: number[]): number {
  if (values.length < 4) return 0
  const half = Math.floor(values.length / 2)
  const a = values.slice(0, half).reduce((s, v) => s + v, 0)
  const b = values.slice(half).reduce((s, v) => s + v, 0)
  if (a === 0) return b > 0 ? 100 : 0
  return ((b - a) / a) * 100
}

export function PerformanceChart({ series, rangeDays }: Props): React.JSX.Element {
  const [active, setActive] = useState<MetricKey>("spend")
  const def = METRICS.find((m) => m.key === active) ?? METRICS[0]!

  const data = useMemo(
    () => series.map((p) => ({ date: p.date, value: def.pick(p) })),
    [series, def],
  )
  const total = useMemo(() => totalFor(series, def), [series, def])
  const avg = data.length > 0 ? data.reduce((s, d) => s + d.value, 0) / data.length : 0
  const hasData = data.some((d) => d.value > 0)

  return (
    <div className="flex flex-col gap-0.5">
      <div className="bg-white grid grid-cols-2 lg:grid-cols-5 divide-x divide-y-0 divide-[rgba(10,10,10,0.08)] max-lg:divide-y max-lg:divide-x-0 max-lg:[&>*:nth-child(2)]:border-l max-lg:[&>*:nth-child(2)]:border-[rgba(10,10,10,0.08)] max-lg:[&>*:nth-child(4)]:border-l max-lg:[&>*:nth-child(4)]:border-[rgba(10,10,10,0.08)]">
        {METRICS.map((m) => {
          const values = series.map((p) => m.pick(p))
          return (
            <MetricPill
              key={m.key}
              def={m}
              value={totalFor(series, m)}
              spark={values}
              trend={trendPct(values)}
              active={m.key === active}
              onClick={() => setActive(m.key)}
            />
          )
        })}
      </div>

      <div className="bg-white pl-1 pr-2.5 pt-2 pb-1.5">
        <div className="flex items-center justify-between mb-1.5 pl-2 pr-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#0A0A0A]/55">
              Daily {def.label.toLowerCase()} · last {rangeDays} days
            </span>
            {avg > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#0A0A0A]/[0.04] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[#0A0A0A]/60">
                <span className="size-[6px] rounded-full border border-[#0A0A0A]/30" aria-hidden />
                Avg {def.format(avg)}
              </span>
            )}
          </div>
          <span className="text-[12px] font-medium tabular-nums text-[#0A0A0A]">
            Total {def.format(total)}
          </span>
        </div>
        {hasData ? (
          <PerformanceChartCanvas data={data} metric={def} avg={avg} />
        ) : (
          <EmptyChart />
        )}
      </div>
    </div>
  )
}

interface MetricPillProps {
  def: MetricDef
  value: number
  spark: number[]
  trend: number
  active: boolean
  onClick: () => void
}

function MetricPill({ def, value, spark, trend, active, onClick }: MetricPillProps): React.JSX.Element {
  const up = trend >= 0
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative text-left px-2.5 py-1.5 transition-colors ${
        active ? "bg-white" : "bg-[#0A0A0A]/[0.015] hover:bg-white"
      }`}
    >
      {active && (
        <span
          aria-hidden
          className="absolute inset-x-2.5 top-0 h-px bg-[#1F40CD]"
        />
      )}
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-semibold uppercase tracking-widest ${active ? "text-[#1F40CD]" : "text-[#0A0A0A]/55"}`}>
          {def.label}
        </span>
        {Math.abs(trend) >= 0.5 && (
          <span className="inline-flex items-center gap-0.5 text-[9px] font-medium tabular-nums text-[#0A0A0A]/55">
            <span aria-hidden className="text-[8px] leading-none">{up ? "↑" : "↓"}</span>
            {Math.abs(trend).toFixed(0)}%
          </span>
        )}
      </div>
      <div className="mt-0.5 flex items-end justify-between gap-2">
        <span className={`text-[18px] font-medium tabular-nums tracking-[-0.01em] ${active ? "text-[#0A0A0A]" : "text-[#0A0A0A]/70"}`}>
          {def.format(value)}
        </span>
        <Sparkline values={spark} active={active} />
      </div>
    </button>
  )
}

function Sparkline({ values, active }: { values: number[]; active: boolean }): React.JSX.Element {
  const w = 72
  const h = 22
  if (values.length < 2) return <div style={{ width: w, height: h }} />
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const stepX = w / (values.length - 1)
  const pts = values
    .map((v, i) => `${(i * stepX).toFixed(1)},${(h - 2 - ((v - min) / range) * (h - 4)).toFixed(1)}`)
    .join(" ")
  const stroke = active ? "#1F40CD" : "rgba(31,64,205,0.4)"
  const last = values[values.length - 1]!
  const lastY = h - 2 - ((last - min) / range) * (h - 4)
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden
      className="block shrink-0"
    >
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(values.length - 1) * stepX} cy={lastY} r={2} fill={stroke} stroke="white" strokeWidth={1} />
    </svg>
  )
}

function EmptyChart(): React.JSX.Element {
  return (
    <div className="flex h-[260px] items-center justify-center text-[11px] text-muted-foreground">
      No data in this range — chart will populate once campaigns deliver.
    </div>
  )
}
