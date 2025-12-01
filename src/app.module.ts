import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EventsModule } from './events/events.module';
import { TicketModule } from './ticket/ticket.module';

@Module({
  imports: [UserModule, EventsModule, TicketModule, AuthModule],
})
export class AppModule {}
