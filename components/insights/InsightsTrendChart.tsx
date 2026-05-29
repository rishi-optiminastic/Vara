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
      <AreaChart data={series} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="insightsSpendFill" x1="0" y1="0" x2="0" y2="1">
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
          tickFormatter={(v) => centsToUsd(v)}
          width={56}
        />
        <Tooltip
          cursor={{ stroke: "rgba(10,10,10,0.2)", strokeDasharray: "3 3" }}
          contentStyle={{
            background: "white",
            border: "1px solid rgba(10,10,10,0.08)",
            borderRadius: 8,
            fontSize: 11,
            padding: "6px 10px",
            boxShadow: "0 10px 28px -10px rgba(31,64,205,0.22)",
          }}
          labelStyle={{ fontSize: 9, color: "rgba(10,10,10,0.55)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}
          formatter={(value: number, name: string) => {
            if (name === "spendUsdCents") return [centsToUsd(value), "Spend"]
            return [formatCompact(value), "Impressions"]
          }}
          labelFormatter={(d) => new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        />
        <Area
          type="monotone"
          dataKey="spendUsdCents"
          stroke="#1F40CD"
          strokeWidth={1.75}
          fill="url(#insightsSpendFill)"
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
