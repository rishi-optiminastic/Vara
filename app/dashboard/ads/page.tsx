import Link from "next/link"
import { getCachedSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/campaigns/components/StatusBadge"
import { AdPreview } from "@/components/ads/components/AdPreview"
import { BoxPlusIcon } from "@/icons"
import type { CreativeFormat } from "@prisma/client"

interface PageProps {
  searchParams: Promise<{ campaign?: string }>
}

const FORMAT_STYLE: Record<CreativeFormat, string> = {
  BANNER: "bg-[#EAF1FF] text-[#1E40AF]",
  HTML5: "bg-[#F0E8FF] text-[#6D28D9]",
  VIDEO: "bg-[#FFF7E0] text-[#A16207]",
  NATIVE: "bg-[#E8F5E9] text-[#15803D]",
}

export default async function AdsPage({ searchParams }: PageProps): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const { campaign: campaignFilter } = await searchParams

  const creatives = await prisma.creative.findMany({
    where: {
      campaign: {
        advertiserId: advertiser.id,
        ...(campaignFilter ? { id: campaignFilter } : {}),
      },
    },
    include: {
      campaign: { select: { id: true, name: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const filterCampaign = campaignFilter
    ? await prisma.campaign.findFirst({
        where: { id: campaignFilter, advertiserId: advertiser.id },
        select: { name: true },
      })
    : null

  const newHref = campaignFilter ? `/dashboard/ads/new?campaign=${campaignFilter}` : "/dashboard/ads/new"

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-end justify-between border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <div>
          <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
            <span className="font-instrument-serif italic font-normal text-[26px]">Ads</span>
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <p className="text-[11px] text-muted-foreground">{creatives.length} total</p>
            {filterCampaign && (
              <>
                <span className="text-[11px] text-muted-foreground">·</span>
                <span className="text-[11px] text-[#37322F]">
                  filtered by <span className="font-medium">{filterCampaign.name}</span>
                </span>
                <Link href="/dashboard/ads" className="text-[11px] text-muted-foreground hover:text-[#37322F] underline underline-offset-2">
                  clear
                </Link>
              </>
            )}
          </div>
        </div>
        <Button asChild size="sm" className="h-8 gap-1.5 text-xs rounded-full px-4 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(55,50,47,0.18)]">
          <Link href={newHref}>
            <BoxPlusIcon className="size-3" />New Ad
          </Link>
        </Button>
      </div>

      <Card className="gap-0 py-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
        <CardHeader className="border-b border-[rgba(55,50,47,0.12)] px-3 py-2">
          <CardTitle className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">All Ads</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {creatives.length === 0 ? (
            <div className="px-3 py-12 text-center text-xs text-muted-foreground">
              No ads yet.{" "}
              <Link href={newHref} className="font-medium text-foreground underline underline-offset-2">
                Create one
              </Link>
              .
            </div>
          ) : (
            <div className="divide-y divide-[rgba(55,50,47,0.07)]">
              {creatives.map((cr) => (
                <div key={cr.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-[rgba(55,50,47,0.02)] transition-colors">
                  <Link href={`/dashboard/ads/${cr.id}`} className="w-24 shrink-0 group/preview">
                    <div className="transition-transform group-hover/preview:scale-[1.02]">
                      <AdPreview
                        format={cr.format}
                        assetUrl={cr.assetUrl}
                        name={cr.name}
                        walletConnectCta={cr.walletConnectCta}
                        compact
                      />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/dashboard/ads/${cr.id}`} className="text-xs font-medium text-[#37322F] hover:underline truncate">
                        {cr.name}
                      </Link>
                      <span className={`inline-flex items-center rounded-full px-1.5 py-px text-[9px] font-medium uppercase tracking-wider ${FORMAT_STYLE[cr.format]}`}>
                        {cr.format.toLowerCase()}
                      </span>
                      {cr.walletConnectCta && (
                        <Badge variant="outline" className="h-4 px-1.5 text-[9px] bg-[#E8F5E9] text-[#15803D] border-[#15803D]/20">
                          Wallet CTA
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Link href={`/dashboard/campaigns/${cr.campaign.id}`} className="text-[11px] text-muted-foreground hover:text-[#37322F] hover:underline truncate">
                        {cr.campaign.name}
                      </Link>
                      <span className="text-[11px] text-muted-foreground">·</span>
                      <StatusBadge status={cr.campaign.status} />
                    </div>
                  </div>
                  <div className="shrink-0 text-[10px] text-muted-foreground tabular-nums">
                    {cr.width}×{cr.height}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
