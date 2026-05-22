-- AlterTable: add the active advertiser pointer that the Rust BE auth path
-- (be/src/auth.rs) joins on. Nullable so existing rows aren't broken; the FK
-- is SET NULL so deleting an advertiser doesn't cascade-delete its owner.
ALTER TABLE "user" ADD COLUMN "activeAdvertiserId" TEXT;

-- CreateIndex: the BE uses this as the user→active-account pointer; @unique
-- in the Prisma schema prevents two users from pointing at the same row.
CREATE UNIQUE INDEX "user_activeAdvertiserId_key" ON "user"("activeAdvertiserId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_activeAdvertiserId_fkey" FOREIGN KEY ("activeAdvertiserId") REFERENCES "advertiser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill: every existing user that already has an advertiser should point
-- at it. Without this, all current accounts would hit "Unauthorized" on
-- BE-proxied routes until they re-trigger getOrCreateAdvertiser.
UPDATE "user" u
SET "activeAdvertiserId" = a.id
FROM advertiser a
WHERE a."userId" = u.id
  AND u."activeAdvertiserId" IS NULL;
