-- AlterTable
ALTER TABLE "users" ADD COLUMN "lastLoginAt" DATETIME;
ALTER TABLE "users" ADD COLUMN "lastLoginIp" TEXT;
ALTER TABLE "users" ADD COLUMN "lastLogoutAt" DATETIME;
ALTER TABLE "users" ADD COLUMN "username" TEXT;

-- CreateTable
CREATE TABLE "providers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "coverageRadiusKm" INTEGER NOT NULL DEFAULT 0,
    "totalDrones" INTEGER NOT NULL DEFAULT 0,
    "acresPerDayCapacity" INTEGER NOT NULL DEFAULT 0,
    "pricePerAcre" REAL NOT NULL DEFAULT 0,
    "bulkDiscountThreshold" INTEGER,
    "bulkDiscountPercent" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "providers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "provider_pilots" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "providerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "experienceYears" REAL NOT NULL DEFAULT 0,
    "acresSprayed" REAL NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "provider_pilots_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "provider_signup_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "otpExpiresAt" DATETIME NOT NULL,
    "otpVerified" BOOLEAN NOT NULL DEFAULT false,
    "otpSentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "otpAttempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "providers_userId_key" ON "providers"("userId");

-- CreateIndex
CREATE INDEX "provider_pilots_providerId_idx" ON "provider_pilots"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "provider_signup_requests_email_key" ON "provider_signup_requests"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

