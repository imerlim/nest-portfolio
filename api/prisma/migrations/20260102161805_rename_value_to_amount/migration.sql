/*
  Warnings:

  - You are about to drop the column `value` on the `expense` table. All the data in the column will be lost.
  - Added the required column `amount` to the `expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "expense" DROP COLUMN "value",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;
