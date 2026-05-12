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
  if (!session) redirect("/dsp/sign-in")
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
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-end justify-between gap-3 border-b border-[#37322F]/15 pb-5">
        <div className="shrink-0">
          <div className="text-[10px] tracking-[0.16em] text-[#37322F]/55">DASHBOARD · CAMPAIGNS</div>
          <h1 className="mt-2 text-[#1f40cd] uppercase tracking-[-0.01em] text-2xl md:text-3xl font-medium leading-[0.95]">
            Campaigns
          </h1>
          <p className="mt-2 text-[12px] text-[#37322F]/65 tracking-[0.04em]">
            {campaigns.length === totalCount ? `${totalCount} TOTAL` : `${campaigns.length} OF ${totalCount}`}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <CampaignsToolbar totalCount={totalCount} filteredCount={campaigns.length} csvData={csvData} />
          <Button asChild size="sm" className="h-9 rounded-none gap-2 text-[11px] tracking-[0.14em] px-5 bg-[#1f40cd] text-white hover:opacity-90">
            <Link href="/dashboard/campaigns/new"><BoxPlusIcon className="size-3" />NEW CAMPAIGN</Link>
          </Button>
        </div>
      </div>

      <Card className="gap-0 py-0 rounded-none border border-[#37322F]/15 shadow-none bg-transparent">
        <CardHeader className="border-b border-[#37322F]/15 px-5 py-4 flex flex-row items-center justify-between">
          <div>
            <div className="text-[10px] tracking-[0.16em] text-[#37322F]/55">PROGRAMME</div>
            <CardTitle className="mt-1 text-[#1f40cd] tracking-[-0.01em] text-lg font-medium">
              All campaigns
            </CardTitle>
          </div>
          <span className="text-[10px] tracking-[0.14em] text-[#37322F]/55 tabular-nums">LAST 30 DAYS</span>
        </CardHeader>

        <CardContent className="p-0">
          {campaigns.length === 0 ? (
            <div className="px-5 py-16 text-center text-[12px] text-[#37322F]/65">
              {totalCount === 0 ? (
                <>No campaigns yet. <Link href="/dashboard/campaigns/new" className="text-[#1f40cd] underline underline-offset-4">Create one</Link>.</>
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
