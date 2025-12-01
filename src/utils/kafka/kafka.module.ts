import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserConsumer } from './userConsumer';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [],
          },
          consumer: {
            groupId: '',
          },
        },
      },
    ]),
  ],
  providers: [UserConsumer],
  exports: [ClientsModule],
})
export class KafkaModule {}
