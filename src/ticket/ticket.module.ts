import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseStorageModule } from '../utils/supabase-storage/supabase-storage.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [SupabaseStorageModule],
  controllers: [TicketController],
  providers: [TicketService, PrismaService, UserService],
})
export class TicketModule {}
