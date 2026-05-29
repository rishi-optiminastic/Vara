import { NextResponse, type NextRequest } from "next/server"

import { prisma } from "@/lib/prisma"
import { requireAdvertiser, isAuthError, jsonError } from "@/lib/api"
import { CreateFileAssetSchema } from "@/components/ads/types"
import { logger } from "@/lib/logger"

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const body = await req.json().catch(() => null)
  const parsed = CreateFileAssetSchema.safeParse(body)
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422)
  const d = parsed.data
  try {
    const asset = await prisma.asset.create({
      data: {
        advertiserId: ctx.advertiser.id,
        type: d.type,
        // Auto-approve in dev/v1 so the wizard flow finishes end-to-end.
        // Wire real review once moderation is in place (see roadmap).
        status: "APPROVED",
        fileUrl: d.fileUrl,
        fileMimeType: d.fileMimeType ?? null,
        fileBytes: d.fileBytes ?? null,
        width: d.width ?? null,
        height: d.height ?? null,
        durationMs: d.durationMs ?? null,
        aspectRatio: d.aspectRatio ?? null,
        gatedByContract: d.gatedByContract ?? null,
      },
    })
    return NextResponse.json({ asset }, { status: 201 })
  } catch (err) {
    logger.error({ err }, "Failed to create file asset")
    return jsonError("Failed to create asset", 500)
  }
}
