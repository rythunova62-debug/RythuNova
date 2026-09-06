-- AlterTable
ALTER TABLE "pilots" ADD COLUMN "licenceFileKey" TEXT;
ALTER TABLE "pilots" ADD COLUMN "photoFileKey" TEXT;

-- CreateTable
CREATE TABLE "pilot_signup_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "mandal" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "licenceFileKey" TEXT NOT NULL,
    "photoFileKey" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "otpExpiresAt" DATETIME NOT NULL,
    "otpVerified" BOOLEAN NOT NULL DEFAULT false,
    "otpSentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "otpAttempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "pilot_signup_requests_email_key" ON "pilot_signup_requests"("email");

