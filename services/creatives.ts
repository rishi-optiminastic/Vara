import type { Creative } from "@prisma/client"
import type { CreateCreativeInput } from "@/components/ads/types"

interface CreativeResp { creative: Creative }

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function createCreative(input: CreateCreativeInput): Promise<CreativeResp> {
  return jsonOrThrow(
    await fetch("/api/creatives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  )
}

export async function deleteCreative(id: string): Promise<{ ok: true }> {
  return jsonOrThrow(await fetch(`/api/creatives/${id}`, { method: "DELETE" }))
}
