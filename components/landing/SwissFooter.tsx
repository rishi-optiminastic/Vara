import Image from "next/image"
import Link from "next/link"
import type { JSX } from "react"

export interface FooterLink {
  label: string
  href: string
}

export interface SwissFooterProps {
  brand: string
  brandLogo?: { src: string; alt: string; width: number; height: number }
  blurb: string
  meta: string
  columns: ReadonlyArray<{ title: string; links: ReadonlyArray<FooterLink> }>
  legal: { copyright: string; links: ReadonlyArray<FooterLink> }
  newsletterHeading?: string
  newsletterBody?: string
}

export function SwissFooter({
  brand,
  brandLogo,
  blurb,
  meta,
  columns,
  legal,
  newsletterHeading = "Stay in the loop",
  newsletterBody = "Subscribe for dispatches on architecture decisions, module releases, and access waves.",
}: SwissFooterProps): JSX.Element {
  return (
    <footer className="relative w-full">
      <StepBand />
      <div className="bg-[#1f40cd] text-white px-6 md:px-10 lg:px-14 py-10">
        <div className="grid grid-cols-12 gap-x-6 gap-y-6 items-start">
          <div className="col-span-12 lg:col-span-7">
            <h2 className="uppercase tracking-[-0.01em] text-xl md:text-2xl font-medium">
              {newsletterHeading}
            </h2>
            <p className="mt-1 text-[12px] opacity-90 max-w-[420px]">{newsletterBody}</p>
          </div>
          <form className="col-span-12 lg:col-span-5 flex gap-2 items-end" aria-label="Subscribe">
            <label className="flex-1">
              <span className="sr-only">Email address</span>
              <input
                type="email"
                placeholder="Email address"
                className="w-full h-10 px-3 bg-[#1731a3] text-white placeholder-white/70 border-0 outline-none text-sm"
              />
            </label>
            <button
              type="submit"
              className="h-10 px-5 bg-white text-[#1f40cd] text-[11px] font-medium tracking-[0.08em]"
            >
              JOIN LIST
            </button>
          </form>
        </div>

        <div className="mt-8 grid grid-cols-12 gap-x-6 gap-y-6 items-start">
          <div className="col-span-12 lg:col-span-6 flex items-center gap-4">
            {brandLogo ? (
              <Image
                src={brandLogo.src}
                alt={brandLogo.alt}
                width={brandLogo.width}
                height={brandLogo.height}
                className="h-16 w-auto"
                priority={false}
              />
            ) : (
              <div className="text-xl font-medium tracking-[-0.01em]">{brand}</div>
            )}
            <div className="flex flex-col">
              <p className="max-w-[360px] text-[12px] opacity-90">{blurb}</p>
              <div className="mt-2 text-[10px] tracking-[0.14em] opacity-80">{meta}</div>
            </div>
          </div>

          {columns.map((col) => (
            <FooterColumn
              key={col.title}
              title={col.title}
              links={col.links}
              className="col-span-6 lg:col-span-3"
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between gap-2 text-[10px] tracking-[0.14em] opacity-80 border-t border-white/15 pt-4">
          <div>{legal.copyright}</div>
          <div className="flex gap-5">
            {legal.links.map((l) => (
              <Link key={l.label} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
  className,
}: {
  title: string
  links: ReadonlyArray<FooterLink>
  className: string
}): JSX.Element {
  return (
    <div className={className}>
      <div className="text-[11px] tracking-[0.14em] opacity-80">{title}</div>
      <ul className="mt-3 space-y-2 text-[13px]">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="hover:underline underline-offset-4">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StepBand(): JSX.Element {
  return (
    <div aria-hidden className="relative h-14 w-full overflow-hidden">
      <div className="absolute left-[6%] top-0 h-7 w-[10%] bg-[#1f40cd]" />
      <div className="absolute left-[28%] top-0 h-10 w-[14%] bg-[#1f40cd]" />
      <div className="absolute left-[52%] top-0 h-6 w-[8%] bg-[#1f40cd]" />
      <div className="absolute left-[68%] top-0 h-12 w-[18%] bg-[#1f40cd]" />
      <div className="absolute inset-x-0 bottom-0 h-4 bg-[#1f40cd]" />
    </div>
  )
}
