import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CheckTicketDto } from './dto/check-tickt.dto';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/create-ticket')
  async createTicket(@Body() dto: CreateTicketDto): Promise<Ticket> {
    return await this.ticketService.createTicket(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/check-ticket')
  async checkTicket(@Body() dto: CheckTicketDto): Promise<Ticket> {
    return await this.ticketService.checkTicket(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getTicketById/:id')
  async getTicketById(@Param('id') id: string): Promise<Ticket> {
    return await this.ticketService.getTicketById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/softDeleted/:id')
  async softDeleted(@Param('id') id: number): Promise<Ticket> {
    return await this.ticketService.softDeleted(Number(id));
  }
}
