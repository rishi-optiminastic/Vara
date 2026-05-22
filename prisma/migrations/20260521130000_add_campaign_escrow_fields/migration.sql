-- AlterTable: add escrow tracking columns the Rust BE expects on Campaign.
-- See be/src/helpers/wallet_escrow.rs for the invariants these maintain:
--   * `reservedUsdcCents` = funds locked against this campaign right now
--     (== max(0, budget - spent) while status = ACTIVE)
--   * `spentUsdcCents`    = cumulative spend recorded against this campaign
-- Both default to 0 so existing rows are valid without a backfill.
ALTER TABLE "campaign" ADD COLUMN "reservedUsdcCents" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "campaign" ADD COLUMN "spentUsdcCents"    INTEGER NOT NULL DEFAULT 0;
