import { cache } from "react"
import { prisma } from "@/lib/prisma"
import type { AdFormat, Chain, Placement, Publisher } from "@prisma/client"

export const getOrCreatePublisher = cache(async (
  userId: string,
  fallbackName: string,
): Promise<Publisher> => {
  const existing = await prisma.publisher.findUnique({ where: { userId } })
  if (existing) return existing
  return prisma.publisher.create({
    data: { userId, siteName: fallbackName || "My Site" },
  })
})

interface StarterPlacementInput {
  publisherId: string
  siteName: string
  adFormats: AdFormat[]
  audienceChains: Chain[]
}

// Default banner dimensions for the starter slot we hand the publisher after
// onboarding. 300x250 (medium rectangle) is the most widely supported IAB size.
const DEFAULT_BANNER = { width: 300, height: 250 }

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40) || "default"
}

// Idempotent: returns the publisher's first placement when one already exists,
// otherwise mints a starter slot derived from the formats chosen in step 2 so
// the SDK snippet shown in step 3 has a real placement ID to embed.
export async function ensureStarterPlacement(
  input: StarterPlacementInput,
): Promise<Placement> {
  const existing = await prisma.placement.findFirst({
    where: { publisherId: input.publisherId },
    orderBy: { createdAt: "asc" },
  })
  if (existing) return existing

  const format = input.adFormats[0] ?? "BANNER"
  const isBanner = format === "BANNER"
  return prisma.placement.create({
    data: {
      publisherId: input.publisherId,
      name: `${slugify(input.siteName)}-default`,
      format,
      chains: input.audienceChains,
      width: isBanner ? DEFAULT_BANNER.width : null,
      height: isBanner ? DEFAULT_BANNER.height : null,
    },
  })
}
