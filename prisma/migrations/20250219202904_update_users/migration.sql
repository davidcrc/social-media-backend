/*
  Warnings:

  - You are about to drop the column `app_metadata` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `aud` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `confirmed_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email_confirmed_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `identities` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_sign_in_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_metadata` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "app_metadata",
DROP COLUMN "aud",
DROP COLUMN "confirmed_at",
DROP COLUMN "created_at",
DROP COLUMN "email",
DROP COLUMN "email_confirmed_at",
DROP COLUMN "identities",
DROP COLUMN "last_sign_in_at",
DROP COLUMN "phone",
DROP COLUMN "role",
DROP COLUMN "updated_at",
DROP COLUMN "user_metadata",
ADD COLUMN     "address" TEXT NOT NULL DEFAULT 'address',
ADD COLUMN     "bio" TEXT NOT NULL DEFAULT 'bio',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image" TEXT NOT NULL DEFAULT 'image',
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'name',
ADD COLUMN     "phoneNumber" TEXT NOT NULL DEFAULT 'phoneNumber';

-- CreateTable
CREATE TABLE "UserMetaData" (
    "id" TEXT NOT NULL,
    "aud" TEXT NOT NULL DEFAULT 'authenticated',
    "role" TEXT NOT NULL DEFAULT 'user',
    "email" TEXT NOT NULL,
    "email_confirmed_at" TIMESTAMP(3),
    "phone" TEXT,
    "confirmed_at" TIMESTAMP(3),
    "last_sign_in_at" TIMESTAMP(3),
    "app_metadata" JSONB NOT NULL DEFAULT '{"provider":"", "providers":[]}',
    "user_metadata" JSONB NOT NULL DEFAULT '{}',
    "identities" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMetaData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMetaData_email_key" ON "UserMetaData"("email");
