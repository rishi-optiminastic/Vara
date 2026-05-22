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
import type { DailyPoint } from "@/lib/dashboardMetrics"
import { centsToUsd, formatCompact } from "@/lib/money"

type MetricKey = "spend" | "impressions" | "clicks" | "ctr" | "walletConnects"

interface MetricDef {
  key: MetricKey
  label: string
  format: (n: number) => string
  pick: (p: DailyPoint) => number
}

const METRICS: MetricDef[] = [
  {
    key: "spend",
    label: "Spend",
    format: (n) => `${centsToUsd(n)}`,
    pick: (p) => p.spendUsdCents,
  },
  {
    key: "impressions",
    label: "Impressions",
    format: (n) => formatCompact(n),
    pick: (p) => p.impressions,
  },
  {
    key: "clicks",
    label: "Clicks",
    format: (n) => formatCompact(n),
    pick: (p) => p.clicks,
  },
  {
    key: "ctr",
    label: "CTR",
    format: (n) => `${n.toFixed(2)}%`,
    pick: (p) => (p.impressions > 0 ? (p.clicks / p.impressions) * 100 : 0),
  },
  {
    key: "walletConnects",
    label: "Wallet connects",
    format: (n) => formatCompact(n),
    pick: (p) => p.walletConnects,
  },
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

export function PerformanceChart({ series, rangeDays }: Props): React.JSX.Element {
  const [active, setActive] = useState<MetricKey>("spend")
  const def = METRICS.find((m) => m.key === active) ?? METRICS[0]!

  const data = useMemo(
    () => series.map((p) => ({ date: p.date, value: def.pick(p) })),
    [series, def],
  )
  const total = useMemo(() => totalFor(series, def), [series, def])
  const hasData = data.some((d) => d.value > 0)

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 lg:grid-cols-5 divide-x divide-y-0 divide-[rgba(10,10,10,0.08)] max-lg:divide-y max-lg:divide-x-0 max-lg:[&>*:nth-child(2)]:border-l max-lg:[&>*:nth-child(2)]:border-[rgba(10,10,10,0.08)] max-lg:[&>*:nth-child(4)]:border-l max-lg:[&>*:nth-child(4)]:border-[rgba(10,10,10,0.08)] border-b border-[rgba(10,10,10,0.08)]">
        {METRICS.map((m) => {
          const isActive = m.key === active
          const v = totalFor(series, m)
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setActive(m.key)}
              className={`group text-left px-3.5 py-2.5 transition-colors ${
                isActive ? "bg-white" : "bg-[#ECEAE2]/40 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-semibold uppercase tracking-widest ${
                  isActive ? "text-[#1F40CD]" : "text-muted-foreground"
                }`}>
                  {m.label}
                </span>
                {isActive && (
                  <span className="size-1.5 rounded-full bg-[#1F40CD]" aria-hidden />
                )}
              </div>
              <div className={`mt-1 text-[18px] font-medium tabular-nums tracking-[-0.01em] ${
                isActive ? "text-[#0A0A0A]" : "text-[#0A0A0A]/65"
              }`}>
                {m.format(v)}
              </div>
            </button>
          )
        })}
      </div>

      <div className="px-3.5 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Daily {def.label.toLowerCase()}
            </span>
            <span className="text-[10px] text-muted-foreground">· last {rangeDays} days</span>
          </div>
          <span className="text-[12px] font-medium tabular-nums text-[#0A0A0A]">
            Total {def.format(total)}
          </span>
        </div>
        {hasData ? <Chart data={data} def={def} /> : <EmptyChart />}
      </div>
    </div>
  )
}

interface ChartProps {
  data: { date: string; value: number }[]
  def: MetricDef
}

function Chart({ data, def }: ChartProps): React.JSX.Element {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1F40CD" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#1F40CD" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(10,10,10,0.06)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "rgba(10,10,10,0.55)" }}
          tickLine={false}
          axisLine={{ stroke: "rgba(10,10,10,0.12)" }}
          tickFormatter={(d) =>
            new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          }
          minTickGap={24}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "rgba(10,10,10,0.55)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => def.format(v)}
          width={56}
        />
        <Tooltip
          cursor={{ stroke: "rgba(10,10,10,0.18)", strokeDasharray: "3 3" }}
          contentStyle={{
            background: "white",
            border: "1px solid rgba(10,10,10,0.12)",
            borderRadius: 8,
            fontSize: 11,
            padding: "6px 10px",
          }}
          labelStyle={{ fontSize: 10, color: "rgba(10,10,10,0.55)", marginBottom: 2 }}
          formatter={(value: number) => [def.format(value), def.label]}
          labelFormatter={(d) =>
            new Date(d).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })
          }
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#1F40CD"
          strokeWidth={1.75}
          fill="url(#perfFill)"
          dot={false}
          activeDot={{ r: 3.5, stroke: "white", strokeWidth: 1.5, fill: "#1F40CD" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function EmptyChart(): React.JSX.Element {
  return (
    <div className="flex h-[220px] items-center justify-center text-[11px] text-muted-foreground">
      No data in this range — chart will populate once campaigns deliver.
    </div>
  )
}
