import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getOrCreatePublisher } from "@/lib/publisher"
import type { Publisher } from "@prisma/client"

export interface PublisherCtx {
  userId: string
  publisher: Publisher
}

export async function requirePublisher(): Promise<PublisherCtx | NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const publisher = await getOrCreatePublisher(session.user.id, session.user.name)
  return { userId: session.user.id, publisher }
}

export function isPublisherAuthError(
  ctx: PublisherCtx | NextResponse,
): ctx is NextResponse {
  return ctx instanceof NextResponse
}
