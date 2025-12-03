import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async createTicket(dto: CreateTicketDto): Promise<Ticket> {
    const eventExinsting = await this.prisma.events.findUnique({
      where: { id: dto.eventId, deletedAt: null },
    });

    const userExisting = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!eventExinsting) {
      throw new BadRequestException('Evento inexistente');
    }

    if (!userExisting) {
      throw new BadRequestException('Usuário inexistente');
    }

    const hash = crypto.randomUUID().toString();

    return await this.prisma.ticket.create({
      data: {
        eventId: dto.eventId,
        userId: dto.userId,
        hash,
        name: dto.name,
      },
    });
  }

  findAll() {
    return `This action returns all ticket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  // update(id: number, updateTicketDto: UpdateTicketDto) {
  //   return `This action updates a #${id} ticket`;
  // }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
