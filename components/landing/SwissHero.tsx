import Link from "next/link"
import type { JSX, ReactNode } from "react"

export interface SwissHeroProps {
  eyebrow?: string
  title: ReactNode
  body: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  meta?: string
}

export function SwissHero({
  eyebrow,
  title,
  body,
  primaryCta,
  secondaryCta,
  meta,
}: SwissHeroProps): JSX.Element {
  return (
    <section className="relative w-full pt-10 pb-16">
      <div className="grid grid-cols-12 gap-x-6 items-start">
        <div className="col-span-12 lg:col-span-7">
          {eyebrow && (
            <div className="text-[11px] tracking-[0.18em] text-[#37322F]/55 mb-5">
              {eyebrow}
            </div>
          )}
          <h1 className="text-[#1f40cd] uppercase tracking-[-0.01em] leading-[0.95] text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] font-medium">
            {title}
          </h1>
          <p className="mt-5 max-w-[440px] text-[13px] leading-[1.55] text-[#37322F]/80">
            {body}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={primaryCta.href}
              className="inline-flex h-10 items-center px-5 text-xs font-medium tracking-[0.08em] text-white bg-[#1f40cd] hover:opacity-90 transition-opacity"
            >
              {primaryCta.label.toUpperCase()}
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex h-10 items-center px-5 text-xs font-medium tracking-[0.08em] text-[#1f40cd] border border-[#1f40cd] hover:bg-[#1f40cd]/5 transition-colors"
              >
                {secondaryCta.label.toUpperCase()}
              </Link>
            )}
          </div>
          {meta && (
            <div className="mt-10 text-[11px] tracking-[0.14em] text-[#37322F]/55">
              {meta}
            </div>
          )}
        </div>

        <div className="col-span-12 lg:col-span-5 relative min-h-[260px] lg:min-h-[420px] mt-10 lg:mt-0">
          <SteppedShape />
        </div>
      </div>

      <div className="mt-16 h-[240px] sm:h-[320px] w-full bg-[#1f40cd] relative">
        <div className="absolute -top-8 left-[12%] h-8 w-[14%] bg-[#1f40cd]" />
        <div className="absolute -top-16 left-[40%] h-16 w-[10%] bg-[#1f40cd]" />
        <div className="absolute -top-10 right-[8%] h-10 w-[12%] bg-[#1f40cd]" />
      </div>
    </section>
  )
}

function SteppedShape(): JSX.Element {
  return (
    <svg
      viewBox="0 0 320 320"
      className="absolute right-0 top-0 h-full w-full max-w-[440px] ml-auto"
      preserveAspectRatio="xMaxYMin meet"
      aria-hidden
    >
      <path
        d="M 60 40 L 100 40 L 100 80 L 60 80 Z
           M 160 0 L 320 0 L 320 220 L 220 220 L 220 180 L 180 180 L 180 140 L 160 140 Z"
        fill="#1f40cd"
      />
    </svg>
  )
}
