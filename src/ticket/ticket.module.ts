
import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseStorageModule } from '../utils/supabase-storage/supabase-storage.module';

@Module({
  imports: [SupabaseStorageModule],
  controllers: [TicketController],
  providers: [TicketService, PrismaService],
})
export class TicketModule {}
