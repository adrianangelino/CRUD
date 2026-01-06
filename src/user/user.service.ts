import { BadRequestException, Injectable } from '@nestjs/common';
import { UserData } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { getSupabaseClient } from '../utils/auth/supabase-client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  /**
   * Busca um usuário pelo email, incluindo o companyId. Retorna null se não encontrado.
   */
  async buscarUsuarioPorEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async criarUsuario(dto: UserData): Promise<User> {
    const existente = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existente) {
      throw new BadRequestException('Usuário já cadastrado');
    }

    // Cria usuário no Supabase Auth
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
    });
    if (error) {
      throw new BadRequestException(
        'Erro ao criar usuário no Supabase: ' + error.message,
      );
    }

    // Cria usuário no banco local
    return this.prisma.user.create({
      data: {
        ...dto,
        roleId: dto.roleId ?? 2,
      },
    });
  }

  async buscarUsuario(dto: UserData): Promise<User> {
    const buscar = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!buscar) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return buscar;
  }

  async getAllUsers(companyId: number): Promise<User[]> {
    const existingUsers = await this.prisma.user.findMany({
      where: { deletedAt: null, companyId },
      include: { role: true },
    });
    return existingUsers;
  }

  async atualizarUsuario(id: number, dto: UserData): Promise<User> {
    const atualizar = await this.prisma.user.findUnique({ where: { id } });
    if (!atualizar) {
      throw new BadRequestException('Não foi possivel atualizar o registro');
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async ExcluirUsuario(id: number): Promise<User> {
    const excluir = await this.prisma.user.findUnique({ where: { id } });
    if (!excluir) {
      throw new BadRequestException('Erro ao excluir usuário');
    }

    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
