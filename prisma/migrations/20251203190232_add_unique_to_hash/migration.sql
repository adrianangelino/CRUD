/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ticket_hash_key" ON "Ticket"("hash");
