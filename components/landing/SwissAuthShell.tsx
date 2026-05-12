import Image from "next/image"
import Link from "next/link"
import type { JSX, ReactNode } from "react"

export interface SwissAuthShellProps {
  children: ReactNode
  eyebrow: string
  panelHeading: string
  panelBody: string
  panelMeta: string
  backHref: string
  backLabel: string
}

export function SwissAuthShell({
  children,
  eyebrow,
  panelHeading,
  panelBody,
  panelMeta,
  backHref,
  backLabel,
}: SwissAuthShellProps): JSX.Element {
  return (
    <div className="min-h-screen w-full bg-background grid lg:grid-cols-[1fr_1fr]">
      <aside className="relative hidden lg:flex flex-col justify-between bg-[#1f40cd] text-white px-12 xl:px-16 py-10 overflow-hidden">
        <Link href="/" className="relative z-10 inline-flex items-center gap-3 w-fit">
          <Image
            src="/VaraAd.png"
            alt="Vara"
            width={1080}
            height={1080}
            className="h-12 w-auto brightness-0 invert"
            priority
          />
          <span className="text-2xl font-medium tracking-tight">
            Vara <span className="opacity-70">Ads</span>
          </span>
        </Link>

        <div className="relative z-10 max-w-[440px]">
          <div className="text-[11px] tracking-[0.18em] opacity-80 mb-5">{eyebrow}</div>
          <h2 className="uppercase tracking-[-0.01em] leading-[0.95] text-3xl xl:text-4xl font-medium">
            {panelHeading}
          </h2>
          <p className="mt-5 text-[14px] leading-[1.55] opacity-90">{panelBody}</p>
          <div className="mt-8 text-[11px] tracking-[0.14em] opacity-80">{panelMeta}</div>
        </div>

        <StepBlocks />
      </aside>

      <section className="relative flex flex-col px-6 sm:px-10 lg:px-16 py-8 lg:py-12">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="lg:hidden inline-flex items-center gap-2 text-[#1f40cd]"
          >
            <Image
              src="/VaraAd.png"
              alt="Vara"
              width={1080}
              height={1080}
              className="h-8 w-auto"
            />
            <span className="text-base font-medium">
              Vara <span className="text-[#37322F]/55">Ads</span>
            </span>
          </Link>
          <Link
            href={backHref}
            className="ml-auto text-[11px] tracking-[0.14em] text-[#1f40cd] hover:opacity-70 transition-opacity"
          >
            ← {backLabel.toUpperCase()}
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[420px] py-10">{children}</div>
        </div>
      </section>
    </div>
  )
}

function StepBlocks(): JSX.Element {
  return (
    <div aria-hidden className="relative z-0 h-32 w-full">
      <div className="absolute bottom-0 left-0 h-12 w-[18%] bg-white/15" />
      <div className="absolute bottom-0 left-[22%] h-20 w-[14%] bg-white/15" />
      <div className="absolute bottom-0 left-[40%] h-8 w-[10%] bg-white/15" />
      <div className="absolute bottom-0 left-[54%] h-24 w-[16%] bg-white/15" />
      <div className="absolute bottom-0 right-0 h-14 w-[18%] bg-white/15" />
    </div>
  )
}
