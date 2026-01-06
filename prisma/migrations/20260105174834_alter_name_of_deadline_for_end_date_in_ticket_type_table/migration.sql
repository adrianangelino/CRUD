/*
  Warnings:

  - You are about to drop the column `deadline` on the `TicketType` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `TicketType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TicketType" DROP COLUMN "deadline",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL;
