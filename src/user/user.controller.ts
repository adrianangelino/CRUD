import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  // Inject,
  // OnModuleInit,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { getSupabaseClient } from '../utils/auth/supabase-client';
import { UserService } from './user.service';
import { UserData } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { UpdateUserData } from './dto/atualizar-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    // @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  // async onModuleInit() {
  //   await this.kafkaClient.connect();
  // }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data?.session?.access_token) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return { access_token: data.session.access_token, user: data.user };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('criar-usuario')
  async criarUsuario(@Body() dto: UserData): Promise<User> {
    const user = await this.userService.criarUsuario(dto);

    // this.kafkaClient.emit('usuario.criado', {
    //   value: JSON.stringify(user),
    // });

    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('buscar-usuario')
  async buscarUsuario(@Query() dto: UserData): Promise<User> {
    return this.userService.buscarUsuario(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async atualizarUsuario(
    @Param('id') id: string,
    @Body() dto: UpdateUserData,
  ): Promise<User> {
    return this.userService.atualizarUsuario(Number(id), dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async ExcluirUsuario(@Param('id') id: string): Promise<User> {
    return this.userService.ExcluirUsuario(Number(id));
  }
}
