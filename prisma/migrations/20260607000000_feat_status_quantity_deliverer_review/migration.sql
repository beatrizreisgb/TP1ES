-- AlterTable: add status and delivererId to Order
ALTER TABLE "Order" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'PENDENTE';
ALTER TABLE "Order" ADD COLUMN "delivererId" INTEGER;

-- AlterTable: add quantity to Product
ALTER TABLE "Product" ADD COLUMN "quantity" INTEGER NOT NULL DEFAULT 0;

-- CreateTable: Deliverer
CREATE TABLE "Deliverer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "region" TEXT NOT NULL,
    CONSTRAINT "Deliverer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Deliverer_userId_key" ON "Deliverer"("userId");

-- CreateTable: Review
CREATE TABLE "Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    CONSTRAINT "Review_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Review_orderId_key" ON "Review"("orderId");
