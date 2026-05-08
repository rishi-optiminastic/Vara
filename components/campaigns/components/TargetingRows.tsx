import type { Chain, DeviceType } from "@prisma/client"
import { ChainBadge } from "@/components/ChainBadge"
import { DeviceBadge } from "@/components/DeviceBadge"
import { GeoBadge } from "@/components/GeoBadge"

interface RowShellProps {
  label: string
  empty: string
  isEmpty: boolean
  children: React.ReactNode
}

function RowShell({ label, empty, isEmpty, children }: RowShellProps): React.JSX.Element {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
      {isEmpty ? (
        <span className="text-[11px] text-muted-foreground italic">{empty}</span>
      ) : (
        <div className="flex flex-wrap gap-1">{children}</div>
      )}
    </div>
  )
}

export function ChainRow({ label, chains, empty }: { label: string; chains: Chain[]; empty: string }): React.JSX.Element {
  return (
    <RowShell label={label} empty={empty} isEmpty={chains.length === 0}>
      {chains.map((c) => <ChainBadge key={c} chain={c} size="md" />)}
    </RowShell>
  )
}

export function DeviceRow({ label, devices, empty }: { label: string; devices: DeviceType[]; empty: string }): React.JSX.Element {
  return (
    <RowShell label={label} empty={empty} isEmpty={devices.length === 0}>
      {devices.map((d) => <DeviceBadge key={d} device={d} size="md" />)}
    </RowShell>
  )
}

export function GeoRow({ label, codes, empty }: { label: string; codes: string[]; empty: string }): React.JSX.Element {
  return (
    <RowShell label={label} empty={empty} isEmpty={codes.length === 0}>
      {codes.map((g) => <GeoBadge key={g} code={g} size="md" />)}
    </RowShell>
  )
}

export function ChipRow({ label, items, empty, capitalize }: { label: string; items: string[]; empty: string; capitalize?: boolean }): React.JSX.Element {
  return (
    <RowShell label={label} empty={empty} isEmpty={items.length === 0}>
      {items.map((it) => (
        <span key={it} className={`rounded-full bg-[#F0ECE6] px-2 py-0.5 text-[10px] font-medium text-[#37322F] ${capitalize ? "capitalize" : ""}`}>
          {it}
        </span>
      ))}
    </RowShell>
  )
}
