import type React from 'react'

interface PageBadgeProps {
  icon: React.ReactNode
  text: string
}

export function PageBadge({ icon, text }: PageBadgeProps): React.JSX.Element {
  return (
    <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] rounded-[90px] flex items-center gap-[8px] border border-[rgba(2,6,23,0.08)] w-fit">
      <div className="w-[14px] h-[14px] flex items-center justify-center text-[#37322F]">
        {icon}
      </div>
      <span className="text-foreground text-xs font-medium leading-3 font-sans">{text}</span>
    </div>
  )
}

export function DiagonalLines(): React.JSX.Element {
  return (
    <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
      <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline-[0.5px] outline outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
          />
        ))}
      </div>
    </div>
  )
}
