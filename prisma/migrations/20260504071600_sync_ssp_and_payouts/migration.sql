-- CreateEnum
CREATE TYPE "DepositNetwork" AS ENUM ('MAINNET', 'SEPOLIA');

-- CreateEnum
CREATE TYPE "DepositStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

-- CreateEnum
CREATE TYPE "WalletTxType" AS ENUM ('DEPOSIT', 'AD_SPEND', 'REFUND', 'WITHDRAWAL');

-- CreateEnum
CREATE TYPE "WalletTxStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "EarningStatus" AS ENUM ('PENDING', 'CLEARED', 'PAID', 'REVERSED');

-- CreateEnum
CREATE TYPE "StatementStatus" AS ENUM ('OPEN', 'FINALIZED', 'PAID');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'SUBMITTED', 'CONFIRMED', 'FAILED');

-- CreateEnum
CREATE TYPE "PlacementStatus" AS ENUM ('DRAFT', 'LIVE', 'PAUSED');

-- CreateEnum
CREATE TYPE "AdFormat" AS ENUM ('BANNER', 'NATIVE', 'INTERSTITIAL', 'WALLET_CONTEXTUAL', 'VIDEO');

-- CreateEnum
CREATE TYPE "InventoryCategory" AS ENUM ('DEFI', 'NFT', 'GAMING', 'NEWS', 'SOCIAL', 'TOOLS', 'OTHER');

