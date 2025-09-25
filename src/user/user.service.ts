import { BadRequestException, Injectable } from '@nestjs/common';
import { UserData } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'generated/prisma';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async criarUsuario(dto: UserData): Promise<User> {
    const { name, email } = dto;

    const existente = await this.prisma.user.findUnique({ where: { email } });
    if (existente) {
      throw new BadRequestException('Usuário já cadastrado');
    }

    return this.prisma.user.create({
      data: {
        name,
        email,
      },
    });
  }

  async buscarUsuario(dto: UserData): Promise<User> {
    const { email } = dto;

    const buscar = await this.prisma.user.findUnique({ where: { email } });
    if (!buscar) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return buscar;
  }

  async atualizarUsuario(id: number, dto: UserData): Promise<User> {
    const { name, email } = dto;

    const atualizar = await this.prisma.user.findUnique({ where: { id } });
    if (!atualizar) {
      throw new BadRequestException('Não foi possivel atualizar o registro');
    }

    return this.prisma.user.update({
      where: { id },
      data: { name, email },
    });
  }

  async ExcluirUsuario(id: number): Promise<User> {
    const excluir = await this.prisma.user.findUnique({ where: { id } });
    if (!excluir) {
      throw new BadRequestException('Erro ao excluir usuário');
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
