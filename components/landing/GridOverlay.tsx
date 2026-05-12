import type { JSX } from "react"

export function GridOverlay(): JSX.Element {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="flex-1 border-l border-dashed border-[#37322F]/12 first:border-l-0 last:border-r"
        />
      ))}
    </div>
  )
}
