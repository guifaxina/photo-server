/*
  Warnings:

  - Changed the type of `descriptor` on the `photos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."photos" DROP COLUMN "descriptor",
ADD COLUMN     "descriptor" JSONB NOT NULL;
