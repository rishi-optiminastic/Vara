import type { Payout } from "@prisma/client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  NavTransactionsIcon,
  CircleCheckIcon,
  HourglassStartIcon,
  CircleXmarkIcon,
} from "@/icons"
import { chainName } from "@/lib/chains"
import { PAYOUT_STATUS_LABELS, PAYOUT_STATUS_TINT } from "./types"

interface Props {
  payouts: Payout[]
}

function formatUsdc(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function dateLabel(d: Date): string {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function shortAddress(addr: string): string {
  if (addr.length <= 14) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

function explorerUrl(chain: Payout["chain"], txHash: string): string {
  switch (chain) {
    case "ETHEREUM":
      return `https://sepolia.etherscan.io/tx/${txHash}`
    case "BASE":
      return `https://sepolia.basescan.org/tx/${txHash}`
    case "POLYGON":
      return `https://amoy.polygonscan.com/tx/${txHash}`
    case "ARBITRUM":
      return `https://sepolia.arbiscan.io/tx/${txHash}`
    case "OPTIMISM":
      return `https://sepolia-optimistic.etherscan.io/tx/${txHash}`
    case "SOLANA":
      return `https://solscan.io/tx/${txHash}?cluster=devnet`
    default:
      return `https://sepolia.etherscan.io/tx/${txHash}`
  }
}

export function PayoutsLedger({ payouts }: Props): React.JSX.Element {
  return (
    <Card className="py-0 gap-0 overflow-hidden border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <div className="flex items-center gap-1.5 border-b border-[rgba(55,50,47,0.12)] px-4 py-2.5 bg-[#FAFAF8]">
        <NavTransactionsIcon className="size-3 text-muted-foreground" />
        <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Payout history
        </h3>
      </div>
      <div className="divide-y divide-[rgba(55,50,47,0.06)]">
        {payouts.length === 0 ? (
          <div className="px-4 py-8 text-center text-[11px] text-muted-foreground">
            No payouts yet. Withdraw your available balance to get started.
          </div>
        ) : (
          payouts.map(p => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-[#FAFAF8]/60 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Badge
                  variant="outline"
                  className={`h-5 px-2 text-[9px] uppercase tracking-widest shrink-0 ${PAYOUT_STATUS_TINT[p.status]}`}
                >
                  {PAYOUT_STATUS_LABELS[p.status]}
                </Badge>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-medium text-[#37322F] truncate">
                    Withdraw to <span className="font-mono">{shortAddress(p.toAddress)}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground truncate">
                    <span>{chainName(p.chain)}</span>
                    <span>·</span>
                    <span>{dateLabel(p.initiatedAt)}</span>
                    {p.txHash && (
                      <>
                        <span>·</span>
                        <a
                          href={explorerUrl(p.chain, p.txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono underline hover:text-[#37322F]"
                        >
                          {p.txHash.slice(0, 8)}…
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusIcon status={p.status} />
                <div className="text-[13px] font-medium tabular-nums text-[#37322F]">
                  − {formatUsdc(p.amountUsdcCents)}
                </div>
                <span className="text-[10px] text-muted-foreground tabular-nums">USDC</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}

function StatusIcon({ status }: { status: Payout["status"] }): React.JSX.Element {
  if (status === "CONFIRMED") return <CircleCheckIcon className="size-3 text-[#15803D]" />
  if (status === "FAILED") return <CircleXmarkIcon className="size-3 text-[#B91C1C]" />
  return <HourglassStartIcon className="size-3 text-[#C2410C]" />
}
