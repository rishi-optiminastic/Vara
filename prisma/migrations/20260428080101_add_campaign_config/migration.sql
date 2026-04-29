-- CreateEnum
CREATE TYPE "PricingModel" AS ENUM ('CPM', 'CPC', 'CPA');

-- CreateEnum
CREATE TYPE "BidStrategy" AS ENUM ('MANUAL', 'AUTO', 'MAX_CONVERSIONS', 'TARGET_CPA');

-- CreateEnum
CREATE TYPE "Pacing" AS ENUM ('STANDARD', 'ACCELERATED', 'EVEN');

-- AlterTable
ALTER TABLE "campaign" ADD COLUMN     "bidStrategy" "BidStrategy" NOT NULL DEFAULT 'MANUAL',
ADD COLUMN     "brandSafetyKeywords" TEXT[],
ADD COLUMN     "conversionWindowDays" INTEGER,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "frequencyCapHours" INTEGER,
ADD COLUMN     "frequencyCapPerWallet" INTEGER,
ADD COLUMN     "pacing" "Pacing" NOT NULL DEFAULT 'STANDARD',
ADD COLUMN     "pricingModel" "PricingModel" NOT NULL DEFAULT 'CPM';
