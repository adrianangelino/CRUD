import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [UserModule, TaskModule, EventsModule],
})
export class AppModule {}
