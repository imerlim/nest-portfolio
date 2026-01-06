/*
  Warnings:

  - The `month` column on the `expense` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "expense" DROP COLUMN "month",
ADD COLUMN     "month" INTEGER;
