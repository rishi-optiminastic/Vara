import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { centsToUsd } from "@/lib/money"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/campaigns/components/StatusBadge"
import { CampaignActions } from "@/components/campaigns/components/CampaignActions"
import { CampaignOverview } from "@/components/campaigns/components/CampaignOverview"
import { TargetingForm } from "@/components/campaigns/components/TargetingForm"
import { MetricsPanel } from "@/components/campaigns/components/MetricsPanel"
import { ChevronLeft, Image as ImageIcon } from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CampaignDetailPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const [campaign, segments, agg] = await Promise.all([
    prisma.campaign.findFirst({
      where: { id, advertiserId: advertiser.id },
      include: { targeting: true, creatives: true },
    }),
    prisma.walletSegment.findMany({ orderBy: { name: "asc" } }),
    prisma.metricDaily.aggregate({
      where: { campaignId: id },
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
          <ChevronLeft className="size-3" />Campaigns
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
          <CampaignActions id={campaign.id} status={campaign.status} />
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="h-8 bg-[#F0ECE6] border border-[rgba(55,50,47,0.08)] p-0.5">
          <TabsTrigger
            value="overview"
            className="h-7 text-xs data-[state=active]:bg-white data-[state=active]:shadow-[0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(55,50,47,0.06)]"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="targeting"
            className="h-7 text-xs data-[state=active]:bg-white data-[state=active]:shadow-[0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(55,50,47,0.06)]"
          >
            Targeting
          </TabsTrigger>
          <TabsTrigger
            value="creatives"
            className="h-7 text-xs data-[state=active]:bg-white data-[state=active]:shadow-[0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(55,50,47,0.06)]"
          >
            Creatives
            <span className="ml-1.5 rounded-full bg-[rgba(55,50,47,0.08)] px-1.5 py-px text-[9px] tabular-nums">
              {creativeCount}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="reporting"
            className="h-7 text-xs data-[state=active]:bg-white data-[state=active]:shadow-[0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(55,50,47,0.06)]"
          >
            Reporting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-3">
          <CampaignOverview campaign={campaign} metrics={metrics} segments={segments} />
        </TabsContent>

        <TabsContent value="targeting" className="mt-3">
          <TargetingForm campaignId={campaign.id} initial={campaign.targeting} segments={segments} />
        </TabsContent>

        <TabsContent value="creatives" className="mt-3">
          <CreativesEmpty count={creativeCount} />
        </TabsContent>

        <TabsContent value="reporting" className="mt-3">
          <MetricsPanel campaignId={campaign.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CreativesEmpty({ count }: { count: number }): React.JSX.Element {
  return (
    <div className="rounded-xl border border-dashed border-[rgba(55,50,47,0.18)] bg-white/50 p-10 text-center">
      <div className="mx-auto mb-3 flex size-9 items-center justify-center rounded-full bg-[#F0ECE6]">
        <ImageIcon className="size-4 text-muted-foreground" />
      </div>
      <p className="text-xs font-medium text-[#37322F]">{count === 0 ? "No creatives yet" : `${count} creative${count > 1 ? "s" : ""}`}</p>
      <p className="text-[11px] text-muted-foreground mt-1">
        Creative upload is coming soon. The data model is in place.
      </p>
    </div>
  )
}
