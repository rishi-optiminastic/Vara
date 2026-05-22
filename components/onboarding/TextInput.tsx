import type { InputHTMLAttributes, ReactNode } from 'react'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  error?: string | undefined
  prefix?: ReactNode | undefined
}

export function TextInput({ error, prefix, className, ...rest }: Props): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A0A0A]/45 text-sm">
            {prefix}
          </span>
        )}
        <input
          {...rest}
          className={`w-full ${prefix ? 'pl-9' : 'pl-3.5'} pr-3.5 py-2.5 bg-white border ${error ? 'border-red-300' : 'border-[rgba(10,10,10,0.12)]'} text-[#0A0A0A] text-[13.5px] outline-none transition-colors rounded-md placeholder:text-[#0A0A0A]/32 focus:border-[#1F40CD] focus:shadow-[0_0_0_3px_rgba(31,64,205,0.08)] ${className ?? ''}`}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
