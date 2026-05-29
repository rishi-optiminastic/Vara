import { NextResponse, type NextRequest } from "next/server"

import { prisma } from "@/lib/prisma"
import { requireAdvertiser, isAuthError, jsonError } from "@/lib/api"
import { CreateAdSchema } from "@/components/ads/types"
import { meetsMinimumMix } from "@/lib/adAssetRules"
import { logger } from "@/lib/logger"

export async function GET(req: NextRequest): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const adGroupId = req.nextUrl.searchParams.get("adGroupId")
  if (!adGroupId) return jsonError("adGroupId is required", 422)
  const owns = await prisma.adGroup.findFirst({
    where: { id: adGroupId, campaign: { advertiserId: ctx.advertiser.id } },
    select: { id: true },
  })
  if (!owns) return jsonError("Not found", 404)
  const ads = await prisma.ad.findMany({
    where: { adGroupId },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json({ ads })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const body = await req.json().catch(() => null)
  const parsed = CreateAdSchema.safeParse(body)
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422)
  const d = parsed.data

  const owns = await prisma.adGroup.findFirst({
    where: { id: d.adGroupId, campaign: { advertiserId: ctx.advertiser.id } },
    select: { id: true },
  })
  if (!owns) return jsonError("Ad group not found", 404)

  const assetIds = d.assets.map((a) => a.assetId)
  const ownedAssets = await prisma.asset.findMany({
    where: {
      id: { in: assetIds },
      advertiserId: ctx.advertiser.id,
      status: { not: "ARCHIVED" },
    },
    select: { id: true },
  })
  if (ownedAssets.length !== assetIds.length) {
    return jsonError("One or more assets are not available", 422)
  }

  const hasMinAssets = meetsMinimumMix(d.type, d.assets.map((a) => a.role))

  try {
    const ad = await prisma.ad.create({
      data: {
        adGroupId: d.adGroupId,
        name: d.name,
        type: d.type,
        status: "DRAFT",
        trafficShare: d.trafficShare ?? 100,
        clickUrl: d.clickUrl,
        finalUrlSuffix: d.finalUrlSuffix ?? null,
        hasMinAssets,
        links: {
          create: d.assets.map((a) => ({
            assetId: a.assetId,
            role: a.role,
            weight: a.weight ?? 1,
          })),
        },
      },
    })
    return NextResponse.json({ ad }, { status: 201 })
  } catch (err) {
    logger.error({ err }, "Failed to create ad")
    return jsonError("Failed to create ad", 500)
  }
}
