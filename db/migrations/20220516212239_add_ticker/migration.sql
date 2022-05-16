-- AlterTable
ALTER TABLE "User" ADD COLUMN     "canAccessTicker" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Ticker" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content" VARCHAR(260) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUUID" UUID NOT NULL,

    CONSTRAINT "Ticker_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "Ticker" ADD CONSTRAINT "Ticker_createdByUUID_fkey" FOREIGN KEY ("createdByUUID") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
