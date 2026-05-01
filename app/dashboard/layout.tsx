import { getCachedSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import DashboardShell from "./dashboard-shell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)
  return (
    <DashboardShell user={session.user} advertiser={advertiser}>
      {children}
    </DashboardShell>
  )
}
