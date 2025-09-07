import { IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateCheckoutDto {
  @IsNumber()
  amount: number;

  @IsString()
  connectedAccountId: string;

  @IsUrl()
  successUrl: string;

  @IsUrl()
  cancelUrl: string;
}
