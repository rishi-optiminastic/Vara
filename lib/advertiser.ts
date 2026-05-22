import { cache } from "react"
import { prisma } from "@/lib/prisma"
import type { Advertiser } from "@prisma/client"

export const getOrCreateAdvertiser = cache(async (
  userId: string,
  fallbackName: string,
): Promise<Advertiser> => {
  const existing = await prisma.advertiser.findUnique({ where: { userId } })
  if (existing) {
    await setActiveAdvertiserSafe(userId, existing.id)
    return existing
  }
  // contractAddrs needs an explicit [] — the DB column lacks a default,
  // so Prisma's array auto-default doesn't kick in and the insert fails
  // with "Null constraint violation on the fields: (`contractAddrs`)".
  const created = await prisma.advertiser.create({
    data: { userId, projectName: fallbackName || "My Project", contractAddrs: [] },
  })
  await setActiveAdvertiserSafe(userId, created.id)
  return created
})

// Best-effort backfill of user.activeAdvertiserId. The BE's auth path joins on
// this column; the FE doesn't need it to render, so we never want a failure
// here to take down a request. Failures we intentionally swallow:
//  - Dev server hasn't restarted since `prisma generate` → in-memory client
//    rejects the field name (PrismaClientValidationError).
//  - Migration not applied yet → DB returns "column does not exist"
//    (PrismaClientKnownRequestError P2022).
async function setActiveAdvertiserSafe(userId: string, advertiserId: string): Promise<void> {
  try {
    await prisma.user.updateMany({
      where: { id: userId, activeAdvertiserId: null },
      data: { activeAdvertiserId: advertiserId },
    })
  } catch {
    // Intentionally silent — see comment above.
  }
}
