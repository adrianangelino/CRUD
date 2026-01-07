export class CreateTicketDto {
  email: string;
  name: string;
  eventId: number;
  ticketTypeId: number;
  userId?: number;
  companyId?: number;
}
