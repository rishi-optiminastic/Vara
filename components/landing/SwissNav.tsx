import Image from "next/image"
import Link from "next/link"
import type { JSX } from "react"

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

function CornerBracket({ position }: { position: "tl" | "tr" | "bl" | "br" }): JSX.Element {
  const map: Record<typeof position, string> = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  }
  return <span className={`absolute h-2 w-2 border-[#1f40cd] ${map[position]}`} aria-hidden />
}

export function SwissNav({ brand, brandLogo, items, cta }: SwissNavProps): JSX.Element {
  return (
    <nav className="relative w-full pt-8 pb-4">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
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
              className="h-14 w-auto"
              priority
              />
              <div className="text-2xl">Vara<span className="text-gray-500">Ads</span></div>
              </>
          ) : (
            brand.label
          )}
        </Link>

        <ul className="flex items-center justify-end gap-6 lg:gap-8 text-xs font-medium tracking-[0.08em] text-[#1f40cd]">
          {items.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className="hover:opacity-70 transition-opacity">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={cta.href}
          className="relative px-5 py-2 text-xs font-medium tracking-[0.08em] text-white bg-[#1f40cd]"
        >
          <CornerBracket position="tl" />
          <CornerBracket position="tr" />
          <CornerBracket position="bl" />
          <CornerBracket position="br" />
          {cta.label}
        </Link>
      </div>
    </nav>
  )
}
