"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Vertical, Objective, PricingModel, BidStrategy, Pacing } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createCampaign } from "@/services/campaigns"
import { CreateCampaignSchema } from "@/components/campaigns/types"
import { Loader2, Sparkles } from "lucide-react"
import { FormSection, TextField, SelectField, TextareaField } from "./form-fields"

const VERTICALS = [
  { value: Vertical.TOKEN_LAUNCH, label: "Token Launch", desc: "Launching a new token / TGE" },
  { value: Vertical.NFT_DROP, label: "NFT Drop", desc: "Mint or collection launch" },
  { value: Vertical.DEFI, label: "DeFi", desc: "Lending, DEX, vaults, perps" },
  { value: Vertical.DAPP_GROWTH, label: "dApp Growth", desc: "User acquisition for an existing dApp" },
  { value: Vertical.OTHER, label: "Other", desc: "Anything else" },
]

const OBJECTIVES = [
  { value: Objective.AWARENESS, label: "Awareness", desc: "Optimize for reach" },
  { value: Objective.WALLET_CONNECTS, label: "Wallet Connects", desc: "Drive connect_wallet events" },
  { value: Objective.ON_CHAIN_CONVERSION, label: "On-chain Conversion", desc: "Drive on-chain action (mint, swap, stake)" },
  { value: Objective.TOKEN_HOLDERS, label: "Token Holders", desc: "Acquire wallets that hold the token" },
]

const PRICING_MODELS = [
  { value: PricingModel.CPM, label: "CPM", desc: "Pay per 1,000 impressions" },
  { value: PricingModel.CPC, label: "CPC", desc: "Pay per click" },
  { value: PricingModel.CPA, label: "CPA", desc: "Pay per on-chain conversion" },
]

const BID_STRATEGIES = [
  { value: BidStrategy.MANUAL, label: "Manual", desc: "Fixed bid you set" },
  { value: BidStrategy.AUTO, label: "Auto", desc: "Engine adjusts within budget" },
  { value: BidStrategy.MAX_CONVERSIONS, label: "Max conversions", desc: "Spend all budget for max conversions" },
  { value: BidStrategy.TARGET_CPA, label: "Target CPA", desc: "Hit a target cost-per-acquisition" },
]

const PACING_OPTIONS = [
  { value: Pacing.STANDARD, label: "Standard", desc: "Smooth spend across the day" },
  { value: Pacing.EVEN, label: "Even", desc: "Strictly equal hourly spend" },
  { value: Pacing.ACCELERATED, label: "Accelerated", desc: "Spend ASAP — exhaust daily cap fast" },
]

const today = new Date().toISOString().slice(0, 10)

