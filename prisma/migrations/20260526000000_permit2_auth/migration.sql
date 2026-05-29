-- AlterEnum
ALTER TYPE "WalletTxType" ADD VALUE 'PERMIT2_RECHARGE';

-- CreateEnum
CREATE TYPE "Permit2AuthStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED', 'CEILING_REACHED');

-- AlterTable: add auto-recharge settings to wallet
ALTER TABLE "wallet"
  ADD COLUMN "autoRechargeEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "rechargeThresholdCents" INTEGER NOT NULL DEFAULT 1000,
  ADD COLUMN "preferredRechargeAmountCents" INTEGER NOT NULL DEFAULT 2500;

-- CreateTable
CREATE TABLE "permit2_authorization" (
  "id"               TEXT NOT NULL,
  "walletId"         TEXT NOT NULL,
  "userWallet"       TEXT NOT NULL,
  "tokenAddress"     TEXT NOT NULL,
  "spenderAddress"   TEXT NOT NULL,
  "authorizedAmount" BIGINT NOT NULL,
  "expiresAt"        TIMESTAMP(3) NOT NULL,
  "nonce"            INTEGER NOT NULL,
  "sigDeadline"      TIMESTAMP(3) NOT NULL,
  "signature"        TEXT NOT NULL,
  "status"           "Permit2AuthStatus" NOT NULL DEFAULT 'ACTIVE',
  "amountPulled"     BIGINT NOT NULL DEFAULT 0,
  "lastPullAt"       TIMESTAMP(3),
  "revokedAt"        TIMESTAMP(3),
  "revokeReason"     TEXT,
  "chainId"          INTEGER NOT NULL DEFAULT 137,
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"        TIMESTAMP(3) NOT NULL,

  CONSTRAINT "permit2_authorization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permit2_authorization_walletId_key" ON "permit2_authorization"("walletId");

-- CreateIndex
CREATE INDEX "permit2_authorization_userWallet_idx" ON "permit2_authorization"("userWallet");

-- CreateIndex
CREATE INDEX "permit2_authorization_status_expiresAt_idx" ON "permit2_authorization"("status", "expiresAt");

-- AddForeignKey
ALTER TABLE "permit2_authorization"
  ADD CONSTRAINT "permit2_authorization_walletId_fkey"
  FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
