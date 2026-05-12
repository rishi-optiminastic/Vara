import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { env } from "@/lib/env"
import { logger } from "@/lib/logger"
import {
  chargeCampaignSpend,
  OverChargeError,
} from "@/lib/walletEscrow"

const Body = z.object({
  campaignId: z.string().min(1),
  amountUsdCents: z.number().int().positive(),
  source: z.string().max(64).optional(),
})

/**
 * Internal endpoint hit by the indexer/RTB settlement worker to debit
 * spend against a campaign's reservation. Authenticated via the
 * `INTERNAL_API_TOKEN` shared secret.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = env.INTERNAL_API_TOKEN
  if (!secret) {
    return NextResponse.json(
      { error: "Server missing INTERNAL_API_TOKEN" },
      { status: 500 },
    )
  }
  const auth = req.headers.get("authorization") ?? ""
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 },
    )
  }
  const { campaignId, amountUsdCents, source } = parsed.data

  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } })
  if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 })

  try {
    await chargeCampaignSpend(campaignId, amountUsdCents, source)
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof OverChargeError) {
      return NextResponse.json({ error: err.message }, { status: 409 })
    }
    logger.error({ err, campaignId, amountUsdCents }, "Failed to charge campaign spend")
    return NextResponse.json({ error: "Failed to charge" }, { status: 500 })
  }
}
