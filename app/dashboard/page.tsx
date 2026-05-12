import Link from "next/link"
import { getCachedSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { centsToUsd, formatCompact } from "@/lib/money"
import { chainName } from "@/lib/chains"
import { parseRange, rangeSinceDate, rangeShortLabel } from "@/lib/dateRange"
import type { Chain } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/campaigns/components/StatusBadge"
import { DateRangeSelector } from "@/components/DateRangeSelector"
import {
  InsightsIcon,
  SpendIcon,
  EyeScannerIcon,
  ClicksIcon,
  GaugeIcon,
  CircleOpenArrowRight,
  BoxPlusIcon,
} from "@/icons"

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function DashboardPage({ searchParams }: PageProps): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const params = await searchParams
  const rangeDays = parseRange(params["range"])
  const since = rangeSinceDate(rangeDays)

  const [agg, activeCount, recent] = await Promise.all([
    prisma.metricDaily.aggregate({
      where: { campaign: { advertiserId: advertiser.id }, date: { gte: since } },
      _sum: { spendUsdCents: true, impressions: true, clicks: true, walletConnects: true },
    }),
    prisma.campaign.count({ where: { advertiserId: advertiser.id, status: "ACTIVE" } }),
    prisma.campaign.findMany({
      where: { advertiserId: advertiser.id },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { targeting: true },
    }),
  ])

  const sums = agg._sum
  const impressions = sums.impressions ?? 0
  const clicks = sums.clicks ?? 0
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0

  const walletConnects = sums.walletConnects ?? 0
  const cpm = impressions > 0 ? ((sums.spendUsdCents ?? 0) / impressions) * 1000 / 100 : 0

  const stats = [
    { label: `Spend · ${rangeShortLabel(rangeDays)}`, value: centsToUsd(sums.spendUsdCents ?? 0), icon: SpendIcon, sub: `${rangeDays}D ROLLING` },
    { label: "Impressions", value: formatCompact(impressions), icon: EyeScannerIcon, sub: `${rangeDays}D ROLLING` },
    { label: "CTR", value: `${ctr.toFixed(2)}%`, icon: ClicksIcon, sub: `${formatCompact(clicks)} CLICKS` },
    { label: "Active campaigns", value: String(activeCount), icon: GaugeIcon, sub: "LIVE NOW" },
  ]

  const meta = [
    { label: "Wallet connects", value: formatCompact(walletConnects) },
    { label: "Avg CPM", value: cpm > 0 ? `$${cpm.toFixed(2)}` : "—" },
    { label: "Settlement", value: "USDC · Base" },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-end justify-between border-b border-[rgba(55,50,47,0.15)] pb-5">
        <div>
          <div className="text-[10px] tracking-[0.16em] text-[#37322F]/55">DASHBOARD · OVERVIEW</div>
          <h1 className="mt-2 text-[#1f40cd] uppercase tracking-[-0.01em] text-2xl md:text-3xl font-medium leading-[0.95]">
            Good day, {session.user.name?.split(" ")[0] || "there"}
          </h1>
          <p className="mt-2 text-[12px] text-[#37322F]/65">Live Web3 campaign performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeSelector />
          <Button asChild size="sm" className="h-9 rounded-none gap-2 text-[11px] tracking-[0.14em] px-5 bg-[#1f40cd] text-white hover:opacity-90">
            <Link href="/dashboard/campaigns/new">
              <BoxPlusIcon className="size-3" />
              NEW CAMPAIGN
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-[#1f40cd] text-white grid grid-cols-2 lg:grid-cols-4 divide-x divide-y-0 divide-white/15 max-lg:divide-y max-lg:divide-x-0 max-lg:[&>*:nth-child(2)]:border-l max-lg:[&>*:nth-child(2)]:border-white/15 max-lg:[&>*:nth-child(4)]:border-l max-lg:[&>*:nth-child(4)]:border-white/15">
        {stats.map((s) => (
          <div key={s.label} className="px-6 py-7 flex flex-col gap-3 min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] opacity-80">{s.label}</span>
              <s.icon className="size-3.5 opacity-70" />
            </div>
            <div className="text-3xl font-medium tracking-[-0.02em] tabular-nums leading-none mt-auto">
              {s.value}
            </div>
            <div className="text-[10px] tracking-[0.14em] opacity-75">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-0 border border-[#37322F]/15 divide-x divide-[#37322F]/15">
        {meta.map((m) => (
          <div key={m.label} className="px-5 py-4">
            <div className="text-[10px] tracking-[0.14em] text-[#37322F]/55">{m.label.toUpperCase()}</div>
            <div className="mt-1 text-[18px] font-medium tabular-nums text-[#1f40cd] tracking-[-0.01em]">
              {m.value}
            </div>
          </div>
        ))}
      </div>

      <Card className="gap-0 py-0 rounded-none border border-[#37322F]/15 shadow-none bg-transparent">
        <div className="flex items-center justify-between border-b border-[#37322F]/15 px-5 py-4">
          <div>
            <div className="text-[10px] tracking-[0.16em] text-[#37322F]/55">PROGRAMME · LATEST</div>
            <h2 className="mt-1 text-[#1f40cd] tracking-[-0.01em] text-lg font-medium">
              Recent campaigns
            </h2>
          </div>
          <Button asChild variant="ghost" size="sm" className="h-8 gap-1 text-[11px] tracking-[0.14em] text-[#1f40cd] hover:bg-[#1f40cd]/8">
            <Link href="/dashboard/campaigns">VIEW ALL <CircleOpenArrowRight className="size-3" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-12 gap-x-4 px-5 py-3 border-b border-[#37322F]/15 text-[10px] tracking-[0.14em] text-[#37322F]/55">
          <div className="col-span-5">CAMPAIGN</div>
          <div className="col-span-2">BUDGET</div>
          <div className="col-span-3">CHAINS</div>
          <div className="col-span-2 text-right">STATUS</div>
        </div>
        <CardContent className="p-0">
          {recent.length === 0 ? (
            <div className="px-5 py-12 text-center text-[12px] text-[#37322F]/65">
              No campaigns yet.{" "}
              <Link href="/dashboard/campaigns/new" className="text-[#1f40cd] underline underline-offset-4">
                Create your first campaign
              </Link>
              .
            </div>
          ) : (
            <ul>
              {recent.map((c) => (
                <li
                  key={c.id}
                  className="group grid grid-cols-12 gap-x-4 items-center px-5 py-4 border-b border-dashed border-[#37322F]/20 last:border-b-0 hover:bg-[#1f40cd]/4 transition-colors"
                >
                  <div className="col-span-5 min-w-0">
                    <Link href={`/dashboard/campaigns/${c.id}`} className="text-[14px] font-medium text-[#1f40cd] hover:underline underline-offset-4">
                      {c.name}
                    </Link>
                    <p className="mt-0.5 text-[11px] text-[#37322F]/55 tracking-[0.06em] uppercase">
                      {c.vertical.replace("_", " ")}
                    </p>
                  </div>
                  <div className="col-span-2 text-[12px] text-[#37322F]/85 tabular-nums">
                    {centsToUsd(c.budgetUsdCents)}
                  </div>
                  <div className="col-span-3 flex gap-1.5 flex-wrap">
                    {c.targeting?.chains.length ? (
                      c.targeting.chains.slice(0, 3).map((ch: Chain) => (
                        <span key={ch} className="border border-[#1f40cd]/30 px-1.5 py-0.5 text-[10px] tracking-[0.06em] text-[#1f40cd] uppercase">
                          {chainName(ch)}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-[#37322F]/35">—</span>
                    )}
                  </div>
                  <div className="col-span-2 flex justify-end items-center gap-2">
                    <StatusBadge status={c.status} />
                    <CircleOpenArrowRight className="size-3.5 text-[#1f40cd] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