export function CampaignForm(): React.JSX.Element {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [vertical, setVertical] = useState<Vertical>("TOKEN_LAUNCH")
  const [objective, setObjective] = useState<Objective>("AWARENESS")
  const [pricingModel, setPricingModel] = useState<PricingModel>("CPM")
  const [bidStrategy, setBidStrategy] = useState<BidStrategy>("MANUAL")
  const [pacing, setPacing] = useState<Pacing>("STANDARD")
  const [budget, setBudget] = useState("1000")
  const [dailyCap, setDailyCap] = useState("")
  const [bid, setBid] = useState("2.50")
  const [freqCap, setFreqCap] = useState("")
  const [freqHours, setFreqHours] = useState("24")
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState("")
  const [convContract, setConvContract] = useState("")
  const [convEvent, setConvEvent] = useState("")
  const [convWindow, setConvWindow] = useState("7")
  const [brandSafety, setBrandSafety] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError("")
    const parsed = CreateCampaignSchema.safeParse({
      name,
      description: description || undefined,
      vertical,
      objective,
      pricingModel,
      bidStrategy,
      pacing,
      budgetUsd: Number(budget),
      dailyCapUsd: dailyCap ? Number(dailyCap) : undefined,
      bidUsd: Number(bid),
      frequencyCapPerWallet: freqCap ? Number(freqCap) : undefined,
      frequencyCapHours: freqCap && freqHours ? Number(freqHours) : undefined,
      startDate,
      endDate: endDate || undefined,
      conversionContract: convContract || undefined,
      conversionEvent: convEvent || undefined,
      conversionWindowDays: convContract && convWindow ? Number(convWindow) : undefined,
      brandSafetyKeywords: brandSafety
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input")
      return
    }
    setLoading(true)
    try {
      const { campaign } = await createCampaign(parsed.data)
      router.push(`/dashboard/campaigns/${campaign.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create campaign")
      setLoading(false)
    }
  }

  const showConversionFields =
    objective === "ON_CHAIN_CONVERSION" ||
    pricingModel === "CPA" ||
    bidStrategy === "MAX_CONVERSIONS" ||
    bidStrategy === "TARGET_CPA"

  return (
    <Card className="border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormSection title="Basics" desc="Campaign identity and intent.">
            <TextField label="Name" value={name} onChange={setName} placeholder="Q4 Token Launch" required span={2} />
            <TextareaField
              label="Description"
              value={description}
              onChange={setDescription}
              placeholder="Internal note. What is this campaign for?"
              rows={2}
            />
            <SelectField label="Vertical" value={vertical} onChange={setVertical} options={VERTICALS} />
            <SelectField label="Objective" value={objective} onChange={setObjective} options={OBJECTIVES} />
          </FormSection>

          <FormSection title="Pricing & Bidding" desc="How you pay and how the engine optimizes.">
            <SelectField label="Pricing model" value={pricingModel} onChange={setPricingModel} options={PRICING_MODELS} />
            <SelectField label="Bid strategy" value={bidStrategy} onChange={setBidStrategy} options={BID_STRATEGIES} />
            <TextField label="Bid" value={bid} onChange={setBid} type="number" min={0.1} step="0.01" required prefix="$" suffix={pricingModel} />
            <SelectField label="Pacing" value={pacing} onChange={setPacing} options={PACING_OPTIONS} />
          </FormSection>

          <FormSection title="Budget & Schedule" desc="How much, how fast, and when.">
            <TextField label="Total budget" value={budget} onChange={setBudget} type="number" min={10} step="0.01" required prefix="$" hint="Min $10" />
            <TextField label="Daily cap" value={dailyCap} onChange={setDailyCap} type="number" min={1} step="0.01" placeholder="Optional" prefix="$" />
            <TextField label="Start date" value={startDate} onChange={setStartDate} type="date" required />
            <TextField label="End date" value={endDate} onChange={setEndDate} type="date" hint="Leave blank for open-ended" />
          </FormSection>

          <FormSection title="Frequency & Brand Safety" desc="Avoid wallet fatigue and contextual mismatches.">
            <TextField
              label="Frequency cap"
              value={freqCap}
              onChange={setFreqCap}
              type="number"
              min={1}
              placeholder="e.g. 5"
              suffix="impr."
              hint="Max impressions per wallet"
            />
            <TextField
              label="Per window"
              value={freqHours}
              onChange={setFreqHours}
              type="number"
              min={1}
              suffix="hours"
              disabled={!freqCap}
            />
            <TextField
              label="Brand safety keywords"
              value={brandSafety}
              onChange={setBrandSafety}
              placeholder="rug, scam, hack"
              span={2}
              hint="Comma-separated. Excluded from contextual placements."
            />
          </FormSection>

          {showConversionFields && (
            <FormSection
              title="Conversion Tracking"
              desc="Required for on-chain conversion / CPA-style optimization."
            >
              <TextField
                label="Conversion contract"
                value={convContract}
                onChange={setConvContract}
                placeholder="0x… or Solana base58"
                span={2}
                mono
              />
              <TextField
                label="Conversion event"
                value={convEvent}
                onChange={setConvEvent}
                placeholder="Mint(address,uint256)"
                mono
              />
              <TextField
                label="Attribution window"
                value={convWindow}
                onChange={setConvWindow}
                type="number"
                min={1}
                suffix="days"
                hint="Max 90"
              />
            </FormSection>
          )}

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
          )}

          <div className="flex items-center justify-between gap-2 pt-3 border-t border-[rgba(55,50,47,0.08)]">
            <p className="text-[10px] text-muted-foreground">
              You can refine targeting and add creatives after saving.
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" className="h-8 text-xs rounded-full px-4" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={loading}
                className="h-8 gap-1.5 text-xs rounded-full px-4 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[0_0_0_2.5px_rgba(255,255,255,0.08)_inset]"
              >
                {loading ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
                Create campaign
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
