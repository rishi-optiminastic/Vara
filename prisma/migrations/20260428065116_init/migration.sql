-- CreateEnum
CREATE TYPE "Chain" AS ENUM ('ETHEREUM', 'POLYGON', 'SOLANA', 'BASE', 'ARBITRUM', 'OPTIMISM', 'BSC', 'AVALANCHE');

-- CreateEnum
CREATE TYPE "Vertical" AS ENUM ('TOKEN_LAUNCH', 'NFT_DROP', 'DEFI', 'DAPP_GROWTH', 'OTHER');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ENDED');

-- CreateEnum
CREATE TYPE "Objective" AS ENUM ('AWARENESS', 'WALLET_CONNECTS', 'ON_CHAIN_CONVERSION', 'TOKEN_HOLDERS');

-- CreateEnum
CREATE TYPE "CreativeFormat" AS ENUM ('BANNER', 'HTML5', 'VIDEO', 'NATIVE');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('DESKTOP', 'MOBILE');

-- CreateEnum
CREATE TYPE "AttrEventType" AS ENUM ('IMPRESSION', 'CLICK', 'WALLET_CONNECT', 'ON_CHAIN_CONV');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advertiser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "contractAddrs" TEXT[],
    "chain" "Chain" NOT NULL DEFAULT 'ETHEREUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advertiser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign" (
    "id" TEXT NOT NULL,
    "advertiserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vertical" "Vertical" NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "objective" "Objective" NOT NULL,
    "budgetUsdCents" INTEGER NOT NULL,
    "dailyCapUsdCents" INTEGER,
    "bidUsdCents" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "conversionContract" TEXT,
    "conversionEvent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "format" "CreativeFormat" NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "assetUrl" TEXT NOT NULL,
    "clickUrl" TEXT NOT NULL,
    "walletConnectCta" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "creative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "targeting" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "chains" "Chain"[],
    "geos" TEXT[],
    "deviceTypes" "DeviceType"[],
    "segmentIds" TEXT[],
    "minWalletAgeDays" INTEGER,
    "minPortfolioUsdCents" INTEGER,
    "holdsAnyContract" TEXT[],
    "excludesContracts" TEXT[],

    CONSTRAINT "targeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_segment" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "chain" "Chain",
    "estSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_segment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metric_daily" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "walletConnects" INTEGER NOT NULL DEFAULT 0,
    "onChainConvs" INTEGER NOT NULL DEFAULT 0,
    "spendUsdCents" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "metric_daily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribution_event" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "walletHash" TEXT NOT NULL,
    "eventType" "AttrEventType" NOT NULL,
    "txHash" TEXT,
    "chain" "Chain",
    "valueUsdCents" INTEGER,
    "occurredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attribution_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "advertiser_userId_key" ON "advertiser"("userId");

-- CreateIndex
CREATE INDEX "campaign_advertiserId_status_idx" ON "campaign"("advertiserId", "status");

-- CreateIndex
CREATE INDEX "creative_campaignId_idx" ON "creative"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "targeting_campaignId_key" ON "targeting"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_segment_slug_key" ON "wallet_segment"("slug");

-- CreateIndex
CREATE INDEX "metric_daily_date_idx" ON "metric_daily"("date");

-- CreateIndex
CREATE UNIQUE INDEX "metric_daily_campaignId_date_key" ON "metric_daily"("campaignId", "date");

-- CreateIndex
CREATE INDEX "attribution_event_campaignId_occurredAt_idx" ON "attribution_event"("campaignId", "occurredAt");

-- CreateIndex
CREATE INDEX "attribution_event_walletHash_idx" ON "attribution_event"("walletHash");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advertiser" ADD CONSTRAINT "advertiser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_advertiserId_fkey" FOREIGN KEY ("advertiserId") REFERENCES "advertiser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creative" ADD CONSTRAINT "creative_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "targeting" ADD CONSTRAINT "targeting_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_daily" ADD CONSTRAINT "metric_daily_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
