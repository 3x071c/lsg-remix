/*
  Warnings:

  - The primary key for the `Page` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Page` table. All the data in the column will be lost.
  - The primary key for the `PageCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PageCategory` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Added the required column `categoryUUID` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_categoryId_fkey";

-- AlterTable
ALTER TABLE "Page" DROP CONSTRAINT "Page_pkey",
DROP COLUMN "categoryId",
DROP COLUMN "id",
ADD COLUMN     "categoryUUID" UUID NOT NULL,
ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Page_pkey" PRIMARY KEY ("uuid");

-- AlterTable
ALTER TABLE "PageCategory" DROP CONSTRAINT "PageCategory_pkey",
DROP COLUMN "id",
ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "PageCategory_pkey" PRIMARY KEY ("uuid");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("uuid");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_categoryUUID_fkey" FOREIGN KEY ("categoryUUID") REFERENCES "PageCategory"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
