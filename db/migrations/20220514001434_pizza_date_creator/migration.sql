/*
  Warnings:

  - Added the required column `createdByUUID` to the `Pizza` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pizza" ADD COLUMN     "createdByUUID" UUID NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pizzaUpdatedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Pizza" ADD CONSTRAINT "Pizza_createdByUUID_fkey" FOREIGN KEY ("createdByUUID") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
