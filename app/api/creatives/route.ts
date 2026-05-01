import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdvertiser, isAuthError, jsonError } from "@/lib/api"
import { CreateCreativeSchema } from "@/components/ads/types"
import { FORMAT_DIMS } from "@/lib/creatives"
import { logger } from "@/lib/logger"

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx

  const body = await req.json().catch(() => null)
  const parsed = CreateCreativeSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422)
  }
  const d = parsed.data

  const campaign = await prisma.campaign.findFirst({
    where: { id: d.campaignId, advertiserId: ctx.advertiser.id },
    select: { id: true },
  })
  if (!campaign) return jsonError("Campaign not found", 404)

  try {
    const creative = await prisma.creative.create({
      data: {
        campaignId: d.campaignId,
        name: d.name,
        format: d.format,
        width: FORMAT_DIMS[d.format].width,
        height: FORMAT_DIMS[d.format].height,
        assetUrl: d.assetUrl,
        clickUrl: d.clickUrl,
        walletConnectCta: d.walletConnectCta,
      },
    })
    return NextResponse.json({ creative }, { status: 201 })
  } catch (err) {
    logger.error({ err }, "Failed to create creative")
    return jsonError("Failed to create creative", 500)
  }
}
