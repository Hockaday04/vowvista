import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import type Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const accountId = session.metadata?.accountId;

        if (accountId) {
          const supplier = await prisma.supplier.findUnique({
            where: { id: accountId },
          });

          if (supplier) {
            const price = session.amount_total?.toFixed(0);
            let tier: 'BASIC' | 'PREMIUM' | 'FEATURED' = 'BASIC';

            if (price === '2999') tier = 'PREMIUM';
            else if (price === '5999') tier = 'FEATURED';

            await prisma.supplier.update({
              where: { id: accountId },
              data: { subscriptionTier: tier },
            });
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Subscription payment succeeded:', invoice.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Subscription payment failed:', invoice.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const accountId = subscription.metadata?.accountId;

        if (accountId) {
          await prisma.supplier.update({
            where: { id: accountId },
            data: { subscriptionTier: 'FREE' },
          });
        }
        break;
      }
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
