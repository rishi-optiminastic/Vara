import Link from "next/link"
import { getCachedSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { centsToUsd } from "@/lib/money"
import { chainName } from "@/lib/chains"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/campaigns/components/StatusBadge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-end justify-between border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <div>
          <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
            <span className="font-instrument-serif italic font-normal text-[26px]">Ad Groups</span>
          </h1>
          <p className="text-[11px] text-muted-foreground mt-1.5">{adGroups.length} total</p>
        </div>
        <Button asChild size="sm" className="h-8 gap-1.5 text-xs rounded-full px-4 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(55,50,47,0.18)]">
          <Link href="/dashboard/ad-groups/new">
            <BoxPlusIcon className="size-3" />New Ad Group
          </Link>
        </Button>
      </div>

      <Card className="gap-0 py-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
        <CardHeader className="border-b border-[rgba(55,50,47,0.12)] px-3 py-2">
          <CardTitle className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">All Ad Groups</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {adGroups.length === 0 ? (
            <div className="px-3 py-12 text-center text-xs text-muted-foreground">
              No ad groups yet.{" "}
              <Link href="/dashboard/ad-groups/new" className="font-medium text-foreground underline underline-offset-2">
                Create one
              </Link>
              .
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="h-7 hover:bg-transparent">
                  <TableHead className="h-7 text-[10px] uppercase tracking-wider">Name</TableHead>
                  <TableHead className="h-7 text-[10px] uppercase tracking-wider">Campaign</TableHead>
                  <TableHead className="h-7 text-[10px] uppercase tracking-wider">Chains</TableHead>
                  <TableHead className="h-7 text-[10px] uppercase tracking-wider">Bid</TableHead>
                  <TableHead className="h-7 text-[10px] uppercase tracking-wider">Pricing</TableHead>
                  <TableHead className="h-7 text-[10px] uppercase tracking-wider">Daily cap</TableHead>
                  <TableHead className="h-7 text-[10px] uppercase tracking-wider">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adGroups.map((ag) => (
                  <TableRow key={ag.id} className="h-8">
                    <TableCell className="py-1.5 text-xs font-medium">
                      <Link href={`/dashboard/ad-groups/${ag.id}`} className="hover:underline">{ag.name}</Link>
                    </TableCell>
                    <TableCell className="py-1.5 text-xs text-muted-foreground">
                      <Link href={`/dashboard/campaigns/${ag.campaign.id}`} className="hover:underline text-[#37322F]">
                        {ag.campaign.name}
                      </Link>
                    </TableCell>
                    <TableCell className="py-1.5 text-xs text-muted-foreground">
                      {ag.targeting?.chains.length ? ag.targeting.chains.map(chainName).join(", ") : "All"}
                    </TableCell>
                    <TableCell className="py-1.5 text-xs tabular-nums">{centsToUsd(ag.bidUsdCents)}</TableCell>
                    <TableCell className="py-1.5 text-xs">{ag.pricingModel}</TableCell>
                    <TableCell className="py-1.5 text-xs tabular-nums">
                      {ag.dailyCapUsdCents ? centsToUsd(ag.dailyCapUsdCents) : "—"}
                    </TableCell>
                    <TableCell className="py-1.5"><StatusBadge status={ag.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
