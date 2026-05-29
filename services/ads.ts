import type { Ad, Asset, AssetRole } from "@prisma/client"

import type { CreateAdInput, UpdateAdInput } from "@/components/ads/types"

export interface AdAssetRef {
  role: AssetRole
  weight: number
  asset: Asset
}

export type AdWithAssets = Ad & {
  assets: AdAssetRef[]
}

interface ListResp { ads: Ad[] }
interface DetailResp { ad: AdWithAssets }
interface OneResp { ad: Ad }
interface OkResp { ok: true }

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function listAds(adGroupId: string): Promise<ListResp> {
  const qs = new URLSearchParams({ adGroupId })
  return jsonOrThrow(await fetch(`/api/ads?${qs.toString()}`, { cache: "no-store" }))
}

export async function getAd(id: string): Promise<DetailResp> {
  return jsonOrThrow(await fetch(`/api/ads/${id}`, { cache: "no-store" }))
}

export async function createAd(input: CreateAdInput): Promise<OneResp> {
  return jsonOrThrow(
    await fetch("/api/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  )
}

export async function updateAd(id: string, input: UpdateAdInput): Promise<OneResp> {
  return jsonOrThrow(
    await fetch(`/api/ads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  )
}

export async function deleteAd(id: string): Promise<OkResp> {
  return jsonOrThrow(await fetch(`/api/ads/${id}`, { method: "DELETE" }))
}
