/*
  Warnings:

  - You are about to drop the column `did` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_did_key";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "did",
DROP COLUMN "email";

-- CreateTable
CREATE TABLE "MagicUser" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "phoneNumber" TEXT,
    "email" TEXT,
    "did" TEXT,
    "userUUID" UUID,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MagicUser_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "MagicUser_phoneNumber_key" ON "MagicUser"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MagicUser_email_key" ON "MagicUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MagicUser_did_key" ON "MagicUser"("did");

-- AddForeignKey
ALTER TABLE "MagicUser" ADD CONSTRAINT "MagicUser_userUUID_fkey" FOREIGN KEY ("userUUID") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
