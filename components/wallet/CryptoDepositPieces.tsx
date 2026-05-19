// Helper sub-components for CryptoDepositConnect. Co-located here to keep
// the main component file under the 250-line ceiling.

import { ConnectButton } from "@rainbow-me/rainbowkit"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CircleCheckIcon, TriangleWarningIcon, WalletIcon } from "@/icons"

export const SEPOLIA_FAUCET_URL =
  "https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
export const USDC_FAUCET_URL = "https://faucet.circle.com/"

export type DepositStage =
  | "idle"
  | "signing"
  | "confirming"
  | "crediting"
  | "credited"
  | "error"

interface DeriveStageArgs {
  serverError: string | null
  crediting: boolean
  confirmed: boolean
  confirming: boolean
  signing: boolean
}

export function deriveStage({
  serverError,
  crediting,
  confirmed,
  confirming,
  signing,
}: DeriveStageArgs): DepositStage {
  if (serverError) return "error"
  if (crediting) return "crediting"
  if (confirmed) return "credited"
  if (confirming) return "confirming"
  if (signing) return "signing"
  return "idle"
}

interface RowProps {
  label: string
  value: string
  mono?: boolean
}

export function Row({ label, value, mono }: RowProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-[#37322F] ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  )
}

interface WarnProps {
  children: React.ReactNode
}

export function Warn({ children }: WarnProps): React.JSX.Element {
  return (
    <div className="flex items-start gap-2 rounded-md border border-[#B91C1C]/30 bg-[#FEF2F2] p-2 text-[11px] text-[#991B1B]">
      <TriangleWarningIcon className="size-3.5 shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  )
}

interface StageProps {
  stage: DepositStage
  txHash: `0x${string}` | undefined
}

export function Stage({ stage, txHash }: StageProps): React.JSX.Element | null {
  if (stage === "idle" || stage === "error") return null
  return (
    <div className="rounded-md border border-[rgba(55,50,47,0.12)] bg-white p-2.5 text-[11px] text-muted-foreground">
      {stage === "signing" && "Open your wallet to confirm the transaction."}
      {stage === "confirming" && "Broadcast — waiting for Sepolia confirmation…"}
      {stage === "crediting" && "Confirmed on-chain. Crediting your Vara balance…"}
      {stage === "credited" && "Done — closing dialog."}
      {txHash && (
        <a
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-1 font-mono text-[#1E40AF] underline hover:no-underline"
        >
          {txHash.slice(0, 10)}…{txHash.slice(-8)}
        </a>
      )}
    </div>
  )
}

interface SendButtonLabelProps {
  stage: DepositStage
  amount: string
}

export function SendButtonLabel({ stage, amount }: SendButtonLabelProps): React.JSX.Element {
  if (stage === "signing") return <>Confirm in your wallet…</>
  if (stage === "confirming") return <>Waiting for on-chain confirmation…</>
  if (stage === "crediting") return <>Crediting your Vara balance…</>
  if (stage === "credited") {
    return (
      <>
        <CircleCheckIcon className="size-3" /> Done
      </>
    )
  }
  return (
    <>
      Send {amount || "0"} USDC <CircleCheckIcon className="size-3" />
    </>
  )
}

export function shortAddress(addr: string): string {
  if (addr.length <= 14) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

interface AccountBadgeRowProps {
  address: `0x${string}` | undefined
  wrongNetwork: boolean
}

export function AccountBadgeRow({ address, wrongNetwork }: AccountBadgeRowProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-[rgba(55,50,47,0.12)] bg-[#FFFFFF] px-3 py-2">
      <div className="min-w-0 flex items-center gap-2">
        <WalletIcon className="size-3.5 text-[#37322F] shrink-0" />
        <span className="font-mono text-[11px] text-[#37322F] truncate" title={address}>
          {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : ""}
        </span>
        <Badge
          variant="outline"
          className="h-4 px-1.5 text-[9px] uppercase tracking-widest bg-white/60 border-[rgba(55,50,47,0.16)]"
        >
          {wrongNetwork ? "Wrong network" : "Sepolia"}
        </Badge>
      </div>
      <ConnectButton.Custom>
        {({ openAccountModal }) => (
          <button
            type="button"
            onClick={openAccountModal}
            className="text-[10px] underline text-[#1E40AF] hover:no-underline"
          >
            Manage
          </button>
        )}
      </ConnectButton.Custom>
    </div>
  )
}

interface WrongNetworkBannerProps {
  switching: boolean
  onSwitch: () => void
}

export function WrongNetworkBanner({
  switching,
  onSwitch,
}: WrongNetworkBannerProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-[#C2410C]/30 bg-[#FFF3E8] px-3 py-2 text-[11px] text-[#9A3412]">
      <span>Switch to Sepolia to send testnet USDC.</span>
      <Button
        type="button"
        size="sm"
        className="h-6 text-[10px] bg-[#37322F] hover:bg-[#37322F]/90 text-white"
        onClick={onSwitch}
        disabled={switching}
      >
        {switching ? "Switching…" : "Switch network"}
      </Button>
    </div>
  )
}

export function NoEthBanner(): React.JSX.Element {
  return (
    <Warn>
      <p className="font-medium">No Sepolia ETH for gas.</p>
      <p className="mt-0.5">
        ERC-20 transfers need test ETH to pay gas — your wallet has 0.{" "}
        <a
          href={SEPOLIA_FAUCET_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-[#1E40AF]"
        >
          Get test ETH
        </a>
        , then refresh.
      </p>
    </Warn>
  )
}
