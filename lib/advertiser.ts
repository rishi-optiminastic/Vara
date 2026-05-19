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
    // contractAddrs needs an explicit [] — the DB column lacks a default,
    // so Prisma's array auto-default doesn't kick in and the insert fails
    // with "Null constraint violation on the fields: (`contractAddrs`)".
    data: { userId, projectName: fallbackName || "My Project", contractAddrs: [] },
  })
})
