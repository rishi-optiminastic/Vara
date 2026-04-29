import Link from 'next/link'
import { ArrowRight, DollarSign } from 'lucide-react'
import { PageBadge } from '../page-elements'

interface ProofItem {
  value: string
  label: string
}

const PROOF: ProofItem[] = [
  { value: '94%', label: 'fill rate' },
  { value: '+38%', label: 'eCPM lift' },
  { value: '<60s', label: 'settlement' },
  { value: '120+', label: 'DSP buyers' },
]

export function SspHero(): React.JSX.Element {
  return (
    <section className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 lg:pb-16 flex flex-col items-center w-full relative">
      <div className="absolute top-[80px] sm:top-[120px] lg:top-[180px] left-1/2 -translate-x-1/2 z-0 pointer-events-none">
        <img
          src="/mask-group-pattern.svg"
          alt=""
          className="w-[936px] sm:w-[1404px] lg:w-[2400px] h-auto opacity-30 sm:opacity-40 mix-blend-multiply"
          style={{ filter: 'hue-rotate(180deg) saturate(0.6) brightness(1.1)' }}
        />
      </div>

      <div className="w-full max-w-[937px] flex flex-col items-center gap-4 sm:gap-5 relative z-10">
        <PageBadge icon={<DollarSign size={11} />} text="Supply-Side Platform · Web3 Native" />
        <h1 className="max-w-[820px] text-center text-foreground text-[34px] sm:text-[48px] md:text-[60px] lg:text-[72px] font-normal leading-[1.05] sm:leading-[1.05] lg:leading-[1.05] font-serif px-2 tracking-tight">
          Monetize your traffic with Web3 demand
        </h1>
        <p className="max-w-[540px] text-center text-foreground/65 text-[15px] sm:text-base leading-[1.55] font-sans px-2">
          Connect your inventory to premium programmatic demand — with transparent on-chain payments
          and no middlemen taking a cut.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-7 sm:mt-8 relative z-10">
        <Link
          href="/ssp/sign-up"
          className="h-11 px-7 bg-primary shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] rounded-full flex items-center gap-2 hover:bg-[#2A2520] transition-colors"
        >
          <span className="text-white text-[14px] font-medium leading-5 font-sans">
            Start onboarding
          </span>
          <ArrowRight size={14} className="text-white" />
        </Link>
        <Link
          href="/ssp/sign-in"
          className="h-11 px-7 bg-white shadow-[0px_1px_2px_rgba(55,50,47,0.12)] rounded-full flex items-center border border-[rgba(2,6,23,0.08)] hover:bg-[#F0EEEB] transition-colors"
        >
          <span className="text-foreground text-[14px] font-medium leading-5 font-sans">
            Sign in
          </span>
        </Link>
      </div>

      <div className="mt-9 sm:mt-12 relative z-10 w-full max-w-[760px] px-4">
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 sm:gap-x-9 px-5 py-3 rounded-full bg-white/60 backdrop-blur-sm border border-foreground/[0.06] shadow-[0_1px_2px_rgba(55,50,47,0.04)] mx-auto w-fit">
          {PROOF.map((item, i) => (
            <div key={item.label} className="flex items-center gap-2.5">
              {i > 0 && (
                <span className="hidden sm:inline-block size-1 rounded-full bg-foreground/20" />
              )}
              <span className="text-[#37322F] text-[13px] font-mono tabular-nums font-medium">
                {item.value}
              </span>
              <span className="text-foreground/55 text-[12px] font-sans">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
