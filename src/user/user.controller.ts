import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserData } from './dto/create-user.dto';
import { User } from 'generated/prisma';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('criar-usuario')
  async criarUsuario(@Body() dto: UserData): Promise<User>{
    return this.userService.criarUsuario(dto);
  }

  @Get('buscar-usuario')
  async buscarUsuario(@Query() dto: UserData): Promise<User>{
    return this.userService.buscarUsuario(dto);
  }

  @Patch(':id')
  async atualizarUsuario(@Param('id') id: string, @Body() dto: UserData): Promise<User>{
    return this.userService.atualizarUsuario(Number(id), dto);
  }

  @Delete(':id')
  async ExcluirUsuario(@Param('id') id: string, @Body() dto: UserData): Promise<User>{
    return this.userService.ExcluirUsuario(Number(id), dto);
  }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

}
