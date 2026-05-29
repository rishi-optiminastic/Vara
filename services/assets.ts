import type { Asset, AssetStatus, AssetType } from "@prisma/client"

import type { CreateFileAssetInput, CreateTextAssetInput } from "@/components/ads/types"

interface ListResp { assets: Asset[] }
interface OneResp { asset: Asset }
interface OkResp { ok: true }

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

interface ListAssetsParams {
  type?: AssetType
  status?: AssetStatus
  limit?: number
}

export async function listAssets(params?: ListAssetsParams): Promise<ListResp> {
  const qs = new URLSearchParams()
  if (params?.type) qs.set("type", params.type)
  if (params?.status) qs.set("status", params.status)
  if (params?.limit) qs.set("limit", String(params.limit))
  const url = qs.toString() ? `/api/assets?${qs.toString()}` : "/api/assets"
  return jsonOrThrow(await fetch(url, { cache: "no-store" }))
}

export async function createTextAsset(input: CreateTextAssetInput): Promise<OneResp> {
  return jsonOrThrow(
    await fetch("/api/assets/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  )
}

export async function createFileAsset(input: CreateFileAssetInput): Promise<OneResp> {
  return jsonOrThrow(
    await fetch("/api/assets/file", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  )
}

export async function deleteAsset(id: string): Promise<OkResp> {
  return jsonOrThrow(await fetch(`/api/assets/${id}`, { method: "DELETE" }))
}
