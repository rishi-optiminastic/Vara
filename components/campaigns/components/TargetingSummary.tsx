import {
  BoxIcon,
  HardDriveIcon,
  AudiencesIcon,
  WalletIcon,
} from "@/icons"

interface Props {
  chains: number
  devices: number
  segments: number
  geos: number
  minPortfolioUsd?: string
}

export function TargetingSummary({
  chains,
  devices,
  segments,
  geos,
  minPortfolioUsd,
}: Props): React.JSX.Element {
  const items: { icon: React.ElementType; label: string; value: string; tint: string }[] = [
    {
      icon: BoxIcon,
      label: "Chains",
      value: chains > 0 ? `${chains} selected` : "Any",
      tint: "bg-[#EAF1FF] text-[#1E40AF]",
    },
    {
      icon: HardDriveIcon,
      label: "Devices",
      value: devices > 0 ? `${devices} selected` : "Any",
      tint: "bg-[#F0E8FF] text-[#6D28D9]",
    },
    {
      icon: AudiencesIcon,
      label: "Segments",
      value: segments > 0 ? `${segments} active` : "None",
      tint: "bg-[#FFE8F0] text-[#BE185D]",
    },
    {
      icon: WalletIcon,
      label: "Geos",
      value: geos > 0 ? `${geos} markets` : "Any",
      tint: "bg-[#FFF7E0] text-[#A16207]",
    },
    {
      icon: WalletIcon,
      label: "Min portfolio",
      value: minPortfolioUsd && minPortfolioUsd.length > 0 ? `$${minPortfolioUsd}` : "Any",
      tint: "bg-[#E8F5E9] text-[#15803D]",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((it) => {
        const Icon = it.icon
        return (
          <div
            key={it.label}
            className="rounded-lg border border-[rgba(55,50,47,0.12)] bg-white px-3 py-2 shadow-[0_1px_0_rgba(255,255,255,0.6)]"
          >
            <div className="flex items-center gap-1.5">
              <span className={`flex size-4 items-center justify-center rounded-md ${it.tint}`}>
                <Icon className="size-2.5" />
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {it.label}
              </span>
            </div>
            <div className="mt-1 text-xs font-medium text-[#37322F] truncate">{it.value}</div>
          </div>
        )
      })}
    </div>
  )
}
