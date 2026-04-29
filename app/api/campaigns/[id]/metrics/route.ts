import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdvertiser, isAuthError, jsonError } from "@/lib/api"

interface RouteCtx {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: RouteCtx): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const { id } = await params
  const owned = await prisma.campaign.findFirst({
    where: { id, advertiserId: ctx.advertiser.id },
    select: { id: true },
  })
  if (!owned) return jsonError("Not found", 404)

  const { searchParams } = new URL(req.url)
  const days = Math.min(Math.max(parseInt(searchParams.get("days") ?? "30", 10), 1), 365)
  const since = new Date()
  since.setDate(since.getDate() - days)

  const metrics = await prisma.metricDaily.findMany({
    where: { campaignId: id, date: { gte: since } },
    orderBy: { date: "asc" },
  })
  return NextResponse.json({ metrics })
}
