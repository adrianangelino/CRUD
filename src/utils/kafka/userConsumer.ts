import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { User } from '@prisma/client';

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    typeof (obj as Record<string, unknown>).id === 'number' &&
    'name' in obj &&
    typeof (obj as Record<string, unknown>).name === 'string' &&
    'email' in obj &&
    typeof (obj as Record<string, unknown>).email === 'string'
  );
}

@Controller()
export class UserConsumer {
  @MessagePattern('usuario.criado')
  handleUsuarioCriado(@Payload() message: { value: string }) {
    const parsed: unknown = JSON.parse(message.value);

    if (isUser(parsed)) {
      const user: User = parsed;
      console.log('👂 Usuário criado recebido do Kafka:', user);
    } else {
      console.error('Mensagem Kafka não é um User válido:', parsed);
    }
  }
}
