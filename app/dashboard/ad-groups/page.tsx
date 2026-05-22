import Link from "next/link"
import { getCachedSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { Button } from "@/components/ui/button"
import { AdGroupsTable } from "@/components/dashboard/AdGroupsTable"
import type { AdGroupRow } from "@/components/dashboard/AdGroupsTable"
import { BoxPlusIcon } from "@/icons"

export default async function AdGroupsPage(): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const adGroups = await prisma.adGroup.findMany({
    where: { campaign: { advertiserId: advertiser.id } },
    orderBy: { createdAt: "desc" },
    include: { campaign: { select: { id: true, name: true } }, targeting: true },
  })

  const rows: AdGroupRow[] = adGroups.map((ag) => ({
    id: ag.id,
    name: ag.name,
    status: ag.status,
    campaignId: ag.campaign.id,
    campaignName: ag.campaign.name,
    pricingModel: ag.pricingModel,
    bidStrategy: ag.bidStrategy,
    bidUsdCents: ag.bidUsdCents,
    dailyCapUsdCents: ag.dailyCapUsdCents,
    startDate: ag.startDate ? ag.startDate.toISOString() : null,
    endDate: ag.endDate ? ag.endDate.toISOString() : null,
    chains: ag.targeting?.chains ?? [],
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
          <div className="shrink-0 flex items-baseline gap-2">
            <h1 className="text-[#0A0A0A] tracking-[-0.02em] text-[20px] font-medium leading-none">
              Ad groups
            </h1>
            <span className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground tabular-nums">
              {adGroups.length} total
            </span>
          </div>
          <Button
            asChild
            size="sm"
            className="h-8 rounded-full gap-1.5 text-[11px] px-3.5 bg-[#1F40CD] text-white hover:bg-[#1A36B0]"
          >
            <Link href="/dashboard/ad-groups/new">
              <BoxPlusIcon className="size-3" />
              New ad group
            </Link>
          </Button>
        </div>

        {adGroups.length === 0 ? (
          <div className="bg-white rounded-md px-3 py-10 text-center text-[12px] text-muted-foreground">
            No ad groups yet.{" "}
            <Link
              href="/dashboard/ad-groups/new"
              className="text-[#1F40CD] underline underline-offset-4"
            >
              Create one
            </Link>
            .
          </div>
        ) : (
          <AdGroupsTable rows={rows} />
        )}
      </div>
    </div>
  )
}
