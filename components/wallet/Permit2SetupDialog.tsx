"use client"

import { useEffect, useState, useCallback } from "react"
import { useAccount, useChainId, useSwitchChain, useReadContract,
  useWriteContract, useWaitForTransactionReceipt, useSignTypedData } from "wagmi"
import { maxUint256 } from "viem"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { erc20Abi, USDC_POLYGON_ADDRESS } from "@/lib/usdc"
import { PERMIT2_ADDRESS, AUTH_CEILING_RAW, AUTH_DURATION_DAYS,
  PERMIT2_TYPES, permit2Domain, permit2Abi, buildPermit2TypedData, PERMIT2_CHAIN } from "@/lib/permit2"
import { CircleCheckIcon, TriangleWarningIcon } from "@/icons"

type Step = "connect" | "approve" | "approving" | "sign" | "signing" | "submit" | "done" | "error"

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
}

const ESCROW = (process.env.NEXT_PUBLIC_VARA_ESCROW_ADDRESS ?? "") as `0x${string}`

function StepRow({ n, label, done, active }: { n: number; label: string; done: boolean; active: boolean }): React.JSX.Element {
  return (
    <div className={`flex items-center gap-2.5 text-[11px] ${active ? "text-[#37322F]" : done ? "text-[#37322F]/50" : "text-[#37322F]/30"}`}>
      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold
        ${done ? "border-[#16a34a] bg-[#f0fdf4] text-[#16a34a]" : active ? "border-[#1F40CD] bg-[#eef2ff] text-[#1F40CD]" : "border-[rgba(55,50,47,0.2)]"}`}>
        {done ? <CircleCheckIcon className="size-3 text-[#16a34a]" /> : n}
      </div>
      <span>{label}</span>
    </div>
  )
}

export function Permit2SetupDialog({ open, onOpenChange }: Props): React.JSX.Element {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending: switching } = useSwitchChain()
  const queryClient = useQueryClient()

  const [step, setStep] = useState<Step>("connect")
  const [error, setError] = useState<string | null>(null)

  const onPolygon = isConnected && chainId === PERMIT2_CHAIN.id

  const { data: usdcAllowance, refetch: refetchAllowance } = useReadContract({
    abi: erc20Abi, address: USDC_POLYGON_ADDRESS,
    functionName: "allowance",
    args: address ? [address, PERMIT2_ADDRESS] : undefined,
    chainId: PERMIT2_CHAIN.id,
    query: { enabled: onPolygon && !!address },
  })

  const { data: permit2Slot } = useReadContract({
    abi: permit2Abi, address: PERMIT2_ADDRESS,
    functionName: "allowance",
    args: address && ESCROW ? [address, USDC_POLYGON_ADDRESS, ESCROW] : undefined,
    chainId: PERMIT2_CHAIN.id,
    query: { enabled: onPolygon && !!address && !!ESCROW },
  })

  const { writeContract, data: approveTxHash, isPending: approvalPending, reset: resetWrite } = useWriteContract()
  const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({ hash: approveTxHash })
  const { signTypedData, data: signature, isPending: signPending, reset: resetSign } = useSignTypedData()

  // Advance to approve step once connected to Polygon
  useEffect(() => {
    if (onPolygon && step === "connect") setStep("approve")
  }, [onPolygon, step])

  // Skip approve if already approved
  useEffect(() => {
    if (step === "approve" && usdcAllowance !== undefined && usdcAllowance > 0n) setStep("sign")
  }, [step, usdcAllowance])

  // Advance after approval tx confirms
  useEffect(() => {
    if (approveConfirmed && step === "approving") {
      void refetchAllowance()
      setStep("sign")
    }
  }, [approveConfirmed, step, refetchAllowance])

  // Submit signature to backend when signed
  useEffect(() => {
    if (!signature || step !== "signing") return
    setStep("submit")
    const now = Math.floor(Date.now() / 1000)
    const expiration = now + AUTH_DURATION_DAYS * 86400
    const sigDeadline = BigInt(now + 3600)
    const nonce = permit2Slot ? Number(permit2Slot[2]) : 0

    void fetch("/api/wallet/permit2", {
      method: "POST", credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        walletAddress: address,
        tokenAddress: USDC_POLYGON_ADDRESS,
        spenderAddress: ESCROW,
        authorizedAmount: AUTH_CEILING_RAW.toString(),
        expiration, nonce,
        sigDeadline: sigDeadline.toString(),
        signature,
        chainId: PERMIT2_CHAIN.id,
      }),
    }).then(async (res) => {
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string }
        throw new Error(body.error ?? "Failed to save authorization")
      }
      setStep("done")
      void queryClient.invalidateQueries({ queryKey: ["permit2-status"] })
    }).catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Submission failed")
      setStep("error")
    })
  }, [signature, step, address, permit2Slot, queryClient])

  const handleApprove = useCallback((): void => {
    setError(null)
    resetWrite()
    setStep("approving")
    writeContract({
      abi: erc20Abi, address: USDC_POLYGON_ADDRESS,
      functionName: "approve",
      args: [PERMIT2_ADDRESS, maxUint256],
      chainId: PERMIT2_CHAIN.id,
    })
  }, [resetWrite, writeContract])

  const handleSign = useCallback((): void => {
    if (!address) return
    setError(null)
    resetSign()
    const now = Math.floor(Date.now() / 1000)
    const expiration = now + AUTH_DURATION_DAYS * 86400
    const nonce = permit2Slot ? Number(permit2Slot[2]) : 0
    setStep("signing")
    signTypedData(buildPermit2TypedData({
      tokenAddress: USDC_POLYGON_ADDRESS,
      spenderAddress: ESCROW,
      amount: AUTH_CEILING_RAW,
      expiration,
      nonce,
      sigDeadline: BigInt(now + 3600),
    }))
  }, [address, permit2Slot, resetSign, signTypedData])

  const handleReset = useCallback((): void => {
    setStep(isConnected ? "approve" : "connect")
    setError(null)
    resetWrite()
    resetSign()
  }, [isConnected, resetWrite, resetSign])

  const needsApprove = usdcAllowance !== undefined && usdcAllowance === 0n
  const approveComplete = usdcAllowance !== undefined && usdcAllowance > 0n

  const waitingForWallet = step === "approving" || step === "signing" || step === "submit"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-sm gap-4"
        overlayClassName={waitingForWallet ? "pointer-events-none" : ""}
        onInteractOutside={(e) => { if (waitingForWallet) e.preventDefault() }}
      >
        <DialogHeader>
          <DialogTitle className="text-[15px] font-medium text-[#37322F]">
            Set up spending authorization
          </DialogTitle>
        </DialogHeader>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Authorize Vara to automatically top up your ad balance from your wallet when it
          runs low — up to <strong>500 USDC</strong> over 30 days. No upfront deposit required.
        </p>

        <div className="flex flex-col gap-2.5 rounded-md border border-dashed border-[rgba(55,50,47,0.16)] bg-[#FAFAF9] p-3">
          <StepRow n={1} label={`Connect wallet on ${PERMIT2_CHAIN.name}`} done={onPolygon} active={!onPolygon} />
          <StepRow n={2} label="Approve USDC → Permit2 (one-time)" done={approveComplete} active={step === "approve" || step === "approving"} />
          <StepRow n={3} label="Sign 30-day authorization" done={step === "done"} active={step === "sign" || step === "signing"} />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-md border border-[#fecaca] bg-[#fef2f2] p-2.5 text-[11px] text-[#991B1B]">
            <TriangleWarningIcon className="size-3.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {step === "done" && (
          <div className="flex items-center gap-2 rounded-md border border-[#bbf7d0] bg-[#f0fdf4] p-2.5 text-[11px] text-[#15803d]">
            <CircleCheckIcon className="size-3.5 shrink-0" />
            <span>Authorization active — auto-recharge is on.</span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {!isConnected && <ConnectButton showBalance={false} />}

          {isConnected && chainId !== PERMIT2_CHAIN.id && (
            <Button onClick={() => switchChain({ chainId: PERMIT2_CHAIN.id })} disabled={switching}
              className="h-9 w-full text-xs bg-[#37322F] hover:bg-[#37322F]/90 text-white">
              {switching ? "Switching…" : `Switch to ${PERMIT2_CHAIN.name}`}
            </Button>
          )}

          {step === "approve" && !approveComplete && (
            <Button onClick={handleApprove} disabled={approvalPending || usdcAllowance === undefined}
              className="h-9 w-full text-xs bg-[#37322F] hover:bg-[#37322F]/90 text-white">
              {usdcAllowance === undefined ? "Checking allowance…" : "Approve USDC"}
            </Button>
          )}

          {step === "approving" && (
            <Button disabled className="h-9 w-full text-xs bg-[#37322F]/50 text-white">
              Waiting for approval…
            </Button>
          )}

          {(step === "sign" || (step === "approve" && approveComplete)) && (
            <Button onClick={handleSign} disabled={signPending}
              className="h-9 w-full text-xs bg-[#1F40CD] hover:bg-[#1A36B0] text-white">
              {signPending ? "Check wallet…" : "Sign authorization"}
            </Button>
          )}

          {(step === "signing" || step === "submit") && (
            <Button disabled className="h-9 w-full text-xs bg-[#1F40CD]/50 text-white">
              {step === "submit" ? "Saving…" : "Awaiting signature…"}
            </Button>
          )}

          {(step === "error") && (
            <Button onClick={handleReset} variant="outline"
              className="h-9 w-full text-xs border-[rgba(55,50,47,0.2)]">
              Try again
            </Button>
          )}

          {step === "done" && (
            <Button onClick={() => onOpenChange(false)}
              className="h-9 w-full text-xs bg-[#37322F] hover:bg-[#37322F]/90 text-white">
              Done
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
