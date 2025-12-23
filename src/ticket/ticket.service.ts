import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseStorageService } from '../utils/supabase-storage/supabase-storage.service';
import { CheckTicketDto } from './dto/check-tickt.dto';
import PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';
import crypto from 'crypto';

@Injectable()
export class TicketService {
  constructor(
    private prisma: PrismaService,
    private supabaseStorage: SupabaseStorageService,
  ) {}

  async createTicket(dto: CreateTicketDto): Promise<Ticket> {
    const userExisting = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    const eventExinsting = await this.prisma.events.findUnique({
      where: {
        id: dto.eventId,
        deletedAt: null,
        endDate: dto.endDate,
      },
    });

    const ticketExisting = await this.prisma.ticket.findFirst({
      where: { userId: dto.userId, eventId: dto.eventId, deletedAt: null },
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
        userId: dto.userId,
        hash,
        name: dto.name,
        pdfUrl,
      },
    });
  }

  async checkTicket(dto: CheckTicketDto): Promise<Ticket> {
    const ticketExisting = await this.prisma.ticket.findFirst({
      where: { hash: dto.hash,
        event: {
          id: dto.eventId,
          deletedAt: null,
          endDate: {
            gt: new Date(),
          }
        }
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

  async getTicketById(id: number): Promise<Ticket> {
    const existingTicket = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!existingTicket) {
      throw new BadRequestException('Ticket inexistente');
    }

    return existingTicket;
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
