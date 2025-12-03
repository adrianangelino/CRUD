import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Patch,
  Param,
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
  @Get(':id')
  async getEventById(@Param('id') id: string) {
    return await this.eventsService.getEventById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: updateEventDto,
  ): Promise<Events> {
    return await this.eventsService.updateEvent(Number(id), updateEventDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async softDeletedEvent(@Param('id') id: string): Promise<Events> {
    return await this.eventsService.softDeletedEvent(Number(id));
  }
}
