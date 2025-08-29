/*
  Warnings:

  - You are about to drop the column `isMain` on the `photos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."photos" DROP CONSTRAINT "photos_mainPhotoId_fkey";

-- AlterTable
ALTER TABLE "public"."photos" DROP COLUMN "isMain";

-- CreateIndex
CREATE INDEX "photo_descriptor_idx" ON "public"."photos"("descriptor");
