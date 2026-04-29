import { z } from "zod"
import {
  Chain,
  Vertical,
  CampaignStatus,
  Objective,
  CreativeFormat,
  DeviceType,
  PricingModel,
  BidStrategy,
  Pacing,
} from "@prisma/client"

export const ChainEnum = z.nativeEnum(Chain)
export const VerticalEnum = z.nativeEnum(Vertical)
export const StatusEnum = z.nativeEnum(CampaignStatus)
export const ObjectiveEnum = z.nativeEnum(Objective)
export const CreativeFormatEnum = z.nativeEnum(CreativeFormat)
export const DeviceTypeEnum = z.nativeEnum(DeviceType)
export const PricingModelEnum = z.nativeEnum(PricingModel)
export const BidStrategyEnum = z.nativeEnum(BidStrategy)
export const PacingEnum = z.nativeEnum(Pacing)

export const CreateCampaignSchema = z
  .object({
    name: z.string().min(2).max(120),
    description: z.string().max(1000).optional(),
    vertical: VerticalEnum,
    objective: ObjectiveEnum,
    pricingModel: PricingModelEnum.default(PricingModel.CPM),
    bidStrategy: BidStrategyEnum.default(BidStrategy.MANUAL),
    pacing: PacingEnum.default(Pacing.STANDARD),
    budgetUsd: z.number().min(10).max(10_000_000),
    dailyCapUsd: z.number().min(1).optional(),
    bidUsd: z.number().min(0.1).max(1000),
    frequencyCapPerWallet: z.number().int().min(1).max(1000).optional(),
    frequencyCapHours: z.number().int().min(1).max(720).optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    conversionContract: z.string().optional(),
    conversionEvent: z.string().optional(),
    conversionWindowDays: z.number().int().min(1).max(90).optional(),
    brandSafetyKeywords: z.array(z.string().min(1).max(60)).max(50).default([]),
  })
  .refine((d) => !d.endDate || d.endDate > d.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  })
export type CreateCampaignInput = z.infer<typeof CreateCampaignSchema>

export const UpdateCampaignSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  description: z.string().max(1000).optional(),
  vertical: VerticalEnum.optional(),
  objective: ObjectiveEnum.optional(),
  status: StatusEnum.optional(),
  pricingModel: PricingModelEnum.optional(),
  bidStrategy: BidStrategyEnum.optional(),
  pacing: PacingEnum.optional(),
  budgetUsd: z.number().min(10).max(10_000_000).optional(),
  dailyCapUsd: z.number().min(1).optional(),
  bidUsd: z.number().min(0.1).max(1000).optional(),
  frequencyCapPerWallet: z.number().int().min(1).max(1000).optional(),
  frequencyCapHours: z.number().int().min(1).max(720).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  conversionContract: z.string().optional(),
  conversionEvent: z.string().optional(),
  conversionWindowDays: z.number().int().min(1).max(90).optional(),
  brandSafetyKeywords: z.array(z.string().min(1).max(60)).max(50).optional(),
})
export type UpdateCampaignInput = z.infer<typeof UpdateCampaignSchema>

export const TargetingSchema = z.object({
  chains: z.array(ChainEnum).default([]),
  geos: z.array(z.string().length(2)).default([]),
  deviceTypes: z.array(DeviceTypeEnum).default([]),
  segmentIds: z.array(z.string()).default([]),
  minWalletAgeDays: z.number().int().min(0).optional(),
  minPortfolioUsd: z.number().min(0).optional(),
  holdsAnyContract: z.array(z.string()).default([]),
  excludesContracts: z.array(z.string()).default([]),
})
export type TargetingInput = z.infer<typeof TargetingSchema>
