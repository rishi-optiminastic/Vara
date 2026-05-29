import { NextResponse, type NextRequest } from "next/server"

import { prisma } from "@/lib/prisma"
import { requireAdvertiser, isAuthError, jsonError } from "@/lib/api"
import { logger } from "@/lib/logger"

interface Params { params: Promise<{ id: string }> }

export async function DELETE(_: NextRequest, { params }: Params): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const { id } = await params
  const asset = await prisma.asset.findFirst({
    where: { id, advertiserId: ctx.advertiser.id },
    select: { id: true },
  })
  if (!asset) return jsonError("Not found", 404)
  try {
    // Soft archive — leaves the asset visible in historical reporting while
    // hiding it from the picker.
    await prisma.asset.update({ where: { id }, data: { status: "ARCHIVED" } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error({ err }, "Failed to archive asset")
    return jsonError("Failed to delete asset", 500)
  }
}
