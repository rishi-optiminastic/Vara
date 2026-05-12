import Link from "next/link"
import type { JSX } from "react"

export interface Tier {
  price: string
  unit: string
  name: string
  body: string
  features: ReadonlyArray<string>
  cta: { label: string; href: string }
  recommended?: boolean
  ctaVariant?: "default" | "dark"
  note?: string
}

export interface SwissPricingProps {
  heading: string
  body: string
  tiers: ReadonlyArray<Tier>
  footnoteLeft?: string
  footnoteRight?: string
}

export function SwissPricing({
  heading,
  body,
  tiers,
  footnoteLeft,
  footnoteRight,
}: SwissPricingProps): JSX.Element {
  return (
    <section id="access" className="relative w-full py-20 border-t border-[#37322F]/15">
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12 lg:col-span-7">
          <h2 className="text-[#1f40cd] uppercase tracking-[-0.01em] text-2xl md:text-3xl font-medium">
            {heading}
          </h2>
          <p className="mt-3 max-w-[520px] text-[13px] text-[#37322F]/70">{body}</p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-12 gap-0">
        {tiers.map((t) => (
          <TierCard key={t.name} tier={t} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-12 gap-x-6 text-[11px] tracking-[0.14em] text-[#37322F]/55">
        {footnoteLeft && <div className="col-span-12 md:col-span-6">{footnoteLeft}</div>}
        {footnoteRight && (
          <div className="col-span-12 md:col-span-6 md:text-right">{footnoteRight}</div>
        )}
      </div>
    </section>
  )
}

function TierCard({ tier }: { tier: Tier }): JSX.Element {
  const buttonDark = tier.ctaVariant === "dark"
  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-[#1f40cd] text-white p-6 flex flex-col gap-5">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-3xl font-medium tracking-[-0.01em]">{tier.price}</div>
          <div className="text-[10px] tracking-[0.14em] opacity-80 mt-1">{tier.unit}</div>
        </div>
        {tier.recommended && (
          <span className="text-[10px] tracking-[0.14em] opacity-90">RECOMMENDED</span>
        )}
      </div>
      <div>
        <div className="text-lg font-medium tracking-[-0.01em]">{tier.name}</div>
        <p className="mt-2 text-[13px] leading-[1.55] opacity-90">{tier.body}</p>
      </div>
      <ul className="space-y-2 text-[13px] leading-[1.45] opacity-95">
        {tier.features.map((f) => (
          <li key={f} className="flex gap-2">
            <span aria-hidden>•</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto space-y-3">
        {tier.note && (
          <div className="text-[11px] tracking-[0.04em] opacity-80 text-center">
            {tier.note}
          </div>
        )}
        <Link
          href={tier.cta.href}
          className={`block w-full text-center h-10 leading-10 text-xs tracking-[0.08em] font-medium ${
            buttonDark ? "bg-black text-white" : "bg-white text-[#1f40cd]"
          }`}
        >
          {tier.cta.label.toUpperCase()}
        </Link>
      </div>
    </div>
  )
}
