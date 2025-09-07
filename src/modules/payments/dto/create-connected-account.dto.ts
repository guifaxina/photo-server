import { IsEmail } from 'class-validator';

export class CreateConnectedAccountDto {
  @IsEmail()
  email: string;
}
