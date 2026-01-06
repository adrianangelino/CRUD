export class CreateEventDto {
  name: string;
  startDate: Date;
  endDate: Date;
  deletedAt?: Date;
  companyId: number;
  ticketTypeId: number;
}
