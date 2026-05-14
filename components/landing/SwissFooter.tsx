"use client"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { JSX } from "react"
import { AnimatedGrid, AnimatedItem, EASE } from "@/components/landing/AnimatedGrid"

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

const STEP_BARS = [
  { left: "6%", h: "h-7", w: "w-[10%]", delay: 0.04 },
  { left: "28%", h: "h-10", w: "w-[14%]", delay: 0.12 },
  { left: "52%", h: "h-6", w: "w-[8%]", delay: 0.08 },
  { left: "68%", h: "h-12", w: "w-[18%]", delay: 0 },
]

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
      <motion.div
        className="bg-[#1f40cd] text-white px-6 md:px-10 lg:px-14 py-10"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -40px 0px" }}
        transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
      >
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

        <AnimatedGrid className="mt-8 grid grid-cols-12 gap-x-6 gap-y-6 items-start">
          <AnimatedItem className="col-span-12 lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            {brandLogo ? (
              <Image
                src={brandLogo.src}
                alt={brandLogo.alt}
                width={brandLogo.width}
                height={brandLogo.height}
                className="h-10 sm:h-14 w-auto flex-shrink-0"
                priority={false}
              />
            ) : (
              <div className="text-xl font-medium tracking-[-0.01em]">{brand}</div>
            )}
            <div className="flex flex-col">
              <p className="text-[12px] opacity-90">{blurb}</p>
              <div className="mt-2 text-[10px] tracking-[0.14em] opacity-80">{meta}</div>
            </div>
          </AnimatedItem>

          {columns.map((col) => (
            <AnimatedItem key={col.title} className="col-span-6 lg:col-span-3">
              <FooterColumn title={col.title} links={col.links} />
            </AnimatedItem>
          ))}
        </AnimatedGrid>

        <div className="mt-8 flex flex-col md:flex-row justify-between gap-2 text-[10px] tracking-[0.14em] opacity-80 border-t border-white/15 pt-4">
          <div>{legal.copyright}</div>
          <div className="flex flex-wrap gap-4">
            {legal.links.map((l) => (
              <Link key={l.label} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: ReadonlyArray<FooterLink>
}): JSX.Element {
  return (
    <div>
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
      {STEP_BARS.map((bar) => (
        <motion.div
          key={bar.left}
          className={`absolute top-0 ${bar.h} ${bar.w} bg-[#1f40cd]`}
          style={{ left: bar.left }}
          initial={{ y: "-100%" }}
          whileInView={{ y: "0%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.38, delay: bar.delay, ease: EASE }}
        />
      ))}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-4 bg-[#1f40cd]"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        style={{ transformOrigin: "left" }}
        transition={{ duration: 0.5, delay: 0.18, ease: EASE }}
      />
    </div>
  )
}
