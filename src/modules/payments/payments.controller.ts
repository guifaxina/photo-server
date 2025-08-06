import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { CreateConnectedAccountDto } from './dto/create-connected-account.dto';
import { CreateCheckoutUseCase } from './use-cases/create-checkout.use-case';
import { CreateConnectedAccountUseCase } from './use-cases/create-connected-account.use-case';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly checkoutUseCase: CreateCheckoutUseCase,
    private readonly connectedAccountUseCase: CreateConnectedAccountUseCase,
  ) {}
  @Public()
  @Post('checkout')
  async createCheckout(@Body() dto: CreateCheckoutDto) {
    return await this.checkoutUseCase.execute(dto);
  }

  @Public()
  @Post('connected-account')
  async createConnectedAccount(@Body() dto: CreateConnectedAccountDto) {
    return await this.connectedAccountUseCase.execute(dto);
  }
}
