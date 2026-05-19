"use client"

import { useEffect, useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { formatUnits, parseUnits } from "viem"
import {
  useAccount,
  useBalance,
  useChainId,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"
import { sepolia } from "wagmi/chains"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UsdcIcon, WalletIcon } from "@/icons"
import { erc20Abi, USDC_DECIMALS, USDC_SEPOLIA_ADDRESS } from "@/lib/usdc"
import { submitDeposit } from "@/services/wallet"
import {
  AccountBadgeRow,
  NoEthBanner,
  Row,
  SendButtonLabel,
  Stage,
  USDC_FAUCET_URL,
  Warn,
  WrongNetworkBanner,
  deriveStage,
  shortAddress,
} from "./CryptoDepositPieces"

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

  const wrongNetwork = chainId !== sepolia.id
  const onCorrectChain = isConnected && !wrongNetwork

  // Pre-flight balance checks so the Send button can be gated before the user
  // signs a tx that's destined to revert (insufficient ETH for gas, or
  // insufficient USDC for the transfer amount).
  const { data: ethBalance } = useBalance({
    address,
    chainId: sepolia.id,
    query: { enabled: onCorrectChain },
  })
  const { data: usdcBalanceRaw } = useReadContract({
    abi: erc20Abi,
    address: USDC_SEPOLIA_ADDRESS,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: sepolia.id,
    query: { enabled: onCorrectChain && !!address },
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

  const amountCents = Math.round(parseFloat(amount || "0") * 100)
  const amountValid = amountCents > 0
  const amountUnits = amountValid ? parseUnits(amount, USDC_DECIMALS) : 0n

  const ethEmpty = ethBalance !== undefined && ethBalance.value === 0n
  const usdcBalance = usdcBalanceRaw as bigint | undefined
  const usdcBalancePretty =
    usdcBalance !== undefined ? formatUnits(usdcBalance, USDC_DECIMALS) : null
  const insufficientUsdc =
    usdcBalance !== undefined && amountValid && amountUnits > usdcBalance

  const stage = deriveStage({ serverError, crediting, confirmed, confirming, signing })

  const sendDisabled =
    !amountValid ||
    wrongNetwork ||
    ethEmpty ||
    insufficientUsdc ||
    (stage !== "idle" && stage !== "error")

  const handleSend = (): void => {
    if (sendDisabled) return
    setServerError(null)
    reset()
    writeContract({
      abi: erc20Abi,
      address: USDC_SEPOLIA_ADDRESS,
      functionName: "transfer",
      args: [depositAddress as `0x${string}`, amountUnits],
    })
  }

  return (
    <div className="space-y-3 p-5">
      <AccountBadgeRow address={address} wrongNetwork={wrongNetwork} />

      {wrongNetwork && (
        <WrongNetworkBanner
          switching={switching}
          onSwitch={() => switchChain({ chainId: sepolia.id })}
        />
      )}

      {onCorrectChain && ethEmpty && <NoEthBanner />}

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Amount (USDC)
          </label>
          {usdcBalancePretty !== null && (
            <span className="text-[10px] text-muted-foreground">
              Balance: <span className="font-mono tabular-nums text-[#37322F]">{usdcBalancePretty}</span>
              {usdcBalance === 0n && (
                <>
                  {" · "}
                  <a
                    href={USDC_FAUCET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-[#1E40AF]"
                  >
                    Get USDC
                  </a>
                </>
              )}
            </span>
          )}
        </div>
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
        {insufficientUsdc && (
          <p className="text-[10px] text-[#991B1B]">
            Amount exceeds your USDC balance ({usdcBalancePretty}).
          </p>
        )}
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
        disabled={sendDisabled}
        className="h-9 w-full text-xs bg-[#37322F] hover:bg-[#37322F]/90 text-white disabled:opacity-50"
      >
        <SendButtonLabel stage={stage} amount={amount} />
      </Button>
    </div>
  )
}
