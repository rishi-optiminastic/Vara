import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getCachedSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { centsToUsd } from "@/lib/money"
import { parseRange, rangeSinceDate } from "@/lib/dateRange"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/campaigns/components/StatusBadge"
import { CampaignActions } from "@/components/campaigns/components/CampaignActions"
import { CampaignOverview } from "@/components/campaigns/components/CampaignOverview"
import { TargetingForm } from "@/components/campaigns/components/TargetingForm"
import { MetricsPanel } from "@/components/campaigns/components/MetricsPanel"
import { CampaignTabs } from "@/components/campaigns/components/CampaignTabs"
import { DateRangeSelector } from "@/components/DateRangeSelector"
import { ChevronLeftIcon, ImageSparkleIcon } from "@/icons"
interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function CampaignDetailPage({ params, searchParams }: PageProps): Promise<React.JSX.Element> {
  const { id } = await params
  const sp = await searchParams
  const rangeDays = parseRange(sp["range"])
  const since = rangeSinceDate(rangeDays)
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const [campaign, segments, agg] = await Promise.all([
    prisma.campaign.findFirst({
      where: { id, advertiserId: advertiser.id },
      include: { targeting: true, creatives: true },
    }),
    prisma.walletSegment.findMany({ orderBy: { name: "asc" } }),
    prisma.metricDaily.aggregate({
      where: { campaignId: id, date: { gte: since } },
      _sum: {
        spendUsdCents: true,
        impressions: true,
        clicks: true,
        walletConnects: true,
        onChainConvs: true,
      },
    }),
  ])

  if (!campaign) notFound()

  const metrics = {
    spendUsdCents: agg._sum.spendUsdCents ?? 0,
    impressions: agg._sum.impressions ?? 0,
    clicks: agg._sum.clicks ?? 0,
    walletConnects: agg._sum.walletConnects ?? 0,
    onChainConvs: agg._sum.onChainConvs ?? 0,
  }

  const creativeCount = campaign.creatives.length

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <Link
          href="/dashboard/campaigns"
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-[#37322F] transition-colors"
        >
          <ChevronLeftIcon className="size-3" />Campaigns
        </Link>
        <div className="flex items-start justify-between gap-3 mt-1.5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none truncate">
                {campaign.name}
              </h1>
              <StatusBadge status={campaign.status} />
              <Badge
                variant="outline"
                className="h-4 px-1.5 text-[9px] uppercase tracking-widest bg-white/60 border-[rgba(55,50,47,0.16)]"
              >
                {campaign.vertical.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              {centsToUsd(campaign.budgetUsdCents)} budget · {centsToUsd(campaign.bidUsdCents)} CPM ·{" "}
              <span className="capitalize">{campaign.objective.replace(/_/g, " ").toLowerCase()}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <DateRangeSelector />
            <CampaignActions id={campaign.id} status={campaign.status} />
          </div>
        </div>
      </div>

      <CampaignTabs
          creativeCount={creativeCount}
          overview={<CampaignOverview campaign={campaign} metrics={metrics} segments={segments} rangeDays={rangeDays} />}
          targeting={<TargetingForm campaignId={campaign.id} initial={campaign.targeting} segments={segments} />}
          creatives={<CreativesEmpty count={creativeCount} />}
          reporting={<MetricsPanel campaignId={campaign.id} days={rangeDays} />}
        />
    </div>
  )
}

function CreativesEmpty({ count }: { count: number }): React.JSX.Element {
  return (
    <div className="rounded-xl border border-dashed border-[rgba(55,50,47,0.18)] bg-white/50 p-10 text-center">
      <div className="mx-auto mb-3 flex size-9 items-center justify-center rounded-full bg-[#F0ECE6]">
        <ImageSparkleIcon className="size-4 text-muted-foreground" />
      </div>
      <p className="text-xs font-medium text-[#37322F]">{count === 0 ? "No creatives yet" : `${count} creative${count > 1 ? "s" : ""}`}</p>
      <p className="text-[11px] text-muted-foreground mt-1">
        Creative upload is coming soon. The data model is in place.
      </p>
    </div>
  )
}
