import type { Chain } from "@prisma/client"
import { chainBrand } from "@/lib/chainLogos"
import { chainName } from "@/lib/chains"

type Size = "sm" | "md"

interface Props {
  chain: Chain
  size?: Size
  showName?: boolean
}

const SIZE_CLASS: Record<Size, { wrap: string; logo: string; text: string }> = {
  sm: { wrap: "h-5 px-1.5 gap-1", logo: "size-3", text: "text-[9px]" },
  md: { wrap: "h-6 px-2 gap-1.5", logo: "size-3.5", text: "text-[10px]" },
}

export function ChainBadge({ chain, size = "md", showName = true }: Props): React.JSX.Element {
  const brand = chainBrand(chain)
  const Logo = brand.Logo
  const cls = SIZE_CLASS[size]
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[rgba(55,50,47,0.08)] ${brand.bg} ${brand.fg} ${cls.wrap}`}
      title={chainName(chain)}
    >
      <Logo className={cls.logo} />
      {showName && (
        <span className={`font-medium tracking-tight ${cls.text}`}>{chainName(chain)}</span>
      )}
    </span>
  )
}
