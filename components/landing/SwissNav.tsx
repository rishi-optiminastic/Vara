"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import type { JSX } from "react"
import { EASE } from "@/components/landing/AnimatedGrid"

export interface SwissNavItem {
  label: string
  href: string
}

export interface SwissNavLogo {
  src: string
  alt: string
  width: number
  height: number
}

export interface SwissNavProps {
  brand: SwissNavItem
  brandLogo?: SwissNavLogo
  items: ReadonlyArray<SwissNavItem>
  cta: SwissNavItem
}

const BRACKET_ORIGIN: Record<"tl" | "tr" | "bl" | "br", string> = {
  tl: "top left",
  tr: "top right",
  bl: "bottom left",
  br: "bottom right",
}

const BRACKET_DELAY: Record<"tl" | "tr" | "bl" | "br", number> = {
  tl: 0.44,
  tr: 0.52,
  br: 0.60,
  bl: 0.68,
}

function CornerBracket({ position }: { position: "tl" | "tr" | "bl" | "br" }): JSX.Element {
  const map: Record<typeof position, string> = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  }
  return (
    <motion.span
      className={`absolute h-2 w-2 border-[#1f40cd] ${map[position]}`}
      aria-hidden
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      style={{ transformOrigin: BRACKET_ORIGIN[position] }}
      transition={{ duration: 0.2, delay: BRACKET_DELAY[position], ease: EASE }}
    />
  )
}

function BurgerIcon({ open }: { open: boolean }): JSX.Element {
  return (
    <div className="flex flex-col gap-[5px] w-5">
      <motion.span
        className="h-px bg-[#1f40cd] block"
        animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
        transition={{ duration: 0.2, ease: EASE }}
      />
      <motion.span
        className="h-px bg-[#1f40cd] block"
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.15, ease: EASE }}
      />
      <motion.span
        className="h-px bg-[#1f40cd] block"
        animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
        transition={{ duration: 0.2, ease: EASE }}
      />
    </div>
  )
}

export function SwissNav({ brand, brandLogo, items, cta }: SwissNavProps): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="relative w-full pt-5 pb-3 sm:pt-8 sm:pb-4">
      <div className="flex items-center gap-4 sm:gap-6">

        <motion.div
          initial={{ x: -18, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.02, ease: EASE }}
        >
          <Link
            href={brand.href}
            aria-label={brand.label}
            className="inline-flex items-center text-xs font-medium tracking-[0.08em] text-[#1f40cd]"
          >
            {brandLogo ? (
              <>
                <Image
                  src={brandLogo.src}
                  alt={brandLogo.alt}
                  width={brandLogo.width}
                  height={brandLogo.height}
                  className="h-10 sm:h-12 lg:h-14 w-auto"
                  priority
                />
                <div className="text-lg sm:text-2xl">Vara<span className="text-gray-500">Ads</span></div>
              </>
            ) : (
              brand.label
            )}
          </Link>
        </motion.div>

        <ul className="hidden lg:flex flex-1 items-center justify-end gap-4 xl:gap-8 text-xs font-medium tracking-[0.08em] text-[#1f40cd]">
          {items.map((item, i) => (
            <motion.li
              key={item.label}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.08 + i * 0.07, ease: EASE }}
            >
              <Link href={item.href} className="hover:opacity-70 transition-opacity">
                {item.label}
              </Link>
            </motion.li>
          ))}
        </ul>

        <div className="ml-auto lg:ml-0 flex items-center gap-2 sm:gap-3">
          <motion.div
            initial={{ x: 18, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.22, ease: EASE }}
          >
            <Link
              href={cta.href}
              className="relative px-3 sm:px-5 py-2 text-xs font-medium tracking-[0.08em] text-white bg-[#1f40cd]"
            >
              <CornerBracket position="tl" />
              <CornerBracket position="tr" />
              <CornerBracket position="br" />
              <CornerBracket position="bl" />
              {cta.label}
            </Link>
          </motion.div>

          <button
            className="lg:hidden p-1.5 -mr-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <BurgerIcon open={menuOpen} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="lg:hidden overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <ul className="mt-3 pt-3 pb-2 border-t border-[#37322F]/10">
              {items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="block py-3 text-xs font-medium tracking-[0.08em] text-[#1f40cd] border-b border-[#37322F]/8 hover:opacity-70 transition-opacity"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
