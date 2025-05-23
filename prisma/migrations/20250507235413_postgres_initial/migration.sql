-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_available_idx" ON "Product"("available");
