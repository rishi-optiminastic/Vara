import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdvertiser, isAuthError, jsonError } from '@/lib/api'
import { CreateCampaignWizardSchema } from '@/components/campaigns/types'
import { usdToCents } from '@/lib/money'
import { FORMAT_DIMS } from '@/lib/creatives'
import { logger } from '@/lib/logger'

export async function GET(): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const campaigns = await prisma.campaign.findMany({
    where: { advertiserId: ctx.advertiser.id },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { creatives: true } } },
  })
  return NextResponse.json({ campaigns })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const body = await req.json().catch(() => null)
  const parsed = CreateCampaignWizardSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? 'Invalid input', 422)
  }
  const d = parsed.data
  const adData = d.ads.map((ad) => ({
    name: ad.name,
    format: ad.format,
    width: FORMAT_DIMS[ad.format].width,
    height: FORMAT_DIMS[ad.format].height,
    assetUrl: ad.assetUrl,
    clickUrl: ad.clickUrl,
    walletConnectCta: ad.walletConnectCta,
  }))
  try {
    const campaign = await prisma.campaign.create({
      data: {
        advertiserId: ctx.advertiser.id,
        name: d.name,
        description: d.description ?? null,
        vertical: d.vertical,
        objective: d.objective,
        status: d.status,
        pricingModel: d.pricingModel,
        bidStrategy: d.bidStrategy,
        pacing: d.pacing,
        budgetUsdCents: usdToCents(d.budgetUsd),
        dailyCapUsdCents: d.dailyCapUsd ? usdToCents(d.dailyCapUsd) : null,
        bidUsdCents: usdToCents(d.bidUsd),
        frequencyCapPerWallet: d.frequencyCapPerWallet ?? null,
        frequencyCapHours: d.frequencyCapHours ?? null,
        startDate: d.startDate,
        endDate: d.endDate ?? null,
        brandSafetyKeywords: d.brandSafetyKeywords,
        targeting: {
          create: {
            chains: d.chains,
            geos: d.geos,
            deviceTypes: d.deviceTypes,
          },
        },
        ...(adData.length > 0 ? { creatives: { createMany: { data: adData } } } : {}),
      },
    })
    return NextResponse.json({ campaign }, { status: 201 })
  } catch (err) {
    logger.error({ err }, 'Failed to create campaign')
    return jsonError('Failed to create campaign', 500)
  }
}
