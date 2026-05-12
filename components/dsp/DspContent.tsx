import { ArrowRight, BarChart3, Globe, Shield, Target, TrendingUp, Zap } from 'lucide-react'
import { DiagonalLines, PageBadge } from '@/components/page-elements'

interface FeatureItem {
  icon: React.ReactNode
  title: string
  description: string
}

interface StepItem {
  num: string
  title: string
  description: string
}

const FEATURES: FeatureItem[] = [
  {
    icon: <Target size={18} />,
    title: 'Precision wallet targeting',
    description:
      'Reach users by token holdings, DeFi activity, NFT ownership, and on-chain behaviour across every chain.',
  },
  {
    icon: <Zap size={18} />,
    title: 'Sub-100ms RTB',
    description:
      'Bid in real-time auctions across every connected exchange and SSP with ML-powered pacing.',
  },
  {
    icon: <Shield size={18} />,
    title: 'On-chain attribution',
    description:
      'Every impression, click, and conversion verified on-chain — cryptographic proof, zero ad fraud.',
  },
  {
    icon: <Globe size={18} />,
    title: 'Multi-chain reach',
    description:
      'Run unified campaigns across Ethereum, Solana, Base, Arbitrum, and 15+ chains from one console.',
  },
  {
    icon: <BarChart3 size={18} />,
    title: 'Live analytics',
    description:
      'Real-time spend, CPM, CTR, and wallet-level conversion attribution — verified on-chain.',
  },
  {
    icon: <TrendingUp size={18} />,
    title: 'Budget controls',
    description:
      'Daily caps, bid floors, frequency limits, and dayparting rules enforced at the exchange level.',
  },
]

const STEPS: StepItem[] = [
  {
    num: '01',
    title: 'Connect & onboard',
    description: 'Sign up, verify identity, and fund your ad account in under 10 minutes.',
  },
  {
    num: '02',
    title: 'Create a campaign',
    description: 'Define your audience by chain, wallet behaviour, geography, and device.',
  },
  {
    num: '03',
    title: 'Set bids & budget',
    description: 'Choose CPM targets and let our optimizer handle real-time bid shading.',
  },
  {
    num: '04',
    title: 'Launch & track',
    description: 'Go live and monitor every impression on-chain with wallet-level attribution.',
  },
]

function Explainer(): React.JSX.Element {
  return (
    <section className="w-full border-t border-b border-border flex flex-col items-center">
      <div className="self-stretch px-4 sm:px-6 md:px-24 py-10 sm:py-14 md:py-16 flex justify-center items-center">
        <div className="w-full max-w-[640px] flex flex-col items-center gap-3 sm:gap-4 text-center">
          <PageBadge icon={<Globe size={11} />} text="Explainer" />
          <h2 className="max-w-[560px] text-[#49423D] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            What is a Demand-Side Platform?
          </h2>
          <p className="text-[#605A57] text-sm sm:text-base leading-6 sm:leading-7 font-sans">
            A DSP lets advertisers automatically buy digital ad inventory across multiple exchanges
            through a single console. Instead of negotiating placements one-by-one, you bid on
            impressions in real time. Vara goes further — every bid, impression, and conversion is
            recorded on-chain for cryptographic proof of delivery.
          </p>
        </div>
      </div>
    </section>
  )
}

function FeaturesGrid(): React.JSX.Element {
  return (
    <section className="w-full border-b border-border flex justify-center items-start">
      <DiagonalLines />
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-l border-r border-border">
        {FEATURES.map((f, i) => {
          const isLastInRow = (i + 1) % 3 === 0
          const isLastRow = i >= 3
          return (
            <div
              key={f.title}
              className={`p-5 sm:p-6 md:p-8 flex flex-col gap-3 border-b border-border ${
                isLastRow ? 'lg:border-b-0' : ''
              } ${i % 2 === 0 ? 'sm:border-r sm:border-r-border' : ''} ${
                !isLastInRow ? 'lg:border-r' : 'lg:border-r-0'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-[#FFFFFF] border border-foreground/[0.08] flex items-center justify-center text-[#2F3037]">
                {f.icon}
              </div>
              <h3 className="text-[#49423D] text-base sm:text-[17px] font-semibold leading-tight font-sans">
                {f.title}
              </h3>
              <p className="text-[#605A57] text-[13px] sm:text-sm leading-[22px] font-sans">
                {f.description}
              </p>
            </div>
          )
        })}
      </div>
      <DiagonalLines />
    </section>
  )
}

function HowItWorks(): React.JSX.Element {
  return (
    <section className="w-full border-b border-border">
      <div className="self-stretch px-4 sm:px-6 md:px-24 py-10 sm:py-14 md:py-16 border-b border-border flex justify-center items-center">
        <div className="w-full max-w-[640px] flex flex-col items-center gap-3 sm:gap-4 text-center">
          <PageBadge icon={<ArrowRight size={11} />} text="How it works" />
          <h2 className="max-w-[560px] text-[#49423D] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            From signup to live in 30 minutes
          </h2>
          <p className="text-[#605A57] text-sm sm:text-base leading-6 sm:leading-7 font-sans">
            Onboarding is fully self-serve. You can ship your first campaign the same day you sign
            up.
          </p>
        </div>
      </div>
      <div className="flex justify-center items-start">
        <DiagonalLines />
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-r border-border">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className={`p-5 sm:p-6 md:p-8 flex flex-col gap-2 border-b sm:border-b-0 border-border ${
                i < 3 ? 'lg:border-r' : ''
              } ${i === 0 ? 'sm:border-r' : ''} ${i === 1 ? 'sm:border-r-0 lg:border-r' : ''} ${
                i === 2 ? 'sm:border-r' : ''
              } ${i < 2 ? 'sm:border-b lg:border-b-0' : ''}`}
            >
              <span className="text-[#828387] text-xs font-mono tracking-wider">{step.num}</span>
              <h3 className="text-[#49423D] text-base font-semibold leading-tight font-sans">
                {step.title}
              </h3>
              <p className="text-[#605A57] text-[13px] leading-[22px] font-sans">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        <DiagonalLines />
      </div>
    </section>
  )
}

export function DspContent(): React.JSX.Element {
  return (
    <>
      <Explainer />
      <FeaturesGrid />
      <HowItWorks />
    </>
  )
}
