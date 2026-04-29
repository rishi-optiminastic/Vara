import Link from 'next/link'
import type { ReactNode } from 'react'

type Variant = 'dsp' | 'ssp'

interface AuthShellProps {
  children: ReactNode
  variant?: Variant
  headline?: string
  subline?: string
  /** Backwards-compat: ignored. Old call sites passed these — they are no longer rendered. */
  quote?: string
  quoteAuthor?: string
}

interface VariantCopy {
  badge: string
  headline: string
  subline: string
  illustration: ReactNode
  footnote: ReactNode
}

const COPY: Record<Variant, VariantCopy> = {
  dsp: {
    badge: 'Web3 DSP',
    headline: 'Reach the wallets that actually convert.',
    subline:
      'Target by token holdings, NFT ownership, and DeFi behaviour — and verify every impression on-chain.',
    illustration: <CampaignsArtwork />,
    footnote: (
      <>
        <span className="font-mono text-[#37322F]">0x4d2b…11af</span>
        <span className="text-foreground/30">·</span>
        <span>USDC settled · Base</span>
      </>
    ),
  },
  ssp: {
    badge: 'Web3 SSP',
    headline: 'Your inventory deserves a better clearing house.',
    subline:
      'Plug into the Vara exchange and let vetted Web3 demand fight for your impressions — settled instantly to your wallet.',
    illustration: <PayoutsArtwork />,
    footnote: (
      <>
        <span className="font-mono text-[#37322F]">+ $1,284.40</span>
        <span className="text-foreground/30">·</span>
        <span>USDC · verified on-chain</span>
      </>
    ),
  },
}

export function AuthShell({
  children,
  variant = 'dsp',
  headline,
  subline,
}: AuthShellProps): React.JSX.Element {
  const copy = COPY[variant]

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-sans grid lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden p-10 xl:p-14 bg-[#F4EFE7] border-r border-foreground/[0.06]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 30% 20%, rgba(247,201,103,0.18), transparent 55%), radial-gradient(ellipse at 80% 90%, rgba(123,201,244,0.14), transparent 55%)',
          }}
        />

        <Link
          href={variant === 'ssp' ? '/ssp' : '/dsp'}
          className="relative z-10 flex items-center gap-2 group w-fit"
        >
          <span className="text-xl font-medium tracking-tight text-[#37322F] group-hover:opacity-70 transition-opacity">
            Vara
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] border border-foreground/15 rounded-full px-2 py-0.5 bg-white/70 backdrop-blur-sm text-foreground/65">
            {copy.badge}
          </span>
        </Link>

        <div className="relative z-10 flex flex-col items-start gap-10">
          {copy.illustration}

          <div className="flex flex-col gap-4 max-w-110">
            <h2 className="text-[36px] xl:text-[44px] font-serif font-normal leading-[1.05] tracking-tight text-[#37322F]">
              {headline ?? copy.headline}
            </h2>
            <p className="text-[15px] leading-[1.55] text-foreground/60">
              {subline ?? copy.subline}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-[12px] text-foreground/55 font-sans">
          <span className="size-1.5 rounded-full bg-[#10B981] animate-pulse" />
          {copy.footnote}
        </div>
      </div>

      <div className="relative flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
        <div className="relative z-10 w-full max-w-100">{children}</div>
      </div>
    </div>
  )
}

interface CardRow {
  accent: string
  bg: string
  text: string
  primary: string
  secondary: string
  value: string
}

const CAMPAIGN_ROWS: CardRow[] = [
  {
    accent: '#F59E0B',
    bg: 'rgba(245,158,11,0.10)',
    text: '#92400E',
    primary: 'USDC Growth · Q2',
    secondary: 'Live · CTR 3.4%',
    value: '2.4M imp',
  },
  {
    accent: '#0EA5E9',
    bg: 'rgba(14,165,233,0.10)',
    text: '#0C4A6E',
    primary: 'NFT Collectors',
    secondary: 'Live · CPM $4.20',
    value: '891k imp',
  },
  {
    accent: '#10B981',
    bg: 'rgba(16,185,129,0.10)',
    text: '#064E3B',
    primary: 'DeFi Power Users',
    secondary: 'Today · on target',
    value: '✓ pacing',
  },
]

