import { Inject, Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from '../dto/create-checkout.dto';
import { PaymentGatewayInterface } from '../interfaces/payment-gateway.interface';

@Injectable()
export class CreateCheckoutUseCase {
  constructor(
    @Inject('PaymentGatewayInterface')
    private readonly gateway: PaymentGatewayInterface,
  ) {}

  async execute(dto: CreateCheckoutDto) {
    return await this.gateway.createCheckoutSession(dto);
  }
}
