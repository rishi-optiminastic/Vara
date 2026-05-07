import type { Placement, PlacementStatus } from "@prisma/client"
import type { CreatePlacementInput } from "@/components/ssp/inventory/types"

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function listPlacements(): Promise<{ placements: Placement[] }> {
  return jsonOrThrow(await fetch("/api/ssp/placements", { cache: "no-store" }))
}

export async function createPlacement(input: CreatePlacementInput): Promise<{ placement: Placement }> {
  return jsonOrThrow(
    await fetch("/api/ssp/placements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  )
}

export async function updatePlacementStatus(
  id: string,
  status: PlacementStatus,
): Promise<{ ok: true }> {
  return jsonOrThrow(
    await fetch(`/api/ssp/placements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }),
  )
}

export async function deletePlacement(id: string): Promise<{ ok: true }> {
  return jsonOrThrow(
    await fetch(`/api/ssp/placements/${id}`, { method: "DELETE" }),
  )
}
