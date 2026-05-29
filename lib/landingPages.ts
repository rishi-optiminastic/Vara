import { prisma } from "@/lib/prisma"
import type { CampaignStatus } from "@prisma/client"

export interface LandingPageFilters {
  statuses?: CampaignStatus[]
  campaignId?: string | null
  adGroupId?: string | null
}

export interface LandingPageRow {
  url: string
  host: string
  path: string
  adCount: number
  campaigns: string[]
  impressions: number
  clicks: number
  ctrPct: number
  spendUsdcCents: number
  walletConnects: number
  onChainConvs: number
  cvrPct: number
}

function parseUrl(raw: string): { host: string; path: string } {
  try {
    const u = new URL(raw)
    return { host: u.hostname.replace(/^www\./, ""), path: u.pathname || "/" }
  } catch {
    return { host: raw, path: "" }
  }
}

interface UrlAccumulator {
  url: string
  host: string
  path: string
  adCount: number
  campaignSet: Set<string>
  campaignIds: Set<string>
  impressions: number
  clicks: number
  spendUsdcCents: number
  walletConnects: number
  onChainConvs: number
}

function getOrInit(map: Map<string, UrlAccumulator>, url: string): UrlAccumulator {
  let row = map.get(url)
  if (!row) {
    const { host, path } = parseUrl(url)
    row = {
      url,
      host,
      path,
      adCount: 0,
      campaignSet: new Set<string>(),
      campaignIds: new Set<string>(),
      impressions: 0,
      clicks: 0,
      spendUsdcCents: 0,
      walletConnects: 0,
      onChainConvs: 0,
    }
    map.set(url, row)
  }
  return row
}

export async function fetchLandingPagePerformance(
  advertiserId: string,
  sinceDate: Date,
  filters: LandingPageFilters = {},
): Promise<LandingPageRow[]> {
  const campaignWhere = {
    advertiserId,
    ...(filters.statuses && filters.statuses.length > 0 ? { status: { in: filters.statuses } } : {}),
    ...(filters.campaignId ? { id: filters.campaignId } : {}),
  }
  const adGroupFilter = filters.adGroupId ? { adGroupId: filters.adGroupId } : {}

  const [creatives, ads, campaignMetrics] = await Promise.all([
    // Creatives don't have an adGroup relation, so adGroupId filtering excludes them entirely.
    filters.adGroupId
      ? Promise.resolve([])
      : prisma.creative.findMany({
          where: { campaign: campaignWhere },
          select: {
            clickUrl: true,
            campaign: { select: { id: true, name: true } },
          },
        }),
    prisma.ad.findMany({
      where: {
        ...adGroupFilter,
        adGroup: { campaign: campaignWhere },
      },
      select: {
        clickUrl: true,
        adGroup: { select: { campaign: { select: { id: true, name: true } } } },
        metrics: {
          where: { date: { gte: sinceDate } },
          select: {
            impressions: true,
            clicks: true,
            spendUsdcCents: true,
            walletConnects: true,
            onChainConvs: true,
          },
        },
      },
    }),
    prisma.metricDaily.groupBy({
      by: ["campaignId"],
      where: {
        date: { gte: sinceDate },
        campaign: campaignWhere,
      },
      _sum: {
        impressions: true,
        clicks: true,
        spendUsdCents: true,
        walletConnects: true,
        onChainConvs: true,
      },
    }),
  ])

  const campaignTotals = new Map(
    campaignMetrics.map((m) => [m.campaignId, m._sum]),
  )

  const creativesPerCampaign = new Map<string, number>()
  for (const c of creatives) {
    const id = c.campaign.id
    creativesPerCampaign.set(id, (creativesPerCampaign.get(id) ?? 0) + 1)
  }

  const byUrl = new Map<string, UrlAccumulator>()

  for (const c of creatives) {
    const url = c.clickUrl.trim()
    if (!url) continue
    const row = getOrInit(byUrl, url)
    row.adCount += 1
    row.campaignSet.add(c.campaign.name)
    row.campaignIds.add(c.campaign.id)
  }

  const campaignsAlreadyAttributed = new Set<string>()
  for (const row of byUrl.values()) {
    for (const cid of row.campaignIds) {
      if (campaignsAlreadyAttributed.has(cid)) continue
      campaignsAlreadyAttributed.add(cid)
      const totals = campaignTotals.get(cid)
      if (!totals) continue
      const urlsForCampaign = Array.from(byUrl.values()).filter((r) => r.campaignIds.has(cid))
      const share = urlsForCampaign.length > 0 ? 1 / urlsForCampaign.length : 0
      for (const r of urlsForCampaign) {
        r.impressions += Math.round((totals.impressions ?? 0) * share)
        r.clicks += Math.round((totals.clicks ?? 0) * share)
        r.spendUsdcCents += Math.round((totals.spendUsdCents ?? 0) * share)
        r.walletConnects += Math.round((totals.walletConnects ?? 0) * share)
        r.onChainConvs += Math.round((totals.onChainConvs ?? 0) * share)
      }
    }
  }

  for (const ad of ads) {
    const url = ad.clickUrl.trim()
    if (!url) continue
    const row = getOrInit(byUrl, url)
    row.adCount += 1
    row.campaignSet.add(ad.adGroup.campaign.name)
    row.campaignIds.add(ad.adGroup.campaign.id)
    for (const m of ad.metrics) {
      row.impressions += m.impressions
      row.clicks += m.clicks
      row.spendUsdcCents += m.spendUsdcCents
      row.walletConnects += m.walletConnects
      row.onChainConvs += m.onChainConvs
    }
  }

  const rows: LandingPageRow[] = Array.from(byUrl.values()).map((r) => ({
    url: r.url,
    host: r.host,
    path: r.path,
    adCount: r.adCount,
    campaigns: Array.from(r.campaignSet),
    impressions: r.impressions,
    clicks: r.clicks,
    ctrPct: r.impressions > 0 ? (r.clicks / r.impressions) * 100 : 0,
    spendUsdcCents: r.spendUsdcCents,
    walletConnects: r.walletConnects,
    onChainConvs: r.onChainConvs,
    cvrPct: r.clicks > 0 ? ((r.walletConnects + r.onChainConvs) / r.clicks) * 100 : 0,
  }))

  return rows.sort((a, b) => b.spendUsdcCents - a.spendUsdcCents || b.adCount - a.adCount)
}
