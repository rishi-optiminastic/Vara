"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SectionProps {
  title: string
  desc?: string
  children: React.ReactNode
}

export function FormSection({ title, desc, children }: SectionProps): React.JSX.Element {
  return (
    <div className="space-y-3 border-b border-[rgba(55,50,47,0.08)] pb-4 last:border-b-0 last:pb-0">
      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#37322F]">{title}</h3>
        {desc && <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  )
}

interface TextProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  min?: number
  step?: string
  required?: boolean
  prefix?: string
  suffix?: string
  disabled?: boolean
  span?: 1 | 2
  hint?: string
  mono?: boolean
}

export function TextField(p: TextProps): React.JSX.Element {
  const colSpan = p.span === 2 ? "col-span-2" : ""
  return (
    <div className={`space-y-1 ${colSpan}`}>
      <Label className="text-[10px] uppercase tracking-widest">{p.label}</Label>
      <div className="relative">
        {p.prefix && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground select-none">{p.prefix}</span>
        )}
        <Input
          type={p.type ?? "text"}
          value={p.value}
          onChange={(e) => p.onChange(e.target.value)}
          placeholder={p.placeholder}
          required={p.required}
          disabled={p.disabled}
          min={p.min}
          step={p.step}
          className={`h-8 text-xs ${p.prefix ? "pl-6" : ""} ${p.suffix ? "pr-9" : ""} ${p.mono ? "font-mono" : ""}`}
        />
        {p.suffix && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground uppercase tracking-wider select-none">{p.suffix}</span>
        )}
      </div>
      {p.hint && <p className="text-[10px] text-muted-foreground">{p.hint}</p>}
    </div>
  )
}

interface SelectProps<T extends string> {
  label: string
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string; desc?: string }[]
  span?: 1 | 2
  hint?: string
}

export function SelectField<T extends string>(p: SelectProps<T>): React.JSX.Element {
  const colSpan = p.span === 2 ? "col-span-2" : ""
  return (
    <div className={`space-y-1 ${colSpan}`}>
      <Label className="text-[10px] uppercase tracking-widest">{p.label}</Label>
      <Select value={p.value} onValueChange={(v) => p.onChange(v as T)}>
        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          {p.options.map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-xs">
              <div className="flex flex-col">
                <span>{o.label}</span>
                {o.desc && <span className="text-[10px] text-muted-foreground">{o.desc}</span>}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {p.hint && <p className="text-[10px] text-muted-foreground">{p.hint}</p>}
    </div>
  )
}

interface TextareaProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  hint?: string
}

export function TextareaField(p: TextareaProps): React.JSX.Element {
  return (
    <div className="space-y-1 col-span-2">
      <Label className="text-[10px] uppercase tracking-widest">{p.label}</Label>
      <Textarea
        value={p.value}
        onChange={(e) => p.onChange(e.target.value)}
        placeholder={p.placeholder}
        rows={p.rows ?? 2}
        className="text-xs resize-none"
      />
      {p.hint && <p className="text-[10px] text-muted-foreground">{p.hint}</p>}
    </div>
  )
}
