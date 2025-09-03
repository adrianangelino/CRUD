import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from 'generated/prisma';
import { dot } from 'node:test/reporters';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post(':id')
  async criarTask(@Param('id') id: string, @Body() dto: CreateTaskDto): Promise<Task>{
    return this.taskService.criarTask(Number(id), dto);
  } 
 
  @Get(':id')
  async buscarTask(@Param('id') id: string){
      return this.taskService.buscarTask(Number(id));
  }

  @Patch(':id')
  async atualizarTask(@Param('id') id: string, @Body() dto: CreateTaskDto): Promise<Task>{
    return this.taskService.atualizarTask(Number(id), dto)
  }
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.taskService.remove(+id);
  // }
}
