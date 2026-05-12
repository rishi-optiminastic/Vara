import type { JSX } from "react"
import { SwissShell } from "@/components/landing/SwissShell"
import {
  NAV,
  HERO,
  SUMMIT,
  HIGHLIGHTS,
  MODULES,
  PRICING,
  FOOTER,
} from "@/components/landing/content/ssp"

export default function SspPage(): JSX.Element {
  return (
    <SwissShell
      nav={NAV}
      hero={HERO}
      summit={SUMMIT}
      highlights={HIGHLIGHTS}
      modules={MODULES}
      pricing={PRICING}
      footer={FOOTER}
    />
  )
}
