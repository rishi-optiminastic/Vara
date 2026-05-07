import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getOrCreatePublisher } from "@/lib/publisher"
import { getOrCreatePublisherWallet } from "@/lib/publisherWallet"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, FileCheckIcon, FileDownloadIcon } from "@/icons"
import { EarningsTable } from "@/components/ssp/payouts/EarningsTable"
import { PayoutsLedger } from "@/components/ssp/payouts/PayoutsLedger"
import {
  STATEMENT_STATUS_LABELS,
  STATEMENT_STATUS_TINT,
} from "@/components/ssp/payouts/types"

interface PageProps {
  params: Promise<{ id: string }>
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
    year: "numeric",
  })
}

export default async function StatementDetailPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/ssp/sign-in")
  const publisher = await getOrCreatePublisher(session.user.id, session.user.name)
  const wallet = await getOrCreatePublisherWallet(publisher.id)
  const { id } = await params

  const statement = await prisma.publisherStatement.findFirst({
    where: { id, publisherWalletId: wallet.id },
  })
  if (!statement) notFound()

  const [earnings, payouts] = await Promise.all([
    prisma.publisherEarning.findMany({
      where: { statementId: statement.id },
      orderBy: { date: "desc" },
      include: { placement: { select: { id: true, name: true, format: true } } },
    }),
    prisma.payout.findMany({
      where: { statementId: statement.id },
      orderBy: { initiatedAt: "desc" },
    }),
  ])

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs hover:bg-[#F0ECE6]"
        >
          <Link href="/ssp/dashboard/payouts">
            <ChevronLeftIcon className="size-3" />
            Back to payouts
          </Link>
        </Button>
      </div>

      <div className="flex items-end justify-between border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <div>
          <div className="flex items-center gap-2">
            <FileCheckIcon className="size-4" />
            <h1 className="text-[18px] font-medium tracking-tight text-[#37322F] leading-none">
              Statement
            </h1>
            <Badge
              variant="outline"
              className={`h-4 px-1.5 text-[9px] uppercase tracking-widest ${STATEMENT_STATUS_TINT[statement.status]}`}
            >
              {STATEMENT_STATUS_LABELS[statement.status]}
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5 tabular-nums">
            {dateLabel(statement.periodStart)} – {dateLabel(statement.periodEnd)}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1 text-xs border-[rgba(55,50,47,0.2)] bg-white"
          disabled
        >
          <FileDownloadIcon className="size-3" />
          Download CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <SummaryCard label="Impressions" value={statement.impressions.toLocaleString()} />
        <SummaryCard label="Clicks" value={statement.clicks.toLocaleString()} />
        <SummaryCard
          label="Gross"
          value={`$${formatUsdc(statement.grossUsdcCents)}`}
        />
        <SummaryCard
          label="Net (your share)"
          value={`$${formatUsdc(statement.netUsdcCents)}`}
          accent
        />
      </div>

      <Card className="py-0 gap-0 overflow-hidden border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
        <CardContent className="p-4 grid grid-cols-2 gap-4 sm:grid-cols-4 text-[11px]">
          <Row label="Period" value={`${dateLabel(statement.periodStart)} – ${dateLabel(statement.periodEnd)}`} />
          <Row label="Gross revenue" value={`$${formatUsdc(statement.grossUsdcCents)} USDC`} />
          <Row label="Platform fee" value={`− $${formatUsdc(statement.feeUsdcCents)} USDC`} />
          <Row label="Net to publisher" value={`$${formatUsdc(statement.netUsdcCents)} USDC`} accent />
        </CardContent>
      </Card>

      <EarningsTable earnings={earnings} />

      {payouts.length > 0 && <PayoutsLedger payouts={payouts} />}
    </div>
  )
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}): React.JSX.Element {
  return (
    <Card className="py-3 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <CardContent className="px-3">
        <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
        <div
          className={`mt-2 text-[20px] font-medium tracking-tight tabular-nums leading-none ${accent ? "text-[#15803D]" : "text-[#37322F]"}`}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  )
}

function Row({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}): React.JSX.Element {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div
        className={`mt-1 text-[12px] font-medium tabular-nums ${accent ? "text-[#15803D]" : "text-[#37322F]"}`}
      >
        {value}
      </div>
    </div>
  )
}
