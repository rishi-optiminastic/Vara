import { getCachedSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { chainName } from "@/lib/chains"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProfileCard } from "@/components/settings/ProfileCard"
import { WorkspaceCard } from "@/components/settings/WorkspaceCard"
import { ContractsCard } from "@/components/settings/ContractsCard"
import { CampaignsIcon, GaugeIcon, SpendIcon } from "@/icons"
import { centsToUsd } from "@/lib/money"

export default async function SettingsPage(): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const since = new Date()
  since.setDate(since.getDate() - 30)

  const [totalCampaigns, activeCampaigns, spendAgg] = await Promise.all([
    prisma.campaign.count({ where: { advertiserId: advertiser.id } }),
    prisma.campaign.count({ where: { advertiserId: advertiser.id, status: "ACTIVE" } }),
    prisma.metricDaily.aggregate({
      where: { campaign: { advertiserId: advertiser.id }, date: { gte: since } },
      _sum: { spendUsdCents: true },
    }),
  ])

  const stats = [
    { label: "Campaigns", value: String(totalCampaigns), icon: CampaignsIcon, tint: "bg-[#EAF1FF] text-[#1E40AF]" },
    { label: "Active", value: String(activeCampaigns), icon: GaugeIcon, tint: "bg-[#E8F5E9] text-[#15803D]" },
    { label: "Spend (30d)", value: centsToUsd(spendAgg._sum.spendUsdCents ?? 0), icon: SpendIcon, tint: "bg-[#FFF3E8] text-[#C2410C]" },
  ]

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-end justify-between border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <div>
          <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
            Account{" "}
            <span className="font-instrument-serif italic font-normal text-[26px]">settings</span>
          </h1>
          <p className="text-[11px] text-muted-foreground mt-1.5">
            Profile, workspace and on-chain configuration.
          </p>
        </div>
        <Badge
          variant="outline"
          className="h-5 px-2 text-[10px] uppercase tracking-widest bg-white/60 border-[rgba(55,50,47,0.16)] text-[#37322F]"
        >
          {advertiser.id.slice(0, 8)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {stats.map((s) => (
          <Card
            key={s.label}
            className="py-3 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]"
          >
            <CardContent className="px-3">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </span>
                <div className={`flex h-5 w-5 items-center justify-center rounded-md ${s.tint}`}>
                  <s.icon className="size-3" />
                </div>
              </div>
              <div className="text-[20px] font-medium tracking-tight tabular-nums text-[#37322F] leading-none">
                {s.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <ProfileCard
            name={session.user.name ?? "—"}
            email={session.user.email ?? "—"}
            image={session.user.image ?? null}
            emailVerified={session.user.emailVerified ?? false}
            createdAt={session.user.createdAt}
          />
        </div>
        <div className="lg:col-span-3">
          <WorkspaceCard
            advertiserId={advertiser.id}
            projectName={advertiser.projectName}
            websiteUrl={advertiser.websiteUrl}
            primaryChain={chainName(advertiser.chain)}
            createdAt={advertiser.createdAt}
            updatedAt={advertiser.updatedAt}
          />
        </div>
      </div>

      <ContractsCard contracts={advertiser.contractAddrs} primaryChain={chainName(advertiser.chain)} />
    </div>
  )
}
