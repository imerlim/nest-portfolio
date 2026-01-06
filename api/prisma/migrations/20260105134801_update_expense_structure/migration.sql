/*
  Warnings:

  - You are about to drop the column `date` on the `expense` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "expense" DROP COLUMN "date",
ADD COLUMN     "month" TEXT,
ADD COLUMN     "year" INTEGER;
