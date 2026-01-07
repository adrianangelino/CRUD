import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { updateEventDto } from './dto/update-event.dto';
import { UserService } from '../user/user.service';
import { Events } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    public readonly userService: UserService,
  ) {}

  async createEvent(dto: CreateEventDto): Promise<Events> {
    return await this.prisma.events.create({
      data: {
        name: dto.name,
        startDate: dto.startDate,
        endDate: dto.endDate,
        deletedAt: dto.deletedAt,
        ticketTypeId: dto.ticketTypeId,
        companyId: dto.companyId,
      },
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

  async getAllEvents(companyId: number): Promise<Events[]> {
    const events = await this.prisma.events.findMany({
      where: { deletedAt: null, companyId },
    });

    const validEvents = events.filter(
      (ev) =>
        new Date(ev.startDate) <= new Date() &&
        new Date(ev.endDate) >= new Date(),
    );

    if (validEvents.length === 0) {
      throw new BadRequestException('Nenhum evento válido');
    }

    return validEvents;
  }

  async getAllEventsForClients(): Promise<Events[]> {
    return this.prisma.events.findMany({
      where: { deletedAt: null },
    });
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
