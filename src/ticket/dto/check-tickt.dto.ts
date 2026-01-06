import { IsString } from 'class-validator';

export class CheckTicketDto {
  @IsString()
  hash: string;
  name: string;
  eventId: number;
  userId: number;
  endDate: Date;
}
