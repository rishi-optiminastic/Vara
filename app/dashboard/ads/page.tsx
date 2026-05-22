import Link from "next/link"
import { getCachedSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { Button } from "@/components/ui/button"
import { AdsTable } from "@/components/dashboard/AdsTable"
import type { AdRow } from "@/components/dashboard/AdsTable"
import { BoxPlusIcon } from "@/icons"

interface PageProps {
  searchParams: Promise<{ campaign?: string }>
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
    include: { campaign: { select: { id: true, name: true, status: true } } },
    orderBy: { createdAt: "desc" },
  })

  const filterCampaign = campaignFilter
    ? await prisma.campaign.findFirst({
        where: { id: campaignFilter, advertiserId: advertiser.id },
        select: { name: true },
      })
    : null

  const newHref = campaignFilter ? `/dashboard/ads/new?campaign=${campaignFilter}` : "/dashboard/ads/new"

  const rows: AdRow[] = creatives.map((cr) => ({
    id: cr.id,
    name: cr.name,
    format: cr.format,
    width: cr.width,
    height: cr.height,
    assetUrl: cr.assetUrl,
    walletConnectCta: cr.walletConnectCta,
    campaignId: cr.campaign.id,
    campaignName: cr.campaign.name,
    campaignStatus: cr.campaign.status,
    createdAt: cr.createdAt.toISOString(),
  }))

  return (
    <div className="relative min-h-full">
      <div aria-hidden className="pointer-events-none absolute inset-0 flex">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 border-l border-dashed border-[rgba(10,10,10,0.08)] first:border-l-0 last:border-r"
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col gap-2.5 p-3">
        <div className="flex items-end justify-between gap-2">
          <div className="shrink-0 flex items-baseline gap-2 flex-wrap">
            <h1 className="text-[#0A0A0A] tracking-[-0.02em] text-[20px] font-medium leading-none">
              Ads
            </h1>
            <span className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground tabular-nums">
              {creatives.length} total
            </span>
            {filterCampaign && (
              <span className="text-[11px] text-[#0A0A0A]/75">
                · filtered by <span className="font-medium">{filterCampaign.name}</span>
                <Link
                  href="/dashboard/ads"
                  className="ml-1.5 text-[#0A0A0A]/55 hover:text-[#1F40CD] underline underline-offset-4"
                >
                  clear
                </Link>
              </span>
            )}
          </div>
          <Button
            asChild
            size="sm"
            className="h-8 rounded-full gap-1.5 text-[11px] px-3.5 bg-[#1F40CD] text-white hover:bg-[#1A36B0]"
          >
            <Link href={newHref}>
              <BoxPlusIcon className="size-3" />
              New ad
            </Link>
          </Button>
        </div>

        {creatives.length === 0 ? (
          <div className="bg-white rounded-md px-3 py-10 text-center text-[12px] text-muted-foreground">
            No ads yet.{" "}
            <Link href={newHref} className="text-[#1F40CD] underline underline-offset-4">
              Create one
            </Link>
            .
          </div>
        ) : (
          <AdsTable rows={rows} />
        )}
      </div>
    </div>
  )
}
