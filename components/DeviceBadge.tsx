import type { DeviceType } from "@prisma/client"
import { MonitorIcon, PhoneIcon } from "@/icons"

type Size = "sm" | "md"

interface Props {
  device: DeviceType
  size?: Size
  showLabel?: boolean
}

const SIZE_CLASS: Record<Size, { wrap: string; icon: string; text: string }> = {
  sm: { wrap: "h-5 px-1.5 gap-1", icon: "size-3", text: "text-[9px]" },
  md: { wrap: "h-6 px-2 gap-1.5", icon: "size-3.5", text: "text-[10px]" },
}

const LABEL: Record<DeviceType, string> = {
  DESKTOP: "Desktop",
  MOBILE: "Mobile",
}

export function DeviceBadge({ device, size = "md", showLabel = true }: Props): React.JSX.Element {
  const Icon = device === "DESKTOP" ? MonitorIcon : PhoneIcon
  const cls = SIZE_CLASS[size]
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[rgba(10,10,10,0.12)] bg-white text-[#0A0A0A] ${cls.wrap}`}
      title={LABEL[device]}
    >
      <Icon className={`${cls.icon} text-[#0A0A0A]`} />
      {showLabel && (
        <span className={`font-medium tracking-tight ${cls.text}`}>{LABEL[device]}</span>
      )}
    </span>
  )
}
