export interface PaymentGatewayInterface {
  createConnectedAccount(email: string): Promise<{ accountId: string }>;
  generateOnboardingLink(accountId: string): Promise<string>;
  createCheckoutSession(data: {
    amount: number;
    connectedAccountId: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ url: string }>;
}
