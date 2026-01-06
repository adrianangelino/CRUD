import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { TicketTypeService } from './ticket-type.service';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';
import { GetTicketTypeForName } from './dto/get-ticket-type-for-name';
import { AuthGuard } from '@nestjs/passport';
import { TicketType } from '@prisma/client';

@Controller('ticket-type')
export class TicketTypeController {
  constructor(private readonly ticketTypeService: TicketTypeService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/crate-ticketType')
  async createTicketType(@Request() req, @Body() dto: CreateTicketTypeDto): Promise<TicketType> {
    const userDb = await this.ticketTypeService.userService.buscarUsuarioPorEmail(req.user.email);
    if (!userDb) {
      throw new Error('Usuário não encontrado');
    }
    if (userDb.companyId == null) {
      throw new Error('Usuário não pertence a nenhuma empresa');
    }
    return await this.ticketTypeService.createTicketType(dto, userDb.companyId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getAllTicketType')
  async getAllTicketType(@Request() req): Promise<TicketType[]> {
    const userDb = await this.ticketTypeService.userService.buscarUsuarioPorEmail(req.user.email);
    if (!userDb) {
      throw new Error('Usuário não encontrado');
    }
    if (userDb.companyId == null) {
      throw new Error('Usuário não pertence a nenhuma empresa');
    }
    return await this.ticketTypeService.getAllTicketType(userDb.companyId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getTickTypeForName')
  async getTickTypeForName(@Request() req, @Query() dto: GetTicketTypeForName): Promise<TicketType> {
    const userDb = await this.ticketTypeService.userService.buscarUsuarioPorEmail(req.user.email);
    if (!userDb) {
      throw new Error('Usuário não encontrado');
    }
    if (userDb.companyId == null) {
      throw new Error('Usuário não pertence a nenhuma empresa');
    }
    return await this.ticketTypeService.getTickTypeForName(dto, userDb.companyId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/softDeltedTicketType/:id')
  async softDeltedTicketType(@Param('id') id: number) {
    return await this.ticketTypeService.softDeltedTicketType(Number(id));
  }
}
