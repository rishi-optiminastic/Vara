"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"

const TABS = ["overview", "targeting", "creatives", "reporting"] as const
type Tab = (typeof TABS)[number]

interface CampaignTabsProps {
  creativeCount: number
  overview: React.ReactNode
  targeting: React.ReactNode
  creatives: React.ReactNode
  reporting: React.ReactNode
}

export function CampaignTabs({
  creativeCount,
  overview,
  targeting,
  creatives,
  reporting,
}: CampaignTabsProps): React.JSX.Element {
  const [active, setActive] = useState<Tab>("overview")

  const panels: Record<Tab, React.ReactNode> = { overview, targeting, creatives, reporting }

  return (
    <Tabs value={active} onValueChange={(v) => setActive(v as Tab)}>
      <TabsList className="h-8 bg-[#F0ECE6] border border-[rgba(55,50,47,0.08)] p-0.5">
        <TabsTrigger
          value="overview"
          className="h-7 text-xs data-[state=active]:bg-white data-[state=active]:shadow-[0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(55,50,47,0.06)]"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="targeting"
          className="h-7 text-xs data-[state=active]:bg-white data-[state=active]:shadow-[0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(55,50,47,0.06)]"
        >
          Targeting
        </TabsTrigger>
        <TabsTrigger
          value="creatives"
          className="h-7 text-xs data-[state=active]:bg-white data-[state=active]:shadow-[0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(55,50,47,0.06)]"
        >
          Creatives
          <span className="ml-1.5 rounded-full bg-[rgba(55,50,47,0.08)] px-1.5 py-px text-[9px] tabular-nums">
            {creativeCount}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="reporting"
          className="h-7 text-xs data-[state=active]:bg-white data-[state=active]:shadow-[0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(55,50,47,0.06)]"
        >
          Reporting
        </TabsTrigger>
      </TabsList>

      <div className="relative mt-3">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{
              opacity: { duration: 0.18, ease: "easeOut" },
              y: { duration: 0.24, ease: [0.32, 0.72, 0, 1] },
            }}
          >
            {panels[active]}
          </motion.div>
        </AnimatePresence>
      </div>
    </Tabs>
  )
}
