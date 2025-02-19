/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserMetaData` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserMetaData" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "UserMetaData_userId_key" ON "UserMetaData"("userId");

-- AddForeignKey
ALTER TABLE "UserMetaData" ADD CONSTRAINT "UserMetaData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
