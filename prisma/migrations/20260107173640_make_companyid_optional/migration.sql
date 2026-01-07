-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_companyId_fkey";

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "companyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
