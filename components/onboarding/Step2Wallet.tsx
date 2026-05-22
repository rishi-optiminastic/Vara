'use client'

import { Chain } from '@prisma/client'
import { Plus, X } from 'lucide-react'
import { FormRow } from './FormRow'
import { TextInput } from './TextInput'
import { chainBrand } from '@/lib/chainLogos'
import { type OnboardingStep2Input } from './types'

type Errors = Partial<Record<keyof OnboardingStep2Input, string>>

interface Props {
  values: OnboardingStep2Input
  errors: Errors
  onChange: (patch: Partial<OnboardingStep2Input>) => void
}

const CHAIN_LABELS: Record<Chain, string> = {
  POLYGON: 'Polygon',
  BASE: 'Base',
  ETHEREUM: 'Ethereum',
  SOLANA: 'Solana',
  ARBITRUM: 'Arbitrum',
  OPTIMISM: 'Optimism',
  BSC: 'BNB',
  AVALANCHE: 'Avax',
}

// Polygon first since it's the primary settlement chain; Base second as the
// active fallback.
const CHAINS: Chain[] = [
  'POLYGON',
  'BASE',
  'ETHEREUM',
  'SOLANA',
  'ARBITRUM',
  'OPTIMISM',
  'BSC',
  'AVALANCHE',
]

type ListKey = 'tokenContracts' | 'nftContracts' | 'treasuryWallets' | 'campaignWallets'

interface ListProps {
  items: string[]
  onChange: (next: string[]) => void
}

function AddressList({ items, onChange }: ListProps): React.JSX.Element {
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
      {list.map((item, i) => (
        <div key={i} className="flex gap-1.5">
          <input
            value={item}
            onChange={e => update(i, e.target.value)}
            placeholder="0x… or Solana address"
            className="flex-1 px-3 py-2 bg-white border border-[#E0DEDB] text-[#37322F] outline-none transition-all rounded-md placeholder:text-[rgba(55,50,47,0.28)] focus:border-[rgba(55,50,47,0.45)] focus:shadow-[0_0_0_3px_rgba(55,50,47,0.06)] font-mono text-[12px]"
          />
          {list.length > 1 && (
            <button
              type="button"
              onClick={() => remove(i)}
              className="size-9 grid place-items-center rounded-md border border-[#E0DEDB] bg-white text-[rgba(55,50,47,0.5)] hover:text-[#37322F] hover:border-[rgba(55,50,47,0.32)] transition-all"
              aria-label="Remove"
            >
              <X size={13} />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...list, ''])}
        className="self-start text-[11px] text-[rgba(55,50,47,0.55)] hover:text-[#37322F] inline-flex items-center gap-1"
      >
        <Plus size={11} /> Add another
      </button>
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
    <div className="flex flex-col divide-y divide-[rgba(10,10,10,0.08)]">
      <Section>
        <FormRow
          label="Primary wallet"
          hint="Used for billing and on-chain attribution."
          required
        >
          <TextInput
            placeholder="0x…"
            value={values.primaryWalletAddress}
            onChange={e => onChange({ primaryWalletAddress: e.target.value })}
            error={errors.primaryWalletAddress}
            className="font-mono text-[12.5px]"
          />
        </FormRow>

        <FormRow
          label="Supported chains"
          hint="Polygon is primary · Base is the active fallback."
          required
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {CHAINS.map(c => {
              const active = values.supportedChains.includes(c)
              const isPrimary = c === 'POLYGON'
              const Logo = chainBrand(c).Logo
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleChain(c)}
                  className={`relative h-10 rounded-md border text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                    active
                      ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                      : 'bg-white text-[#0A0A0A] border-[rgba(10,10,10,0.12)] hover:border-[#1F40CD] hover:text-[#1F40CD]'
                  }`}
                >
                  {isPrimary && (
                    <span
                      aria-hidden
                      className={`absolute top-1 right-1 size-1.5 rounded-full ${
                        active ? 'bg-[#1F40CD] ring-1 ring-white' : 'bg-[#1F40CD]'
                      }`}
                    />
                  )}
                  <Logo
                    className={`size-3.5 ${active ? 'text-white' : 'text-[#0A0A0A]/85'}`}
                  />
                  <span className="leading-none">{CHAIN_LABELS[c]}</span>
                </button>
              )
            })}
          </div>
          {errors.supportedChains && (
            <p className="mt-1.5 text-xs text-red-600">{errors.supportedChains}</p>
          )}
        </FormRow>
      </Section>

      <Section title="Attribution sources" subtitle="Optional — wire in now to unlock holder targeting and on-chain conversion attribution from day one.">
        <FormRow label="Token contracts" hint="Used for conversion attribution." optional>
          <AddressList
            items={values.tokenContracts ?? []}
            onChange={n => updateList('tokenContracts', n)}
          />
        </FormRow>
        <FormRow label="NFT collections" hint="Used for holder targeting." optional>
          <AddressList
            items={values.nftContracts ?? []}
            onChange={n => updateList('nftContracts', n)}
          />
        </FormRow>
        <FormRow label="Treasury wallets" hint="Excluded from targeting and fraud detection." optional>
          <AddressList
            items={values.treasuryWallets ?? []}
            onChange={n => updateList('treasuryWallets', n)}
          />
        </FormRow>
        <FormRow label="Campaign wallets" hint="Per-campaign attribution wallets." optional>
          <AddressList
            items={values.campaignWallets ?? []}
            onChange={n => updateList('campaignWallets', n)}
          />
        </FormRow>
      </Section>
    </div>
  )
}

function Section({
  title,
  subtitle,
  children,
}: {
  title?: string
  subtitle?: string
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-5 py-6 first:pt-0 last:pb-0">
      {title && (
        <div className="flex flex-col gap-1">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[rgba(55,50,47,0.55)]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[12px] text-[rgba(55,50,47,0.6)] leading-snug max-w-xl">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
