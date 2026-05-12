"use client"

import { useEffect, useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { parseUnits } from "viem"
import { useAccount, useChainId, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { sepolia } from "wagmi/chains"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CircleCheckIcon, TriangleWarningIcon, UsdcIcon, WalletIcon } from "@/icons"
import { erc20Abi, USDC_DECIMALS, USDC_SEPOLIA_ADDRESS } from "@/lib/usdc"
import { submitDeposit } from "@/services/wallet"

interface Props {
  depositAddress: string | null
  onSuccess: () => void
}

export function CryptoDepositConnect({ depositAddress, onSuccess }: Props): React.JSX.Element {
  const { isConnected, address } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending: switching } = useSwitchChain()

  const [amount, setAmount] = useState("")
  const [serverError, setServerError] = useState<string | null>(null)
  const [crediting, setCrediting] = useState(false)

  const { writeContract, data: txHash, isPending: signing, error: writeError, reset } =
    useWriteContract()
  const { isLoading: confirming, isSuccess: confirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  // Once the tx is confirmed on-chain, push the hash to the backend so the
  // verifier credits the wallet, then close the dialog.
  useEffect(() => {
    if (!confirmed || !txHash) return
    let cancelled = false
    void (async () => {
      setCrediting(true)
      setServerError(null)
      try {
        await submitDeposit(txHash)
        if (!cancelled) onSuccess()
      } catch (err) {
        if (!cancelled) setServerError(err instanceof Error ? err.message : "Failed to credit deposit")
      } finally {
        if (!cancelled) setCrediting(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [confirmed, txHash, onSuccess])

  if (!depositAddress) {
    return (
      <div className="px-5 py-6">
        <Warn>
          <p className="font-medium">Deposit address not configured.</p>
          <p className="mt-1 text-muted-foreground">
            Set <code className="font-mono">WALLET_DEPOSIT_RECEIVER_SEPOLIA</code> in your{" "}
            <code className="font-mono">.env</code> and restart the backend.
          </p>
        </Warn>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="px-5 py-6 space-y-3">
        <div className="flex items-start gap-2 rounded-md border border-dashed border-[rgba(55,50,47,0.16)] bg-[#FFFFFF] p-3 text-[11px] text-muted-foreground">
          <WalletIcon className="size-4 shrink-0 mt-0.5 text-[#37322F]" />
          <div>
            <p className="font-medium text-[#37322F]">Connect your wallet to top up</p>
            <p className="mt-0.5">
              We&apos;ll send testnet USDC from your wallet to the Vara deposit address. The on-chain
              verifier credits your balance once the tx confirms.
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <ConnectButton showBalance={false} />
        </div>
      </div>
    )
  }

  const wrongNetwork = chainId !== sepolia.id
  const amountCents = Math.round(parseFloat(amount || "0") * 100)
  const amountValid = amountCents > 0

  const handleSend = (): void => {
    if (!amountValid || wrongNetwork) return
    setServerError(null)
    reset()
    writeContract({
      abi: erc20Abi,
      address: USDC_SEPOLIA_ADDRESS,
      functionName: "transfer",
      args: [depositAddress as `0x${string}`, parseUnits(amount, USDC_DECIMALS)],
    })
  }

  const stage = serverError
    ? "error"
    : crediting
      ? "crediting"
      : confirmed
        ? "credited"
        : confirming
          ? "confirming"
          : signing
            ? "signing"
            : "idle"

  return (
    <div className="space-y-3 p-5">
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

      {wrongNetwork && (
        <div className="flex items-center justify-between gap-2 rounded-md border border-[#C2410C]/30 bg-[#FFF3E8] px-3 py-2 text-[11px] text-[#9A3412]">
          <span>Switch to Sepolia to send testnet USDC.</span>
          <Button
            type="button"
            size="sm"
            className="h-6 text-[10px] bg-[#37322F] hover:bg-[#37322F]/90 text-white"
            onClick={() => switchChain({ chainId: sepolia.id })}
            disabled={switching}
          >
            {switching ? "Switching…" : "Switch network"}
          </Button>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Amount (USDC)
        </label>
        <div className="relative">
          <UsdcIcon className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <Input
            value={amount}
            onChange={e => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder="0.00"
            className="h-9 pl-8 text-sm font-mono tabular-nums"
            disabled={stage !== "idle" && stage !== "error"}
          />
        </div>
      </div>

      <div className="rounded-md border border-dashed border-[rgba(55,50,47,0.16)] bg-[#FFFFFF] p-2.5 space-y-1 text-[11px]">
        <Row label="To" value={shortAddress(depositAddress)} mono />
        <Row label="Network" value="Sepolia (testnet)" />
        <Row label="Token" value="USDC" />
      </div>

      {(writeError || serverError) && (
        <Warn>
          <span>{serverError ?? writeError?.message ?? "Transaction failed"}</span>
        </Warn>
      )}

      <Stage stage={stage} txHash={txHash} />

      <Button
        type="button"
        onClick={handleSend}
        disabled={!amountValid || wrongNetwork || (stage !== "idle" && stage !== "error")}
        className="h-9 w-full text-xs bg-[#37322F] hover:bg-[#37322F]/90 text-white disabled:opacity-50"
      >
        {stage === "signing" && "Confirm in your wallet…"}
        {stage === "confirming" && "Waiting for on-chain confirmation…"}
        {stage === "crediting" && "Crediting your Vara balance…"}
        {stage === "credited" && (
          <>
            <CircleCheckIcon className="size-3" /> Done
          </>
        )}
        {(stage === "idle" || stage === "error") && (
          <>
            Send {amount || "0"} USDC <CircleCheckIcon className="size-3" />
          </>
        )}
      </Button>
    </div>
  )
}

function Row({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}): React.JSX.Element {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-[#37322F] ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  )
}

function Warn({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="flex items-start gap-2 rounded-md border border-[#B91C1C]/30 bg-[#FEF2F2] p-2 text-[11px] text-[#991B1B]">
      <TriangleWarningIcon className="size-3.5 shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  )
}

function Stage({
  stage,
  txHash,
}: {
  stage: string
  txHash: `0x${string}` | undefined
}): React.JSX.Element | null {
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

function shortAddress(addr: string): string {
  if (addr.length <= 14) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}
