import { Activity, Globe2, Timer, TrendingUp } from 'lucide-react'
import { DiagonalLines, PageBadge } from '../page-elements'

interface StatItem {
  icon: React.ReactNode
  value: string
  label: string
  description: string
}

const STATS: StatItem[] = [
  {
    icon: <TrendingUp size={18} />,
    value: '+38%',
    label: 'Average eCPM lift',
    description:
      'Publishers see meaningful CPM uplift versus traditional Web2 SSPs after their first 30 days.',
  },
  {
    icon: <Activity size={18} />,
    value: '94%',
    label: 'Fill rate',
    description:
      'Header-bidding plus our curated DSP pool keeps your inventory monetized at near-saturation.',
  },
  {
    icon: <Timer size={18} />,
    value: '<60s',
    label: 'Settlement time',
    description:
      'USDC payouts finalize on Polygon and Base in under a minute — no net-30, no invoices.',
  },
  {
    icon: <Globe2 size={18} />,
    value: '120+',
    label: 'Active DSP buyers',
    description:
      'A vetted, growing pool of Web3-native demand-side buyers competing for every impression.',
  },
]

export function SspStats(): React.JSX.Element {
  return (
    <section className="w-full border-b border-border">
      <div className="self-stretch px-4 sm:px-6 md:px-24 py-10 sm:py-14 md:py-16 border-b border-border flex justify-center items-center">
        <div className="w-full max-w-[640px] flex flex-col items-center gap-3 sm:gap-4 text-center">
          <PageBadge icon={<TrendingUp size={11} />} text="Network performance" />
          <h2 className="max-w-[560px] text-[#49423D] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            Numbers publishers can rely on
          </h2>
          <p className="text-[#605A57] text-sm sm:text-base leading-6 sm:leading-7 font-sans">
            Live metrics from the Vara exchange — refreshed continuously and verifiable on-chain.
          </p>
        </div>
      </div>
      <div className="flex justify-center items-start">
        <DiagonalLines />
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-r border-border">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`p-5 sm:p-6 md:p-8 flex flex-col gap-3 border-b sm:border-b-0 border-border ${
                i < 3 ? 'lg:border-r' : ''
              } ${i === 0 ? 'sm:border-r' : ''} ${i === 1 ? 'sm:border-r-0 lg:border-r' : ''} ${
                i === 2 ? 'sm:border-r' : ''
              } ${i < 2 ? 'sm:border-b lg:border-b-0' : ''}`}
            >
              <div className="w-9 h-9 rounded-lg bg-[#F7F5F3] border border-foreground/[0.08] flex items-center justify-center text-[#2F3037]">
                {stat.icon}
              </div>
              <div className="text-[#37322F] text-3xl sm:text-4xl font-serif font-normal leading-none tracking-tight">
                {stat.value}
              </div>
              <h3 className="text-[#49423D] text-sm sm:text-[15px] font-semibold leading-tight font-sans">
                {stat.label}
              </h3>
              <p className="text-[#605A57] text-[13px] leading-[20px] font-sans">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
        <DiagonalLines />
      </div>
    </section>
  )
}
