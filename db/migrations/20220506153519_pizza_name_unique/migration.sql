/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Pizza` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Pizza_name_key" ON "Pizza"("name");
