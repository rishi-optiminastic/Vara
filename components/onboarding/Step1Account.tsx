'use client'

import { Field } from './Field'
import { BUSINESS_TYPE_LABELS, BUSINESS_TYPES, type BusinessType, type OnboardingStep1Input } from './types'

type Errors = Partial<Record<keyof OnboardingStep1Input, string>>

interface Props {
  values: OnboardingStep1Input
  errors: Errors
  onChange: (patch: Partial<OnboardingStep1Input>) => void
}

const TYPES: readonly BusinessType[] = BUSINESS_TYPES

export function Step1Account({ values, errors, onChange }: Props): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <Field
        label="Company / Project name"
        placeholder="Acme Labs"
        value={values.projectName}
        onChange={e => onChange({ projectName: e.target.value })}
        error={errors.projectName}
        required
      />

      <Field
        label="Website / dApp URL"
        placeholder="https://acme.xyz"
        value={values.websiteUrl ?? ''}
        onChange={e => onChange({ websiteUrl: e.target.value })}
        error={errors.websiteUrl}
        optional
      />

      <Field
        label="Contact email"
        type="email"
        placeholder="growth@acme.xyz"
        value={values.contactEmail ?? ''}
        onChange={e => onChange({ contactEmail: e.target.value })}
        error={errors.contactEmail}
        optional
      />

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Telegram"
          prefix="@"
          placeholder="acmelabs"
          value={values.telegramHandle ?? ''}
          onChange={e => onChange({ telegramHandle: e.target.value })}
          error={errors.telegramHandle}
          optional
        />
        <Field
          label="Discord"
          prefix="#"
          placeholder="acme"
          value={values.discordHandle ?? ''}
          onChange={e => onChange({ discordHandle: e.target.value })}
          error={errors.discordHandle}
          optional
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium text-[rgba(55,50,47,0.5)] uppercase tracking-[0.07em]">
          Business type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TYPES.map(t => {
            const active = values.businessType === t
            return (
              <button
                key={t}
                type="button"
                onClick={() => onChange({ businessType: t })}
                className={`h-10 rounded-md border text-xs font-medium transition-all ${
                  active
                    ? 'bg-[#37322F] text-white border-[#37322F] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(55,50,47,0.18)]'
                    : 'bg-white text-[#37322F] border-[#E0DEDB] hover:border-[rgba(55,50,47,0.32)]'
                }`}
              >
                {BUSINESS_TYPE_LABELS[t]}
              </button>
            )
          })}
        </div>
        {errors.businessType && <p className="text-xs text-red-600">{errors.businessType}</p>}
      </div>
    </div>
  )
}
