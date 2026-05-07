import { z } from "zod"
import { Chain, EarningStatus, PayoutStatus, StatementStatus } from "@prisma/client"

export const WithdrawSchema = z.object({
  amountUsdcCents: z.number().int().positive(),
  chain: z.nativeEnum(Chain),
  toAddress: z
    .string()
    .trim()
    .min(20, "Enter a valid wallet address")
    .max(80, "Address looks too long"),
})

export type WithdrawInput = z.infer<typeof WithdrawSchema>

export const PayoutAddressSchema = z.object({
  payoutAddress: z
    .string()
    .trim()
    .min(20, "Enter a valid wallet address")
    .max(80, "Address looks too long"),
  payoutChain: z.nativeEnum(Chain),
})

export type PayoutAddressInput = z.infer<typeof PayoutAddressSchema>

export const EARNING_STATUS_LABELS: Record<EarningStatus, string> = {
  PENDING: "Pending",
  CLEARED: "Cleared",
  PAID: "Paid out",
  REVERSED: "Reversed",
}

export const EARNING_STATUS_TINT: Record<EarningStatus, string> = {
  PENDING: "bg-[#FFF3E8] text-[#C2410C] border-[rgba(194,65,12,0.2)]",
  CLEARED: "bg-[#EAF1FF] text-[#1E40AF] border-[rgba(30,64,175,0.2)]",
  PAID: "bg-[#E8F5E9] text-[#15803D] border-[rgba(21,128,61,0.2)]",
  REVERSED: "bg-[#FEF2F2] text-[#991B1B] border-[rgba(153,27,27,0.2)]",
}

export const STATEMENT_STATUS_LABELS: Record<StatementStatus, string> = {
  OPEN: "Open",
  FINALIZED: "Finalized",
  PAID: "Paid",
}

export const STATEMENT_STATUS_TINT: Record<StatementStatus, string> = {
  OPEN: "bg-[#FFF3E8] text-[#C2410C] border-[rgba(194,65,12,0.2)]",
  FINALIZED: "bg-[#EAF1FF] text-[#1E40AF] border-[rgba(30,64,175,0.2)]",
  PAID: "bg-[#E8F5E9] text-[#15803D] border-[rgba(21,128,61,0.2)]",
}

export const PAYOUT_STATUS_LABELS: Record<PayoutStatus, string> = {
  PENDING: "Pending",
  SUBMITTED: "Submitted",
  CONFIRMED: "Confirmed",
  FAILED: "Failed",
}

export const PAYOUT_STATUS_TINT: Record<PayoutStatus, string> = {
  PENDING: "bg-[#FFF3E8] text-[#C2410C] border-[rgba(194,65,12,0.2)]",
  SUBMITTED: "bg-[#EAF1FF] text-[#1E40AF] border-[rgba(30,64,175,0.2)]",
  CONFIRMED: "bg-[#E8F5E9] text-[#15803D] border-[rgba(21,128,61,0.2)]",
  FAILED: "bg-[#FEF2F2] text-[#991B1B] border-[rgba(153,27,27,0.2)]",
}
