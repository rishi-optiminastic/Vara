import { prisma } from "@/lib/prisma"
import type { CampaignStatus } from "@prisma/client"

const VALID_STATUSES: CampaignStatus[] = ["DRAFT", "ACTIVE", "PAUSED", "ENDED"]

export interface UniversalFilters {
  statuses: CampaignStatus[]
  campaignId: string | null
  adGroupId: string | null
}

export function parseUniversalFilters(
  params: Record<string, string | undefined>,
): UniversalFilters {
  const rawStatus = params["status"] ?? ""
  const statuses = rawStatus
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter((s): s is CampaignStatus => VALID_STATUSES.includes(s as CampaignStatus))

  return {
    statuses,
    campaignId: params["campaign"]?.trim() || null,
    adGroupId: params["adGroup"]?.trim() || null,
  }
}

export interface ScopeCampaign {
  id: string
  name: string
  status: CampaignStatus
}

export interface ScopeAdGroup {
  id: string
  name: string
  status: CampaignStatus
}

export interface FilterScope {
  campaigns: ScopeCampaign[]
  adGroups: ScopeAdGroup[]
}

export async function fetchFilterScope(
  advertiserId: string,
  campaignId: string | null,
): Promise<FilterScope> {
  const [campaigns, adGroups] = await Promise.all([
    prisma.campaign.findMany({
      where: { advertiserId },
      select: { id: true, name: true, status: true },
      orderBy: { updatedAt: "desc" },
    }),
    campaignId
      ? prisma.adGroup.findMany({
          where: { campaignId, campaign: { advertiserId } },
          select: { id: true, name: true, status: true },
          orderBy: { updatedAt: "desc" },
        })
      : Promise.resolve([]),
  ])
  return { campaigns, adGroups }
}

export function campaignWhere(filters: UniversalFilters, advertiserId: string): {
  advertiserId: string
  status?: { in: CampaignStatus[] }
  id?: string
} {
  return {
    advertiserId,
    ...(filters.statuses.length > 0 ? { status: { in: filters.statuses } } : {}),
    ...(filters.campaignId ? { id: filters.campaignId } : {}),
  }
}
