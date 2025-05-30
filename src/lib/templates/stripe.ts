import type { StripeProduct } from '@/types/api';

export function generateStripeSetup(products: StripeProduct[]): string {
  return `import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(priceId: string, userId: string) {
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: userId,
    success_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/payment/success\`,
    cancel_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/payment/canceled\`,
  });
}`;
}

export function generateStripeWebhook(): string {
  return `import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        // Handle successful payment
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}`;
}

export function generateStripeConfig(products: StripeProduct[]): string {
  return `export const STRIPE_PRODUCTS = ${JSON.stringify(products, null, 2)};`;
} 