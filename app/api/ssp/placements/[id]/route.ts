import { NextResponse, type NextRequest } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getOrCreatePublisher } from "@/lib/publisher"
import { UpdatePlacementStatusSchema } from "@/components/ssp/inventory/types"

interface Ctx {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const publisher = await getOrCreatePublisher(session.user.id, session.user.name)
  const { id } = await params

  const body = await req.json().catch(() => null)
  const parsed = UpdatePlacementStatusSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 },
    )
  }

  const result = await prisma.placement.updateMany({
    where: { id, publisherId: publisher.id },
    data: { status: parsed.data.status },
  })
  if (result.count === 0) {
    return NextResponse.json({ error: "Placement not found" }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const publisher = await getOrCreatePublisher(session.user.id, session.user.name)
  const { id } = await params

  const result = await prisma.placement.deleteMany({
    where: { id, publisherId: publisher.id },
  })
  if (result.count === 0) {
    return NextResponse.json({ error: "Placement not found" }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
