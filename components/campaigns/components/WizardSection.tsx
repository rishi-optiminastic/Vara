interface Props {
  icon: React.ElementType
  tint?: string
  title: string
  description?: string
  badge?: React.ReactNode
  children: React.ReactNode
}

// Shared section primitive used across the campaign wizard steps and the
// edit-page targeting form. Wizard steps each had a local `Section` that
// rendered an icon + uppercase eyebrow — this promotes the heading to a
// proper title with an optional sub-description, and uses a dashed divider
// between sections so it matches the page-level grid aesthetic.
export function WizardSection({
  icon: Icon,
  tint = "bg-[#ECEAE2] text-[#1F40CD]",
  title,
  description,
  badge,
  children,
}: Props): React.JSX.Element {
  return (
    <section className="space-y-3 border-b border-dashed border-[rgba(10,10,10,0.12)] pb-4 last:border-0 last:pb-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md ${tint}`}>
            <Icon className="size-3" />
          </span>
          <div className="flex flex-col leading-tight min-w-0">
            <h3 className="text-[12.5px] font-medium text-[#0A0A0A] tracking-[-0.01em]">{title}</h3>
            {description && (
              <p className="text-[10.5px] text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>
      <div>{children}</div>
    </section>
  )
}
