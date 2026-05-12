import type { JSX } from "react"

export interface ModuleCard {
  eyebrow: string
  title: string
  body: string
  location: string
  tags: ReadonlyArray<string>
  variant?: "default" | "dark"
}

export interface SwissModulesProps {
  eyebrow: string
  heading: string
  body: string
  modules: ReadonlyArray<ModuleCard>
}

export function SwissModules({
  eyebrow,
  heading,
  body,
  modules,
}: SwissModulesProps): JSX.Element {
  return (
    <section id="modules" className="relative w-full py-20 border-t border-[#37322F]/15">
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12 lg:col-span-7">
          <div className="text-[11px] tracking-[0.16em] text-[#37322F]/55">{eyebrow}</div>
          <h2 className="mt-2 text-[#1f40cd] uppercase tracking-[-0.01em] text-2xl md:text-3xl font-medium">
            {heading}
          </h2>
          <p className="mt-3 max-w-[480px] text-[13px] text-[#37322F]/70">{body}</p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-12 gap-6">
        {modules.map((m) => (
          <ModuleTile key={m.title} module={m} />
        ))}
      </div>
    </section>
  )
}

function ModuleTile({ module: m }: { module: ModuleCard }): JSX.Element {
  const dark = m.variant === "dark"
  const bg = dark ? "bg-[#0a1a5c]" : "bg-[#1f40cd]"
  return (
    <article className="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col">
      <div className="relative aspect-[4/3] w-full bg-[#d6d3c8] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-[#37322F]/30 text-xs tracking-[0.18em]">
          {m.title} ·  ENGINE
        </div>
        <div className={`absolute -bottom-2 -left-2 h-8 w-8 ${bg}`} />
        <div className={`absolute -bottom-2 -right-2 h-8 w-8 ${bg}`} />
      </div>
      <div className={`${bg} text-white p-6 flex-1 flex flex-col`}>
        <div className="text-[10px] tracking-[0.14em] opacity-80">{m.eyebrow}</div>
        <div className="mt-2 text-lg font-medium tracking-[-0.01em]">{m.title}</div>
        <p className="mt-3 text-[13px] leading-[1.55] opacity-90">{m.body}</p>
        <div className="mt-auto pt-6">
          <div className="text-[10px] tracking-[0.14em] opacity-80">{m.location}</div>
          <ul className="mt-2 text-[12px] leading-[1.6] opacity-90">
            {m.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}