-- CreateTable
CREATE TABLE "wallet" (
    "id" TEXT NOT NULL,
    "advertiserId" TEXT NOT NULL,
    "balanceUsdcCents" INTEGER NOT NULL DEFAULT 0,
    "pendingUsdcCents" INTEGER NOT NULL DEFAULT 0,
    "reservedUsdcCents" INTEGER NOT NULL DEFAULT 0,
    "totalDepositedUsdcCents" INTEGER NOT NULL DEFAULT 0,
    "totalSpentUsdcCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposit" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "chain" "Chain" NOT NULL DEFAULT 'ETHEREUM',
    "network" "DepositNetwork" NOT NULL DEFAULT 'SEPOLIA',
    "txHash" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "amountUsdcCents" INTEGER NOT NULL,
    "status" "DepositStatus" NOT NULL DEFAULT 'CONFIRMED',
    "blockNumber" INTEGER,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_transaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" "WalletTxType" NOT NULL,
    "status" "WalletTxStatus" NOT NULL DEFAULT 'COMPLETED',
    "amountUsdcCents" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "txHash" TEXT,
    "depositId" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publisher" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "siteName" TEXT NOT NULL,
    "primaryUrl" TEXT,
    "category" "InventoryCategory" NOT NULL DEFAULT 'OTHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publisher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placement" (
    "id" TEXT NOT NULL,
    "publisherId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "format" "AdFormat" NOT NULL,
    "chains" "Chain"[],
    "status" "PlacementStatus" NOT NULL DEFAULT 'LIVE',
    "width" INTEGER,
    "height" INTEGER,
    "floorPriceUsdcCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "placement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publisher_wallet" (
    "id" TEXT NOT NULL,
    "publisherId" TEXT NOT NULL,
    "payoutAddress" TEXT,
    "payoutChain" "Chain" NOT NULL DEFAULT 'BASE',
    "payoutNetwork" "DepositNetwork" NOT NULL DEFAULT 'SEPOLIA',
    "revShareBps" INTEGER NOT NULL DEFAULT 7000,
    "availableUsdcCents" INTEGER NOT NULL DEFAULT 0,
    "pendingUsdcCents" INTEGER NOT NULL DEFAULT 0,
    "lifetimeEarnedUsdcCents" INTEGER NOT NULL DEFAULT 0,
    "lifetimePaidUsdcCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publisher_wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publisher_earning" (
    "id" TEXT NOT NULL,
    "publisherWalletId" TEXT NOT NULL,
    "placementId" TEXT,
    "statementId" TEXT,
    "date" DATE NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "grossUsdcCents" INTEGER NOT NULL DEFAULT 0,
    "feeUsdcCents" INTEGER NOT NULL DEFAULT 0,
    "netUsdcCents" INTEGER NOT NULL DEFAULT 0,
    "status" "EarningStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publisher_earning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publisher_statement" (
    "id" TEXT NOT NULL,
    "publisherWalletId" TEXT NOT NULL,
    "periodStart" DATE NOT NULL,
    "periodEnd" DATE NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "grossUsdcCents" INTEGER NOT NULL DEFAULT 0,
    "feeUsdcCents" INTEGER NOT NULL DEFAULT 0,
    "netUsdcCents" INTEGER NOT NULL DEFAULT 0,
    "status" "StatementStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalizedAt" TIMESTAMP(3),

    CONSTRAINT "publisher_statement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payout" (
    "id" TEXT NOT NULL,
    "publisherWalletId" TEXT NOT NULL,
    "statementId" TEXT,
    "chain" "Chain" NOT NULL,
    "network" "DepositNetwork" NOT NULL DEFAULT 'SEPOLIA',
    "amountUsdcCents" INTEGER NOT NULL,
    "feeUsdcCents" INTEGER NOT NULL DEFAULT 0,
    "toAddress" TEXT NOT NULL,
    "txHash" TEXT,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "failureReason" TEXT,
    "initiatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "settledAt" TIMESTAMP(3),

    CONSTRAINT "payout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_group" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "bidUsdCents" INTEGER NOT NULL,
    "pricingModel" "PricingModel" NOT NULL DEFAULT 'CPM',
    "bidStrategy" "BidStrategy" NOT NULL DEFAULT 'MANUAL',
    "dailyCapUsdCents" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ad_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_group_targeting" (
    "id" TEXT NOT NULL,
    "adGroupId" TEXT NOT NULL,
    "chains" "Chain"[],
    "geos" TEXT[],
    "deviceTypes" "DeviceType"[],
    "segmentIds" TEXT[],
    "holdsAnyContract" TEXT[],
    "excludesContracts" TEXT[],

    CONSTRAINT "ad_group_targeting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallet_advertiserId_key" ON "wallet"("advertiserId");

-- CreateIndex
CREATE UNIQUE INDEX "deposit_txHash_key" ON "deposit"("txHash");

-- CreateIndex
CREATE INDEX "deposit_walletId_idx" ON "deposit"("walletId");

-- CreateIndex
CREATE INDEX "wallet_transaction_walletId_occurredAt_idx" ON "wallet_transaction"("walletId", "occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "publisher_userId_key" ON "publisher"("userId");

-- CreateIndex
CREATE INDEX "placement_publisherId_idx" ON "placement"("publisherId");

-- CreateIndex
CREATE UNIQUE INDEX "publisher_wallet_publisherId_key" ON "publisher_wallet"("publisherId");

-- CreateIndex
CREATE INDEX "publisher_earning_publisherWalletId_date_idx" ON "publisher_earning"("publisherWalletId", "date");

-- CreateIndex
CREATE INDEX "publisher_earning_statementId_idx" ON "publisher_earning"("statementId");

-- CreateIndex
CREATE INDEX "publisher_statement_publisherWalletId_periodStart_idx" ON "publisher_statement"("publisherWalletId", "periodStart");

-- CreateIndex
CREATE UNIQUE INDEX "payout_txHash_key" ON "payout"("txHash");

-- CreateIndex
CREATE INDEX "payout_publisherWalletId_initiatedAt_idx" ON "payout"("publisherWalletId", "initiatedAt");

-- CreateIndex
CREATE INDEX "ad_group_campaignId_idx" ON "ad_group"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "ad_group_targeting_adGroupId_key" ON "ad_group_targeting"("adGroupId");

-- AddForeignKey
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_advertiserId_fkey" FOREIGN KEY ("advertiserId") REFERENCES "advertiser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit" ADD CONSTRAINT "deposit_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transaction" ADD CONSTRAINT "wallet_transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publisher" ADD CONSTRAINT "publisher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placement" ADD CONSTRAINT "placement_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "publisher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publisher_wallet" ADD CONSTRAINT "publisher_wallet_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "publisher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publisher_earning" ADD CONSTRAINT "publisher_earning_publisherWalletId_fkey" FOREIGN KEY ("publisherWalletId") REFERENCES "publisher_wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publisher_earning" ADD CONSTRAINT "publisher_earning_placementId_fkey" FOREIGN KEY ("placementId") REFERENCES "placement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publisher_earning" ADD CONSTRAINT "publisher_earning_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "publisher_statement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publisher_statement" ADD CONSTRAINT "publisher_statement_publisherWalletId_fkey" FOREIGN KEY ("publisherWalletId") REFERENCES "publisher_wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout" ADD CONSTRAINT "payout_publisherWalletId_fkey" FOREIGN KEY ("publisherWalletId") REFERENCES "publisher_wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout" ADD CONSTRAINT "payout_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "publisher_statement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_group" ADD CONSTRAINT "ad_group_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_group_targeting" ADD CONSTRAINT "ad_group_targeting_adGroupId_fkey" FOREIGN KEY ("adGroupId") REFERENCES "ad_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

