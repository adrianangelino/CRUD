import { Module } from '@nestjs/common';
import { AuthModule } from './utils/auth/auth.module';
import { UserModule } from './user/user.module';
import { EventsModule } from './events/events.module';
import { TicketModule } from './ticket/ticket.module';
import { RoleModule } from './role/role.module';
import { CompanyModule } from './company/company.module';
import { TicketTypeModule } from './ticket-type/ticket-type.module';

@Module({
  imports: [UserModule, EventsModule, TicketModule, AuthModule, RoleModule, CompanyModule, TicketTypeModule],
})
export class AppModule {}
