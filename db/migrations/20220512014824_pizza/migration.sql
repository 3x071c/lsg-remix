-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pizzaUUID" UUID;

-- CreateTable
CREATE TABLE "Pizza" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "price" SMALLINT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pizza_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pizza_name_key" ON "Pizza"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pizzaUUID_fkey" FOREIGN KEY ("pizzaUUID") REFERENCES "Pizza"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
