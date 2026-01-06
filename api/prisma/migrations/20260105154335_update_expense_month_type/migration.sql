/*
  Warnings:

  - Made the column `year` on table `expense` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "expense" ALTER COLUMN "year" SET NOT NULL,
ALTER COLUMN "month" SET DATA TYPE TEXT;
