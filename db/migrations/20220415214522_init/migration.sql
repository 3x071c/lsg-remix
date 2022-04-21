-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "did" VARCHAR(51) NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "firstname" VARCHAR(20) NOT NULL,
    "lastname" VARCHAR(20) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "title" VARCHAR(40) NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageCategory" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_did_key" ON "User"("did");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PageCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
