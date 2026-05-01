import { z } from "zod"
import { CreativeFormat } from "@prisma/client"

export const CreateCreativeSchema = z.object({
  campaignId: z.string().min(1, "Campaign is required"),
  name: z.string().min(1, "Name is required").max(120),
  format: z.nativeEnum(CreativeFormat),
  assetUrl: z.string().url("Must be a valid URL"),
  clickUrl: z.string().url("Must be a valid URL"),
  walletConnectCta: z.boolean().default(false),
})
export type CreateCreativeInput = z.infer<typeof CreateCreativeSchema>
