-- CreateTable
CREATE TABLE "Pizza" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Pizza_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PizzaOrder" (
    "id" SERIAL NOT NULL,
    "pizzaId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PizzaOrder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PizzaOrder" ADD CONSTRAINT "PizzaOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PizzaOrder" ADD CONSTRAINT "PizzaOrder_pizzaId_fkey" FOREIGN KEY ("pizzaId") REFERENCES "Pizza"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
