import type { InputHTMLAttributes, ReactNode } from 'react'

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label: string
  hint?: string | undefined
  error?: string | undefined
  optional?: boolean | undefined
  prefix?: ReactNode | undefined
}

export function Field({
  label,
  hint,
  error,
  optional,
  prefix,
  className,
  ...rest
}: FieldProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex justify-between items-center text-[11px] font-medium text-[rgba(55,50,47,0.5)] uppercase tracking-[0.07em]">
        <span>{label}</span>
        {optional && (
          <span className="normal-case tracking-normal text-[10px] text-[rgba(55,50,47,0.4)]">
            optional
          </span>
        )}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(55,50,47,0.45)] text-sm">
            {prefix}
          </span>
        )}
        <input
          {...rest}
          className={`w-full ${prefix ? 'pl-9' : 'pl-3.5'} pr-3.5 py-2.5 bg-white border ${error ? 'border-red-300' : 'border-[#E0DEDB]'} text-[#37322F] text-sm outline-none transition-all rounded-md placeholder:text-[rgba(55,50,47,0.28)] focus:border-[rgba(55,50,47,0.38)] focus:shadow-[0_0_0_3px_rgba(55,50,47,0.05)] ${className ?? ''}`}
        />
      </div>
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[rgba(55,50,47,0.5)]">{hint}</p>
      ) : null}
    </div>
  )
}
