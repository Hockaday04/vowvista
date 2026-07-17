import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function createPaymentIntent(amount: number, currency: string = 'gbp') {
  return stripe.paymentIntents.create({
    amount,
    currency,
    metadata: { businessName: 'VowVista' },
  });
}

export async function createSubscription(priceId: string, customerId: string) {
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });
}
