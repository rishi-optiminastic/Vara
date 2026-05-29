import { NextResponse, type NextRequest } from "next/server"
import type { AssetStatus, AssetType, Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import { requireAdvertiser, isAuthError } from "@/lib/api"

export async function GET(req: NextRequest): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const sp = req.nextUrl.searchParams
  const where: Prisma.AssetWhereInput = { advertiserId: ctx.advertiser.id }
  const typeParam = sp.get("type")
  if (typeParam) where.type = typeParam as AssetType
  const statusParam = sp.get("status")
  if (statusParam) where.status = statusParam as AssetStatus
  const limitParam = sp.get("limit")
  const take = Math.min(Math.max(Number(limitParam) || 100, 1), 500)
  const assets = await prisma.asset.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take,
  })
  return NextResponse.json({ assets })
}
