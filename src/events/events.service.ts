import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { updateEventDto } from './dto/update-event.dto';
import { Events } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(dto: CreateEventDto): Promise<Events> {
    return await this.prisma.events.create({
      data: dto,
    });
  }

  async getEventById(id: number): Promise<Events> {
    const event = await this.prisma.events.findUnique({
      where: { id, deletedAt: null },
    });

    if (!event) {
      throw new BadRequestException('Inexistente');
    }

    if (event.endDate < new Date()) {
      throw new BadRequestException('Evento Expirado');
    }

    if (event.startDate > new Date()) {
      throw new BadRequestException('Evento não iniciado');
    }

    return event;
  }

  async updateEvent(id: number, dto: updateEventDto): Promise<Events> {
    const event = await this.prisma.events.findUnique({
      where: { id },
    });

    if (!event) {
      throw new BadRequestException('Evento inexistente');
    }

    return await this.prisma.events.update({
      where: { id },
      data: dto,
    });
  }

  async softDeletedEvent(id: number): Promise<Events> {
    const event = await this.prisma.events.findUnique({ where: { id } });

    if (!event) {
      throw new BadRequestException('Erro ao excluir evento');
    }
    return this.prisma.events.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
