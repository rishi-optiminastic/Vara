import { NextResponse, type NextRequest } from "next/server"
import type { Asset, AssetRole } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import { requireAdvertiser, isAuthError, jsonError } from "@/lib/api"
import { UpdateAdSchema } from "@/components/ads/types"
import { meetsMinimumMix } from "@/lib/adAssetRules"
import { logger } from "@/lib/logger"

interface Params { params: Promise<{ id: string }> }

const OWNERSHIP = (id: string, advertiserId: string) =>
  ({
    id,
    adGroup: { campaign: { advertiserId } },
  }) as const

export async function GET(_: NextRequest, { params }: Params): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const { id } = await params
  const ad = await prisma.ad.findFirst({
    where: OWNERSHIP(id, ctx.advertiser.id),
    include: { links: { include: { asset: true } } },
  })
  if (!ad) return jsonError("Not found", 404)
  const assets = ad.links.map((l: { role: AssetRole; weight: number; asset: Asset }) => ({
    role: l.role,
    weight: l.weight,
    asset: l.asset,
  }))
  return NextResponse.json({ ad: { ...ad, assets } })
}

export async function PATCH(req: NextRequest, { params }: Params): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const { id } = await params
  const existing = await prisma.ad.findFirst({
    where: OWNERSHIP(id, ctx.advertiser.id),
    select: { id: true, type: true },
  })
  if (!existing) return jsonError("Not found", 404)
  const body = await req.json().catch(() => null)
  const parsed = UpdateAdSchema.safeParse(body)
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422)
  const d = parsed.data
  try {
    const ad = await prisma.$transaction(async (tx) => {
      await tx.ad.update({
        where: { id },
        data: {
          ...(d.name !== undefined && { name: d.name }),
          ...(d.clickUrl !== undefined && { clickUrl: d.clickUrl }),
          ...(d.finalUrlSuffix !== undefined && { finalUrlSuffix: d.finalUrlSuffix ?? null }),
          ...(d.trafficShare !== undefined && { trafficShare: d.trafficShare }),
          ...(d.status !== undefined && { status: d.status }),
        },
      })
      if (d.assets) {
        await tx.adAssetLink.deleteMany({ where: { adId: id } })
        await tx.adAssetLink.createMany({
          data: d.assets.map((a) => ({
            adId: id,
            assetId: a.assetId,
            role: a.role,
            weight: a.weight ?? 1,
          })),
        })
        const hasMin = meetsMinimumMix(existing.type, d.assets.map((a) => a.role))
        await tx.ad.update({ where: { id }, data: { hasMinAssets: hasMin } })
      }
      return tx.ad.findUnique({ where: { id } })
    })
    return NextResponse.json({ ad })
  } catch (err) {
    logger.error({ err }, "Failed to update ad")
    return jsonError("Failed to update ad", 500)
  }
}

export async function DELETE(_: NextRequest, { params }: Params): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const { id } = await params
  const owns = await prisma.ad.findFirst({
    where: OWNERSHIP(id, ctx.advertiser.id),
    select: { id: true },
  })
  if (!owns) return jsonError("Not found", 404)
  try {
    await prisma.ad.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error({ err }, "Failed to delete ad")
    return jsonError("Failed to delete ad", 500)
  }
}
