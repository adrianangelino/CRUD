import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CheckTicketDto } from './dto/check-tickt.dto';
import { getTicketUser } from './dto/get-ticket-user';

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
  @Get('/getTicketUserName/')
  async getTicketUser(@Query() dto: getTicketUser): Promise<Ticket> {
    return await this.ticketService.getTicketUser(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getAlltickets')
  async getAlltickets(@Request() req): Promise<Ticket[]> {
    const userDb = await this.ticketService.userService.buscarUsuarioPorEmail(req.user.email);
    if (!userDb) {
      throw new Error('Usuário não encontrado');
    }
    return await this.ticketService.getAlllticket(userDb.companyId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/softDeleted/:id')
  async softDeleted(@Param('id') id: number): Promise<Ticket> {
    return await this.ticketService.softDeleted(Number(id));
  }
}
