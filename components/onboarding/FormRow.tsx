import type { ReactNode } from 'react'

interface Props {
  label: string
  hint?: string
  required?: boolean
  optional?: boolean
  children: ReactNode
  align?: 'top' | 'center'
}

export function FormRow({
  label,
  hint,
  required,
  optional,
  children,
  align = 'top',
}: Props): React.JSX.Element {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-[170px_1fr] gap-x-6 gap-y-1.5 ${
        align === 'center' ? 'sm:items-center' : 'sm:items-start'
      }`}
    >
      <div className="sm:pt-1.5 flex flex-col gap-0.5">
        <span className="text-[13px] font-medium text-[#0A0A0A] leading-tight">
          {label}
          {required && <span className="text-[#1F40CD] ml-0.5">*</span>}
          {optional && (
            <span className="ml-1.5 text-[10px] font-normal text-[#0A0A0A]/40 tracking-normal">
              optional
            </span>
          )}
        </span>
        {hint && (
          <span className="text-[11px] text-[#0A0A0A]/50 leading-snug">{hint}</span>
        )}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
