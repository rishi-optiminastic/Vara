import type { WalletSegment } from "@prisma/client"

export async function listSegments(): Promise<{ segments: WalletSegment[] }> {
  const res = await fetch("/api/segments", { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to load segments")
  return res.json()
}
