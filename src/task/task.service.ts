import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task } from 'generated/prisma';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService){}

  async criarTask(id: number, dto: CreateTaskDto): Promise<Task>{
    const { title, description } = dto

    const taskCriada = await this.prisma.task.findUnique( { where: { id } } )
    if(taskCriada){
      throw new BadRequestException('Tarefa já existente')
    }

    return this.prisma.task.create({
      data: { title, description}
    });
  }

  async buscarTask(id: number){
      return this.prisma.task.findUnique( { where: { id } } )

  }

  async atualizarTask(id: number, dto: CreateTaskDto): Promise<Task>{
    const { title, description, completed, email } = dto;

    const VerificaUsuario = await this.prisma.user.findUnique( { where: { email } } );
    if(!VerificaUsuario) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const Verificatask = await this.prisma.task.findUnique( { where: { id } } );
    if(!Verificatask){
      throw new BadRequestException('Task não encontrada ou inexistente');
    }

    return this.prisma.task.update({
      where: { id },
        data: {
          title,
          description,
          completed,
          userId: VerificaUsuario.id,
        }
    })
  }

  async deletarTask(id: number){
     return this.prisma.task.delete( { where: { id } } )
  }
  

  // findOne(id: number) {
  //   return `This action returns a #${id} task`;
  // }

  // update(id: number, updateTaskDto: UpdateTaskDto) {
  //   return `This action updates a #${id} task`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} task`;
  // }
}
