import { NextResponse, type NextRequest } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getOrCreatePublisher } from "@/lib/publisher"
import { CreatePlacementSchema } from "@/components/ssp/inventory/types"
import { logger } from "@/lib/logger"

export async function GET(): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const publisher = await getOrCreatePublisher(session.user.id, session.user.name)
  const placements = await prisma.placement.findMany({
    where: { publisherId: publisher.id },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json({ placements })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const publisher = await getOrCreatePublisher(session.user.id, session.user.name)
  const body = await req.json().catch(() => null)
  const parsed = CreatePlacementSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 },
    )
  }
  try {
    const placement = await prisma.placement.create({
      data: {
        publisherId: publisher.id,
        name: parsed.data.name,
        format: parsed.data.format,
        chains: parsed.data.chains,
        width: parsed.data.width ?? null,
        height: parsed.data.height ?? null,
        floorPriceUsdcCents: parsed.data.floorPriceUsdcCents,
      },
    })
    return NextResponse.json({ placement }, { status: 201 })
  } catch (err) {
    logger.error({ err }, "Failed to create placement")
    return NextResponse.json({ error: "Failed to create placement" }, { status: 500 })
  }
}
