"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"

const TABS = ["overview", "wallet"] as const
type Tab = (typeof TABS)[number]

function isTab(value: string | null): value is Tab {
  return value !== null && (TABS as readonly string[]).includes(value)
}

interface SettingsTabsProps {
  overview: React.ReactNode
  wallet: React.ReactNode
}

export function SettingsTabs({ overview, wallet }: SettingsTabsProps): React.JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const active: Tab = isTab(tabParam) ? tabParam : "overview"

  const handleChange = useCallback(
    (value: string): void => {
      if (!isTab(value)) return
      const params = new URLSearchParams(searchParams.toString())
      if (value === "overview") params.delete("tab")
      else params.set("tab", value)
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [router, pathname, searchParams],
  )

  const panels: Record<Tab, React.ReactNode> = { overview, wallet }

  return (
    <Tabs value={active} onValueChange={handleChange}>
      <TabsList className="h-8 bg-[#F0ECE6] border border-[rgba(55,50,47,0.08)] p-0.5">
        <TabsTrigger
          value="overview"
          className="h-7 text-xs data-[state=active]:bg-white data-[state=active]:shadow-[0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(55,50,47,0.06)]"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="wallet"
          className="h-7 text-xs data-[state=active]:bg-white data-[state=active]:shadow-[0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(55,50,47,0.06)]"
        >
          Wallet
        </TabsTrigger>
      </TabsList>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="mt-3"
        >
          {panels[active]}
        </motion.div>
      </AnimatePresence>
    </Tabs>
  )
}
