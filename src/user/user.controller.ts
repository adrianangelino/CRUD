import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserData } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { UpdateUserData } from './dto/atualizar-user.dto';
import { ClientKafka } from '@nestjs/microservices';

@Controller('user')
export class UserController implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  @Post('criar-usuario')
  async criarUsuario(@Body() dto: UserData): Promise<User> {
    const user = await this.userService.criarUsuario(dto);

    this.kafkaClient.emit('usuario.criado', {
      value: JSON.stringify(user),
    });

    return user;
  }

  @Get('buscar-usuario')
  async buscarUsuario(@Query() dto: UserData): Promise<User> {
    return this.userService.buscarUsuario(dto);
  }

  @Patch(':id')
  async atualizarUsuario(
    @Param('id') id: string,
    @Body() dto: UpdateUserData,
  ): Promise<User> {
    return this.userService.atualizarUsuario(Number(id), dto);
  }

  @Delete(':id')
  async ExcluirUsuario(@Param('id') id: string): Promise<User> {
    return this.userService.ExcluirUsuario(Number(id));
  }
}
