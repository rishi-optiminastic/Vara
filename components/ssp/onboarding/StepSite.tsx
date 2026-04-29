'use client'

import { Field } from '@/components/onboarding/Field'
import {
  INVENTORY_CATEGORY_LABELS,
  type InventoryCategory,
  type SspOnboardingStep1Input,
} from './types'

type Errors = Partial<Record<keyof SspOnboardingStep1Input, string>>

interface Props {
  values: SspOnboardingStep1Input
  errors: Errors
  onChange: (patch: Partial<SspOnboardingStep1Input>) => void
}

const CATEGORIES: InventoryCategory[] = [
  'DEFI',
  'NFT',
  'GAMING',
  'NEWS',
  'SOCIAL',
  'TOOLS',
  'OTHER',
]

export function StepSite({ values, errors, onChange }: Props): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <Field
        label="Site / dApp name"
        placeholder="Acme Web3 News"
        value={values.siteName}
        onChange={e => onChange({ siteName: e.target.value })}
        error={errors.siteName}
        required
      />

      <Field
        label="Primary URL"
        placeholder="https://acme.xyz"
        value={values.primaryUrl}
        onChange={e => onChange({ primaryUrl: e.target.value })}
        error={errors.primaryUrl}
        required
      />

      <Field
        label="Contact email"
        type="email"
        placeholder="ads@acme.xyz"
        value={values.contactEmail ?? ''}
        onChange={e => onChange({ contactEmail: e.target.value })}
        error={errors.contactEmail}
        optional
      />

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Telegram"
          prefix="@"
          placeholder="acmenews"
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
          Inventory category
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {CATEGORIES.map(c => {
            const active = values.inventoryCategory === c
            return (
              <button
                key={c}
                type="button"
                onClick={() => onChange({ inventoryCategory: c })}
                className={`h-10 rounded-md border text-xs font-medium transition-all ${
                  active
                    ? 'bg-[#37322F] text-white border-[#37322F] shadow-[0_0_0_2.5px_rgba(255,255,255,0.08)_inset]'
                    : 'bg-white text-[#37322F] border-[#E0DEDB] hover:border-[rgba(55,50,47,0.32)]'
                }`}
              >
                {INVENTORY_CATEGORY_LABELS[c]}
              </button>
            )
          })}
        </div>
        {errors.inventoryCategory && (
          <p className="text-xs text-red-600">{errors.inventoryCategory}</p>
        )}
      </div>
    </div>
  )
}
