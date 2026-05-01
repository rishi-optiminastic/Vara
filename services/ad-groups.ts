import type { AdGroup, AdGroupTargeting, Campaign } from "@prisma/client"
import type { CreateAdGroupInput, UpdateAdGroupInput } from "@/components/ad-groups/types"

export type AdGroupWithRel = AdGroup & {
  campaign: Pick<Campaign, "id" | "name">
  targeting: AdGroupTargeting | null
}

interface ListResp { adGroups: AdGroupWithRel[] }
interface OneResp { adGroup: AdGroupWithRel }

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function listAdGroups(): Promise<ListResp> {
  return jsonOrThrow(await fetch("/api/ad-groups", { cache: "no-store" }))
}

export async function createAdGroup(input: CreateAdGroupInput): Promise<OneResp> {
  return jsonOrThrow(
    await fetch("/api/ad-groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  )
}

export async function updateAdGroup(id: string, input: UpdateAdGroupInput): Promise<OneResp> {
  return jsonOrThrow(
    await fetch(`/api/ad-groups/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  )
}

export async function deleteAdGroup(id: string): Promise<{ ok: true }> {
  return jsonOrThrow(await fetch(`/api/ad-groups/${id}`, { method: "DELETE" }))
}
