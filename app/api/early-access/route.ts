import { NextResponse } from "next/server"
import { z } from "zod"

const bodySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Enter a valid email"),
  company: z.string().max(200).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
})

export async function POST(request: Request) {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors
    const message =
      Object.values(first).flat()[0] ?? "Invalid input"
    return NextResponse.json({ error: message }, { status: 400 })
  }

  // Extend here: save to DB, send email (Resend, etc.), or forward to a CRM.
  return NextResponse.json({ ok: true })
}
