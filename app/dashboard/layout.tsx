import { getCachedSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { getOrCreateWallet } from "@/lib/wallet"
import { Web3Provider } from "@/components/web3-provider"
import DashboardShell from "./dashboard-shell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)
  const wallet = await getOrCreateWallet(advertiser.id)
  return (
    <Web3Provider>
      <DashboardShell
        user={session.user}
        advertiser={advertiser}
        walletBalanceUsdcCents={wallet.balanceUsdcCents}
      >
        {children}
      </DashboardShell>
    </Web3Provider>
  )
}
