-- AlterTable
ALTER TABLE "advertiser" ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "campaignWallets" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "discordHandle" TEXT,
ADD COLUMN     "nftContracts" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "onboardedAt" TIMESTAMP(3),
ADD COLUMN     "primaryWalletAddress" TEXT,
ADD COLUMN     "supportedChains" "Chain"[] DEFAULT ARRAY[]::"Chain"[],
ADD COLUMN     "telegramHandle" TEXT,
ADD COLUMN     "tokenContracts" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "treasuryWallets" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "chain" SET DEFAULT 'POLYGON';
