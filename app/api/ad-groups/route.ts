import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdvertiser, isAuthError, jsonError } from "@/lib/api"
import { CreateAdGroupSchema } from "@/components/ad-groups/types"
import { usdToCents } from "@/lib/money"
import { logger } from "@/lib/logger"

const INCLUDE = { campaign: { select: { id: true, name: true } }, targeting: true } as const

export async function GET(): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const adGroups = await prisma.adGroup.findMany({
    where: { campaign: { advertiserId: ctx.advertiser.id } },
    include: INCLUDE,
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json({ adGroups })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const body = await req.json().catch(() => null)
  const parsed = CreateAdGroupSchema.safeParse(body)
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422)
  const d = parsed.data
  const campaign = await prisma.campaign.findFirst({
    where: { id: d.campaignId, advertiserId: ctx.advertiser.id },
  })
  if (!campaign) return jsonError("Campaign not found", 404)
  try {
    const adGroup = await prisma.adGroup.create({
      data: {
        campaignId: d.campaignId,
        name: d.name,
        status: d.status,
        bidUsdCents: usdToCents(d.bidUsd),
        pricingModel: d.pricingModel,
        bidStrategy: d.bidStrategy,
        dailyCapUsdCents: d.dailyCapUsd ? usdToCents(d.dailyCapUsd) : null,
        startDate: d.startDate ?? null,
        endDate: d.endDate ?? null,
        targeting: {
          create: {
            chains: d.chains,
            geos: d.geos,
            deviceTypes: d.deviceTypes,
            segmentIds: [],
            holdsAnyContract: [],
            excludesContracts: [],
          },
        },
      },
      include: INCLUDE,
    })
    return NextResponse.json({ adGroup }, { status: 201 })
  } catch (err) {
    logger.error({ err }, "Failed to create ad group")
    return jsonError("Failed to create ad group", 500)
  }
}
