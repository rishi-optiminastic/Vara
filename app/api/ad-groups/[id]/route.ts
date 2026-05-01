import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdvertiser, isAuthError, jsonError } from "@/lib/api"
import { UpdateAdGroupSchema } from "@/components/ad-groups/types"
import { usdToCents } from "@/lib/money"
import { logger } from "@/lib/logger"

const INCLUDE = { campaign: { select: { id: true, name: true } }, targeting: true } as const

interface Params { params: Promise<{ id: string }> }

async function findAdGroup(id: string, advertiserId: string) {
  return prisma.adGroup.findFirst({
    where: { id, campaign: { advertiserId } },
    include: INCLUDE,
  })
}

export async function GET(_: NextRequest, { params }: Params): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const { id } = await params
  const adGroup = await findAdGroup(id, ctx.advertiser.id)
  if (!adGroup) return jsonError("Not found", 404)
  return NextResponse.json({ adGroup })
}

export async function PATCH(req: NextRequest, { params }: Params): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const { id } = await params
  if (!(await findAdGroup(id, ctx.advertiser.id))) return jsonError("Not found", 404)
  const body = await req.json().catch(() => null)
  const parsed = UpdateAdGroupSchema.safeParse(body)
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422)
  const d = parsed.data
  try {
    const adGroup = await prisma.adGroup.update({
      where: { id },
      data: {
        ...(d.name !== undefined && { name: d.name }),
        ...(d.status !== undefined && { status: d.status }),
        ...(d.bidUsd !== undefined && { bidUsdCents: usdToCents(d.bidUsd) }),
        ...(d.pricingModel !== undefined && { pricingModel: d.pricingModel }),
        ...(d.bidStrategy !== undefined && { bidStrategy: d.bidStrategy }),
        ...(d.dailyCapUsd !== undefined && { dailyCapUsdCents: usdToCents(d.dailyCapUsd) }),
        ...(d.startDate !== undefined && { startDate: d.startDate }),
        ...(d.endDate !== undefined && { endDate: d.endDate }),
      },
      include: INCLUDE,
    })
    return NextResponse.json({ adGroup })
  } catch (err) {
    logger.error({ err }, "Failed to update ad group")
    return jsonError("Failed to update ad group", 500)
  }
}

export async function DELETE(_: NextRequest, { params }: Params): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const { id } = await params
  if (!(await findAdGroup(id, ctx.advertiser.id))) return jsonError("Not found", 404)
  await prisma.adGroup.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
