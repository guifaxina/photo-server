import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentGatewayInterface } from '../../interfaces/payment-gateway.interface';

@Injectable()
export class StripeAdapter implements PaymentGatewayInterface {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      //   apiVersion: '2023-10-16',
    });
  }

  async createConnectedAccount(email: string) {
    const account = await this.stripe.accounts.create({
      type: 'express',
      email,
    });
    return { accountId: account.id };
  }

  async generateOnboardingLink(accountId: string) {
    const link = await this.stripe.accountLinks.create({
      account: accountId,
      //TODO: Criar respectivos links/paginas conforme descrito abaixo
      /**
       * 🔄 refresh_url:
       * URL para onde o usuário será redirecionado se ele clicar em "Voltar" ou algo der errado
       * durante o processo de onboarding (ex: fechar a aba, falhar envio de dados etc.)
       *
       * 👉 Aqui você deve apontar para uma rota da sua aplicação que permita tentar o processo de novo
       * ou mostrar uma mensagem amigável, tipo: "Algo deu errado, tente novamente."
       */
      refresh_url: 'https://suaapp.com/refresh',

      /**
       * ✅ return_url:
       * URL para onde o usuário será redirecionado após completar o onboarding com sucesso.
       *
       * 👉 Aqui você deve apontar para uma tela da sua aplicação que diga algo como:
       * "Cadastro financeiro completo" ou "Conta conectada com sucesso!"
       *
       */
      return_url: 'https://suaapp.com/success',

      type: 'account_onboarding',
    });

    return link.url;
  }

  async createCheckoutSession({
    amount,
    connectedAccountId,
    successUrl,
    cancelUrl,
  }) {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: { name: 'Serviço Fotográfico' },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: Math.floor(amount * 0.1),
        transfer_data: {
          destination: connectedAccountId,
        },
      },
      //TODO: Criar respectivos links/paginas conforme descrito abaixo
      /**
       * ✅ success_url:
       * URL para onde o Stripe redireciona o usuário após o pagamento ser realizado com sucesso.
       *
       * 👉 Aqui você deve apontar para uma tela da sua aplicação que confirma a compra ou pedido finalizado.
       * Pode ser, por exemplo:
       *    ➤ /pagamento/sucesso
       *    ➤ /pedido/concluido
       *    ➤ /dashboard/confirmacao
       *
       * 💡 Dica: você pode incluir query params como ?session_id={CHECKOUT_SESSION_ID}
       * para recuperar informações do pagamento depois (ex: status, valor, comprador).
       */
      success_url: successUrl,

      /**
       * ❌ cancel_url:
       * URL para onde o usuário será redirecionado caso ele cancele o pagamento (ex: fechar ou voltar no checkout).
       *
       * 👉 Use essa URL para mostrar uma tela de "compra cancelada" ou oferecer alternativas (ex: alterar forma de pagamento).
       * Pode ser, por exemplo:
       *    ➤ /pagamento/cancelado
       *    ➤ /carrinho
       *    ➤ /tentativa-falhou
       */
      cancel_url: cancelUrl,
    });
    return { url: session.url };
  }
}
