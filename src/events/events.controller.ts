import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Patch,
  Param,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { updateEventDto } from './dto/update-event.dto';
import { Events } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/create-events')
  async createEvent(@Body() dto: CreateEventDto): Promise<Events> {
    return await this.eventsService.createEvent(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getEventById/:id')
  async getEventById(@Param('id') id: string) {
    return await this.eventsService.getEventById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getAllEvents')
  async getAllEvents(@Request() req): Promise<Events[]> {
    const userDb = await this.eventsService.userService.buscarUsuarioPorEmail(
      req.user.email,
    );
    if (!userDb) {
      throw new Error('Usuário não encontrado');
    }
    if (userDb.companyId == null) {
      throw new Error('Usuário não pertence a nenhuma empresa');
    }
    return await this.eventsService.getAllEvents(userDb.companyId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/GetAllEventsForClients')
  async getAllEventsForClients(@Request() req): Promise<Events[]> {
    const userDb = await this.eventsService.userService.buscarUsuarioPorEmail(
      req.user.email,
    );

    if (!userDb) {
      throw new BadRequestException('usuário inexistente');
    }

    if (userDb.roleId !== 2) {
      throw new BadRequestException('Este usuário não é cliente');
    }

    return await this.eventsService.getAllEventsForClients();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/updateEvent/:id')
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: updateEventDto,
  ): Promise<Events> {
    return await this.eventsService.updateEvent(Number(id), updateEventDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/softDeletedEvent/:id')
  async softDeletedEvent(@Param('id') id: string): Promise<Events> {
    return await this.eventsService.softDeletedEvent(Number(id));
  }
}
