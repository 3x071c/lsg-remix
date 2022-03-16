/*
  Warnings:

  - You are about to drop the column `lastMutatedAt` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `lastMutatedAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Page_path_key` ON `Page`;

-- AlterTable
ALTER TABLE `Page` DROP COLUMN `lastMutatedAt`,
    DROP COLUMN `path`,
    ADD COLUMN `categoryId` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `User` DROP COLUMN `lastMutatedAt`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `PageCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(40) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Page` ADD CONSTRAINT `Page_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `PageCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
