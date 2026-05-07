import { Card, CardContent } from "@/components/ui/card"
import { ProfileCard } from "@/components/settings/ProfileCard"
import { WorkspaceCard } from "@/components/settings/WorkspaceCard"
import { ContractsCard } from "@/components/settings/ContractsCard"
import { CampaignsIcon, GaugeIcon, SpendIcon } from "@/icons"
import { centsToUsd } from "@/lib/money"

interface Stat {
  label: string
  value: string
  icon: React.ElementType
  tint: string
}

interface Props {
  user: {
    name: string | null
    email: string | null
    image: string | null
    emailVerified: boolean
    createdAt: Date
  }
  advertiser: {
    id: string
    projectName: string
    websiteUrl: string | null
    chain: string
    contractAddrs: string[]
    createdAt: Date
    updatedAt: Date
  }
  totalCampaigns: number
  activeCampaigns: number
  spendCents30d: number
}

export function AccountOverview({
  user,
  advertiser,
  totalCampaigns,
  activeCampaigns,
  spendCents30d,
}: Props): React.JSX.Element {
  const stats: Stat[] = [
    { label: "Campaigns", value: String(totalCampaigns), icon: CampaignsIcon, tint: "bg-[#EAF1FF] text-[#1E40AF]" },
    { label: "Active", value: String(activeCampaigns), icon: GaugeIcon, tint: "bg-[#E8F5E9] text-[#15803D]" },
    { label: "Spend (30d)", value: centsToUsd(spendCents30d), icon: SpendIcon, tint: "bg-[#FFF3E8] text-[#C2410C]" },
  ]

  return (
    <div className="flex flex-col gap-3">
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
            name={user.name ?? "—"}
            email={user.email ?? "—"}
            image={user.image ?? null}
            emailVerified={user.emailVerified}
            createdAt={user.createdAt}
          />
        </div>
        <div className="lg:col-span-3">
          <WorkspaceCard
            advertiserId={advertiser.id}
            projectName={advertiser.projectName}
            websiteUrl={advertiser.websiteUrl}
            primaryChain={advertiser.chain}
            createdAt={advertiser.createdAt}
            updatedAt={advertiser.updatedAt}
          />
        </div>
      </div>

      <ContractsCard contracts={advertiser.contractAddrs} primaryChain={advertiser.chain} />
    </div>
  )
}
