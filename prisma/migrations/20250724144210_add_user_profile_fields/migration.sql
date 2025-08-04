-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "portfolioCount" INTEGER DEFAULT 0,
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN     "reviewCount" INTEGER DEFAULT 0,
ADD COLUMN     "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[];
