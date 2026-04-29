import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdvertiser, isAuthError, jsonError } from '@/lib/api'
import { CreateCampaignSchema } from '@/components/campaigns/types'
import { usdToCents } from '@/lib/money'
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
  const parsed = CreateCampaignSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? 'Invalid input', 422)
  }
  const d = parsed.data
  try {
    const campaign = await prisma.campaign.create({
      data: {
        advertiserId: ctx.advertiser.id,
        name: d.name,
        description: d.description ?? null,
        vertical: d.vertical,
        objective: d.objective,
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
        conversionContract: d.conversionContract ?? null,
        conversionEvent: d.conversionEvent ?? null,
        conversionWindowDays: d.conversionWindowDays ?? null,
        brandSafetyKeywords: d.brandSafetyKeywords ?? [],
        targeting: { create: {} },
      },
    })
    return NextResponse.json({ campaign }, { status: 201 })
  } catch (err) {
    logger.error({ err }, 'Failed to create campaign')
    return jsonError('Failed to create campaign', 500)
  }
}
