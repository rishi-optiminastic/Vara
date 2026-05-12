import type { JSX } from "react"
import { SwissShell } from "@/components/landing/SwissShell"
import {
  NAV,
  HERO,
  SUMMIT,
  HIGHLIGHTS,
  MODULES,
  SCHEDULE,
  PRICING,
  FOOTER,
} from "@/components/landing/content/landing"

export default function LandingPage(): JSX.Element {
  return (
    <SwissShell
      nav={NAV}
      hero={HERO}
      summit={SUMMIT}
      highlights={HIGHLIGHTS}
      modules={MODULES}
      schedule={SCHEDULE}
      pricing={PRICING}
      footer={FOOTER}
    />
  )
}
