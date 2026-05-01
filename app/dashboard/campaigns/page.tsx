import Link from "next/link"
import { getCachedSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { centsToUsd } from "@/lib/money"
import type { CampaignStatus, Vertical, Prisma } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CampaignsToolbar } from "@/components/campaigns/components/CampaignsToolbar"
import type { CampaignCsvRow } from "@/components/campaigns/components/CampaignsToolbar"
import { CampaignsTable } from "@/components/campaigns/components/CampaignsTable"
import type { CampaignRow } from "@/components/campaigns/components/CampaignsTable"
import { BoxPlusIcon } from "@/icons"

const VALID_STATUSES = new Set(["DRAFT", "ACTIVE", "PAUSED", "ENDED"])
const VALID_VERTICALS = new Set(["TOKEN_LAUNCH", "NFT_DROP", "DEFI", "DAPP_GROWTH", "OTHER"])

function buildOrderBy(sort: string): Prisma.CampaignOrderByWithRelationInput {
  switch (sort) {
    case "oldest": return { createdAt: "asc" }
    case "budget_desc": return { budgetUsdCents: "desc" }
    case "budget_asc": return { budgetUsdCents: "asc" }
    case "name_asc": return { name: "asc" }
    default: return { createdAt: "desc" }
  }
}

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function CampaignsListPage({ searchParams }: PageProps): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const params = await searchParams
  const q = params["q"] ?? ""
  const statusParam = params["status"] ?? ""
  const verticalParam = params["vertical"] ?? ""
  const sort = params["sort"] ?? "newest"

  const statusFilter = VALID_STATUSES.has(statusParam) ? (statusParam as CampaignStatus) : undefined
  const verticalFilter = VALID_VERTICALS.has(verticalParam) ? (verticalParam as Vertical) : undefined

  const where: Prisma.CampaignWhereInput = {
    advertiserId: advertiser.id,
    ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(verticalFilter ? { vertical: verticalFilter } : {}),
  }

  const [campaigns, totalCount] = await Promise.all([
    prisma.campaign.findMany({
      where,
      orderBy: buildOrderBy(sort),
      include: { targeting: true, _count: { select: { creatives: true } } },
    }),
    prisma.campaign.count({ where: { advertiserId: advertiser.id } }),
  ])

  const since = new Date()
  since.setDate(since.getDate() - 30)
  const metrics = campaigns.length > 0
    ? await prisma.metricDaily.groupBy({
        by: ["campaignId"],
        where: { campaignId: { in: campaigns.map((c) => c.id) }, date: { gte: since } },
        _sum: { impressions: true, clicks: true, spendUsdCents: true },
      })
    : []
  const metricsMap = new Map(metrics.map((m) => [m.campaignId, m._sum]))

  const isoDate = (d: Date): string => d.toISOString().split("T")[0] ?? ""

  const csvData: CampaignCsvRow[] = campaigns.map((c) => ({
    name: c.name,
    status: c.status,
    vertical: c.vertical,
    budget: centsToUsd(c.budgetUsdCents),
    bid: centsToUsd(c.bidUsdCents),
    dailyCap: c.dailyCapUsdCents ? centsToUsd(c.dailyCapUsdCents) : "",
    pricingModel: c.pricingModel,
    bidStrategy: c.bidStrategy,
    pacing: c.pacing,
    startDate: isoDate(c.startDate),
    endDate: c.endDate ? isoDate(c.endDate) : "",
    creatives: String(c._count.creatives),
    created: isoDate(c.createdAt),
  }))

  const rows: CampaignRow[] = campaigns.map((c) => {
    const m = metricsMap.get(c.id)
    return {
      id: c.id,
      name: c.name,
      status: c.status,
      vertical: c.vertical,
      budgetUsdCents: c.budgetUsdCents,
      bidUsdCents: c.bidUsdCents,
      chains: c.targeting?.chains ?? [],
      creativesCount: c._count.creatives,
      impressions: m?.impressions ?? 0,
      clicks: m?.clicks ?? 0,
      spendUsdCents: m?.spendUsdCents ?? 0,
    }
  })

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between gap-2 border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <div className="shrink-0">
          <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
            <span className="font-instrument-serif italic font-normal text-[26px]">Campaigns</span>
          </h1>
          <p className="text-[11px] text-muted-foreground mt-1.5">
            {campaigns.length === totalCount ? `${totalCount} total` : `${campaigns.length} of ${totalCount}`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <CampaignsToolbar totalCount={totalCount} filteredCount={campaigns.length} csvData={csvData} />
          <Button asChild size="sm" className="h-8 gap-1.5 text-xs rounded-full px-4 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(55,50,47,0.18)]">
            <Link href="/dashboard/campaigns/new"><BoxPlusIcon className="size-3" />New Campaign</Link>
          </Button>
        </div>
      </div>

      <Card className="gap-0 py-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
        <CardHeader className="border-b border-[rgba(55,50,47,0.12)] px-3 py-2 flex flex-row items-center justify-between">
          <CardTitle className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            All Campaigns
          </CardTitle>
          <span className="text-[10px] text-muted-foreground tabular-nums">Last 30 days</span>
        </CardHeader>

        <CardContent className="p-0">
          {campaigns.length === 0 ? (
            <div className="px-3 py-12 text-center text-xs text-muted-foreground">
              {totalCount === 0 ? (
                <>No campaigns yet. <Link href="/dashboard/campaigns/new" className="font-medium text-foreground underline underline-offset-2">Create one</Link>.</>
              ) : (
                "No campaigns match your filters."
              )}
            </div>
          ) : (
            <CampaignsTable rows={rows} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
