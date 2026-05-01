import type { Campaign, Targeting } from "@prisma/client"
import type {
  UpdateCampaignInput,
  TargetingInput,
  CreateCampaignWizardInput,
} from "@/components/campaigns/types"

interface CampaignWithCount extends Campaign { _count: { creatives: number } }
interface ListResp { campaigns: CampaignWithCount[] }
interface OneResp { campaign: Campaign & { targeting: Targeting | null } }
interface TargetingResp { targeting: Targeting }

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function listCampaigns(): Promise<ListResp> {
  return jsonOrThrow(await fetch("/api/campaigns", { cache: "no-store" }))
}

export async function getCampaign(id: string): Promise<OneResp> {
  return jsonOrThrow(await fetch(`/api/campaigns/${id}`, { cache: "no-store" }))
}

export async function createCampaignWizard(input: CreateCampaignWizardInput): Promise<OneResp> {
  return jsonOrThrow(
    await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  )
}

export async function updateCampaign(
  id: string,
  input: UpdateCampaignInput,
): Promise<OneResp> {
  return jsonOrThrow(
    await fetch(`/api/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  )
}

export async function deleteCampaign(id: string): Promise<{ ok: true }> {
  return jsonOrThrow(
    await fetch(`/api/campaigns/${id}`, { method: "DELETE" }),
  )
}

export async function saveTargeting(
  id: string,
  input: TargetingInput,
): Promise<TargetingResp> {
  return jsonOrThrow(
    await fetch(`/api/campaigns/${id}/targeting`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  )
}
