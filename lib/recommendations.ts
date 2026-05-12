import type { Campaign, Creative, Targeting, MetricDaily, Prisma } from "@prisma/client"

export type Severity = "warning" | "info" | "opportunity"

export interface Recommendation {
  id: string
  severity: Severity
  title: string
  body: string
  campaignId?: string
  campaignName?: string
  ctaLabel: string
  ctaHref: string
}

type CampaignWithRels = Campaign & {
  targeting: Targeting | null
  creatives: Creative[]
  metrics: Pick<MetricDaily, "spendUsdCents" | "impressions" | "clicks" | "date">[]
}

const DAYS_DRAFT_THRESHOLD = 7
const LOW_CTR_BPS = 50 // 0.50%
const NEAR_BUDGET_RATIO = 0.85
const MIN_IMPRESSIONS_FOR_CTR = 1_000

export function buildRecommendations(campaigns: CampaignWithRels[]): Recommendation[] {
  const out: Recommendation[] = []
  const now = Date.now()

  for (const c of campaigns) {
    const totals = c.metrics.reduce(
      (acc, m) => ({
        spend: acc.spend + m.spendUsdCents,
        impressions: acc.impressions + m.impressions,
        clicks: acc.clicks + m.clicks,
      }),
      { spend: 0, impressions: 0, clicks: 0 },
    )

    if (c.status === "DRAFT") {
      const daysOld = Math.floor((now - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      if (daysOld >= DAYS_DRAFT_THRESHOLD) {
        out.push(rec(c, "warning",
          "Draft sitting idle",
          `Created ${daysOld} days ago and never launched. Activate it or archive to keep your dashboard clean.`,
          "Open campaign"))
      }
    }

    if (c.creatives.length === 0 && c.status !== "ENDED") {
      out.push(rec(c, "warning",
        "No creatives uploaded",
        "Campaign can't serve impressions until you add at least one ad. Upload a creative to start spending.",
        "Add ad", `/dashboard/ads/new?campaign=${c.id}`))
    }

    if (!c.targeting || (c.targeting.chains.length === 0 && c.targeting.geos.length === 0 && c.targeting.deviceTypes.length === 0)) {
      out.push(rec(c, "info",
        "No targeting set",
        "Without chains, geos, or device targeting this campaign bids on every available impression — likely overspending.",
        "Edit targeting"))
    }

    if (c.status === "ACTIVE" && totals.spend >= c.budgetUsdCents * NEAR_BUDGET_RATIO) {
      const pct = Math.round((totals.spend / c.budgetUsdCents) * 100)
      out.push(rec(c, "warning",
        `Budget ${pct}% spent`,
        `Approaching cap. Increase budget if performance is good, or pause to avoid overrun.`,
        "Adjust budget"))
    }

    if (totals.impressions >= MIN_IMPRESSIONS_FOR_CTR) {
      const ctrBps = Math.round((totals.clicks / totals.impressions) * 10_000)
      if (ctrBps < LOW_CTR_BPS) {
        out.push(rec(c, "opportunity",
          `Low CTR (${(ctrBps / 100).toFixed(2)}%)`,
          `Below 0.50%. Try refreshing creatives, narrowing targeting, or testing a different bid strategy.`,
          "Open campaign"))
      }
    }

    if (c.status === "ACTIVE" && totals.spend === 0 && totals.impressions === 0) {
      out.push(rec(c, "info",
        "Active but no delivery",
        "No impressions in the last 30 days. Likely causes: bid too low, targeting too narrow, or creative review pending.",
        "Open campaign"))
    }

    if (c.endDate && new Date(c.endDate).getTime() < now && c.status === "ACTIVE") {
      out.push(rec(c, "warning",
        "End date in the past",
        "Campaign is ACTIVE but its end date has passed. Update the schedule or archive it.",
        "Edit schedule"))
    }
  }

  return out.sort((a, b) => severityRank(a.severity) - severityRank(b.severity))
}

function rec(c: CampaignWithRels, severity: Severity, title: string, body: string, ctaLabel: string, ctaHref?: string): Recommendation {
  return {
    id: `${c.id}:${title}`,
    severity,
    title,
    body,
    campaignId: c.id,
    campaignName: c.name,
    ctaLabel,
    ctaHref: ctaHref ?? `/dashboard/campaigns/${c.id}`,
  }
}

function severityRank(s: Severity): number {
  return s === "warning" ? 0 : s === "info" ? 1 : 2
}

export type CampaignRecsQuery = Prisma.CampaignFindManyArgs
