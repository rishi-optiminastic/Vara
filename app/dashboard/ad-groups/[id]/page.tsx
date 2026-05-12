import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getCachedSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { centsToUsd } from "@/lib/money"
import { chainName } from "@/lib/chains"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/campaigns/components/StatusBadge"
import { AdGroupActions } from "@/components/ad-groups/components/AdGroupActions"
import { CreativeGallery } from "@/components/ads/components/CreativeGallery"
import { ChevronLeftIcon } from "@/icons"

interface Props { params: Promise<{ id: string }> }

export default async function AdGroupDetailPage({ params }: Props): Promise<React.JSX.Element> {
  const { id } = await params
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const adGroup = await prisma.adGroup.findFirst({
    where: { id, campaign: { advertiserId: advertiser.id } },
    include: {
      campaign: {
        select: {
          id: true,
          name: true,
          creatives: {
            select: { id: true, name: true, format: true, assetUrl: true, walletConnectCta: true, width: true, height: true },
            orderBy: { createdAt: "desc" },
          },
        },
      },
      targeting: true,
    },
  })
  if (!adGroup) notFound()

  const t = adGroup.targeting
  const creatives = adGroup.campaign.creatives

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <Link href="/dashboard/ad-groups" className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-[#37322F] transition-colors">
          <ChevronLeftIcon className="size-3" />Ad Groups
        </Link>
        <div className="flex items-start justify-between gap-3 mt-1.5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none truncate">{adGroup.name}</h1>
              <StatusBadge status={adGroup.status} />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Campaign:{" "}
              <Link href={`/dashboard/campaigns/${adGroup.campaign.id}`} className="hover:underline text-[#37322F] font-medium">
                {adGroup.campaign.name}
              </Link>
              {" · "}{centsToUsd(adGroup.bidUsdCents)} {adGroup.pricingModel}
              {" · "}{adGroup.bidStrategy.replace(/_/g, " ").toLowerCase()}
            </p>
          </div>
          <AdGroupActions id={adGroup.id} status={adGroup.status} />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
          <div className="border-b border-[rgba(55,50,47,0.12)] px-3.5 py-2">
            <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Configuration</h3>
          </div>
          <CardContent className="p-3.5 grid grid-cols-2 gap-x-6 gap-y-3">
            <Field label="Bid" value={centsToUsd(adGroup.bidUsdCents)} />
            <Field label="Pricing model" value={adGroup.pricingModel} />
            <Field label="Bid strategy" value={adGroup.bidStrategy.replace(/_/g, " ").toLowerCase()} capitalize />
            <Field label="Daily cap" value={adGroup.dailyCapUsdCents ? centsToUsd(adGroup.dailyCapUsdCents) : "—"} />
            <Field label="Start date" value={adGroup.startDate ? dateLabel(adGroup.startDate) : "Inherits campaign"} />
            <Field label="End date" value={adGroup.endDate ? dateLabel(adGroup.endDate) : "Inherits campaign"} />
          </CardContent>
        </Card>

        <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
          <div className="border-b border-[rgba(55,50,47,0.12)] px-3.5 py-2">
            <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Targeting</h3>
          </div>
          <CardContent className="p-3.5 space-y-3">
            <ChipRow label="Chains" items={(t?.chains ?? []).map(chainName)} empty="All chains" />
            <ChipRow label="Geos" items={t?.geos ?? []} empty="Worldwide" />
            <ChipRow label="Devices" items={(t?.deviceTypes ?? []).map((d) => d.toLowerCase())} empty="All devices" capitalize />
          </CardContent>
        </Card>
      </div>

      <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
        <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.12)] px-3.5 py-2">
          <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Creatives in campaign
          </h3>
          <span className="text-[10px] tabular-nums text-muted-foreground">
            {creatives.length}
          </span>
        </div>
        <CardContent className="p-3.5">
          <CreativeGallery
            creatives={creatives}
            newAdHref={`/dashboard/ads/new?campaign=${adGroup.campaign.id}`}
            emptyTitle="No ads in this campaign yet"
          />
        </CardContent>
      </Card>
    </div>
  )
}

function Field({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }): React.JSX.Element {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`text-xs font-medium text-[#37322F] mt-1 truncate ${capitalize ? "capitalize" : ""}`}>{value}</div>
    </div>
  )
}

function ChipRow({ label, items, empty, capitalize }: { label: string; items: string[]; empty: string; capitalize?: boolean }): React.JSX.Element {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
      {items.length === 0 ? (
        <span className="text-[11px] text-muted-foreground italic">{empty}</span>
      ) : (
        <div className="flex flex-wrap gap-1">
          {items.map((it) => (
            <Badge key={it} variant="outline" className={`h-4 px-1.5 text-[9px] bg-white/60 border-[rgba(55,50,47,0.16)] ${capitalize ? "capitalize" : "uppercase"}`}>{it}</Badge>
          ))}
        </div>
      )}
    </div>
  )
}

function dateLabel(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
