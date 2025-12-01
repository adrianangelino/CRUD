import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from '@prisma/client';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post(':id')
  async criarTask(@Body() dto: CreateTaskDto) {
    return await this.taskService.criarTask(dto);
  }

  @Get(':id')
  async buscarTask(@Param('id') id: string) {
    return this.taskService.buscarTask(Number(id));
  }

  @Patch(':id')
  async atualizarTask(
    @Param('id') id: string,
    @Body() dto: CreateTaskDto,
  ): Promise<Task> {
    return this.taskService.atualizarTask(Number(id), dto);
  }

  @Delete(':id')
  async deletarTask(@Param('id') id: string): Promise<Task> {
    return this.taskService.deletarTask(Number(id));
  }
}
