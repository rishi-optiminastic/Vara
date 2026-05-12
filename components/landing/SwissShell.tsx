import type { JSX } from "react"
import { GridOverlay } from "@/components/landing/GridOverlay"
import { SwissNav, type SwissNavProps } from "@/components/landing/SwissNav"
import { SwissHero, type SwissHeroProps } from "@/components/landing/SwissHero"
import { SwissSummit, type SwissSummitProps } from "@/components/landing/SwissSummit"
import {
  SwissHighlights,
  type SwissHighlightsProps,
} from "@/components/landing/SwissHighlights"
import {
  SwissModules,
  type SwissModulesProps,
} from "@/components/landing/SwissModules"
import {
  SwissSchedule,
  type SwissScheduleProps,
} from "@/components/landing/SwissSchedule"
import {
  SwissPricing,
  type SwissPricingProps,
} from "@/components/landing/SwissPricing"
import { SwissFooter, type SwissFooterProps } from "@/components/landing/SwissFooter"

export interface SwissShellProps {
  nav: SwissNavProps
  hero: SwissHeroProps
  summit: SwissSummitProps
  highlights: SwissHighlightsProps
  modules: SwissModulesProps
  schedule?: SwissScheduleProps
  pricing: SwissPricingProps
  footer: SwissFooterProps
}

export function SwissShell({
  nav,
  hero,
  summit,
  highlights,
  modules,
  schedule,
  pricing,
  footer,
}: SwissShellProps): JSX.Element {
  return (
    <div className="min-h-screen w-full bg-background text-[#37322F]">
      <div className="relative w-full px-6 md:px-10 lg:px-16 xl:px-20">
        <GridOverlay />
        <div className="relative z-10">
          <SwissNav {...nav} />
          <SwissHero {...hero} />
          <SwissSummit {...summit} />
          <SwissHighlights {...highlights} />
          <SwissModules {...modules} />
          {schedule && <SwissSchedule {...schedule} />}
          <SwissPricing {...pricing} />
        </div>
      </div>
      <SwissFooter {...footer} />
    </div>
  )
}
