import { z } from "zod"
import { CampaignStatus, PricingModel, BidStrategy, Chain, DeviceType } from "@prisma/client"

export const CreateAdGroupSchema = z.object({
  campaignId: z.string().min(1, "Campaign is required"),
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  status: z.nativeEnum(CampaignStatus).default(CampaignStatus.DRAFT),
  bidUsd: z.number().min(0.1, "Bid must be at least $0.10").max(1000),
  pricingModel: z.nativeEnum(PricingModel).default(PricingModel.CPM),
  bidStrategy: z.nativeEnum(BidStrategy).default(BidStrategy.MANUAL),
  dailyCapUsd: z.number().min(1).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  chains: z.array(z.nativeEnum(Chain)).default([]),
  geos: z.array(z.string().length(2)).default([]),
  deviceTypes: z.array(z.nativeEnum(DeviceType)).default([]),
})
export type CreateAdGroupInput = z.infer<typeof CreateAdGroupSchema>

export const UpdateAdGroupSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  status: z.nativeEnum(CampaignStatus).optional(),
  bidUsd: z.number().min(0.1).max(1000).optional(),
  pricingModel: z.nativeEnum(PricingModel).optional(),
  bidStrategy: z.nativeEnum(BidStrategy).optional(),
  dailyCapUsd: z.number().min(1).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})
export type UpdateAdGroupInput = z.infer<typeof UpdateAdGroupSchema>
