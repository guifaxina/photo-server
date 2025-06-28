/*
  Warnings:

  - You are about to drop the column `userId` on the `photos` table. All the data in the column will be lost.
  - Added the required column `photographerId` to the `photos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "photos" DROP CONSTRAINT "photos_userId_fkey";

-- AlterTable
ALTER TABLE "photos" DROP COLUMN "userId",
ADD COLUMN     "photographerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_photographerId_fkey" FOREIGN KEY ("photographerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
