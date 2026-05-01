import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdvertiser, isAuthError, jsonError } from "@/lib/api"
import { logger } from "@/lib/logger"

interface Params { params: Promise<{ id: string }> }

export async function DELETE(_req: NextRequest, { params }: Params): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const { id } = await params

  const creative = await prisma.creative.findFirst({
    where: { id, campaign: { advertiserId: ctx.advertiser.id } },
    select: { id: true },
  })
  if (!creative) return jsonError("Not found", 404)

  try {
    await prisma.creative.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error({ err }, "Failed to delete creative")
    return jsonError("Failed to delete creative", 500)
  }
}
