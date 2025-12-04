import { IsString } from 'class-validator';

export class CheckTicketDto {
  @IsString()
  hash: string;
}
