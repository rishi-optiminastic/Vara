import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdvertiser, isAuthError, jsonError } from '@/lib/api'
import { UpdateCampaignSchema } from '@/components/campaigns/types'
import { usdToCents } from '@/lib/money'
import { logger } from '@/lib/logger'

interface RouteCtx {
  params: Promise<{ id: string }>
}

async function loadOwned(id: string, advertiserId: string) {
  return prisma.campaign.findFirst({
    where: { id, advertiserId },
    include: { targeting: true, creatives: true },
  })
}

export async function GET(_req: NextRequest, { params }: RouteCtx): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const { id } = await params
  const campaign = await loadOwned(id, ctx.advertiser.id)
  if (!campaign) return jsonError('Not found', 404)
  return NextResponse.json({ campaign })
}

export async function PATCH(req: NextRequest, { params }: RouteCtx): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const { id } = await params
  const exists = await loadOwned(id, ctx.advertiser.id)
  if (!exists) return jsonError('Not found', 404)
  const body = await req.json().catch(() => null)
  const parsed = UpdateCampaignSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? 'Invalid input', 422)
  }
  const d = parsed.data
  try {
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        ...(d.name !== undefined && { name: d.name }),
        ...(d.description !== undefined && { description: d.description ?? null }),
        ...(d.vertical !== undefined && { vertical: d.vertical }),
        ...(d.objective !== undefined && { objective: d.objective }),
        ...(d.status !== undefined && { status: d.status }),
        ...(d.pricingModel !== undefined && { pricingModel: d.pricingModel }),
        ...(d.bidStrategy !== undefined && { bidStrategy: d.bidStrategy }),
        ...(d.pacing !== undefined && { pacing: d.pacing }),
        ...(d.budgetUsd !== undefined && { budgetUsdCents: usdToCents(d.budgetUsd) }),
        ...(d.dailyCapUsd !== undefined && {
          dailyCapUsdCents: d.dailyCapUsd ? usdToCents(d.dailyCapUsd) : null,
        }),
        ...(d.bidUsd !== undefined && { bidUsdCents: usdToCents(d.bidUsd) }),
        ...(d.frequencyCapPerWallet !== undefined && {
          frequencyCapPerWallet: d.frequencyCapPerWallet ?? null,
        }),
        ...(d.frequencyCapHours !== undefined && {
          frequencyCapHours: d.frequencyCapHours ?? null,
        }),
        ...(d.startDate !== undefined && { startDate: d.startDate }),
        ...(d.endDate !== undefined && { endDate: d.endDate ?? null }),
        ...(d.conversionContract !== undefined && {
          conversionContract: d.conversionContract ?? null,
        }),
        ...(d.conversionEvent !== undefined && { conversionEvent: d.conversionEvent ?? null }),
        ...(d.conversionWindowDays !== undefined && {
          conversionWindowDays: d.conversionWindowDays ?? null,
        }),
        ...(d.brandSafetyKeywords !== undefined && { brandSafetyKeywords: d.brandSafetyKeywords }),
      },
    })
    return NextResponse.json({ campaign })
  } catch (err) {
    logger.error({ err }, 'Failed to update campaign')
    return jsonError('Failed to update', 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteCtx): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const { id } = await params
  const exists = await loadOwned(id, ctx.advertiser.id)
  if (!exists) return jsonError('Not found', 404)
  await prisma.campaign.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