const AUDIENCE_ROWS: CardRow[] = [
  {
    accent: '#8B5CF6',
    bg: 'rgba(139,92,246,0.10)',
    text: '#581C87',
    primary: 'DeFi · ETH ≥ 0.5',
    secondary: 'Wallet segment',
    value: '1.2M wallets',
  },
  {
    accent: '#F43F5E',
    bg: '#FFE4E6',
    text: '#BE123C',
    primary: 'NFT Holders ≥ 3',
    secondary: 'Wallet segment',
    value: '340k wallets',
  },
]

const PAYOUT_TODAY: CardRow[] = [
  {
    accent: '#F59E0B',
    bg: 'rgba(245,158,11,0.10)',
    text: '#92400E',
    primary: '0x7a3f…b21c',
    secondary: '12s · Base',
    value: '+ $1,284.40',
  },
  {
    accent: '#0EA5E9',
    bg: 'rgba(14,165,233,0.10)',
    text: '#0C4A6E',
    primary: '0xc019…84ee',
    secondary: '47s · Polygon',
    value: '+ $612.07',
  },
  {
    accent: '#10B981',
    bg: 'rgba(16,185,129,0.10)',
    text: '#064E3B',
    primary: '0x4d2b…11af',
    secondary: '1m · Base',
    value: '+ $3,902.18',
  },
]

const PAYOUT_YESTERDAY: CardRow[] = [
  {
    accent: '#8B5CF6',
    bg: 'rgba(139,92,246,0.10)',
    text: '#581C87',
    primary: '0xa88e…d932',
    secondary: 'Polygon',
    value: '+ $248.55',
  },
  {
    accent: '#F43F5E',
    bg: '#FFE4E6',
    text: '#BE123C',
    primary: '0x9c74…fe10',
    secondary: 'Base',
    value: '+ $1,047.12',
  },
]

function Row({ row }: { row: CardRow }): React.JSX.Element {
  return (
    <div className="flex h-[42px] rounded-[4px] overflow-hidden" style={{ background: row.bg }}>
      <div className="w-[2.5px] shrink-0" style={{ background: row.accent }} />
      <div className="flex-1 px-2 py-1.5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[9px] font-semibold font-sans truncate" style={{ color: row.text }}>
            {row.primary}
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
          {row.secondary}
        </span>
      </div>
    </div>
  )
}

function ArtworkCard({
  rows,
  header,
  pulse = false,
}: {
  rows: CardRow[]
  header: string
  pulse?: boolean
}): React.JSX.Element {
  return (
    <div
      className="w-[190px] bg-white rounded-[10px] p-1.5 flex flex-col gap-[3px]"
      style={{
        boxShadow: '0px 0px 0px 1px rgba(0,0,0,0.08), 0px 8px 24px -6px rgba(55,50,47,0.18)',
      }}
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
        <Row key={r.primary + r.secondary} row={r} />
      ))}
    </div>
  )
}

function CampaignsArtwork(): React.JSX.Element {
  return (
    <div className="relative w-[380px] h-[270px]">
      <div className="absolute" style={{ transform: 'rotate(-5deg)', left: '8px', top: '20px' }}>
        <ArtworkCard rows={CAMPAIGN_ROWS} header="Campaigns" pulse />
      </div>
      <div className="absolute" style={{ transform: 'rotate(5deg)', left: '180px', top: '90px' }}>
        <ArtworkCard rows={AUDIENCE_ROWS} header="Audiences" />
      </div>
    </div>
  )
}

function PayoutsArtwork(): React.JSX.Element {
  return (
    <div className="relative w-[380px] h-[270px]">
      <div className="absolute" style={{ transform: 'rotate(-5deg)', left: '8px', top: '20px' }}>
        <ArtworkCard rows={PAYOUT_TODAY} header="Today" pulse />
      </div>
      <div className="absolute" style={{ transform: 'rotate(5deg)', left: '180px', top: '90px' }}>
        <ArtworkCard rows={PAYOUT_YESTERDAY} header="Yesterday" />
      </div>
    </div>
  )
}
