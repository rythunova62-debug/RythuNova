-- AlterTable
ALTER TABLE "pilots" ADD COLUMN "pincode" TEXT;

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "farmerName" TEXT NOT NULL,
    "farmerPhone" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "acres" REAL NOT NULL,
    "cropType" TEXT NOT NULL,
    "sprayDetails" TEXT NOT NULL,
    "scheduledAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unassigned',
    "assignedPilotId" TEXT,
    "assignedProviderId" TEXT,
    "proofVideoKey" TEXT,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "orders_assignedPilotId_fkey" FOREIGN KEY ("assignedPilotId") REFERENCES "pilots" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "orders_assignedProviderId_fkey" FOREIGN KEY ("assignedProviderId") REFERENCES "providers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "orders_assignedPilotId_idx" ON "orders"("assignedPilotId");

-- CreateIndex
CREATE INDEX "orders_assignedProviderId_idx" ON "orders"("assignedProviderId");

