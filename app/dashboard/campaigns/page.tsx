import Link from "next/link"
import { getCachedSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { centsToUsd } from "@/lib/money"
import type { CampaignStatus, Vertical, Prisma } from "@prisma/client"
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
      description: c.description,
      status: c.status,
      vertical: c.vertical,
      objective: c.objective,
      pricingModel: c.pricingModel,
      bidStrategy: c.bidStrategy,
      pacing: c.pacing,
      budgetUsdCents: c.budgetUsdCents,
      dailyCapUsdCents: c.dailyCapUsdCents,
      bidUsdCents: c.bidUsdCents,
      startDate: c.startDate.toISOString(),
      endDate: c.endDate ? c.endDate.toISOString() : null,
      chains: c.targeting?.chains ?? [],
      creativesCount: c._count.creatives,
      impressions: m?.impressions ?? 0,
      clicks: m?.clicks ?? 0,
      spendUsdCents: m?.spendUsdCents ?? 0,
    }
  })

  return (
    <div className="relative min-h-full">
      {/* Dashed vertical grid lines matching the marketing site's typographic
          grid. Sits behind the content, only visible in the gutters / above
          the table — the white table rows sit on top. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 border-l border-dashed border-[rgba(10,10,10,0.08)] first:border-l-0 last:border-r"
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col gap-2.5 p-3">
        <div className="flex items-end justify-between gap-2">
          <div className="shrink-0 flex items-baseline gap-2">
            <h1 className="text-[#0A0A0A] tracking-[-0.02em] text-[20px] font-medium leading-none">
              Campaigns
            </h1>
            <span className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground tabular-nums">
              {campaigns.length === totalCount ? `${totalCount} total` : `${campaigns.length} of ${totalCount}`}
              <span className="mx-1.5 text-[#0A0A0A]/30">·</span>Last 30 days
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <CampaignsToolbar totalCount={totalCount} filteredCount={campaigns.length} csvData={csvData} />
            <Button asChild size="sm" className="h-8 rounded-full gap-1.5 text-[11px] px-3.5 bg-[#1F40CD] text-white hover:bg-[#1A36B0]">
              <Link href="/dashboard/campaigns/new"><BoxPlusIcon className="size-3" />New campaign</Link>
            </Button>
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="bg-white rounded-md px-3 py-10 text-center text-[12px] text-muted-foreground">
            {totalCount === 0 ? (
              <>No campaigns yet. <Link href="/dashboard/campaigns/new" className="text-[#1F40CD] underline underline-offset-4">Create one</Link>.</>
            ) : (
              "No campaigns match your filters."
            )}
          </div>
        ) : (
          <CampaignsTable rows={rows} />
        )}
      </div>
    </div>
  )
}
