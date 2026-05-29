import { NextResponse, type NextRequest } from "next/server"

import { prisma } from "@/lib/prisma"
import { requireAdvertiser, isAuthError, jsonError } from "@/lib/api"
import { CreateTextAssetSchema } from "@/components/ads/types"
import { logger } from "@/lib/logger"

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const body = await req.json().catch(() => null)
  const parsed = CreateTextAssetSchema.safeParse(body)
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422)
  try {
    const asset = await prisma.asset.create({
      data: {
        advertiserId: ctx.advertiser.id,
        type: parsed.data.type,
        status: "APPROVED",
        textValue: parsed.data.textValue.trim(),
      },
    })
    return NextResponse.json({ asset }, { status: 201 })
  } catch (err) {
    logger.error({ err }, "Failed to create text asset")
    return jsonError("Failed to create asset", 500)
  }
}
