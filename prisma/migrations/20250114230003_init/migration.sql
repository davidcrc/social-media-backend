-- CreateTable
CREATE TABLE "User" (
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

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
