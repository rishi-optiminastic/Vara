import Link from 'next/link'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getOrCreatePublisher } from '@/lib/publisher'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  Eye,
  Activity,
  ArrowUpRight,
  Image as ImageIcon,
  Layers,
  Smartphone,
  Wallet,
  PlaySquare,
  CheckCircle2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { AdFormat, Payout, Placement, PlacementStatus } from '@prisma/client'
import { AD_FORMAT_LABELS, CHAIN_LABELS } from '@/components/ssp/inventory/types'
import { chainName } from '@/lib/chains'
import { getOrCreatePublisherWallet } from '@/lib/publisherWallet'
import { centsToUsd, formatCompact } from '@/lib/money'

const FORMAT_ICON: Record<AdFormat, LucideIcon> = {
  BANNER: ImageIcon,
  NATIVE: Layers,
  INTERSTITIAL: Smartphone,
  WALLET_CONTEXTUAL: Wallet,
  VIDEO: PlaySquare,
}

const FORMAT_TINT: Record<AdFormat, string> = {
  BANNER: 'bg-[#EAF1FF] text-[#1E40AF]',
  NATIVE: 'bg-[#F0E8FF] text-[#6D28D9]',
  INTERSTITIAL: 'bg-[#FFF3E8] text-[#C2410C]',
  WALLET_CONTEXTUAL: 'bg-[#E8F5E9] text-[#15803D]',
  VIDEO: 'bg-[#FFF1F2] text-[#B91C1C]',
}

const STATUS_TINT: Record<PlacementStatus, string> = {
  LIVE: 'bg-[#E8F5E9] text-[#15803D] border-[#15803D]/20',
  PAUSED: 'bg-[#FFF3E8] text-[#C2410C] border-[#C2410C]/20',
  DRAFT: 'bg-[#F0ECE6] text-muted-foreground border-[rgba(55,50,47,0.12)]',
}

function shortAddress(addr: string): string {
  if (addr.length <= 14) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

function timeAgo(d: Date): string {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(d).getTime()) / 1000))
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

interface StatCard {
  label: string
  value: string
  icon: LucideIcon
  tint: string
}

