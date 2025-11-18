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
import { Events } from 'generated/prisma';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('/create-events')
  async createEvent(@Body() dto: CreateEventDto): Promise<Events> {
    return await this.eventsService.createEvent(dto);
  }

  // @Get()
  // findAll() {
  //   return this.eventsService.findAll();
  // }

  @Get(':id')
  async getEventById(@Param('id') id: string) {
    return await this.eventsService.getEventById(Number(id));
  }

  @Patch(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: updateEventDto,
  ): Promise<Events> {
    return await this.eventsService.updateEvent(Number(id), updateEventDto);
  }

  @Delete(':id')
  async softDeletedEvent(@Param('id') id: string): Promise<Events> {
    return await this.eventsService.softDeletedEvent(Number(id));
  }
}
