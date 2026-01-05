/*
  Warnings:

  - Added the required column `quantity` to the `TicketType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TicketType" ADD COLUMN     "quantity" INTEGER NOT NULL;
