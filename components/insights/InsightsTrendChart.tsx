"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { centsToUsd, formatCompact } from "@/lib/money"

export interface TrendPoint {
  date: string
  spendUsdCents: number
  impressions: number
}

interface Props {
  series: TrendPoint[]
}

export function InsightsTrendChart({ series }: Props): React.JSX.Element {
  if (series.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center text-[11px] text-muted-foreground">
        No spend in the last 30 days
      </div>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="insightsSpendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#37322F" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#37322F" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(55,50,47,0.06)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "rgba(55,50,47,0.55)" }}
          tickLine={false}
          axisLine={{ stroke: "rgba(55,50,47,0.12)" }}
          tickFormatter={(d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "rgba(55,50,47,0.55)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${centsToUsd(v)}`}
          width={56}
        />
        <Tooltip
          contentStyle={{
            background: "white",
            border: "1px solid rgba(55,50,47,0.12)",
            borderRadius: 8,
            fontSize: 11,
          }}
          formatter={(value: number, name: string) => {
            if (name === "spendUsdCents") return [`$${centsToUsd(value)}`, "Spend"]
            return [formatCompact(value), "Impressions"]
          }}
          labelFormatter={(d) => new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        />
        <Area
          type="monotone"
          dataKey="spendUsdCents"
          stroke="#37322F"
          strokeWidth={1.5}
          fill="url(#insightsSpendFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
