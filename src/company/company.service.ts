import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async createCompany(dto: CreateCompanyDto) {
    return await this.prisma.company.create({
      data: {
        name: dto.name,
      },
    });
  }

  async getCompanySummaryByUserEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('Usuário não encontrado');
    if (user.companyId == null) throw new BadRequestException('Usuário não pertence a nenhuma empresa');

    // Busca tickets válidos da company
    const validTickets = await this.prisma.ticket.findMany({
      where: { companyId: user.companyId, deletedAt: null },
    });

    // Busca eventos válidos da company
    const validEvents = await this.prisma.events.findMany({
      where: { companyId: user.companyId, deletedAt: null },
    });

    // Busca dados da company
    const company = await this.prisma.company.findUnique({
      where: { id: user.companyId },
    });
    if (!company) throw new BadRequestException('Empresa não encontrada');

    const totalEvents = validEvents.length;
    const totalTickets = validTickets.length;
    // Busca todos os eventos válidos da company
    const events = await this.prisma.events.findMany({
      where: { companyId: user.companyId, deletedAt: null },
      include: { ticketType: true },
    });

    // Para cada evento, sumariza por ticketType
    const eventSummaries = await Promise.all(events.map(async (event) => {
      // Busca todos os ticketTypes do evento
      const ticketTypes = await this.prisma.ticketType.findMany({
        where: { id: event.ticketTypeId, deletedAt: null },
      });
      // Para cada ticketType, calcula limite, vendidos e total
      const ticketTypeSummaries = await Promise.all(ticketTypes.map(async (tt) => {
        // Limite de ingressos para esse tipo
        const limit = tt.quantity;
        if (user.companyId == null) throw new BadRequestException('Usuário não pertence a nenhuma empresa');
        const sold = await this.prisma.ticket.count({
          where: {
            eventId: event.id,
            ticketTypeId: tt.id,
            companyId: user.companyId!,
            deletedAt: null,
          },
        });
        // Total arrecadado
        const total = sold * tt.price;
        return {
          ticketTypeId: tt.id,
          ticketTypeName: tt.name,
          price: tt.price,
          limit,
          sold,
          total,
        };
      }));
        return {
          eventId: event.id,
          eventName: event.name,
          ticketTypes: ticketTypeSummaries,
        };
      }));

      return {
        ...company,
        totalEvents,
        totalTickets,
        events: eventSummaries,
      };
  }
}
