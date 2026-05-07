import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getOrCreatePublisher } from "@/lib/publisher"
import { loadPayoutPageData } from "@/lib/publisherWallet"
import { Card, CardContent } from "@/components/ui/card"
import { centsToUsd, formatCompact } from "@/lib/money"
import {
  SpendIcon,
  EyeScannerIcon,
  ClicksIcon,
  GaugeIcon,
  InsightsIcon,
} from "@/icons"
import { PayoutBalanceCard } from "@/components/ssp/payouts/PayoutBalanceCard"
import { PayoutAddressCard } from "@/components/ssp/payouts/PayoutAddressCard"
import { EarningsTable } from "@/components/ssp/payouts/EarningsTable"
import { StatementsTable } from "@/components/ssp/payouts/StatementsTable"
import { PayoutsLedger } from "@/components/ssp/payouts/PayoutsLedger"

export default async function PayoutsPage(): Promise<React.JSX.Element> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/ssp/sign-in")
  const publisher = await getOrCreatePublisher(session.user.id, session.user.name)
  const { wallet, earnings, statements, payouts, earnings30d } = await loadPayoutPageData(
    publisher.id,
  )

  const stats = [
    {
      label: "Net earnings (30d)",
      value: centsToUsd(earnings30d.netUsdcCents),
      icon: SpendIcon,
      tint: "bg-[#FFF3E8] text-[#C2410C]",
    },
    {
      label: "Gross (30d)",
      value: centsToUsd(earnings30d.grossUsdcCents),
      icon: InsightsIcon,
      tint: "bg-[#F0E8FF] text-[#6D28D9]",
    },
    {
      label: "Impressions (30d)",
      value: formatCompact(earnings30d.impressions),
      icon: EyeScannerIcon,
      tint: "bg-[#EAF1FF] text-[#1E40AF]",
    },
    {
      label: "Clicks (30d)",
      value: formatCompact(earnings30d.clicks),
      icon: ClicksIcon,
      tint: "bg-[#E8F5E9] text-[#15803D]",
    },
  ]

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-end justify-between border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <div>
          <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
            Payouts &{" "}
            <span className="font-instrument-serif italic font-normal text-[26px]">earnings</span>
          </h1>
          <p className="text-[11px] text-muted-foreground mt-1.5">
            Revenue share, statements, and on-chain settlement to your publisher wallet.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <GaugeIcon className="size-3" />
          <span>{(wallet.revShareBps / 100).toFixed(0)}% rev share</span>
        </div>
      </div>

      <PayoutBalanceCard wallet={wallet} />

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {stats.map(s => (
          <Card
            key={s.label}
            className="py-3 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]"
          >
            <CardContent className="px-3">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </span>
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-md ${s.tint}`}
                >
                  <s.icon className="size-3" />
                </div>
              </div>
              <div className="text-[22px] font-medium tracking-tight tabular-nums text-[#37322F] leading-none">
                {s.value}
              </div>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                <InsightsIcon className="size-3" />
                <span>last 30 days</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PayoutAddressCard wallet={wallet} />

      <StatementsTable statements={statements} />

      <EarningsTable earnings={earnings} />

      <PayoutsLedger payouts={payouts} />
    </div>
  )
}
