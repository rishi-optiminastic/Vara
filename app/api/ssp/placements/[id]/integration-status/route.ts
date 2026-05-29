import { NextResponse, type NextRequest } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getOrCreatePublisher } from "@/lib/publisher"

interface Ctx {
  params: Promise<{ id: string }>
}

// Polled by the SSP onboarding wizard's "Drop in the SDK" step to flip the
// integration status to green once the RTB engine has stamped firstSeenAt for
// the placement (i.e. the publisher's site has fired at least one bid request).
export async function GET(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const publisher = await getOrCreatePublisher(session.user.id, session.user.name)
  const { id } = await params

  const placement = await prisma.placement.findFirst({
    where: { id, publisherId: publisher.id },
    select: { id: true, firstSeenAt: true },
  })
  if (!placement) {
    return NextResponse.json({ error: "Placement not found" }, { status: 404 })
  }

  return NextResponse.json({
    placementId: placement.id,
    firstSeenAt: placement.firstSeenAt?.toISOString() ?? null,
    verified: placement.firstSeenAt !== null,
  })
}
