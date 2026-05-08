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

const TINT: Record<DeviceType, string> = {
  DESKTOP: "bg-[#EAF1FF] text-[#1E40AF]",
  MOBILE: "bg-[#F0E8FF] text-[#6D28D9]",
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
      className={`inline-flex items-center rounded-full border border-[rgba(55,50,47,0.08)] ${TINT[device]} ${cls.wrap}`}
      title={LABEL[device]}
    >
      <Icon className={cls.icon} />
      {showLabel && (
        <span className={`font-medium tracking-tight ${cls.text}`}>{LABEL[device]}</span>
      )}
    </span>
  )
}
