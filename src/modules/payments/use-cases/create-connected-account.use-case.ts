import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateConnectedAccountDto } from '../dto/create-connected-account.dto';
import { PaymentGatewayInterface } from '../interfaces/payment-gateway.interface';

@Injectable()
export class CreateConnectedAccountUseCase {
  constructor(
    @Inject('PaymentGatewayInterface')
    private readonly gateway: PaymentGatewayInterface,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(dto: CreateConnectedAccountDto) {
    const { accountId } = await this.gateway.createConnectedAccount(dto.email);

    //TODO: Analisar depois uma forma de invalidar o account id do usuário que não completar o onboarding;
    const onboardingUrl = await this.gateway.generateOnboardingLink(accountId);
    await this.prismaService.user.update({
      where: {
        email: dto.email,
      },
      data: {
        externalAccountId: accountId,
      },
    });
    return { accountId, onboardingUrl };
  }
}
