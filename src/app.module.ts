import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { EventsModule } from './events/events.module';
import { TicketModule } from './ticket/ticket.module';

@Module({
  imports: [UserModule, TaskModule, EventsModule, TicketModule],
})
export class AppModule {}
