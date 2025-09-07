/*
  Warnings:

  - A unique constraint covering the columns `[externalAccountId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "externalAccountId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_externalAccountId_key" ON "public"."users"("externalAccountId");
