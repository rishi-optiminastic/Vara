import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import type { Advertiser } from "@prisma/client"

export interface AuthCtx {
  userId: string
  advertiser: Advertiser
}

export async function requireAdvertiser(): Promise<AuthCtx | NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const advertiser = await getOrCreateAdvertiser(
    session.user.id,
    session.user.name,
  )
  return { userId: session.user.id, advertiser }
}

export function isAuthError(
  ctx: AuthCtx | NextResponse,
): ctx is NextResponse {
  return ctx instanceof NextResponse
}

export function jsonError(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status })
}
