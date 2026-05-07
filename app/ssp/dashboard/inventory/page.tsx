import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getOrCreatePublisher } from "@/lib/publisher"
import { Badge } from "@/components/ui/badge"
import { InventoryTable } from "@/components/ssp/inventory/InventoryTable"
import { InventoryHeader } from "@/components/ssp/inventory/InventoryHeader"

export default async function InventoryPage(): Promise<React.JSX.Element> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/ssp/sign-in")

  const publisher = await getOrCreatePublisher(session.user.id, session.user.name)
  const placements = await prisma.placement.findMany({
    where: { publisherId: publisher.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-end justify-between border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <div>
          <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
            Ad{" "}
            <span className="font-instrument-serif italic font-normal text-[26px]">inventory</span>
          </h1>
          <p className="text-[11px] text-muted-foreground mt-1.5">
            Manage placements on {publisher.siteName}. Each placement gets its own ad tag.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="h-5 px-2 text-[10px] uppercase tracking-widest bg-white/60 border-[rgba(55,50,47,0.16)] text-[#37322F]"
          >
            {placements.length} placement{placements.length === 1 ? "" : "s"}
          </Badge>
          <InventoryHeader />
        </div>
      </div>

      <InventoryTable placements={placements} />
    </div>
  )
}
