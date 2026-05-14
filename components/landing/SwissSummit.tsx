import type { JSX } from "react"
import {
  AuctionMark,
  IdentityMark,
  SettlementMark,
  LayersMark,
  ModulesMark,
  ServicesMark,
} from "@/components/landing/SwissSummitMarks"

export interface Pillar {
  title: string
  sub: string
}

export interface Stat {
  number: string
  label: string
  body: string
  link?: { label: string; href: string }
}

export interface SwissSummitProps {
  heading: string
  pillars: ReadonlyArray<Pillar>
  watermark: string
  stats: ReadonlyArray<Stat>
}

type MarkComponent = () => JSX.Element
const PILLAR_MARKS: ReadonlyArray<MarkComponent> = [AuctionMark, IdentityMark, SettlementMark]
const STAT_MARKS: ReadonlyArray<MarkComponent> = [LayersMark, ModulesMark, ServicesMark]

export function SwissSummit({
  heading,
  pillars,
  watermark,
  stats,
}: SwissSummitProps): JSX.Element {
  return (
    <section id="overview" className="relative w-full py-12 md:py-20 border-t border-[#37322F]/15">
      <div className="grid grid-cols-12 gap-x-6">
        <h2 className="col-span-12 mb-10 text-[#1f40cd] uppercase tracking-[-0.01em] text-2xl md:text-3xl font-medium">
          {heading}
        </h2>

        {pillars.map((p, i) => {
          const Mark = PILLAR_MARKS[i % PILLAR_MARKS.length] as MarkComponent
          return (
            <div key={p.title} className="col-span-12 md:col-span-4 mb-10">
              <Mark />
              <div className="mt-5 text-[#1f40cd] text-[15px] font-medium">{p.title}</div>
              <div className="mt-1 text-[13px] text-[#37322F]/55">{p.sub}</div>
            </div>
          )
        })}
      </div>

      <div className="relative mt-12 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-2 flex justify-center text-[80px] sm:text-[140px] md:text-[200px] lg:text-[260px] leading-[0.85] font-light text-[#1f40cd]/[0.06] select-none tracking-tighter"
        >
          {watermark}
        </div>

        <div className="relative grid grid-cols-12 gap-x-6 pt-10 sm:pt-16 md:pt-20 lg:pt-28">
          {stats.map((s, i) => {
            const Mark = STAT_MARKS[i % STAT_MARKS.length] as MarkComponent
            return (
              <div key={s.label} className="col-span-12 md:col-span-4 mb-10">
                <Mark />
                <div className="mt-5 text-[#1f40cd] uppercase text-xl sm:text-2xl font-medium tracking-[-0.01em]">
                  {s.label}
                </div>
                <p className="mt-3 max-w-[300px] text-[13px] leading-[1.55] text-[#37322F]/75">
                  {s.body}
                </p>
                {s.link && (
                  <a
                    href={s.link.href}
                    className="mt-4 inline-block text-[13px] text-[#1f40cd] underline underline-offset-4"
                  >
                    {s.link.label}
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
