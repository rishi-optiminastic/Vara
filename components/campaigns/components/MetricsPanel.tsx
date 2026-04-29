"use client"

import { useEffect, useState } from "react"
import type { MetricDaily } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { listMetrics } from "@/services/metrics"
import { centsToUsd, formatCompact } from "@/lib/money"
import { Loader2 } from "lucide-react"

interface Props {
  campaignId: string
}

export function MetricsPanel({ campaignId }: Props): React.JSX.Element {
  const [metrics, setMetrics] = useState<MetricDaily[] | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    listMetrics(campaignId, 30)
      .then((d) => setMetrics(d.metrics))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
  }, [campaignId])

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

  const sum = metrics.reduce(
    (acc, m) => ({
      impressions: acc.impressions + m.impressions,
      clicks: acc.clicks + m.clicks,
      walletConnects: acc.walletConnects + m.walletConnects,
      onChainConvs: acc.onChainConvs + m.onChainConvs,
      spend: acc.spend + m.spendUsdCents,
    }),
    { impressions: 0, clicks: 0, walletConnects: 0, onChainConvs: 0, spend: 0 },
  )
  const max = Math.max(1, ...metrics.map((m) => m.spendUsdCents))

  const kpis = [
    { label: "Spend", value: centsToUsd(sum.spend) },
    { label: "Impressions", value: formatCompact(sum.impressions) },
    { label: "Clicks", value: formatCompact(sum.clicks) },
    { label: "Wallet conn.", value: formatCompact(sum.walletConnects) },
    { label: "On-chain conv.", value: formatCompact(sum.onChainConvs) },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
        {kpis.map((k) => (
          <Card key={k.label} className="py-3 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
            <CardContent className="px-3">
              <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1.5">{k.label}</div>
              <div className="text-base font-medium tracking-tight tabular-nums text-[#37322F] leading-none">{k.value}</div>
              <div className="mt-1.5 text-[10px] text-muted-foreground">last 30 days</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="gap-0 py-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
        <div className="border-b border-[rgba(55,50,47,0.12)] px-3 py-2">
          <h3 className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Daily Spend</h3>
        </div>
        <CardContent className="px-3 py-3">
          {metrics.length === 0 ? (
            <p className="text-xs text-muted-foreground py-8 text-center">No metrics yet for this campaign.</p>
          ) : (
            <div className="flex h-32 items-end gap-1">
              {metrics.map((m) => (
                <div
                  key={m.id}
                  className="flex-1 rounded-sm bg-[#37322F]/85 hover:bg-[#37322F] transition-colors"
                  style={{ height: `${(m.spendUsdCents / max) * 100}%` }}
                  title={`${m.date.toString().slice(0, 10)}: ${centsToUsd(m.spendUsdCents)}`}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
