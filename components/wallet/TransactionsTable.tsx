import type { WalletTransaction } from "@prisma/client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  NavTransactionsIcon,
  CircleCheckIcon,
  HourglassStartIcon,
  CircleXmarkIcon,
} from "@/icons"

interface Props {
  transactions: WalletTransaction[]
}

function formatAmount(cents: number, type: WalletTransaction["type"]): string {
  const dollars = (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const sign = type === "DEPOSIT" || type === "REFUND" ? "+" : "−"
  return `${sign}${dollars}`
}

function amountColor(type: WalletTransaction["type"]): string {
  if (type === "DEPOSIT" || type === "REFUND") return "text-[#15803D]"
  return "text-[#37322F]"
}

function dateLabel(d: Date): string {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const TYPE_LABEL: Record<WalletTransaction["type"], string> = {
  DEPOSIT: "Deposit",
  AD_SPEND: "Ad spend",
  REFUND: "Refund",
  WITHDRAWAL: "Withdrawal",
}

const TYPE_TINT: Record<WalletTransaction["type"], string> = {
  DEPOSIT: "bg-[#E8F5E9] text-[#15803D] border-[rgba(21,128,61,0.2)]",
  AD_SPEND: "bg-[#EAF1FF] text-[#1E40AF] border-[rgba(30,64,175,0.2)]",
  REFUND: "bg-[#F3E8FF] text-[#6B21A8] border-[rgba(107,33,168,0.2)]",
  WITHDRAWAL: "bg-[#FFF3E8] text-[#C2410C] border-[rgba(194,65,12,0.2)]",
}

export function TransactionsTable({ transactions }: Props): React.JSX.Element {
  return (
    <Card className="py-0 gap-0 overflow-hidden border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <div className="flex items-center gap-1.5 border-b border-[rgba(55,50,47,0.12)] px-4 py-2.5 bg-[#FAFAF8]">
        <NavTransactionsIcon className="size-3 text-muted-foreground" />
        <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Recent transactions
        </h3>
      </div>
      <div className="divide-y divide-[rgba(55,50,47,0.08)]">
        {transactions.length === 0 ? (
          <div className="px-4 py-8 text-center text-[11px] text-muted-foreground">
            No transactions yet. Add funds to get started.
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-[#FAFAF8]/60 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Badge
                  variant="outline"
                  className={`h-5 px-2 text-[9px] uppercase tracking-widest shrink-0 ${TYPE_TINT[tx.type]}`}
                >
                  {TYPE_LABEL[tx.type]}
                </Badge>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-medium text-[#37322F] truncate">
                    {tx.description}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground truncate">
                    <span>{tx.source}</span>
                    <span>·</span>
                    <span>{dateLabel(tx.occurredAt)}</span>
                    {tx.txHash && (
                      <>
                        <span>·</span>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono underline hover:text-[#37322F]"
                        >
                          {tx.txHash.slice(0, 8)}…
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusIcon status={tx.status} />
                <div className={`text-[13px] font-medium tabular-nums ${amountColor(tx.type)}`}>
                  {formatAmount(tx.amountUsdcCents, tx.type)}
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

function StatusIcon({ status }: { status: WalletTransaction["status"] }): React.JSX.Element {
  if (status === "COMPLETED") {
    return <CircleCheckIcon className="size-3 text-[#15803D]" />
  }
  if (status === "PENDING") {
    return <HourglassStartIcon className="size-3 text-[#C2410C]" />
  }
  return <CircleXmarkIcon className="size-3 text-[#B91C1C]" />
}
