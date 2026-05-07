import { cache } from "react"
import { prisma } from "@/lib/prisma"
import type { Publisher } from "@prisma/client"

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
