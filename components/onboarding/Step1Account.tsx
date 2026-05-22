'use client'

import { FormRow } from './FormRow'
import { TextInput } from './TextInput'
import {
  BUSINESS_TYPE_LABELS,
  BUSINESS_TYPES,
  type BusinessType,
  type OnboardingStep1Input,
} from './types'

type Errors = Partial<Record<keyof OnboardingStep1Input, string>>

interface Props {
  values: OnboardingStep1Input
  errors: Errors
  onChange: (patch: Partial<OnboardingStep1Input>) => void
}

const TYPES: readonly BusinessType[] = BUSINESS_TYPES

export function Step1Account({ values, errors, onChange }: Props): React.JSX.Element {
  return (
    <div className="flex flex-col divide-y divide-[rgba(10,10,10,0.08)]">
      <Section>
        <FormRow label="Project name" hint="Shown in dashboards & invoices." required>
          <TextInput
            placeholder="Acme Labs"
            value={values.projectName}
            onChange={e => onChange({ projectName: e.target.value })}
            error={errors.projectName}
          />
        </FormRow>

        <FormRow label="Website" hint="Helps us verify your brand." optional>
          <TextInput
            placeholder="https://acme.xyz"
            value={values.websiteUrl ?? ''}
            onChange={e => onChange({ websiteUrl: e.target.value })}
            error={errors.websiteUrl}
          />
        </FormRow>

        <FormRow label="Contact email" hint="Billing notifications go here." optional>
          <TextInput
            type="email"
            placeholder="growth@acme.xyz"
            value={values.contactEmail ?? ''}
            onChange={e => onChange({ contactEmail: e.target.value })}
            error={errors.contactEmail}
          />
        </FormRow>
      </Section>

      <Section>
        <FormRow label="Telegram" hint="For ad-ops handoff." optional>
          <TextInput
            prefix="@"
            placeholder="acmelabs"
            value={values.telegramHandle ?? ''}
            onChange={e => onChange({ telegramHandle: e.target.value })}
            error={errors.telegramHandle}
          />
        </FormRow>

        <FormRow label="Discord" optional>
          <TextInput
            prefix="#"
            placeholder="acme"
            value={values.discordHandle ?? ''}
            onChange={e => onChange({ discordHandle: e.target.value })}
            error={errors.discordHandle}
          />
        </FormRow>
      </Section>

      <Section>
        <FormRow
          label="Business type"
          hint="We use this to surface relevant audiences and benchmarks."
          required
        >
          <div className="grid grid-cols-3 gap-1.5">
            {TYPES.map(t => {
              const active = values.businessType === t
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onChange({ businessType: t })}
                  className={`h-10 rounded-md border text-xs font-medium transition-colors ${
                    active
                      ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                      : 'bg-white text-[#0A0A0A] border-[rgba(10,10,10,0.12)] hover:border-[#1F40CD] hover:text-[#1F40CD]'
                  }`}
                >
                  {BUSINESS_TYPE_LABELS[t]}
                </button>
              )
            })}
          </div>
          {errors.businessType && (
            <p className="mt-1.5 text-xs text-red-600">{errors.businessType}</p>
          )}
        </FormRow>
      </Section>
    </div>
  )
}

function Section({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <div className="flex flex-col gap-5 py-6 first:pt-0 last:pb-0">{children}</div>
}
