import { cache } from "react"
import { prisma } from "@/lib/prisma"
import type { Advertiser } from "@prisma/client"

export const getOrCreateAdvertiser = cache(async (
  userId: string,
  fallbackName: string,
): Promise<Advertiser> => {
  const existing = await prisma.advertiser.findUnique({ where: { userId } })
  if (existing) return existing
  return prisma.advertiser.create({
    data: { userId, projectName: fallbackName || "My Project" },
  })
})
