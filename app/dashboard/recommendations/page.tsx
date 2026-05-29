import Link from "next/link"
import { redirect } from "next/navigation"
import { getCachedSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { buildRecommendations, type Severity } from "@/lib/recommendations"
import { RecommendationRow } from "@/components/recommendations/RecommendationCard"
import { SquareWandSparkleIcon } from "@/icons"
import { DashedGridShell } from "@/components/dashboard/DashedGridShell"

const VALID_SEVERITY = new Set<Severity>(["warning", "info", "opportunity"])

const FILTERS: { value: "all" | Severity; label: string }[] = [
  { value: "all", label: "All" },
  { value: "warning", label: "Action needed" },
  { value: "opportunity", label: "Optimization" },
  { value: "info", label: "Heads up" },
]

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function RecommendationsPage({ searchParams }: PageProps): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const params = await searchParams
  const severityParam = params["severity"]
  const activeFilter: "all" | Severity = VALID_SEVERITY.has(severityParam as Severity)
    ? (severityParam as Severity)
    : "all"

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

  const allRecs = buildRecommendations(campaigns)
  const counts = allRecs.reduce<Record<Severity, number>>(
    (acc, r) => ({ ...acc, [r.severity]: acc[r.severity] + 1 }),
    { warning: 0, info: 0, opportunity: 0 },
  )
  const recs = activeFilter === "all" ? allRecs : allRecs.filter((r) => r.severity === activeFilter)

  return (
    <DashedGridShell>
      <div className="flex items-end justify-between gap-2 flex-wrap">
          <div className="shrink-0 flex items-baseline gap-2">
            <h1 className="text-[#0A0A0A] tracking-[-0.02em] text-[20px] font-medium leading-none">
              Recommendations
            </h1>
            <span className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground tabular-nums">
              {allRecs.length} total
              <span className="mx-1.5 text-[#0A0A0A]/30">·</span>
              {counts.warning} action<span className="mx-1.5 text-[#0A0A0A]/30">·</span>
              {counts.opportunity} optimization<span className="mx-1.5 text-[#0A0A0A]/30">·</span>
              {counts.info} heads-up
            </span>
          </div>
        </div>

        <div className="flex items-stretch border-y border-dashed border-[rgba(10,10,10,0.12)] bg-white">
          {FILTERS.map((f, i) => {
            const active = f.value === activeFilter
            const count = f.value === "all" ? allRecs.length : counts[f.value]
            const href = f.value === "all" ? "/dashboard/recommendations" : `/dashboard/recommendations?severity=${f.value}`
            return (
              <Link
                key={f.value}
                href={href}
                className={`relative flex-1 px-3 py-2 text-left transition-colors ${
                  i > 0 ? "border-l border-dashed border-[rgba(10,10,10,0.12)]" : ""
                } ${active ? "text-[#0A0A0A]" : "text-muted-foreground hover:bg-[#0A0A0A]/2"}`}
              >
                {active && (
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-[#1F40CD]" />
                )}
                <div className={`text-[10px] font-semibold uppercase tracking-widest ${active ? "text-[#1F40CD]" : ""}`}>
                  {f.label}
                </div>
                <div className="mt-0.5 text-[14px] font-medium tabular-nums text-[#0A0A0A]">
                  {count}
                </div>
              </Link>
            )
          })}
        </div>

        {recs.length === 0 ? (
          <div className="bg-white py-16 text-center">
            <div className="mx-auto flex size-9 items-center justify-center rounded-full bg-[#1F40CD]/8">
              <SquareWandSparkleIcon className="size-4 text-[#1F40CD]" />
            </div>
            <p className="mt-3 text-[13px] font-medium text-[#0A0A0A]">
              {allRecs.length === 0 ? "All clear" : "Nothing in this filter"}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground max-w-sm mx-auto">
              {campaigns.length === 0
                ? "Create your first campaign and we'll surface tuning suggestions here."
                : activeFilter !== "all"
                ? "Try another severity filter or check back later."
                : "No issues detected. We'll keep watching for budget overruns, low CTR, idle drafts and other signals."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-dashed divide-[rgba(10,10,10,0.12)] bg-white border-y border-dashed border-[rgba(10,10,10,0.12)]">
            {recs.map((r) => (
              <RecommendationRow key={r.id} rec={r} />
            ))}
        </div>
      )}
    </DashedGridShell>
  )
}
