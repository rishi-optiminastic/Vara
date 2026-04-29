import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import SspDashboardShell from '@/components/ssp/SspDashboardShell'

export default async function SspDashboardLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<React.JSX.Element> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/ssp/sign-in')
  return <SspDashboardShell user={session.user}>{children}</SspDashboardShell>
}
