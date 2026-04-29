import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Early access — Varaads",
  description: "Request early access to Varaads and join the waitlist.",
}

export default function EarlyAccessLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
