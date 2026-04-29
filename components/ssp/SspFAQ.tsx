'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { PageBadge } from '@/components/page-elements'

interface FAQItem {
  question: string
  answer: string
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What kinds of inventory can I monetize on Vara?',
    answer:
      'Web pages, dApps, and mobile apps. We support banner, native, interstitial, and wallet-contextual formats. If you can drop in a JS SDK or call our serving endpoint, you can monetize.',
  },
  {
    question: 'How does on-chain settlement actually work?',
    answer:
      'Auctions and serving stay centralized for sub-100ms latency. Earnings accumulate in an append-only ledger and settle to your wallet as USDC on Polygon or Base in batches — typically under a minute, with full on-chain proofs.',
  },
  {
    question: 'Will I need to give up my existing ad partners?',
    answer:
      "No. Vara runs alongside your existing stack as another demand source. Use header bidding to mediate, and we'll only win when our bids are the highest — pure incremental yield.",
  },
  {
    question: 'How are brand safety and fraud handled?',
    answer:
      'Every DSP buyer is vetted before joining the pool. You get allowlist/blocklist controls by category, domain, and wallet type. Pre-bid filters and post-event scoring catch IP, agent, and timing anomalies before payout.',
  },
  {
    question: 'What does it take to integrate?',
    answer:
      'Most publishers go live in under a week: install the SDK or wire the OpenRTB endpoint, define your slots, set floor prices, and connect a payout wallet. We provide integration support throughout.',
  },
  {
    question: 'Are there minimum traffic requirements?',
    answer:
      'We onboard publishers across all sizes, but inventory quality is reviewed during onboarding. Sites with consistent human traffic and clear content categorization will be approved fastest.',
  },
]

function ChevronDownIcon({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SspFAQ(): React.JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number): void => {
    setOpenIndex(prev => (prev === i ? null : i))
  }

  return (
    <section className="w-full border-b border-border">
      <div className="px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20 flex flex-col lg:flex-row gap-8 lg:gap-16">
        <div className="w-full lg:w-[360px] flex flex-col gap-4">
          <PageBadge icon={<HelpCircle size={11} />} text="FAQ" />
          <h2 className="text-[#49423D] text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight font-sans tracking-tight">
            Questions, answered
          </h2>
          <p className="text-[#605A57] text-sm sm:text-base leading-6 font-sans">
            Everything you need to know before connecting your inventory to Web3 demand.
          </p>
        </div>

        <div className="flex-1 flex flex-col">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div key={item.question} className="border-b border-[rgba(73,66,61,0.16)]">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full px-1 sm:px-3 py-5 flex justify-between items-center gap-5 text-left hover:opacity-80 transition-opacity"
                  aria-expanded={isOpen}
                >
                  <span className="flex-1 text-[#49423D] text-base sm:text-[17px] font-medium leading-6 font-sans">
                    {item.question}
                  </span>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-[#49423D]/60 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-1 sm:px-3 pb-5 text-[#605A57] text-sm sm:text-[15px] leading-6 font-sans">
                    {item.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
