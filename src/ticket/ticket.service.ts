import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { getTicketUser } from './dto/get-ticket-user';
import { Ticket } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseStorageService } from '../utils/supabase-storage/supabase-storage.service';
import { UserService } from '../user/user.service';
import { CheckTicketDto } from './dto/check-tickt.dto';
import PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';
import crypto from 'crypto';

@Injectable()
export class TicketService {
  constructor(
    private prisma: PrismaService,
    private supabaseStorage: SupabaseStorageService,
    public readonly userService: UserService,
  ) {}

  async createTicket(
    dto: CreateTicketDto,
    userId: number,
    companyId: number,
  ): Promise<Ticket> {
    // Busca o ticketType para validar o limite
    const ticketType = await this.prisma.ticketType.findUnique({
      where: { id: dto.ticketTypeId },
    });
    if (!ticketType) {
      throw new BadRequestException('Tipo de ticket inexistente');
    }

    const count = await this.prisma.ticket.count({
      where: { ticketTypeId: dto.ticketTypeId, deletedAt: null },
    });

    if (count >= ticketType.quantity) {
      throw new BadRequestException(
        'Limite de tickets para este tipo atingido',
      );
    }

    // Busca usuário e evento normalmente
    const userExisting = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    const eventExinsting = await this.prisma.events.findUnique({
      where: {
        id: dto.eventId,
        deletedAt: null,
      },
    });
    const ticketExisting = await this.prisma.ticket.findFirst({
      where: { userId, eventId: dto.eventId, deletedAt: null },
    });
    if (!userExisting) {
      throw new BadRequestException('Usuário inexistente');
    }
    if (!eventExinsting) {
      throw new BadRequestException('Evento inexistente');
    }
    if (eventExinsting.endDate < new Date()) {
      throw new BadRequestException('Evento Expirado');
    }
    if (ticketExisting) {
      throw new BadRequestException(
        'Esse usuário já possui um ticket para este evento',
      );
    }

    const hash = crypto.randomUUID();
    const qrCodeDataUrl: string = await QRCode.toDataURL(hash);
    const doc = new PDFDocument({ size: 'A6' });
    const buffers: Buffer[] = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    const pdfBufferPromise = new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });
    doc.image(qrCodeDataUrl, doc.page.width / 2 - 85, 80, {
      fit: [170, 170],
      align: 'center',
    });
    doc.moveDown(2);
    doc.fontSize(22);
    const textWidth = doc.widthOfString(dto.name);
    const x = (doc.page.width - textWidth) / 2;
    doc.text(dto.name, x, 270);
    doc.end();
    const pdfBuffer = await pdfBufferPromise;
    const pdfUrl = await this.supabaseStorage.uploadTicketOfPdf(
      'ticket',
      `${hash}.pdf`,
      pdfBuffer,
    );
    return await this.prisma.ticket.create({
      data: {
        eventId: dto.eventId,
        userId,
        hash,
        name: dto.name,
        pdfUrl,
        companyId,
        ticketTypeId: dto.ticketTypeId,
      },
    });
  }

  async checkTicket(dto: CheckTicketDto): Promise<Ticket> {
    const ticketExisting = await this.prisma.ticket.findFirst({
      where: {
        hash: dto.hash,
        event: {
          id: dto.eventId,
          deletedAt: null,
          endDate: {
            gt: new Date(),
          },
        },
      },
    });

    if (!ticketExisting) {
      throw new BadRequestException('Ticket não encontrado');
    }

    return await this.prisma.ticket.update({
      where: { id: ticketExisting.id },
      data: { status: 'valid' },
    });
  }

  async getTicketUser(dto: getTicketUser): Promise<Ticket> {
    const existingTicket = await this.prisma.ticket.findFirst({
      where: { name: dto.name, deletedAt: null },
    });

    if (!existingTicket) {
      throw new BadRequestException('Ticket inexistente');
    }

    return existingTicket;
  }

  async getAllEventTicketSummaries(companyId: number) {
    // Busca todos os eventos da company
    const events = await this.prisma.events.findMany({
      where: { companyId, deletedAt: null },
      include: { ticketType: true },
    });
    // Para cada evento, calcula o resumo
    const summaries = await Promise.all(
      events.map(async (event) => {
        const totalTickets = await this.prisma.ticket.count({
          where: { eventId: event.id, companyId, deletedAt: null },
        });
        const tickets = await this.prisma.ticket.findMany({
          where: { eventId: event.id, companyId, deletedAt: null },
          include: { ticketType: true },
        });
        const totalPrice = tickets.reduce(
          (sum, t) => sum + (t.ticketType?.price ?? 0),
          0,
        );
        return {
          eventName: event.name,
          eventId: event.id,
          totalTickets,
          totalPrice,
        };
      }),
    );
    return summaries;
  }

  async getAlllticket(companyId: number): Promise<Ticket[]> {
    return await this.prisma.ticket.findMany({
      where: { deletedAt: null, companyId },
    });
  }

  async softDeleted(id: number): Promise<Ticket> {
    const existingTicket = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!existingTicket) {
      throw new BadGatewayException('Este ticket não existe');
    }

    return await this.prisma.ticket.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
