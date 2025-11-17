import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task } from 'generated/prisma';
import { TaskStatus } from './enum/task-status';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async criarTask(dto: CreateTaskDto) {
    let userId: number | undefined;

    if (dto.email) {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        throw new BadRequestException('Usuário não encontrado');
      }

      userId = user.id;

      return this.prisma.task.create({
        data: { ...dto, userId },
      });
    }
  }

  async buscarTask(id: number) {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async atualizarTask(id: number, dto: CreateTaskDto): Promise<Task> {
    try {
      if (!dto.email) {
        throw new BadRequestException('Email do usuário é obrigatório');
      }

      const VerificaUsuario = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!VerificaUsuario) {
        throw new BadRequestException('Usuário não encontrado');
      }

      const Verificatask = await this.prisma.task.findUnique({ where: { id } });
      if (!Verificatask) {
        throw new BadRequestException('Task não encontrada ou inexistente');
      }

      let statusTarefa: TaskStatus = dto.status;

      if (dto.completed === true) {
        statusTarefa = TaskStatus.COMPLETED;
      }

      const validStatuses = Object.values(TaskStatus) as TaskStatus[];
      if (statusTarefa && !validStatuses.includes(statusTarefa)) {
        throw new BadRequestException('Status informado incorreto');
      }

      return this.prisma.task.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao atualizar tarefa');
    }
  }

  async deletarTask(id: number) {
    return this.prisma.task.delete({ where: { id } });
  }
}
