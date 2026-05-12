import {
  ArrowRight,
  BarChart3,
  Banknote,
  DollarSign,
  Layers,
  Settings2,
  Shield,
} from 'lucide-react'
import { DiagonalLines, PageBadge } from '../page-elements'

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
    icon: <DollarSign size={18} />,
    title: 'Premium Web3 demand',
    description:
      'A curated pool of vetted DSP buyers competing in real-time auctions for your inventory — pushing CPMs up.',
  },
  {
    icon: <Layers size={18} />,
    title: 'Yield optimisation',
    description:
      'Dynamic floor pricing and header bidding ensure every impression sells at peak value, automatically.',
  },
  {
    icon: <Banknote size={18} />,
    title: 'On-chain settlement',
    description:
      'Payments settle directly to your wallet on-chain. No invoices, no net-30, no reconciliation disputes.',
  },
  {
    icon: <Shield size={18} />,
    title: 'Brand safety controls',
    description:
      'Allowlist and blocklist by category, domain, and wallet type — full control at the impression level.',
  },
  {
    icon: <BarChart3 size={18} />,
    title: 'Impression-level reporting',
    description:
      'Real-time dashboards showing fill rate, eCPM, revenue, and blocked requests — every event verified.',
  },
  {
    icon: <Settings2 size={18} />,
    title: 'Multi-format inventory',
    description:
      'Monetize banner, native, interstitial, and wallet-contextual formats across web, dApp, and mobile.',
  },
]

const STEPS: StepItem[] = [
  {
    num: '01',
    title: 'List your inventory',
    description: 'Connect your site or dApp and define your ad slots and targeting metadata.',
  },
  {
    num: '02',
    title: 'Set floor prices',
    description: 'Configure minimum CPMs per format and audience segment to protect your yield.',
  },
  {
    num: '03',
    title: 'Receive bids',
    description: 'Vetted DSP buyers compete in real-time auctions — the highest bid wins.',
  },
  {
    num: '04',
    title: 'Collect on-chain',
    description: 'Revenue flows directly to your wallet. No middlemen, no delays, fully auditable.',
  },
]

function Explainer(): React.JSX.Element {
  return (
    <section className="w-full border-t border-b border-border flex flex-col items-center">
      <div className="self-stretch px-4 sm:px-6 md:px-24 py-10 sm:py-14 md:py-16 flex justify-center items-center">
        <div className="w-full max-w-[640px] flex flex-col items-center gap-3 sm:gap-4 text-center">
          <PageBadge icon={<Layers size={11} />} text="Explainer" />
          <h2 className="max-w-[560px] text-[#49423D] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            What is a Supply-Side Platform?
          </h2>
          <p className="text-[#605A57] text-sm sm:text-base leading-6 sm:leading-7 font-sans">
            An SSP helps publishers and dApp developers sell ad inventory programmatically. SSPs
            connect to demand — DSPs and exchanges — and run real-time auctions to find the
            highest-paying buyer for every impression. Vara adds on-chain settlement so you actually
            get paid, instantly, with no invoicing.
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
            Live in days, not months
          </h2>
          <p className="text-[#605A57] text-sm sm:text-base leading-6 sm:leading-7 font-sans">
            Drop in our SDK, configure your inventory, and start earning Web3-native CPMs the same
            week you sign up.
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

export function SspContent(): React.JSX.Element {
  return (
    <>
      <Explainer />
      <FeaturesGrid />
      <HowItWorks />
    </>
  )
}
