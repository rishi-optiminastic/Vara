import Link from 'next/link'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
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
  Globe,
  Image as ImageIcon,
  Layers,
  Smartphone,
  CheckCircle2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface PlacementMock {
  id: string
  name: string
  format: string
  formatIcon: LucideIcon
  tint: string
  ecpm: string
  impressions: string
  fillRate: string
  status: 'LIVE' | 'PAUSED'
  chains: string[]
}

const PLACEMENTS: PlacementMock[] = [
  {
    id: 'p1',
    name: 'homepage_top_970x250',
    format: 'Display',
    formatIcon: ImageIcon,
    tint: 'bg-[#EAF1FF] text-[#1E40AF]',
    ecpm: '$4.82',
    impressions: '1.2M',
    fillRate: '96%',
    status: 'LIVE',
    chains: ['Base', 'Polygon'],
  },
  {
    id: 'p2',
    name: 'article_inline_native',
    format: 'Native',
    formatIcon: Layers,
    tint: 'bg-[#F0E8FF] text-[#6D28D9]',
    ecpm: '$3.41',
    impressions: '812k',
    fillRate: '92%',
    status: 'LIVE',
    chains: ['Ethereum'],
  },
  {
    id: 'p3',
    name: 'mobile_interstitial',
    format: 'Interstitial',
    formatIcon: Smartphone,
    tint: 'bg-[#FFF3E8] text-[#C2410C]',
    ecpm: '$6.14',
    impressions: '640k',
    fillRate: '88%',
    status: 'LIVE',
    chains: ['Solana'],
  },
  {
    id: 'p4',
    name: 'sidebar_300x600',
    format: 'Display',
    formatIcon: ImageIcon,
    tint: 'bg-[#EAF1FF] text-[#1E40AF]',
    ecpm: '$2.20',
    impressions: '248k',
    fillRate: '78%',
    status: 'PAUSED',
    chains: ['Polygon'],
  },
  {
    id: 'p5',
    name: 'wallet_contextual_card',
    format: 'Wallet',
    formatIcon: Globe,
    tint: 'bg-[#E8F5E9] text-[#15803D]',
    ecpm: '$8.90',
    impressions: '184k',
    fillRate: '94%',
    status: 'LIVE',
    chains: ['Base', 'Arbitrum'],
  },
]

interface PayoutMock {
  wallet: string
  amount: string
  chain: string
  ago: string
}

const RECENT_PAYOUTS: PayoutMock[] = [
  { wallet: '0x7a3f…b21c', amount: '$1,284.40', chain: 'Base', ago: '12s ago' },
  { wallet: '0xc019…84ee', amount: '$612.07', chain: 'Polygon', ago: '47s ago' },
  { wallet: '0x4d2b…11af', amount: '$3,902.18', chain: 'Base', ago: '1m ago' },
  { wallet: '0xa88e…d932', amount: '$248.55', chain: 'Polygon', ago: '2m ago' },
]

interface StatCard {
  label: string
  value: string
  icon: LucideIcon
  tint: string
}

const STATS: StatCard[] = [
  {
    label: 'Earnings (30d)',
    value: '$24,816.42',
    icon: DollarSign,
    tint: 'bg-[#FFF3E8] text-[#C2410C]',
  },
  { label: 'Impressions', value: '3.1M', icon: Eye, tint: 'bg-[#EAF1FF] text-[#1E40AF]' },
  { label: 'Fill rate', value: '94.2%', icon: Activity, tint: 'bg-[#E8F5E9] text-[#15803D]' },
  { label: 'Avg eCPM', value: '$4.71', icon: TrendingUp, tint: 'bg-[#F0E8FF] text-[#6D28D9]' },
]

export default async function SspDashboardPage(): Promise<React.JSX.Element> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/ssp/sign-in')

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
                <span>last 30 days</span>
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
              <p className="text-[10px] text-muted-foreground">
                Live inventory · last 30d performance
              </p>
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
            <ul className="divide-y divide-[rgba(55,50,47,0.08)]">
              {PLACEMENTS.map(p => {
                const Icon = p.formatIcon
                return (
                  <li
                    key={p.id}
                    className="group transition-colors hover:bg-[#FAF8F5]"
                  >
                    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 px-3 py-2.5">
                      <div
                        className={`flex size-8 items-center justify-center rounded-md ${p.tint} shrink-0`}
                      >
                        <Icon className="size-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium text-[#37322F] truncate font-mono">
                            {p.name}
                          </span>
                          <Badge
                            variant="outline"
                            className="h-3.5 px-1 text-[8px] uppercase tracking-widest bg-white/60 border-[rgba(55,50,47,0.16)] text-muted-foreground font-medium shrink-0"
                          >
                            {p.format}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground">
                          <span className="text-[#37322F]/40">chains:</span>
                          <div className="flex gap-1">
                            {p.chains.map(ch => (
                              <span
                                key={ch}
                                className="rounded-full bg-[#F0ECE6] px-1.5 py-0.5 text-[9px] font-medium text-[#37322F]"
                              >
                                {ch}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:grid grid-cols-3 gap-4 items-center text-right">
                        <Stat label="eCPM" value={p.ecpm} />
                        <Stat label="Impr." value={p.impressions} />
                        <Stat label="Fill" value={p.fillRate} />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          className={`h-4 px-1.5 text-[8px] uppercase tracking-widest font-medium ${
                            p.status === 'LIVE'
                              ? 'bg-[#E8F5E9] text-[#15803D] border-[#15803D]/20'
                              : 'bg-[#F0ECE6] text-muted-foreground border-[rgba(55,50,47,0.12)]'
                          }`}
                          variant="outline"
                        >
                          {p.status}
                        </Badge>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
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
            <ul className="divide-y divide-[rgba(55,50,47,0.08)]">
              {RECENT_PAYOUTS.map(p => (
                <li
                  key={p.wallet + p.ago}
                  className="px-3 py-2.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors"
                >
                  <div className="min-w-0 flex flex-col">
                    <span className="text-xs font-mono text-[#37322F] truncate">{p.wallet}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="size-2.5 text-[#15803D]" />
                      {p.chain} · {p.ago}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-medium tabular-nums text-[#37322F] shrink-0">
                    + {p.amount}
                  </span>
                </li>
              ))}
            </ul>
            <div className="px-3 py-2 border-t border-[rgba(55,50,47,0.12)] bg-[#FAF8F5]">
              <span className="text-[10px] text-muted-foreground">USDC · verified on-chain</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
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
