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
    question: 'What kinds of audiences can I target?',
    answer:
      "Anything that's observable on-chain: token holders by balance, NFT collectors by collection, DeFi users by protocol, wallet age, transaction frequency, and traditional contextual signals like geography, device, and language.",
  },
  {
    question: 'How is on-chain attribution different from pixels?',
    answer:
      'Instead of trusting a tracker, every served impression and conversion event is committed on-chain. You can verify your reported numbers independently against the ledger — no walled-garden math, no inflated reports.',
  },
  {
    question: 'What budget do I need to start?',
    answer:
      "There's no minimum spend during beta. Most advertisers start with a $500–$2,000 test campaign to validate audiences before scaling. You can fund your account with USDC on Polygon or Base.",
  },
  {
    question: 'How do you keep ad fraud out?',
    answer:
      'Pre-bid filters score every request on IP, agent, timing, and wallet-pattern anomalies. Post-event review compares wallet behaviour to known fraud clusters. Invalid traffic is automatically credited back.',
  },
  {
    question: 'Can I bring my own creative?',
    answer:
      "Yes. Upload static, animated, or HTML5 creatives in standard IAB sizes. We also support wallet-contextual creatives that personalize the message based on the visitor's on-chain identity.",
  },
  {
    question: 'How fast can I launch a campaign?',
    answer:
      'Most advertisers go from signup to a live campaign in under 30 minutes — verify, fund, define audience, upload creative, set bids, launch.',
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

export function DspFAQ(): React.JSX.Element {
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
            Everything you need to know before launching your first programmatic campaign on Vara.
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
