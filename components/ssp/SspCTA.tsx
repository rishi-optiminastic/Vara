import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface PayoutRow {
  accent: string
  bg: string
  text: string
  time: string
  wallet: string
  amount: string
}

const CARD_ONE: PayoutRow[] = [
  {
    accent: '#F59E0B',
    bg: 'rgba(245,158,11,0.10)',
    text: '#92400E',
    time: '12s · Base',
    wallet: '0x7a3f…b21c',
    amount: '+ $1,284.40',
  },
  {
    accent: '#0EA5E9',
    bg: 'rgba(14,165,233,0.10)',
    text: '#0C4A6E',
    time: '47s · Polygon',
    wallet: '0xc019…84ee',
    amount: '+ $612.07',
  },
  {
    accent: '#10B981',
    bg: 'rgba(16,185,129,0.10)',
    text: '#064E3B',
    time: '1m · Base',
    wallet: '0x4d2b…11af',
    amount: '+ $3,902.18',
  },
]

const CARD_TWO: PayoutRow[] = [
  {
    accent: '#8B5CF6',
    bg: 'rgba(139,92,246,0.10)',
    text: '#581C87',
    time: '2m · Polygon',
    wallet: '0xa88e…d932',
    amount: '+ $248.55',
  },
  {
    accent: '#F43F5E',
    bg: '#FFE4E6',
    text: '#BE123C',
    time: '3m · Base',
    wallet: '0x9c74…fe10',
    amount: '+ $1,047.12',
  },
]

function ReceiptRow({ row }: { row: PayoutRow }): React.JSX.Element {
  return (
    <div className="flex h-[42px] rounded-[4px] overflow-hidden" style={{ background: row.bg }}>
      <div className="w-[2.5px] shrink-0" style={{ background: row.accent }} />
      <div className="flex-1 px-2 py-1.5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[9px] font-medium font-sans" style={{ color: row.text }}>
            {row.time}
          </span>
          <span
            className="text-[10px] font-semibold font-mono tabular-nums"
            style={{ color: row.text }}
          >
            {row.amount}
          </span>
        </div>
        <span className="text-[9px] font-mono" style={{ color: row.text, opacity: 0.85 }}>
          {row.wallet}
        </span>
      </div>
    </div>
  )
}

function ReceiptCard({ rows, header }: { rows: PayoutRow[]; header: string }): React.JSX.Element {
  return (
    <div
      className="w-[170px] bg-white rounded-[10px] p-1.5 flex flex-col gap-[3px]"
      style={{ boxShadow: '0px 0px 0px 1px rgba(0,0,0,0.08), 0px 6px 14px rgba(0,0,0,0.08)' }}
    >
      <div className="px-1 py-1 flex items-center justify-between">
        <span className="text-[8px] font-semibold font-sans tracking-[0.12em] uppercase text-[#605A57]">
          {header}
        </span>
        <span className="w-1 h-1 rounded-full bg-[#10B981]" />
      </div>
      {rows.map(r => (
        <ReceiptRow key={r.wallet + r.time} row={r} />
      ))}
    </div>
  )
}

function PayoutsIllustration(): React.JSX.Element {
  return (
    <div className="relative w-[340px] h-[280px] flex items-center justify-center">
      <div className="absolute" style={{ transform: 'rotate(-5deg)', left: '20px', top: '30px' }}>
        <ReceiptCard rows={CARD_ONE} header="Today" />
      </div>
      <div className="absolute" style={{ transform: 'rotate(5deg)', right: '20px', top: '70px' }}>
        <ReceiptCard rows={CARD_TWO} header="Yesterday" />
      </div>
    </div>
  )
}

export function SspCTA(): React.JSX.Element {
  return (
    <section className="w-full border-b border-border bg-background">
      <div className="px-4 sm:px-6 md:px-12 py-16 sm:py-20 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <span className="text-[#605A57] text-xs font-mono tracking-[0.2em] uppercase">
            ssp · publisher signup
          </span>
          <h2 className="text-[#37322F] text-[34px] sm:text-[44px] md:text-[56px] font-serif font-normal leading-[1.05] tracking-tight">
            Your inventory deserves a better
            <br className="hidden md:block" /> clearing house.
          </h2>
          <p className="text-[#605A57] text-base lg:text-[17px] leading-[1.6] font-sans max-w-[540px]">
            We don&apos;t do net-30. We don&apos;t shave margin off your CPMs. We route every
            winning bid straight to your wallet — and we publish the proof on-chain.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-2">
            <Link
              href="/ssp/sign-up"
              className="group inline-flex items-center gap-2 h-12 pl-6 pr-5 bg-primary text-white rounded-full hover:bg-[#2A2520] transition-colors shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset]"
            >
              <span className="text-sm font-semibold font-sans">Apply as publisher</span>
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <Link
              href="/dsp"
              className="text-[#605A57] text-sm font-sans hover:text-[#37322F] transition-colors underline-offset-4 decoration-[#605A57]/30 hover:decoration-[#37322F] underline"
            >
              Buying ads instead?
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
          <PayoutsIllustration />
        </div>
      </div>
    </section>
  )
}
