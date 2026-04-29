import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdvertiser, isAuthError, jsonError } from '@/lib/api'
import { TargetingSchema } from '@/components/campaigns/types'
import { usdToCents } from '@/lib/money'
import { logger } from '@/lib/logger'

interface RouteCtx {
  params: Promise<{ id: string }>
}

export async function PUT(req: NextRequest, { params }: RouteCtx): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const { id } = await params
  const owned = await prisma.campaign.findFirst({
    where: { id, advertiserId: ctx.advertiser.id },
    select: { id: true },
  })
  if (!owned) return jsonError('Not found', 404)
  const body = await req.json().catch(() => null)
  const parsed = TargetingSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? 'Invalid input', 422)
  }
  const d = parsed.data
  try {
    const targeting = await prisma.targeting.upsert({
      where: { campaignId: id },
      create: {
        campaignId: id,
        chains: d.chains,
        geos: d.geos,
        deviceTypes: d.deviceTypes,
        segmentIds: d.segmentIds,
        minWalletAgeDays: d.minWalletAgeDays ?? null,
        minPortfolioUsdCents: d.minPortfolioUsd ? usdToCents(d.minPortfolioUsd) : null,
        holdsAnyContract: d.holdsAnyContract,
        excludesContracts: d.excludesContracts,
      },
      update: {
        chains: d.chains,
        geos: d.geos,
        deviceTypes: d.deviceTypes,
        segmentIds: d.segmentIds,
        minWalletAgeDays: d.minWalletAgeDays ?? null,
        minPortfolioUsdCents: d.minPortfolioUsd ? usdToCents(d.minPortfolioUsd) : null,
        holdsAnyContract: d.holdsAnyContract,
        excludesContracts: d.excludesContracts,
      },
    })
    return NextResponse.json({ targeting })
  } catch (err) {
    logger.error({ err }, 'Failed to save targeting')
    return jsonError('Failed to save targeting', 500)
  }
}
