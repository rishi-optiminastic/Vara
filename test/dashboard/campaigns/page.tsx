import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { centsToUsd } from "@/lib/money"
import { chainName } from "@/lib/chains"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/features/campaigns/components/StatusBadge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus } from "lucide-react"

export default async function CampaignsListPage(): Promise<React.JSX.Element> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const campaigns = await prisma.campaign.findMany({
    where: { advertiserId: advertiser.id },
    orderBy: { createdAt: "desc" },
    include: { targeting: true, _count: { select: { creatives: true } } },
  })

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-end justify-between border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <div>
          <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
            <span className="font-instrument-serif italic font-normal text-[26px]">Campaigns</span>
          </h1>
          <p className="text-[11px] text-muted-foreground mt-1.5">{campaigns.length} total</p>
        </div>
        <Button asChild size="sm" className="h-8 gap-1.5 text-xs rounded-full px-4 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[0_0_0_2.5px_rgba(255,255,255,0.08)_inset]">
          <Link href="/dashboard/campaigns/new"><Plus className="size-3" />New Campaign</Link>
        </Button>
      </div>

      <Card className="gap-0 py-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
        <CardHeader className="border-b border-[rgba(55,50,47,0.12)] px-3 py-2">
          <CardTitle className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">All Campaigns</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {campaigns.length === 0 ? (
            <div className="px-3 py-12 text-center text-xs text-muted-foreground">
              No campaigns yet.{" "}
              <Link href="/dashboard/campaigns/new" className="font-medium text-foreground underline underline-offset-2">
                Create one
              </Link>
              .
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="h-7 hover:bg-transparent">
                  <TableHead className="h-7 text-[10px] uppercase tracking-wider">Name</TableHead>
                  <TableHead className="h-7 text-[10px] uppercase tracking-wider">Vertical</TableHead>
                  <TableHead className="h-7 text-[10px] uppercase tracking-wider">Chains</TableHead>
                  <TableHead className="h-7 text-[10px] uppercase tracking-wider">Budget</TableHead>
                  <TableHead className="h-7 text-[10px] uppercase tracking-wider">Bid (CPM)</TableHead>
                  <TableHead className="h-7 text-[10px] uppercase tracking-wider">Creatives</TableHead>
                  <TableHead className="h-7 text-[10px] uppercase tracking-wider">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((c) => (
                  <TableRow key={c.id} className="h-8">
                    <TableCell className="py-1.5 text-xs font-medium">
                      <Link href={`/dashboard/campaigns/${c.id}`} className="hover:underline">{c.name}</Link>
                    </TableCell>
                    <TableCell className="py-1.5">
                      <Badge variant="outline" className="h-4 px-1.5 text-[9px] uppercase tracking-wider">
                        {c.vertical.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-1.5 text-xs text-muted-foreground">
                      {c.targeting?.chains.length ? c.targeting.chains.map(chainName).join(", ") : "—"}
                    </TableCell>
                    <TableCell className="py-1.5 text-xs tabular-nums">{centsToUsd(c.budgetUsdCents)}</TableCell>
                    <TableCell className="py-1.5 text-xs tabular-nums">{centsToUsd(c.bidUsdCents)}</TableCell>
                    <TableCell className="py-1.5 text-xs tabular-nums">{c._count.creatives}</TableCell>
                    <TableCell className="py-1.5"><StatusBadge status={c.status} /></TableCell>
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
