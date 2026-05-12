interface Props {
  title: string
  description: string
  right?: React.ReactNode
}

export function CampaignTabHeader({ title, description, right }: Props): React.JSX.Element {
  return (
    <div className="flex items-start justify-between gap-3 flex-wrap">
      <div className="min-w-0 max-w-[640px]">
        <h2 className="text-base font-medium text-[#37322F] tracking-tight">{title}</h2>
        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
          {description}
        </p>
      </div>
      {right && <div className="flex items-center gap-2 shrink-0">{right}</div>}
    </div>
  )
}
