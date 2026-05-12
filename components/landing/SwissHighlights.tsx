import type { JSX } from "react"

export interface Highlight {
  title: string
  caption: string
  swatch: "primary" | "dark" | "muted"
}

export interface SwissHighlightsProps {
  eyebrow: string
  heading: string
  body: string
  badge?: string
  items: ReadonlyArray<Highlight>
}

const SWATCH: Record<Highlight["swatch"], string> = {
  primary: "bg-[#1f40cd]",
  dark: "bg-[#0a1a5c]",
  muted: "bg-[#37322F]/20",
}

export function SwissHighlights({
  eyebrow,
  heading,
  body,
  badge,
  items,
}: SwissHighlightsProps): JSX.Element {
  return (
    <section className="relative w-full py-20 border-t border-[#37322F]/15">
      <div className="grid grid-cols-12 gap-x-6 items-start">
        <div className="col-span-12 lg:col-span-2">
          <div className="text-[11px] tracking-[0.18em] text-[#37322F]/55">
            {eyebrow}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-7">
          <h2 className="text-[#1f40cd] uppercase tracking-[-0.01em] text-2xl md:text-3xl font-medium">
            {heading}
          </h2>
          <p className="mt-3 max-w-[520px] text-[13px] text-[#37322F]/70">
            {body}
          </p>
        </div>
        {badge && (
          <div className="col-span-12 lg:col-span-3 mt-6 lg:mt-0 flex lg:justify-end">
            <span className="inline-flex h-9 items-center px-4 text-[11px] tracking-[0.14em] text-[#1f40cd] border border-[#1f40cd]">
              {badge}
            </span>
          </div>
        )}
      </div>

      <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((h) => (
          <article key={h.title} className="flex flex-col">
            <div className={`relative aspect-[4/5] w-full ${SWATCH[h.swatch]}`}>
              <div className="absolute inset-x-3 bottom-3 text-white text-[11px] tracking-[0.14em]">
                {h.caption}
              </div>
            </div>
            <div className="mt-3 text-[13px] text-[#37322F]">{h.title}</div>
          </article>
        ))}
      </div>
    </section>
  )
}
