import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getOrCreatePublisher } from '@/lib/publisher'
import { getOrCreatePublisherWallet } from '@/lib/publisherWallet'
import SspDashboardShell from '@/components/ssp/SspDashboardShell'

export default async function SspDashboardLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<React.JSX.Element> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/ssp/sign-in')
  const publisher = await getOrCreatePublisher(session.user.id, session.user.name)
  const wallet = await getOrCreatePublisherWallet(publisher.id)
  return (
    <SspDashboardShell user={session.user} availableUsdcCents={wallet.availableUsdcCents}>
      {children}
    </SspDashboardShell>
  )
}
