export class CreateTicketDto {
  email: string;
  name: string;
  eventId: number;
  userId: number;
  endDate: Date;
  companyId: number;
  price: number;
  deadline: Date;
  ticketTypeId: number;
}
