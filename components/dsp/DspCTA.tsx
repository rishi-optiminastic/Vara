import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface CampaignRow {
  accent: string
  bg: string
  text: string
  label: string
  meta: string
  value: string
}

const CARD_ONE: CampaignRow[] = [
  {
    accent: '#F59E0B',
    bg: 'rgba(245,158,11,0.10)',
    text: '#92400E',
    label: 'USDC Growth · Q2',
    meta: 'Live · CTR 3.4%',
    value: '2.4M imp',
  },
  {
    accent: '#0EA5E9',
    bg: 'rgba(14,165,233,0.10)',
    text: '#0C4A6E',
    label: 'NFT Collectors',
    meta: 'Live · CPM $4.20',
    value: '891k imp',
  },
  {
    accent: '#10B981',
    bg: 'rgba(16,185,129,0.10)',
    text: '#064E3B',
    label: 'DeFi Power Users',
    meta: 'Today · on target',
    value: '✓ pacing',
  },
]

const CARD_TWO: CampaignRow[] = [
  {
    accent: '#8B5CF6',
    bg: 'rgba(139,92,246,0.10)',
    text: '#581C87',
    label: 'DeFi · ETH ≥ 0.5',
    meta: 'Wallet segment',
    value: '1.2M wallets',
  },
  {
    accent: '#F43F5E',
    bg: '#FFE4E6',
    text: '#BE123C',
    label: 'NFT Holders ≥ 3',
    meta: 'Wallet segment',
    value: '340k wallets',
  },
]

function CampaignRowItem({ row }: { row: CampaignRow }): React.JSX.Element {
  return (
    <div className="flex h-[42px] rounded-[4px] overflow-hidden" style={{ background: row.bg }}>
      <div className="w-[2.5px] shrink-0" style={{ background: row.accent }} />
      <div className="flex-1 px-2 py-1.5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[9px] font-semibold font-sans truncate" style={{ color: row.text }}>
            {row.label}
          </span>
          <span
            className="text-[10px] font-semibold font-mono tabular-nums shrink-0"
            style={{ color: row.text }}
          >
            {row.value}
          </span>
        </div>
        <span
          className="text-[9px] font-medium font-sans"
          style={{ color: row.text, opacity: 0.85 }}
        >
          {row.meta}
        </span>
      </div>
    </div>
  )
}

interface CampaignCardProps {
  rows: CampaignRow[]
  header: string
  pulse?: boolean
}

function CampaignCard({ rows, header, pulse = false }: CampaignCardProps): React.JSX.Element {
  return (
    <div
      className="w-[180px] bg-white rounded-[10px] p-1.5 flex flex-col gap-[3px]"
      style={{ boxShadow: '0px 0px 0px 1px rgba(0,0,0,0.08), 0px 6px 14px rgba(0,0,0,0.08)' }}
    >
      <div className="px-1 py-1 flex items-center justify-between">
        <span className="text-[8px] font-semibold font-sans tracking-[0.12em] uppercase text-[#605A57]">
          {header}
        </span>
        {pulse ? (
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
        ) : (
          <span className="w-1 h-1 rounded-full bg-[#828387]" />
        )}
      </div>
      {rows.map(r => (
        <CampaignRowItem key={r.label} row={r} />
      ))}
    </div>
  )
}

function CampaignsIllustration(): React.JSX.Element {
  return (
    <div className="relative w-[360px] h-[280px] flex items-center justify-center">
      <div className="absolute" style={{ transform: 'rotate(-5deg)', left: '10px', top: '20px' }}>
        <CampaignCard rows={CARD_ONE} header="Campaigns" pulse />
      </div>
      <div className="absolute" style={{ transform: 'rotate(5deg)', right: '10px', top: '90px' }}>
        <CampaignCard rows={CARD_TWO} header="Audiences" />
      </div>
    </div>
  )
}

export function DspCTA(): React.JSX.Element {
  return (
    <section className="w-full border-b border-border bg-background">
      <div className="px-4 sm:px-6 md:px-12 py-16 sm:py-20 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <span className="text-[#605A57] text-xs font-mono tracking-[0.2em] uppercase">
            dsp · advertiser signup
          </span>
          <h2 className="text-[#37322F] text-[34px] sm:text-[44px] md:text-[56px] font-serif font-normal leading-[1.05] tracking-tight">
            Reach the wallets that
            <br className="hidden md:block" /> actually convert.
          </h2>
          <p className="text-[#605A57] text-base lg:text-[17px] leading-[1.6] font-sans max-w-[540px]">
            Skip the walled gardens. Target by token holdings, NFT ownership, and DeFi behaviour —
            and verify every impression you paid for against the on-chain ledger.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-2">
            <Link
              href="/dsp/sign-up"
              className="group inline-flex items-center gap-2 h-12 pl-6 pr-5 bg-primary text-white rounded-full hover:bg-[#2A2520] transition-colors shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset]"
            >
              <span className="text-sm font-semibold font-sans">Launch your first campaign</span>
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <Link
              href="/ssp"
              className="text-[#605A57] text-sm font-sans hover:text-[#37322F] transition-colors underline-offset-4 decoration-[#605A57]/30 hover:decoration-[#37322F] underline"
            >
              Selling inventory instead?
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
          <CampaignsIllustration />
        </div>
      </div>
    </section>
  )
}
