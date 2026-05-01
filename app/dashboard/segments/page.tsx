import { getCachedSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function SegmentsPage(): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/sign-in")
  const segments = await prisma.walletSegment.findMany({ orderBy: { name: "asc" } })

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
          Wallet <span className="font-instrument-serif italic font-normal text-[26px]">Audiences</span>
        </h1>
        <p className="text-[11px] text-muted-foreground mt-1.5">
          Predefined behavioral segments. Pick from these when configuring campaign targeting.
        </p>
      </div>

      {segments.length === 0 ? (
        <Card className="border-[rgba(55,50,47,0.12)]"><CardContent className="p-8 text-center text-xs text-muted-foreground">
          No segments seeded. Run <code className="rounded bg-[#F0ECE6] px-1 py-0.5">pnpm db:seed</code> to load defaults.
        </CardContent></Card>
      ) : (
        <div className="grid gap-2 lg:grid-cols-2">
          {segments.map((s) => (
            <Card key={s.id} className="py-2.5 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
              <CardContent className="px-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold">{s.name}</h3>
                  {s.chain && (
                    <Badge variant="outline" className="h-3.5 px-1 text-[8px] uppercase">{s.chain}</Badge>
                  )}
                  <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
                    ~{(s.estSize / 1000).toFixed(1)}k wallets
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{s.description}</p>
                <div className="mt-1.5 text-[9px] uppercase tracking-wider text-muted-foreground">
                  slug: <code>{s.slug}</code>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
