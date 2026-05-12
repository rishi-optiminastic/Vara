import type {
  Campaign,
  CampaignStatus,
  Chain,
  MetricDaily,
  Targeting,
  WalletSegment,
} from "@prisma/client"

export type MatchType = "wallet behavior" | "contract" | "chain" | "geo"
export type TermStatus = "added" | "suggested" | "excluded"

export interface TermRow {
  term: string
  matchType: MatchType
  impressions: number
  clicks: number
  spendUsdCents: number
  conversions: number
  status: TermStatus
}

interface CampaignWithRels {
  id: string
  status: CampaignStatus
  targeting: Targeting | null
  metrics: Pick<MetricDaily, "impressions" | "clicks" | "spendUsdCents" | "onChainConvs">[]
}

interface Totals {
  impressions: number
  clicks: number
  spend: number
  conversions: number
}

interface Bucket {
  matchType: MatchType
  status: TermStatus
  totals: Totals
}

/**
 * Build the search-terms table by fanning out each campaign's 30-day delivery
 * across the targeting "facets" that triggered it (chains, geos, segments,
 * contract holdings). Each campaign's metrics are split evenly across its N
 * facets so the column totals match the campaign's actual delivery.
 *
 * Suggested terms = wallet segments that no active campaign is targeting yet.
 */
export function buildSearchTerms(
  campaigns: CampaignWithRels[],
  segmentsById: Map<string, WalletSegment>,
): TermRow[] {
  const buckets = new Map<string, Bucket>()
  const usedSegmentIds = new Set<string>()

  for (const c of campaigns) {
    const facets = collectFacets(c.targeting, segmentsById)
    if (facets.length === 0) continue

    const totals = c.metrics.reduce<Totals>(
      (acc, m) => ({
        impressions: acc.impressions + m.impressions,
        clicks: acc.clicks + m.clicks,
        spend: acc.spend + m.spendUsdCents,
        conversions: acc.conversions + m.onChainConvs,
      }),
      { impressions: 0, clicks: 0, spend: 0, conversions: 0 },
    )

    const status: TermStatus = c.status === "ACTIVE" ? "added" : "excluded"
    const share = 1 / facets.length

    for (const f of facets) {
      if (f.segmentId) usedSegmentIds.add(f.segmentId)
      const key = `${f.matchType}:${f.term}`
      const b = buckets.get(key) ?? {
        matchType: f.matchType,
        status,
        totals: { impressions: 0, clicks: 0, spend: 0, conversions: 0 },
      }
      b.totals.impressions += Math.round(totals.impressions * share)
      b.totals.clicks += Math.round(totals.clicks * share)
      b.totals.spend += Math.round(totals.spend * share)
      b.totals.conversions += Math.round(totals.conversions * share)
      // Promote to "added" if any campaign using this term is active.
      if (status === "added") b.status = "added"
      buckets.set(key, b)
    }
  }

  const rows: TermRow[] = Array.from(buckets.entries()).map(([key, b]) => ({
    term: key.slice(key.indexOf(":") + 1),
    matchType: b.matchType,
    impressions: b.totals.impressions,
    clicks: b.totals.clicks,
    spendUsdCents: b.totals.spend,
    conversions: b.totals.conversions,
    status: b.status,
  }))

  // Suggested rows: any wallet segment not yet targeted gets surfaced with
  // zero delivery as a hint the advertiser could try it.
  for (const seg of segmentsById.values()) {
    if (usedSegmentIds.has(seg.id)) continue
    rows.push({
      term: seg.name,
      matchType: "wallet behavior",
      impressions: 0,
      clicks: 0,
      spendUsdCents: 0,
      conversions: 0,
      status: "suggested",
    })
  }

  return rows.sort((a, b) => b.spendUsdCents - a.spendUsdCents || b.impressions - a.impressions)
}

interface Facet {
  term: string
  matchType: MatchType
  segmentId?: string
}

function collectFacets(t: Targeting | null, segmentsById: Map<string, WalletSegment>): Facet[] {
  if (!t) return []
  const out: Facet[] = []
  for (const chain of t.chains) {
    out.push({ term: chainLabel(chain), matchType: "chain" })
  }
  for (const geo of t.geos) {
    out.push({ term: geo.toUpperCase(), matchType: "geo" })
  }
  for (const segId of t.segmentIds) {
    const seg = segmentsById.get(segId)
    if (seg) out.push({ term: seg.name, matchType: "wallet behavior", segmentId: segId })
  }
  for (const addr of t.holdsAnyContract) {
    out.push({ term: shortContract(addr), matchType: "contract" })
  }
  return out
}

function chainLabel(c: Chain): string {
  return c.charAt(0) + c.slice(1).toLowerCase()
}

function shortContract(addr: string): string {
  if (addr.length <= 14) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}
