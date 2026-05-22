import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"

// Flip ACTIVE ↔ PAUSED for a campaign owned by the calling advertiser.
// Written as a Next.js route (rather than proxied to the BE) because we want
// the toggle to keep working while the BE's campaign endpoints stabilize.
export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 })
    }
    const { id } = await ctx.params
    const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

    const current = await prisma.campaign.findFirst({
      where: { id, advertiserId: advertiser.id },
      select: { id: true, status: true },
    })
    if (!current) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    // Only ACTIVE ↔ PAUSED is toggleable; DRAFT and ENDED are terminal-ish
    // states that need a more deliberate flow than a switch flip.
    if (current.status !== "ACTIVE" && current.status !== "PAUSED") {
      return NextResponse.json(
        { error: `Cannot toggle a ${current.status.toLowerCase()} campaign` },
        { status: 400 },
      )
    }
    const next = current.status === "ACTIVE" ? "PAUSED" : "ACTIVE"

    const updated = await prisma.campaign.update({
      where: { id },
      data: { status: next },
      select: { id: true, status: true },
    })
    return NextResponse.json({ id: updated.id, status: updated.status })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: `Toggle failed: ${message}` }, { status: 500 })
  }
}
