import { prisma } from "@/lib/prisma"
import type { CampaignStatus, Objective, Vertical, PricingModel, Pacing } from "@prisma/client"

export interface CampaignDetail {
  id: string
  name: string
  status: CampaignStatus
  vertical: Vertical
  objective: Objective
  pricingModel: PricingModel
  pacing: Pacing
  budgetUsdCents: number
  dailyCapUsdCents: number | null
  bidUsdCents: number
  startDate: Date
  endDate: Date | null
  adGroupsCount: number
  creativesCount: number
  spentUsdCents: number
  impressions: number
  clicks: number
}

export async function fetchCampaignDetail(
  advertiserId: string,
  campaignId: string,
  sinceDate: Date,
): Promise<CampaignDetail | null> {
  const c = await prisma.campaign.findFirst({
    where: { id: campaignId, advertiserId },
    include: {
      _count: { select: { adGroups: true, creatives: true } },
      metrics: {
        where: { date: { gte: sinceDate } },
        select: { spendUsdCents: true, impressions: true, clicks: true },
      },
    },
  })
  if (!c) return null

  const spentUsdCents = c.metrics.reduce((a, m) => a + m.spendUsdCents, 0)
  const impressions = c.metrics.reduce((a, m) => a + m.impressions, 0)
  const clicks = c.metrics.reduce((a, m) => a + m.clicks, 0)

  return {
    id: c.id,
    name: c.name,
    status: c.status,
    vertical: c.vertical,
    objective: c.objective,
    pricingModel: c.pricingModel,
    pacing: c.pacing,
    budgetUsdCents: c.budgetUsdCents,
    dailyCapUsdCents: c.dailyCapUsdCents,
    bidUsdCents: c.bidUsdCents,
    startDate: c.startDate,
    endDate: c.endDate,
    adGroupsCount: c._count.adGroups,
    creativesCount: c._count.creatives,
    spentUsdCents,
    impressions,
    clicks,
  }
}
