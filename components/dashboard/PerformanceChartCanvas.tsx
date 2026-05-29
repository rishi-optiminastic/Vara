"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { TooltipProps } from "recharts"

export interface ChartMetric {
  label: string
  format: (n: number) => string
}

interface CanvasProps {
  data: { date: string; value: number }[]
  metric: ChartMetric
  avg: number
}

export function PerformanceChartCanvas({ data, metric, avg }: CanvasProps): React.JSX.Element {
  const maxPoint = data.reduce((m, d) => (d.value > m.value ? d : m), data[0]!)
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 28, right: 16, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
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
          tickFormatter={(v) => metric.format(v)}
          width={48}
        />
        <Tooltip
          cursor={{ stroke: "rgba(10,10,10,0.2)", strokeDasharray: "3 3" }}
          content={<ChartTooltip metric={metric} avg={avg} />}
        />
        {avg > 0 && (
          <ReferenceLine
            y={avg}
            stroke="rgba(10,10,10,0.2)"
            strokeDasharray="2 3"
            strokeWidth={1}
          />
        )}
        <Area
          type="monotone"
          dataKey="value"
          stroke="#1F40CD"
          strokeWidth={1.75}
          fill="url(#perfFill)"
          dot={false}
          activeDot={{ r: 4, stroke: "white", strokeWidth: 2, fill: "#1F40CD" }}
          isAnimationActive
          animationDuration={550}
          animationEasing="ease-out"
        />
        {maxPoint.value > 0 && (
          <ReferenceDot
            x={maxPoint.date}
            y={maxPoint.value}
            r={3}
            fill="#1F40CD"
            stroke="white"
            strokeWidth={1.5}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
}

type TooltipExtras = { metric: ChartMetric; avg: number }

function ChartTooltip({
  metric,
  avg,
  active,
  payload,
  label,
}: TooltipProps<number, string> & TooltipExtras): React.JSX.Element | null {
  if (!active || !payload || payload.length === 0) return null
  const value = Number(payload[0]?.value ?? 0)
  const delta = avg > 0 ? ((value - avg) / avg) * 100 : 0
  const up = delta >= 0
  const date = new Date(String(label)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
  return (
    <div className="rounded-lg border border-[rgba(10,10,10,0.08)] bg-white px-3 py-2 shadow-[0_10px_28px_-10px_rgba(31,64,205,0.22)]">
      <div className="text-[9px] font-semibold uppercase tracking-widest text-[#0A0A0A]/55">{date}</div>
      <div className="mt-0.5 flex items-baseline gap-2">
        <span className="text-[16px] font-medium tabular-nums tracking-[-0.01em] text-[#0A0A0A]">
          {metric.format(value)}
        </span>
        {avg > 0 && (
          <span className={`text-[10px] font-medium tabular-nums ${up ? "text-[#0A0A0A]/65" : "text-[#0A0A0A]/45"}`}>
            {up ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}% vs avg
          </span>
        )}
      </div>
    </div>
  )
}
