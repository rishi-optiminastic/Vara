import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdvertiser, isAuthError } from "@/lib/api"

export async function GET(): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const segments = await prisma.walletSegment.findMany({
    orderBy: { name: "asc" },
  })
  return NextResponse.json({ segments })
}
