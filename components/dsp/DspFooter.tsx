import Link from 'next/link'

interface FooterLink {
  label: string
  href: string
}

interface FooterColumn {
  title: string
  links: FooterLink[]
}

const COLUMNS: FooterColumn[] = [
  {
    title: 'Advertisers',
    links: [
      { label: 'Why Vara DSP', href: '/dsp' },
      { label: 'Wallet targeting', href: '/dsp' },
      { label: 'On-chain attribution', href: '/dsp' },
      { label: 'Campaign console', href: '/dsp' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'For Publishers', href: '/ssp' },
      { label: 'Documentation', href: '/' },
      { label: 'API reference', href: '/' },
      { label: 'Status', href: '/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/' },
      { label: 'Security', href: '/' },
      { label: 'Contact', href: '/' },
      { label: 'Early access', href: '/early-access' },
    ],
  },
]

export function DspFooter(): React.JSX.Element {
  return (
    <footer className="w-full border-t border-border">
      <div className="px-4 sm:px-6 md:px-12 py-12 sm:py-16 flex flex-col lg:flex-row gap-10 lg:gap-16">
        <div className="lg:w-[320px] flex flex-col gap-4">
          <span className="text-[#49423D] text-xl font-semibold font-sans">Vara</span>
          <p className="text-[#605A57] text-sm leading-6 font-sans max-w-[280px]">
            Programmatic ads for the on-chain world. Real-time bidding, wallet-level attribution,
            and proof you can verify yourself.
          </p>
          <Link
            href="/dsp/sign-up"
            className="w-fit text-[#37322F] text-sm font-medium font-sans underline underline-offset-4 decoration-[#37322F]/30 hover:decoration-[#37322F] transition-colors"
          >
            Become an advertiser →
          </Link>
        </div>

        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8">
          {COLUMNS.map(col => (
            <div key={col.title} className="flex flex-col gap-3">
              <span className="text-[rgba(73,66,61,0.5)] text-xs font-semibold font-sans uppercase tracking-wider">
                {col.title}
              </span>
              <ul className="flex flex-col gap-2">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#49423D] text-sm font-normal font-sans hover:text-[#37322F] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-12 py-5 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <span className="text-[#605A57] text-xs sm:text-sm font-sans">
          © 2026 Vara. All rights reserved.
        </span>
        <div className="flex items-center gap-5 sm:gap-6">
          <Link
            href="/terms"
            className="text-[#605A57] text-xs sm:text-sm font-sans hover:text-[#37322F] transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-[#605A57] text-xs sm:text-sm font-sans hover:text-[#37322F] transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/ssp"
            className="text-[#605A57] text-xs sm:text-sm font-sans hover:text-[#37322F] transition-colors"
          >
            For Publishers
          </Link>
        </div>
      </div>
    </footer>
  )
}
