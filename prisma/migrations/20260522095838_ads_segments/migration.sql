-- CreateEnum
CREATE TYPE "AdType" AS ENUM ('STATIC_DISPLAY', 'RESPONSIVE_DISPLAY', 'VIDEO_IN_STREAM', 'VIDEO_OUTSTREAM', 'VIDEO_REWARDED', 'NATIVE', 'APP_INSTALL', 'INTERSTITIAL', 'HTML5', 'WALLET_CONTEXTUAL', 'TOKEN_GATED', 'CATALOG_NFT');

-- CreateEnum
CREATE TYPE "AdStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'ACTIVE', 'PAUSED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('IMAGE', 'VIDEO', 'HEADLINE', 'LONG_HEADLINE', 'DESCRIPTION', 'LOGO', 'HTML_BUNDLE', 'CALL_TO_ACTION', 'CLICK_URL', 'PRODUCT_FEED_ITEM');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AssetRole" AS ENUM ('PRIMARY_IMAGE', 'SQUARE_IMAGE', 'PORTRAIT_IMAGE', 'LOGO', 'VIDEO_FILE', 'COMPANION_BANNER', 'HEADLINE_1', 'HEADLINE_2', 'HEADLINE_3', 'HEADLINE_4', 'HEADLINE_5', 'LONG_HEADLINE', 'DESCRIPTION_1', 'DESCRIPTION_2', 'DESCRIPTION_3', 'CTA', 'HTML_BUNDLE');

-- CreateTable
CREATE TABLE "asset" (
    "id" TEXT NOT NULL,
    "advertiserId" TEXT NOT NULL,
    "type" "AssetType" NOT NULL,
    "status" "AssetStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "textValue" TEXT,
    "fileUrl" TEXT,
    "fileMimeType" TEXT,
    "fileBytes" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "durationMs" INTEGER,
    "aspectRatio" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "gatedByContract" TEXT,
    "gatedByMinHold" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad" (
    "id" TEXT NOT NULL,
    "adGroupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AdType" NOT NULL,
    "status" "AdStatus" NOT NULL DEFAULT 'DRAFT',
    "trafficShare" INTEGER NOT NULL DEFAULT 100,
    "clickUrl" TEXT NOT NULL,
    "finalUrlSuffix" TEXT,
    "hasMinAssets" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_asset_link" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "role" "AssetRole" NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ad_asset_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_metric_daily" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "viewableImps" INTEGER NOT NULL DEFAULT 0,
    "videoStarts" INTEGER NOT NULL DEFAULT 0,
    "videoCompletes" INTEGER NOT NULL DEFAULT 0,
    "walletConnects" INTEGER NOT NULL DEFAULT 0,
    "onChainConvs" INTEGER NOT NULL DEFAULT 0,
    "spendUsdcCents" INTEGER NOT NULL DEFAULT 0,
    "revenueUsdcCents" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ad_metric_daily_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "asset_advertiserId_type_status_idx" ON "asset"("advertiserId", "type", "status");

-- CreateIndex
CREATE INDEX "ad_adGroupId_status_idx" ON "ad"("adGroupId", "status");

-- CreateIndex
CREATE INDEX "ad_asset_link_adId_idx" ON "ad_asset_link"("adId");

-- CreateIndex
CREATE INDEX "ad_asset_link_assetId_idx" ON "ad_asset_link"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "ad_asset_link_adId_assetId_role_key" ON "ad_asset_link"("adId", "assetId", "role");

-- CreateIndex
CREATE INDEX "ad_metric_daily_date_idx" ON "ad_metric_daily"("date");

-- CreateIndex
CREATE UNIQUE INDEX "ad_metric_daily_adId_date_key" ON "ad_metric_daily"("adId", "date");

-- AddForeignKey
ALTER TABLE "asset" ADD CONSTRAINT "asset_advertiserId_fkey" FOREIGN KEY ("advertiserId") REFERENCES "advertiser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad" ADD CONSTRAINT "ad_adGroupId_fkey" FOREIGN KEY ("adGroupId") REFERENCES "ad_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_asset_link" ADD CONSTRAINT "ad_asset_link_adId_fkey" FOREIGN KEY ("adId") REFERENCES "ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_asset_link" ADD CONSTRAINT "ad_asset_link_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_metric_daily" ADD CONSTRAINT "ad_metric_daily_adId_fkey" FOREIGN KEY ("adId") REFERENCES "ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;
