"use client"

import { useEffect, useMemo, useState } from "react"
import type { MetricDaily } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { listMetrics } from "@/services/metrics"
import { centsToUsd, formatCompact } from "@/lib/money"
import { Loader2 } from "lucide-react"
import { ReportCharts } from "./ReportCharts"
import type { DailyPoint } from "./ReportCharts"

interface Props {
  campaignId: string
  days?: number
}

function seededRandom(seed: number): () => number {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function syntheticSeries(seed: string, days: number): DailyPoint[] {
  const hash = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0)
  const rng = seededRandom(hash || 1)
  const today = new Date()
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (days - 1 - i))
    const trend = 0.6 + (i / days) * 0.6
    const noise = 0.7 + rng() * 0.6
    const impressions = Math.round(1800 * trend * noise)
    const clicks = Math.round(impressions * (0.022 + rng() * 0.018))
    const wallets = Math.round(clicks * (0.18 + rng() * 0.14))
    const onchain = Math.round(wallets * (0.22 + rng() * 0.16))
    const spend = Math.round(impressions * (0.85 + rng() * 0.55))
    return {
      date: d.toISOString().slice(0, 10),
      impressions,
      clicks,
      walletConnects: wallets,
      onChainConvs: onchain,
      spendUsdCents: spend,
    }
  })
}

function isoDate(d: unknown): string {
  if (typeof d === "string") return d.slice(0, 10)
  if (d instanceof Date) return d.toISOString().slice(0, 10)
  return new Date(String(d)).toISOString().slice(0, 10)
}

function realSeries(metrics: MetricDaily[]): DailyPoint[] {
  return metrics.map((m) => ({
    date: isoDate(m.date),
    impressions: m.impressions,
    clicks: m.clicks,
    walletConnects: m.walletConnects,
    onChainConvs: m.onChainConvs,
    spendUsdCents: m.spendUsdCents,
  }))
}

export function MetricsPanel({ campaignId, days = 30 }: Props): React.JSX.Element {
  const [metrics, setMetrics] = useState<MetricDaily[] | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    setMetrics(null)
    setError("")
    listMetrics(campaignId, days)
      .then((d) => setMetrics(d.metrics))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
  }, [campaignId, days])

  const { series, isPreview } = useMemo(() => {
    if (!metrics || metrics.length === 0) {
      return { series: syntheticSeries(campaignId, days), isPreview: true }
    }
    const real = realSeries(metrics)
    const totalImpr = real.reduce((a, p) => a + p.impressions, 0)
    if (totalImpr === 0) return { series: syntheticSeries(campaignId, days), isPreview: true }
    return { series: real, isPreview: false }
  }, [metrics, campaignId, days])

  if (error) {
    return <Card><CardContent className="p-4 text-xs text-red-600">{error}</CardContent></Card>
  }
  if (!metrics) {
    return (
      <Card><CardContent className="p-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="size-3 animate-spin" />Loading…
      </CardContent></Card>
    )
  }

  const sum = series.reduce(
    (acc, m) => ({
      impressions: acc.impressions + m.impressions,
      clicks: acc.clicks + m.clicks,
      walletConnects: acc.walletConnects + m.walletConnects,
      onChainConvs: acc.onChainConvs + m.onChainConvs,
      spend: acc.spend + m.spendUsdCents,
    }),
    { impressions: 0, clicks: 0, walletConnects: 0, onChainConvs: 0, spend: 0 },
  )

  const ctr = sum.impressions > 0 ? (sum.clicks / sum.impressions) * 100 : 0

  const kpis = [
    { label: "Spend", value: centsToUsd(sum.spend), tint: "text-[#C2410C]" },
    { label: "Impressions", value: formatCompact(sum.impressions), tint: "text-[#1E40AF]" },
    { label: "Clicks", value: formatCompact(sum.clicks), tint: "text-[#6D28D9]" },
    { label: "CTR", value: `${ctr.toFixed(2)}%`, tint: "text-[#37322F]" },
    { label: "Wallet conn.", value: formatCompact(sum.walletConnects), tint: "text-[#15803D]" },
    { label: "On-chain conv.", value: formatCompact(sum.onChainConvs), tint: "text-[#A16207]" },
  ]

  return (
    <div className="flex flex-col gap-3">
      {isPreview && (
        <div className="flex items-center gap-2 rounded-full border border-dashed border-[rgba(55,50,47,0.18)] bg-white/50 px-3 py-1.5">
          <span className="size-1.5 rounded-full bg-[#A16207] shadow-[0_0_0_2px_rgba(161,98,7,0.18)]" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Preview data
          </span>
          <span className="text-[11px] text-muted-foreground">
            Synthetic last-30-day series — real metrics appear here once delivery starts.
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-6">
        {kpis.map((k) => (
          <Card key={k.label} className="py-3 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
            <CardContent className="px-3">
              <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1.5">
                {k.label}
              </div>
              <div className={`text-base font-medium tracking-tight tabular-nums leading-none ${k.tint}`}>
                {k.value}
              </div>
              <div className="mt-1.5 text-[10px] text-muted-foreground">last {days} days</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ReportCharts series={series} totals={sum} />
    </div>
  )
}
