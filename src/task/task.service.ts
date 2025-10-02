import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task } from 'generated/prisma';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async criarTask(dto: CreateTaskDto): Promise<Task> {
    const { title, description, status } = dto;

    return this.prisma.task.create({
      data: { title, description, status },
    });
  }

  async buscarTask(id: number) {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async atualizarTask(id: number, dto: CreateTaskDto): Promise<Task> {
    const { title, description, completed, email, status } = dto;
    let statusTarefa = status;

    try {
      const VerificaUsuario = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!VerificaUsuario) {
        throw new BadRequestException('Usuário não encontrado');
      }

      const Verificatask = await this.prisma.task.findUnique({ where: { id } });
      if (!Verificatask) {
        throw new BadRequestException('Task não encontrada ou inexistente');
      }

      if (completed === true) {
        statusTarefa = 'completed';
      } else {
        statusTarefa = 'pending';
      }

      return this.prisma.task.update({
        where: { id },
        data: {
          title,
          description,
          completed,
          status: statusTarefa,
          userId: VerificaUsuario.id,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao buscar tarefa');
    }
  }

  async deletarTask(id: number) {
    return this.prisma.task.delete({ where: { id } });
  }
}
