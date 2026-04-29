'use client'

import { Chain } from '@prisma/client'
import { Plus, X } from 'lucide-react'
import { Field } from './Field'
import { CHAIN_LABELS, type OnboardingStep2Input } from './types'

type Errors = Partial<Record<keyof OnboardingStep2Input, string>>

interface Props {
  values: OnboardingStep2Input
  errors: Errors
  onChange: (patch: Partial<OnboardingStep2Input>) => void
}

const CHAINS: Chain[] = [
  'ETHEREUM',
  'POLYGON',
  'SOLANA',
  'BASE',
  'ARBITRUM',
  'OPTIMISM',
  'BSC',
  'AVALANCHE',
]

type ListKey = 'tokenContracts' | 'nftContracts' | 'treasuryWallets' | 'campaignWallets'

interface ListProps {
  label: string
  hint: string
  items: string[]
  onChange: (next: string[]) => void
  placeholder?: string
}

function AddressList({ label, hint, items, onChange, placeholder }: ListProps): React.JSX.Element {
  const list = items.length > 0 ? items : ['']
  const update = (i: number, v: string): void => {
    const next = [...list]
    next[i] = v
    onChange(next)
  }
  const remove = (i: number): void => {
    const next = list.filter((_, idx) => idx !== i)
    onChange(next.length > 0 ? next : [])
  }
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label className="text-[11px] font-medium text-[rgba(55,50,47,0.5)] uppercase tracking-[0.07em]">
          {label}
        </label>
        <span className="text-[10px] text-[rgba(55,50,47,0.4)]">optional</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {list.map((item, i) => (
          <div key={i} className="flex gap-1.5">
            <input
              value={item}
              onChange={e => update(i, e.target.value)}
              placeholder={placeholder ?? '0x… or Solana address'}
              className="flex-1 px-3.5 py-2.5 bg-white border border-[#E0DEDB] text-[#37322F] text-sm outline-none transition-all rounded-md placeholder:text-[rgba(55,50,47,0.28)] focus:border-[rgba(55,50,47,0.38)] focus:shadow-[0_0_0_3px_rgba(55,50,47,0.05)] font-mono text-xs"
            />
            {list.length > 1 && (
              <button
                type="button"
                onClick={() => remove(i)}
                className="size-10 grid place-items-center rounded-md border border-[#E0DEDB] bg-white text-[rgba(55,50,47,0.5)] hover:text-[#37322F] hover:border-[rgba(55,50,47,0.32)] transition-all"
                aria-label="Remove"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...list, ''])}
          className="self-start text-xs text-[rgba(55,50,47,0.6)] hover:text-[#37322F] inline-flex items-center gap-1 mt-0.5"
        >
          <Plus size={12} /> Add another
        </button>
      </div>
      <p className="text-xs text-[rgba(55,50,47,0.5)]">{hint}</p>
    </div>
  )
}

export function Step2Wallet({ values, errors, onChange }: Props): React.JSX.Element {
  const toggleChain = (c: Chain): void => {
    const exists = values.supportedChains.includes(c)
    const next = exists
      ? values.supportedChains.filter(x => x !== c)
      : [...values.supportedChains, c]
    onChange({ supportedChains: next })
  }

  const updateList = (key: ListKey, next: string[]): void => {
    onChange({ [key]: next } as Partial<OnboardingStep2Input>)
  }

  return (
    <div className="flex flex-col gap-4">
      <Field
        label="Primary wallet address"
        placeholder="0x… (used for billing & attribution)"
        value={values.primaryWalletAddress}
        onChange={e => onChange({ primaryWalletAddress: e.target.value })}
        error={errors.primaryWalletAddress}
        className="font-mono text-xs"
        required
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium text-[rgba(55,50,47,0.5)] uppercase tracking-[0.07em]">
          Supported chains
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {CHAINS.map(c => {
            const active = values.supportedChains.includes(c)
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleChain(c)}
                className={`h-9 rounded-md border text-xs font-medium transition-all ${
                  active
                    ? 'bg-[#37322F] text-white border-[#37322F]'
                    : 'bg-white text-[#37322F] border-[#E0DEDB] hover:border-[rgba(55,50,47,0.32)]'
                }`}
              >
                {CHAIN_LABELS[c]}
              </button>
            )
          })}
        </div>
        {errors.supportedChains && <p className="text-xs text-red-600">{errors.supportedChains}</p>}
      </div>

      <AddressList
        label="Token contracts"
        hint="Helps us attribute on-chain conversions to your token."
        items={values.tokenContracts ?? []}
        onChange={n => updateList('tokenContracts', n)}
      />
      <AddressList
        label="NFT collection contracts"
        hint="Used for holder-targeting and drop attribution."
        items={values.nftContracts ?? []}
        onChange={n => updateList('nftContracts', n)}
      />
      <AddressList
        label="Treasury wallets"
        hint="Excluded from targeting and fraud detection."
        items={values.treasuryWallets ?? []}
        onChange={n => updateList('treasuryWallets', n)}
      />
      <AddressList
        label="Campaign-specific wallets"
        hint="Per-campaign attribution wallets, if you use them."
        items={values.campaignWallets ?? []}
        onChange={n => updateList('campaignWallets', n)}
      />
    </div>
  )
}
