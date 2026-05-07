import { Suspense } from "react"
import { getCachedSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { loadWalletPageData } from "@/lib/wallet"
import { chainName } from "@/lib/chains"
import { env } from "@/lib/env"
import { Badge } from "@/components/ui/badge"
import { AccountOverview } from "@/components/settings/AccountOverview"
import { WalletPanel } from "@/components/settings/WalletPanel"
import { SettingsTabs } from "@/components/settings/SettingsTabs"

export default async function SettingsPage(): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const since = new Date()
  since.setDate(since.getDate() - 30)

  const [totalCampaigns, activeCampaigns, spendAgg, walletData] = await Promise.all([
    prisma.campaign.count({ where: { advertiserId: advertiser.id } }),
    prisma.campaign.count({ where: { advertiserId: advertiser.id, status: "ACTIVE" } }),
    prisma.metricDaily.aggregate({
      where: { campaign: { advertiserId: advertiser.id }, date: { gte: since } },
      _sum: { spendUsdCents: true },
    }),
    loadWalletPageData(advertiser.id),
  ])

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-end justify-between border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <div>
          <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
            Account{" "}
            <span className="font-instrument-serif italic font-normal text-[26px]">settings</span>
          </h1>
          <p className="text-[11px] text-muted-foreground mt-1.5">
            Profile, workspace, on-chain configuration, and ad wallet.
          </p>
        </div>
        <Badge
          variant="outline"
          className="h-5 px-2 text-[10px] uppercase tracking-widest bg-white/60 border-[rgba(55,50,47,0.16)] text-[#37322F]"
        >
          {advertiser.id.slice(0, 8)}
        </Badge>
      </div>

      <Suspense fallback={null}>
      <SettingsTabs
        overview={
          <AccountOverview
            user={{
              name: session.user.name,
              email: session.user.email,
              image: session.user.image ?? null,
              emailVerified: session.user.emailVerified ?? false,
              createdAt: session.user.createdAt,
            }}
            advertiser={{
              id: advertiser.id,
              projectName: advertiser.projectName,
              websiteUrl: advertiser.websiteUrl,
              chain: chainName(advertiser.chain),
              contractAddrs: advertiser.contractAddrs,
              createdAt: advertiser.createdAt,
              updatedAt: advertiser.updatedAt,
            }}
            totalCampaigns={totalCampaigns}
            activeCampaigns={activeCampaigns}
            spendCents30d={spendAgg._sum.spendUsdCents ?? 0}
          />
        }
        wallet={
          <WalletPanel
            wallet={walletData.wallet}
            transactions={walletData.transactions}
            depositAddress={env.WALLET_DEPOSIT_RECEIVER_SEPOLIA ?? null}
          />
        }
      />
      </Suspense>
    </div>
  )
}
