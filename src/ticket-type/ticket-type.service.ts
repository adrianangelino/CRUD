import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';
import { GetTicketTypeForName } from './dto/get-ticket-type-for-name';
import { PrismaService } from 'src/prisma/prisma.service';
import { TicketType } from '@prisma/client';
import { UserService } from '../user/user.service';

@Injectable()
export class TicketTypeService {
  constructor(
    private readonly prisma: PrismaService,
    public readonly userService: UserService,
  ) {}

  async createTicketType(dto: CreateTicketTypeDto, companyId: number): Promise<TicketType> {
    const exintingTicketType = await this.prisma.ticketType.findFirst({
      where: { name: dto.name, deletedAt: null, companyId },
    });

    if (exintingTicketType) {
      throw new BadRequestException('Já existe um ticketType com este nome nesta empresa');
    }

    return await this.prisma.ticketType.create({
      data: { ...dto, companyId },
    });
  }

  async getAllTicketType(companyId: number): Promise<TicketType[]> {
    const exintingTicketType = await this.prisma.ticketType.findMany({
      where: { deletedAt: null, companyId },
    });

    if (!exintingTicketType) {
      throw new BadRequestException('nenhum ticket Type existe');
    }

    return exintingTicketType;
  }

  async getTickTypeForName(dto: GetTicketTypeForName, companyId: number): Promise<TicketType> {
    const exintingTicketType = await this.prisma.ticketType.findFirst({
      where: { name: dto.name, deletedAt: null, companyId },
    });

    if (!exintingTicketType) {
      throw new BadRequestException('nenhum ticket Type existe para esta empresa');
    }

    return exintingTicketType;
  }

  async softDeltedTicketType(id: number) {
    const exintingTicketType = await this.prisma.ticketType.findUnique({
      where: { id },
    });

    if (!exintingTicketType) {
      throw new BadRequestException('nenhum ticket Type existe');
    }

    return await this.prisma.ticketType.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
