import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { getSupabaseClient } from '../utils/auth/supabase-client';
import { UserService } from './user.service';
import { UserData } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { UpdateUserData } from './dto/atualizar-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
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

  // @UseGuards(AuthGuard('jwt'))
  @Post('/criar-usuario')
  async criarUsuario(@Body() dto: UserData): Promise<User> {
    const user = await this.userService.criarUsuario(dto);
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/buscar-usuario')
  async buscarUsuario(@Query() dto: UserData): Promise<User> {
    return this.userService.buscarUsuario(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getAllUsers')
  async getAllUsers(@Request() req): Promise<User[]> {
    return await this.userService.getAllUsers(req.user.companyId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/atualizarUsuario/:id')
  async atualizarUsuario(
    @Param('id') id: string,
    @Body() dto: UpdateUserData,
  ): Promise<User> {
    return this.userService.atualizarUsuario(Number(id), dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/ExcluirUsuario/:id')
  async ExcluirUsuario(@Param('id') id: string): Promise<User> {
    return this.userService.ExcluirUsuario(Number(id));
  }
}
