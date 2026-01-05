import { Module } from '@nestjs/common';
import { TicketTypeService } from './ticket-type.service';
import { TicketTypeController } from './ticket-type.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [TicketTypeController],
  providers: [TicketTypeService, PrismaService, UserService],
})
export class TicketTypeModule {}
