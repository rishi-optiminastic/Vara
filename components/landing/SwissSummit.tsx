import type { JSX } from "react"

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

export function SwissSummit({
  heading,
  pillars,
  watermark,
  stats,
}: SwissSummitProps): JSX.Element {
  return (
    <section id="overview" className="relative w-full py-20 border-t border-[#37322F]/15">
      <div className="grid grid-cols-12 gap-x-6">
        <h2 className="col-span-12 mb-10 text-[#1f40cd] uppercase tracking-[-0.01em] text-2xl md:text-3xl font-medium">
          {heading}
        </h2>

        {pillars.map((p) => (
          <div key={p.title} className="col-span-12 md:col-span-4 mb-6">
            <div className="text-[#1f40cd] text-[15px] font-medium">{p.title}</div>
            <div className="mt-1 text-[13px] text-[#37322F]/55">{p.sub}</div>
          </div>
        ))}
      </div>

      <div className="relative mt-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-2 flex justify-center text-[260px] leading-[0.85] font-light text-[#1f40cd]/[0.06] select-none tracking-tighter"
        >
          {watermark}
        </div>

        <div className="relative grid grid-cols-12 gap-x-6 pt-28">
          {stats.map((s) => (
            <div key={s.label} className="col-span-12 md:col-span-4 mb-10">
              <div className="text-[#1f40cd] uppercase text-2xl font-medium tracking-[-0.01em]">
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
          ))}
        </div>
      </div>
    </section>
  )
}
