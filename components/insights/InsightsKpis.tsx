import { centsToUsd, formatCompact } from "@/lib/money"

interface Props {
  spendUsdCents: number
  impressions: number
  clicks: number
  walletConnects: number
  onChainConvs: number
}

export function InsightsKpis({ spendUsdCents, impressions, clicks, walletConnects, onChainConvs }: Props): React.JSX.Element {
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0
  const cpm = impressions > 0 ? (spendUsdCents / impressions) * 1000 / 100 : 0
  const convRate = clicks > 0 ? (onChainConvs / clicks) * 100 : 0

  const kpis: { label: string; value: string; sub?: string }[] = [
    { label: "Spend", value: centsToUsd(spendUsdCents), sub: "Last 30 days" },
    { label: "Impressions", value: formatCompact(impressions), sub: `${cpm.toFixed(2)} CPM` },
    { label: "Clicks", value: formatCompact(clicks), sub: `${ctr.toFixed(2)}% CTR` },
    { label: "Wallet connects", value: formatCompact(walletConnects) },
    { label: "On-chain conversions", value: formatCompact(onChainConvs), sub: `${convRate.toFixed(2)}% of clicks` },
  ]

  return (
    <div className="bg-white grid grid-cols-2 lg:grid-cols-5 divide-x divide-y-0 divide-[rgba(10,10,10,0.08)] max-lg:divide-y max-lg:divide-x-0 max-lg:[&>*:nth-child(2)]:border-l max-lg:[&>*:nth-child(2)]:border-[rgba(10,10,10,0.08)] max-lg:[&>*:nth-child(4)]:border-l max-lg:[&>*:nth-child(4)]:border-[rgba(10,10,10,0.08)]">
      {kpis.map((k) => (
        <div key={k.label} className="px-3 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{k.label}</div>
          <div className="mt-1 text-[18px] font-medium text-[#0A0A0A] tabular-nums tracking-[-0.01em] leading-none">{k.value}</div>
          {k.sub && <div className="mt-1 text-[10px] text-muted-foreground tabular-nums">{k.sub}</div>}
        </div>
      ))}
    </div>
  )
}
