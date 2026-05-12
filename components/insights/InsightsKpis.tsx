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
    { label: "Spend", value: `$${centsToUsd(spendUsdCents)}`, sub: "Last 30 days" },
    { label: "Impressions", value: formatCompact(impressions), sub: `${cpm.toFixed(2)} CPM` },
    { label: "Clicks", value: formatCompact(clicks), sub: `${ctr.toFixed(2)}% CTR` },
    { label: "Wallet connects", value: formatCompact(walletConnects) },
    { label: "On-chain conversions", value: formatCompact(onChainConvs), sub: `${convRate.toFixed(2)}% of clicks` },
  ]

  return (
    <div className="grid gap-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {kpis.map((k) => (
        <div
          key={k.label}
          className="rounded-lg border border-[rgba(55,50,47,0.12)] bg-white p-3.5 shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]"
        >
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k.label}</div>
          <div className="mt-1.5 text-[20px] font-medium text-[#37322F] tabular-nums leading-none">{k.value}</div>
          {k.sub && <div className="mt-1 text-[10px] text-muted-foreground tabular-nums">{k.sub}</div>}
        </div>
      ))}
    </div>
  )
}
