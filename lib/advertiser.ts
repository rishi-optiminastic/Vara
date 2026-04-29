import { prisma } from "@/lib/prisma"
import type { Advertiser } from "@prisma/client"

export async function getOrCreateAdvertiser(
  userId: string,
  fallbackName: string,
): Promise<Advertiser> {
  return prisma.advertiser.upsert({
    where: { userId },
    create: { userId, projectName: fallbackName || "My Project" },
    update: {},
  })
}
