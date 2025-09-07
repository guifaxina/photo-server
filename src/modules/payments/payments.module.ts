import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { StripeAdapter } from './adapters/stripe/stripe.adapter';
import { PaymentsController } from './payments.controller';
import { CreateCheckoutUseCase } from './use-cases/create-checkout.use-case';
import { CreateConnectedAccountUseCase } from './use-cases/create-connected-account.use-case';

@Module({
  controllers: [PaymentsController],
  providers: [
    CreateCheckoutUseCase,
    CreateConnectedAccountUseCase,
    {
      provide: 'PaymentGatewayInterface',
      useClass: StripeAdapter,
    },
  ],
  exports: ['PaymentGatewayInterface'],
  imports: [PrismaModule],
})
export class PaymentsModule {}
