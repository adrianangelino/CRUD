import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { User } from 'generated/prisma';

@Controller()
export class UserConsumer {
  @MessagePattern('usuario.criado')
  handleUsuarioCriado(@Payload() message: { value: string }) {
    const parsed: unknown = JSON.parse(message.value);
    const user: User = parsed as User;
    console.log('👂 Usuário criado recebido do Kafka:', user);
  }
}
