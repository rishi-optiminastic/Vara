import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { centsToUsd, formatCompact } from "@/lib/money"
import { chainName } from "@/lib/chains"
import type { Chain } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/campaigns/components/StatusBadge"
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  Eye,
  MousePointer,
  Activity,
  ArrowUpRight,
} from "lucide-react"

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const since = new Date()
  since.setDate(since.getDate() - 30)

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

  const stats = [
    { label: "Spend (30d)", value: centsToUsd(sums.spendUsdCents ?? 0), icon: DollarSign, tint: "bg-[#FFF3E8] text-[#C2410C]" },
    { label: "Impressions", value: formatCompact(impressions), icon: Eye, tint: "bg-[#EAF1FF] text-[#1E40AF]" },
    { label: "CTR", value: `${ctr.toFixed(2)}%`, icon: MousePointer, tint: "bg-[#F0E8FF] text-[#6D28D9]" },
    { label: "Active", value: String(activeCount), icon: Activity, tint: "bg-[#E8F5E9] text-[#15803D]" },
  ]

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-end justify-between border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <div>
          <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
            Good day,{" "}
            <span className="font-instrument-serif italic font-normal text-[26px]">
              {session.user.name?.split(" ")[0] || "there"}
            </span>
          </h1>
          <p className="text-[11px] text-muted-foreground mt-1.5">Live Web3 campaign performance.</p>
        </div>
        <Button asChild size="sm" className="h-8 gap-1.5 text-xs rounded-full px-4 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[0_0_0_2.5px_rgba(255,255,255,0.08)_inset]">
          <Link href="/dashboard/campaigns/new">
            <Sparkles className="size-3" />
            New Campaign
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="py-3 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
            <CardContent className="px-3">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{s.label}</span>
                <div className={`flex h-5 w-5 items-center justify-center rounded-md ${s.tint}`}>
                  <s.icon className="size-3" />
                </div>
              </div>
              <div className="text-[22px] font-medium tracking-tight tabular-nums text-[#37322F] leading-none">{s.value}</div>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                <TrendingUp className="size-3" />
                <span>last 30 days</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="gap-0 py-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
        <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.12)] px-3 py-2">
          <div>
            <h2 className="text-xs font-semibold text-[#37322F]">Recent Campaigns</h2>
            <p className="text-[10px] text-muted-foreground">Most recently updated</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="h-6 gap-1 text-[10px] hover:bg-[#F0ECE6]">
            <Link href="/dashboard/campaigns">View all <ArrowUpRight className="size-2.5" /></Link>
          </Button>
        </div>
        <CardContent className="p-0">
          {recent.length === 0 ? (
            <div className="px-3 py-10 text-center text-xs text-muted-foreground">
              No campaigns yet.{" "}
              <Link href="/dashboard/campaigns/new" className="font-medium text-foreground underline underline-offset-2">
                Create your first campaign
              </Link>
              .
            </div>
          ) : (
            <ul className="divide-y divide-[rgba(55,50,47,0.08)]">
              {recent.map((c) => (
                <li key={c.id} className="group flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-[#FAF8F5] transition-colors">
                  <div className="min-w-0 flex-1">
                    <Link href={`/dashboard/campaigns/${c.id}`} className="text-xs font-medium text-[#37322F] hover:underline">
                      {c.name}
                    </Link>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground">
                      <Badge variant="outline" className="h-3.5 px-1 text-[8px] uppercase tracking-widest bg-white/60 border-[rgba(55,50,47,0.16)]">
                        {c.vertical.replace("_", " ")}
                      </Badge>
                      <span>·</span>
                      <span className="tabular-nums">{centsToUsd(c.budgetUsdCents)}</span>
                      {c.targeting && c.targeting.chains.length > 0 && (
                        <>
                          <span>·</span>
                          <div className="flex gap-1">
                            {c.targeting.chains.slice(0, 3).map((ch: Chain) => (
                              <span key={ch} className="rounded-full bg-[#F0ECE6] px-1.5 py-0.5 text-[9px] font-medium text-[#37322F]">
                                {chainName(ch)}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                  <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