export default async function SspDashboardPage(): Promise<React.JSX.Element> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/ssp/sign-in')

  const publisher = await getOrCreatePublisher(session.user.id, session.user.name)
  const wallet = await getOrCreatePublisherWallet(publisher.id)
  const since = new Date()
  since.setUTCDate(since.getUTCDate() - 30)

  const [placements, recentPayouts, earningsAgg] = await Promise.all([
    prisma.placement.findMany({
      where: { publisherId: publisher.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.payout.findMany({
      where: { publisherWalletId: wallet.id },
      orderBy: { initiatedAt: 'desc' },
      take: 4,
    }),
    prisma.publisherEarning.aggregate({
      where: { publisherWalletId: wallet.id, date: { gte: since } },
      _sum: { netUsdcCents: true, impressions: true, clicks: true },
    }),
  ])

  const earnings30d = earningsAgg._sum.netUsdcCents ?? 0
  const impressions30d = earningsAgg._sum.impressions ?? 0
  const clicks30d = earningsAgg._sum.clicks ?? 0
  const ctr = impressions30d > 0 ? (clicks30d / impressions30d) * 100 : 0
  const avgEcpm =
    impressions30d > 0 ? (earnings30d / 100) * (1000 / impressions30d) : 0

  const STATS: StatCard[] = [
    {
      label: 'Net earnings (30d)',
      value: earnings30d > 0 ? centsToUsd(earnings30d) : '—',
      icon: DollarSign,
      tint: 'bg-[#FFF3E8] text-[#C2410C]',
    },
    {
      label: 'Impressions',
      value: impressions30d > 0 ? formatCompact(impressions30d) : '—',
      icon: Eye,
      tint: 'bg-[#EAF1FF] text-[#1E40AF]',
    },
    {
      label: 'CTR',
      value: impressions30d > 0 ? `${ctr.toFixed(2)}%` : '—',
      icon: Activity,
      tint: 'bg-[#E8F5E9] text-[#15803D]',
    },
    {
      label: 'Avg eCPM',
      value: avgEcpm > 0 ? `$${avgEcpm.toFixed(2)}` : '—',
      icon: TrendingUp,
      tint: 'bg-[#F0E8FF] text-[#6D28D9]',
    },
  ]

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-end justify-between border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <div>
          <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
            Good day,{' '}
            <span className="font-instrument-serif italic font-normal text-[26px]">
              {session.user.name?.split(' ')[0] || 'there'}
            </span>
          </h1>
          <p className="text-[11px] text-muted-foreground mt-1.5">
            Live publisher inventory performance.
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="h-8 gap-1.5 text-xs rounded-full px-4 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(55,50,47,0.18)]"
        >
          <Link href="/ssp/dashboard/inventory">
            <Sparkles className="size-3" />
            Add placement
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {STATS.map(s => (
          <Card
            key={s.label}
            className="py-3 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]"
          >
            <CardContent className="px-3">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </span>
                <div className={`flex h-5 w-5 items-center justify-center rounded-md ${s.tint}`}>
                  <s.icon className="size-3" />
                </div>
              </div>
              <div className="text-[22px] font-medium tracking-tight tabular-nums text-[#37322F] leading-none">
                {s.value}
              </div>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                <TrendingUp className="size-3" />
                <span>analytics coming soon</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <Card className="lg:col-span-2 gap-0 py-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
          <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.12)] px-3 py-2">
            <div>
              <h2 className="text-xs font-semibold text-[#37322F]">Top placements</h2>
              <p className="text-[10px] text-muted-foreground">Live inventory</p>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-6 gap-1 text-[10px] hover:bg-[#F0ECE6]"
            >
              <Link href="/ssp/dashboard/inventory">
                View all <ArrowUpRight className="size-2.5" />
              </Link>
            </Button>
          </div>
          <CardContent className="p-0">
            {placements.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-[11px] text-muted-foreground">
                  No placements yet.{' '}
                  <Link
                    href="/ssp/dashboard/inventory"
                    className="underline text-[#37322F] hover:no-underline"
                  >
                    Create your first
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-[rgba(55,50,47,0.08)]">
                {placements.map(p => (
                  <PlacementRow key={p.id} placement={p} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="gap-0 py-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
          <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.12)] px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#15803D] animate-pulse" />
              <h2 className="text-xs font-semibold text-[#37322F]">Live payouts</h2>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-6 gap-1 text-[10px] hover:bg-[#F0ECE6]"
            >
              <Link href="/ssp/dashboard/payouts">
                Ledger <ArrowUpRight className="size-2.5" />
              </Link>
            </Button>
          </div>
          <CardContent className="p-0">
            {recentPayouts.length === 0 ? (
              <div className="px-4 py-8 text-center text-[11px] text-muted-foreground">
                No payouts yet.{' '}
                <Link
                  href="/ssp/dashboard/payouts"
                  className="underline text-[#37322F] hover:no-underline"
                >
                  Set up your wallet
                </Link>
                .
              </div>
            ) : (
              <ul className="divide-y divide-[rgba(55,50,47,0.08)]">
                {recentPayouts.map(p => (
                  <PayoutRow key={p.id} payout={p} />
                ))}
              </ul>
            )}
            <div className="px-3 py-2 border-t border-[rgba(55,50,47,0.12)] bg-[#FAF8F5]">
              <span className="text-[10px] text-muted-foreground">USDC · verified on-chain</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function PlacementRow({ placement }: { placement: Placement }): React.JSX.Element {
  const Icon = FORMAT_ICON[placement.format]
  return (
    <li className="group transition-colors hover:bg-[#FAF8F5]">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 px-3 py-2.5">
        <div
          className={`flex size-8 items-center justify-center rounded-md ${FORMAT_TINT[placement.format]} shrink-0`}
        >
          <Icon className="size-3.5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-[#37322F] truncate font-mono">
              {placement.name}
            </span>
            <Badge
              variant="outline"
              className="h-3.5 px-1 text-[8px] uppercase tracking-widest bg-white/60 border-[rgba(55,50,47,0.16)] text-muted-foreground font-medium shrink-0"
            >
              {AD_FORMAT_LABELS[placement.format]}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground">
            <span className="text-[#37322F]/40">chains:</span>
            <div className="flex gap-1 flex-wrap">
              {placement.chains.map(ch => (
                <span
                  key={ch}
                  className="rounded-full bg-[#F0ECE6] px-1.5 py-0.5 text-[9px] font-medium text-[#37322F]"
                >
                  {CHAIN_LABELS[ch]}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="hidden md:grid grid-cols-3 gap-4 items-center text-right">
          <Stat label="eCPM" value="—" />
          <Stat label="Impr." value="—" />
          <Stat label="Fill" value="—" />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            className={`h-4 px-1.5 text-[8px] uppercase tracking-widest font-medium ${STATUS_TINT[placement.status]}`}
            variant="outline"
          >
            {placement.status}
          </Badge>
        </div>
      </div>
    </li>
  )
}

function Stat({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="flex flex-col items-end leading-none">
      <span className="text-[9px] uppercase tracking-widest text-muted-foreground/80">{label}</span>
      <span className="mt-1 text-[11px] font-medium tabular-nums text-[#37322F]">{value}</span>
    </div>
  )
}

function PayoutRow({ payout }: { payout: Payout }): React.JSX.Element {
  const isConfirmed = payout.status === 'CONFIRMED'
  return (
    <li className="px-3 py-2.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
      <div className="min-w-0 flex flex-col">
        <span className="text-xs font-mono text-[#37322F] truncate">
          {shortAddress(payout.toAddress)}
        </span>
        <span className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
          {isConfirmed ? (
            <CheckCircle2 className="size-2.5 text-[#15803D]" />
          ) : (
            <span className="size-1.5 rounded-full bg-[#C2410C] animate-pulse" />
          )}
          {chainName(payout.chain)} · {timeAgo(payout.initiatedAt)}
        </span>
      </div>
      <span className="text-xs font-mono font-medium tabular-nums text-[#37322F] shrink-0">
        + {centsToUsd(payout.amountUsdcCents)}
      </span>
    </li>
  )
}
