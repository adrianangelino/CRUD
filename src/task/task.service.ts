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
      return this.prisma.task.findUnique( { where: {id } } )

  }

  async atualizarTask(id: number, dto: CreateTaskDto): Promise<Task>{
    const {title, description} = dto

    const atualizar = await this.prisma.task.findUnique({ where: { id } } )
    if(!atualizar){
      throw new BadRequestException('Não foi possivel atualizar a task')
    }

    return this.prisma.task.update({
      where: { id },
      data: { title, description }
    })
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
