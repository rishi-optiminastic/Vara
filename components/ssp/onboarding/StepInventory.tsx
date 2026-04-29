'use client'

import { Chain } from '@prisma/client'
import { Field } from '@/components/onboarding/Field'
import {
  AD_FORMAT_LABELS,
  AUDIENCE_CHAIN_LABELS,
  PAYOUT_CHAIN_LABELS,
  TRAFFIC_BUCKET_LABELS,
  type AdFormat,
  type PayoutChain,
  type SspOnboardingStep2Input,
  type TrafficBucket,
} from './types'

type Errors = Partial<Record<keyof SspOnboardingStep2Input, string>>

interface Props {
  values: SspOnboardingStep2Input
  errors: Errors
  onChange: (patch: Partial<SspOnboardingStep2Input>) => void
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
const FORMATS: AdFormat[] = ['BANNER', 'NATIVE', 'INTERSTITIAL', 'WALLET_CONTEXTUAL', 'VIDEO']
const PAYOUT_CHAINS: PayoutChain[] = ['BASE', 'POLYGON']
const BUCKETS: TrafficBucket[] = ['UNDER_100K', '_100K_1M', '_1M_10M', 'OVER_10M']

export function StepInventory({ values, errors, onChange }: Props): React.JSX.Element {
  const toggleChain = (c: Chain): void => {
    const next = values.audienceChains.includes(c)
      ? values.audienceChains.filter(x => x !== c)
      : [...values.audienceChains, c]
    onChange({ audienceChains: next })
  }

  const toggleFormat = (f: AdFormat): void => {
    const next = values.adFormats.includes(f)
      ? values.adFormats.filter(x => x !== f)
      : [...values.adFormats, f]
    onChange({ adFormats: next })
  }

  return (
    <div className="flex flex-col gap-4">
      <Field
        label="Payout wallet"
        placeholder="0x… (where USDC settles)"
        value={values.payoutWalletAddress}
        onChange={e => onChange({ payoutWalletAddress: e.target.value })}
        error={errors.payoutWalletAddress}
        className="font-mono text-xs"
        required
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium text-[rgba(55,50,47,0.5)] uppercase tracking-[0.07em]">
          Payout chain
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PAYOUT_CHAINS.map(c => {
            const active = values.payoutChain === c
            return (
              <button
                key={c}
                type="button"
                onClick={() => onChange({ payoutChain: c })}
                className={`h-10 rounded-md border text-xs font-medium transition-all ${
                  active
                    ? 'bg-[#37322F] text-white border-[#37322F]'
                    : 'bg-white text-[#37322F] border-[#E0DEDB] hover:border-[rgba(55,50,47,0.32)]'
                }`}
              >
                {PAYOUT_CHAIN_LABELS[c]}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-[rgba(55,50,47,0.5)]">
          USDC payouts settle in &lt;60s on either chain.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium text-[rgba(55,50,47,0.5)] uppercase tracking-[0.07em]">
          Audience chains
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {CHAINS.map(c => {
            const active = values.audienceChains.includes(c)
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
                {AUDIENCE_CHAIN_LABELS[c]}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-[rgba(55,50,47,0.5)]">
          Where most of your users transact — used for demand matching.
        </p>
        {errors.audienceChains && <p className="text-xs text-red-600">{errors.audienceChains}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium text-[rgba(55,50,47,0.5)] uppercase tracking-[0.07em]">
          Ad formats accepted
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {FORMATS.map(f => {
            const active = values.adFormats.includes(f)
            return (
              <button
                key={f}
                type="button"
                onClick={() => toggleFormat(f)}
                className={`h-10 rounded-md border text-xs font-medium transition-all ${
                  active
                    ? 'bg-[#37322F] text-white border-[#37322F]'
                    : 'bg-white text-[#37322F] border-[#E0DEDB] hover:border-[rgba(55,50,47,0.32)]'
                }`}
              >
                {AD_FORMAT_LABELS[f]}
              </button>
            )
          })}
        </div>
        {errors.adFormats && <p className="text-xs text-red-600">{errors.adFormats}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium text-[rgba(55,50,47,0.5)] uppercase tracking-[0.07em]">
          Estimated monthly impressions
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {BUCKETS.map(b => {
            const active = values.monthlyImpressions === b
            return (
              <button
                key={b}
                type="button"
                onClick={() => onChange({ monthlyImpressions: b })}
                className={`h-10 rounded-md border text-xs font-medium transition-all ${
                  active
                    ? 'bg-[#37322F] text-white border-[#37322F]'
                    : 'bg-white text-[#37322F] border-[#E0DEDB] hover:border-[rgba(55,50,47,0.32)]'
                }`}
              >
                {TRAFFIC_BUCKET_LABELS[b]}
              </button>
            )
          })}
        </div>
        {errors.monthlyImpressions && (
          <p className="text-xs text-red-600">{errors.monthlyImpressions}</p>
        )}
      </div>
    </div>
  )
}
