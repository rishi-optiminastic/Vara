interface Props {
  children: React.ReactNode
}

export function DashedGridShell({ children }: Props): React.JSX.Element {
  return (
    <div className="relative min-h-full">
      <div aria-hidden className="pointer-events-none absolute inset-0 flex">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 border-l border-dashed border-[rgba(10,10,10,0.08)] first:border-l-0 last:border-r"
          />
        ))}
      </div>
      <div className="relative z-10 flex flex-col gap-2.5 p-3">{children}</div>
    </div>
  )
}
