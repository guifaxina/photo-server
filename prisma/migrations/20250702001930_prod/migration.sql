-- AlterTable
ALTER TABLE "photos" ADD COLUMN     "mainPhotoId" INTEGER;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_mainPhotoId_fkey" FOREIGN KEY ("mainPhotoId") REFERENCES "photos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
