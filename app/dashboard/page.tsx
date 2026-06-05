import Link from "next/link"
import { getCachedSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { serverApi } from "@/lib/serverApi"
import { parseRange } from "@/lib/dateRange"
import { Button } from "@/components/ui/button"
import { CampaignsTable } from "@/components/campaigns/components/CampaignsTable"
import type { CampaignRow } from "@/components/campaigns/components/CampaignsTable"
import { DateRangeSelector } from "@/components/DateRangeSelector"
import { PerformanceChart } from "@/components/dashboard/PerformanceChart"
import { sampleDailySeries } from "@/lib/sampleSeries"
import { CircleOpenArrowRight, BoxPlusIcon } from "@/icons"

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

interface DailyPoint {
  date: string
  spendUsdCents: number
  impressions: number
  clicks: number
  walletConnects: number
}

interface RecentCampaign {
  id: string
  name: string
  description: string | null
  status: CampaignRow["status"]
  vertical: CampaignRow["vertical"]
  objective: CampaignRow["objective"]
  pricingModel: CampaignRow["pricingModel"]
  bidStrategy: CampaignRow["bidStrategy"]
  pacing: CampaignRow["pacing"]
  budgetUsdCents: number
  dailyCapUsdCents: number | null
  bidUsdCents: number | null
  startDate: string
  endDate: string | null
  targeting: { chains: CampaignRow["chains"] } | null
  _count: { creatives: number }
}

interface DashboardData {
  recent: RecentCampaign[]
  dailySeries: DailyPoint[]
}

export default async function DashboardPage({ searchParams }: PageProps): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")

  const params = await searchParams
  const rangeDays = parseRange(params["range"])

  const data = await serverApi<DashboardData>(`/api/page/dsp/dashboard?range=${rangeDays}`)
  const recent = data?.recent ?? []
  const dailySeriesRaw = data?.dailySeries ?? []

  const hasRealSeries = dailySeriesRaw.some(
    (p) => p.impressions > 0 || p.spendUsdCents > 0 || p.clicks > 0,
  )
  const dailySeries = hasRealSeries ? dailySeriesRaw : sampleDailySeries(rangeDays)

  const recentRows: CampaignRow[] = recent.map((c) => ({
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
    startDate: c.startDate,
    endDate: c.endDate,
    chains: c.targeting?.chains ?? [],
    creativesCount: c._count.creatives,
    impressions: 0,
    clicks: 0,
    spendUsdCents: 0,
  }))

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-end justify-between">
        <div>
          {/* <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Dashboard · Overview</div> */}
          <h1 className="mt-1.5 text-[#0A0A0A] tracking-[-0.02em] text-[22px] font-medium leading-none">
            <span className="font-instrument-serif italic font-normal text-[26px] text-[#1F40CD]">Good day, </span>
            {session.user.name?.split(" ")[0] || "there"}
          </h1>
          {/* <p className="mt-1.5 text-[11px] text-muted-foreground">Live Web3 campaign performance.</p> */}
        </div>
        <div className="flex items-center gap-2">
          <DateRangeSelector />
          <Button asChild size="sm" className="h-8 rounded-full gap-1.5 text-[11px] px-3.5 bg-[#1F40CD] text-white hover:bg-[#1A36B0]">
            <Link href="/dashboard/campaigns/new">
              <BoxPlusIcon className="size-3" />
              New campaign
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2.5">
            <h2 className="text-[#0A0A0A] tracking-[-0.015em] text-[15px] font-medium">
              <span className="font-instrument-serif italic font-normal text-[18px] text-[#1F40CD]">Daily</span> performance
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Last {rangeDays} days
            </span>
          </div>
        </div>
        <PerformanceChart series={dailySeries} rangeDays={rangeDays} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2.5">
            <h2 className="text-[#0A0A0A] tracking-[-0.015em] text-[15px] font-medium">
              <span className="font-instrument-serif italic font-normal text-[18px] text-[#1F40CD]">Recent</span> campaigns
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {recent.length} total
            </span>
            <Button
              asChild
              size="sm"
              className="h-6 gap-1 text-[10px] uppercase tracking-[0.08em] font-semibold rounded-full px-2.5 bg-[#1F40CD]/[0.06] text-[#1F40CD] hover:bg-[#1F40CD]/[0.12] shadow-none"
            >
              <Link href="/dashboard/campaigns/new">
                <BoxPlusIcon className="size-2.5" />
                Create campaign
              </Link>
            </Button>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-[11px] text-[#1F40CD] hover:bg-[#1F40CD]/6 rounded-full px-2.5"
          >
            <Link href="/dashboard/campaigns">
              View all <CircleOpenArrowRight className="size-3" />
            </Link>
          </Button>
        </div>

        {recent.length === 0 ? (
          <div className="bg-white rounded-md px-3.5 py-10 text-center text-[12px] text-muted-foreground">
            No campaigns yet.{" "}
            <Link
              href="/dashboard/campaigns/new"
              className="text-[#1F40CD] underline underline-offset-4"
            >
              Create your first campaign
            </Link>
            .
          </div>
        ) : (
          <CampaignsTable rows={recentRows} hideFooter />
        )}
      </div>
    </div>
  )
}
