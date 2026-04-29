'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

interface MarketingNavProps {
  variant: 'dsp' | 'ssp'
}

export function MarketingNav({ variant }: MarketingNavProps): React.JSX.Element {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isDsp = variant === 'dsp'
  const config = {
    badge: isDsp ? 'DSP' : 'SSP',
    crossHref: isDsp ? '/ssp' : '/dsp',
    crossLabel: isDsp ? 'SSP' : 'DSP',
    signInHref: isDsp ? '/dsp/sign-in' : '/ssp/sign-in',
    signUpHref: isDsp ? '/dsp/sign-up' : '/ssp/sign-up',
    signUpLabel: isDsp ? 'Start as Advertiser' : 'Start as Publisher',
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F7F5F3]/90 backdrop-blur-xl border-b border-foreground/[0.07] shadow-[0_1px_0_rgba(255,255,255,0.8)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-14 sm:h-16 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <span className="text-[#2F3037] text-lg sm:text-xl font-medium font-sans group-hover:opacity-70 transition-opacity">
              Vara
            </span>
            <span className="hidden sm:inline-flex items-center text-[9px] font-medium text-foreground/50 uppercase tracking-[0.14em] border border-foreground/[0.12] rounded-full px-2 py-0.5">
              {config.badge}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {[
              { label: 'Home', href: '/' },
              { label: config.crossLabel, href: config.crossHref },
            ].map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="relative px-3 py-1.5 text-[13px] font-medium text-foreground/60 hover:text-foreground transition-colors rounded-lg hover:bg-foreground/[0.04] group"
              >
                {link.label}
                <span className="absolute bottom-1 left-3 right-3 h-px bg-foreground/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link
              href={config.signInHref}
              className="px-4 py-[7px] text-[13px] font-medium text-foreground/70 hover:text-foreground bg-white border border-foreground/[0.09] rounded-full shadow-[0px_1px_2px_rgba(55,50,47,0.08)] hover:bg-[#F0EEEB] transition-all"
            >
              Log in
            </Link>
            <Link
              href={config.signUpHref}
              className="px-4 py-[7px] text-[13px] font-medium text-white bg-primary rounded-full shadow-[0px_0px_0px_2px_rgba(255,255,255,0.1)_inset,0px_1px_3px_rgba(55,50,47,0.25)] hover:bg-[#2A2520] transition-all"
            >
              {config.signUpLabel}
            </Link>
          </div>

          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-foreground/65 hover:bg-foreground/[0.06] hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(p => !p)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-foreground/[0.06] bg-[#F7F5F3]/95 backdrop-blur-xl">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-3 flex flex-col gap-0.5">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 text-[13px] font-medium text-foreground/65 hover:text-foreground hover:bg-foreground/[0.04] rounded-xl transition-colors"
            >
              Home
            </Link>
            <Link
              href={config.crossHref}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 text-[13px] font-medium text-foreground/65 hover:text-foreground hover:bg-foreground/[0.04] rounded-xl transition-colors"
            >
              {config.crossLabel}
            </Link>
            <div className="h-px bg-foreground/[0.06] my-1.5" />
            <div className="flex gap-2 pb-1">
              <Link
                href={config.signInHref}
                onClick={() => setMobileOpen(false)}
                className="flex-1 h-10 text-[13px] font-medium text-foreground bg-foreground/[0.05] rounded-full flex items-center justify-center hover:bg-foreground/[0.09] transition-colors"
              >
                Log in
              </Link>
              <Link
                href={config.signUpHref}
                onClick={() => setMobileOpen(false)}
                className="flex-1 h-10 text-[13px] font-medium text-white bg-primary rounded-full flex items-center justify-center hover:bg-[#2A2520] transition-colors shadow-[0px_0px_0px_2px_rgba(255,255,255,0.1)_inset]"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
