'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Loader2 } from 'lucide-react'
import type { Placement } from '@prisma/client'
import { env } from '@/lib/env'

interface Props {
  placement: Pick<Placement, 'id' | 'width' | 'height' | 'format'>
  primaryUrl: string
}

type Status = 'listening' | 'detected'

// 3s cadence is fast enough that publishers see the green flip within a
// few seconds of dropping in the snippet; slow enough that an idle wizard
// tab doesn't hammer the API.
const POLL_INTERVAL_MS = 3_000

export function StepIntegration({ placement, primaryUrl }: Props): React.JSX.Element {
  const [tab, setTab] = useState<'vanilla' | 'react'>('vanilla')
  const [status, setStatus] = useState<Status>('listening')
  const [detectedAt, setDetectedAt] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cancelled = useRef(false)

  const rtbEndpoint = env.NEXT_PUBLIC_RTB_ENDPOINT
  const domain = safeDomain(primaryUrl)
  const w = placement.width ?? 300
  const h = placement.height ?? 250

  useEffect(() => {
    cancelled.current = false
    const tick = async (): Promise<void> => {
      try {
        const res = await fetch(`/api/ssp/placements/${placement.id}/integration-status`, {
          credentials: 'same-origin',
        })
        if (cancelled.current) return
        if (res.ok) {
          const body = (await res.json()) as { verified: boolean; firstSeenAt: string | null }
          if (body.verified && body.firstSeenAt) {
            setStatus('detected')
            setDetectedAt(body.firstSeenAt)
            return
          }
        }
      } catch {
        // swallow — next poll will retry
      }
      if (!cancelled.current) {
        timer.current = setTimeout(tick, POLL_INTERVAL_MS)
      }
    }
    void tick()
    return () => {
      cancelled.current = true
      if (timer.current) clearTimeout(timer.current)
    }
  }, [placement.id])

  const installCmd = `pnpm add @vara/publisher-sdk`
  const snippet =
    tab === 'vanilla'
      ? vanillaSnippet({ placementId: placement.id, rtbEndpoint, domain, w, h })
      : reactSnippet({ placementId: placement.id, rtbEndpoint, w, h })

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-foreground/65 leading-relaxed">
        Drop the snippet into your site to start serving Web3 demand. We'll listen for the first
        bid request and mark this step done automatically.
      </p>

      <Section title="1 · Install the SDK">
        <CodeBlock label="terminal" code={installCmd} />
      </Section>

      <Section title="2 · Render an ad slot">
        <div className="flex items-center gap-1.5 mb-2">
          <TabButton active={tab === 'vanilla'} onClick={() => setTab('vanilla')}>
            Vanilla
          </TabButton>
          <TabButton active={tab === 'react'} onClick={() => setTab('react')}>
            React
          </TabButton>
        </div>
        <CodeBlock label={tab === 'vanilla' ? 'index.ts' : 'Banner.tsx'} code={snippet} />
      </Section>

      <VerificationPanel status={status} detectedAt={detectedAt} placementId={placement.id} />
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[11px] font-medium text-[rgba(55,50,47,0.5)] uppercase tracking-[0.07em]">
        {title}
      </h3>
      {children}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-7 px-3 rounded-md border text-[11px] font-medium transition-all ${
        active
          ? 'bg-[#37322F] text-white border-[#37322F]'
          : 'bg-white text-[#37322F] border-[#E0DEDB] hover:border-[rgba(55,50,47,0.32)]'
      }`}
    >
      {children}
    </button>
  )
}

function CodeBlock({ code, label }: { code: string; label: string }): React.JSX.Element {
  const [copied, setCopied] = useState(false)
  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable in non-secure contexts; ignore
    }
  }
  return (
    <div className="rounded-md border border-[#E0DEDB] bg-[#FAFAF9] overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-[#E0DEDB] bg-white">
        <span className="font-mono text-[10px] text-[rgba(55,50,47,0.5)] uppercase tracking-[0.07em]">
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 h-6 px-2 rounded text-[10px] font-medium text-[#37322F] hover:bg-[#F0ECE6] transition-colors"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="px-3 py-2.5 overflow-x-auto text-[11.5px] leading-[1.55] font-mono text-[#37322F] whitespace-pre">
        {code}
      </pre>
    </div>
  )
}

function VerificationPanel({
  status,
  detectedAt,
  placementId,
}: {
  status: Status
  detectedAt: string | null
  placementId: string
}): React.JSX.Element {
  const isDetected = status === 'detected'
  return (
    <div
      className={`rounded-md border px-3.5 py-3 flex items-start gap-3 ${
        isDetected
          ? 'border-[#15803D]/25 bg-[#15803D]/4'
          : 'border-[#E0DEDB] bg-white'
      }`}
    >
      <div
        className={`shrink-0 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ${
          isDetected ? 'bg-[#15803D] text-white' : 'bg-[#F0ECE6] text-[#37322F]'
        }`}
      >
        {isDetected ? <Check size={13} /> : <Loader2 size={13} className="animate-spin" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-medium text-[#37322F]">
          {isDetected ? 'Integration verified' : 'Listening for your first bid request…'}
        </p>
        <p className="mt-0.5 text-[11.5px] text-[rgba(55,50,47,0.55)] leading-relaxed">
          {isDetected
            ? `First request seen ${formatRelative(detectedAt)}. You're live.`
            : 'Once your site fires an auction for this placement, we mark this step done.'}
        </p>
        <p className="mt-1.5 font-mono text-[10.5px] text-[rgba(55,50,47,0.45)]">
          placement {placementId}
        </p>
      </div>
    </div>
  )
}

function vanillaSnippet(args: {
  placementId: string
  rtbEndpoint: string
  domain: string
  w: number
  h: number
}): string {
  return `import { VaraPublisher } from '@vara/publisher-sdk'

const vara = new VaraPublisher({
  rtbEndpoint: '${args.rtbEndpoint}',
  site: { domain: '${args.domain}' },
})

vara.loadAd({
  placementId: '${args.placementId}',
  container: '#vara-slot',
  width: ${args.w},
  height: ${args.h},
})`
}

function reactSnippet(args: {
  placementId: string
  rtbEndpoint: string
  w: number
  h: number
}): string {
  return `import { useMemo } from 'react'
import { VaraPublisher } from '@vara/publisher-sdk'
import { useVaraAd } from '@vara/publisher-sdk/react'

export function Banner() {
  const client = useMemo(
    () => new VaraPublisher({ rtbEndpoint: '${args.rtbEndpoint}' }),
    [],
  )
  const { containerRef } = useVaraAd({
    client,
    placementId: '${args.placementId}',
    width: ${args.w},
    height: ${args.h},
  })
  return <div ref={containerRef} />
}`
}

function safeDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0] ?? 'example.com'
  }
}

function formatRelative(iso: string | null): string {
  if (!iso) return 'just now'
  const diff = Date.now() - new Date(iso).getTime()
  const s = Math.max(1, Math.round(diff / 1000))
  if (s < 60) return `${s}s ago`
  const m = Math.round(s / 60)
  return `${m}m ago`
}
