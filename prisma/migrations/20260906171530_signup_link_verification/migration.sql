/*
  Warnings:

  - You are about to drop the column `otpAttempts` on the `pilot_signup_requests` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpiresAt` on the `pilot_signup_requests` table. All the data in the column will be lost.
  - You are about to drop the column `otpHash` on the `pilot_signup_requests` table. All the data in the column will be lost.
  - You are about to drop the column `otpSentAt` on the `pilot_signup_requests` table. All the data in the column will be lost.
  - You are about to drop the column `otpVerified` on the `pilot_signup_requests` table. All the data in the column will be lost.
  - You are about to drop the column `otpAttempts` on the `provider_signup_requests` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpiresAt` on the `provider_signup_requests` table. All the data in the column will be lost.
  - You are about to drop the column `otpHash` on the `provider_signup_requests` table. All the data in the column will be lost.
  - You are about to drop the column `otpSentAt` on the `provider_signup_requests` table. All the data in the column will be lost.
  - You are about to drop the column `otpVerified` on the `provider_signup_requests` table. All the data in the column will be lost.
  - Added the required column `verificationExpiresAt` to the `pilot_signup_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verificationTokenHash` to the `pilot_signup_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verificationExpiresAt` to the `provider_signup_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verificationTokenHash` to the `provider_signup_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pilot_signup_requests" DROP COLUMN "otpAttempts",
DROP COLUMN "otpExpiresAt",
DROP COLUMN "otpHash",
DROP COLUMN "otpSentAt",
DROP COLUMN "otpVerified",
ADD COLUMN     "verificationExpiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verificationSentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "verificationTokenHash" TEXT NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "provider_signup_requests" DROP COLUMN "otpAttempts",
DROP COLUMN "otpExpiresAt",
DROP COLUMN "otpHash",
DROP COLUMN "otpSentAt",
DROP COLUMN "otpVerified",
ADD COLUMN     "verificationExpiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verificationSentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "verificationTokenHash" TEXT NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
