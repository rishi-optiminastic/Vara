import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DatabaseIcon } from "@/icons"

interface Props {
  contracts: string[]
  primaryChain: string
}

function shorten(addr: string): string {
  if (addr.length <= 14) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export function ContractsCard({ contracts, primaryChain }: Props): React.JSX.Element {
  return (
    <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.12)] px-3.5 py-2">
        <div className="flex items-center gap-1.5">
          <DatabaseIcon className="size-3 text-muted-foreground" />
          <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Tracked contracts
          </h3>
        </div>
        <span className="text-[10px] text-muted-foreground tabular-nums">
          {contracts.length} on {primaryChain}
        </span>
      </div>
      <CardContent className="p-3.5">
        {contracts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[rgba(55,50,47,0.18)] bg-white/50 px-4 py-8 text-center">
            <p className="text-xs font-medium text-[#37322F]">No contracts tracked</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Add contracts during onboarding to attribute on-chain conversions.
            </p>
          </div>
        ) : (
          <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {contracts.map((addr) => (
              <li
                key={addr}
                className="flex items-center justify-between gap-2 rounded-full border border-[rgba(55,50,47,0.12)] bg-white/60 px-3 py-1.5 hover:bg-white transition-colors"
              >
                <span className="font-mono text-[11px] text-[#37322F] tabular-nums truncate" title={addr}>
                  {shorten(addr)}
                </span>
                <Badge
                  variant="outline"
                  className="h-3.5 px-1 text-[8px] uppercase tracking-widest bg-[#F0ECE6] border-transparent text-[#37322F] shrink-0"
                >
                  {primaryChain}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
