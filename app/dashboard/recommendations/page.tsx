import { redirect } from "next/navigation"
import { getCachedSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { buildRecommendations, type Severity } from "@/lib/recommendations"
import { RecommendationCard } from "@/components/recommendations/RecommendationCard"
import { Card, CardContent } from "@/components/ui/card"
import { SquareWandSparkleIcon } from "@/icons"

export default async function RecommendationsPage(): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const since = new Date()
  since.setDate(since.getDate() - 30)

  const campaigns = await prisma.campaign.findMany({
    where: { advertiserId: advertiser.id },
    include: {
      targeting: true,
      creatives: true,
      metrics: {
        where: { date: { gte: since } },
        select: { spendUsdCents: true, impressions: true, clicks: true, date: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const recs = buildRecommendations(campaigns)
  const counts = recs.reduce<Record<Severity, number>>(
    (acc, r) => ({ ...acc, [r.severity]: acc[r.severity] + 1 }),
    { warning: 0, info: 0, opportunity: 0 },
  )

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
          <span className="font-instrument-serif italic font-normal text-[26px]">Recommendations</span>
        </h1>
        <p className="text-[11px] text-muted-foreground mt-1.5">
          Auto-generated suggestions across {campaigns.length} {campaigns.length === 1 ? "campaign" : "campaigns"}.
          {" "}{counts.warning} action needed · {counts.info} heads up · {counts.opportunity} optimization
        </p>
      </div>

      {recs.length === 0 ? (
        <Card className="border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#F0F7E8]">
              <SquareWandSparkleIcon className="size-5 text-[#3F6212]" />
            </div>
            <p className="mt-3 text-sm font-medium text-[#37322F]">All clear</p>
            <p className="mt-1 text-[11px] text-muted-foreground max-w-sm">
              {campaigns.length === 0
                ? "Create your first campaign and we'll surface tuning suggestions here."
                : "No issues detected. We'll keep watching for budget overruns, low CTR, idle drafts and other signals."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2.5 md:grid-cols-2">
          {recs.map((r) => (
            <RecommendationCard key={r.id} rec={r} />
          ))}
        </div>
      )}
    </div>
  )
}
