'use server';

import Stripe from 'stripe';

// Initialize Stripe (use environment variable in production)
// Note: Stripe will be undefined if secret key is not set
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
  });
}

export interface StripeCheckoutResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function createCheckoutSession(
  monthlyRate: number,
  memberIds: number[],
  householdId?: number
): Promise<StripeCheckoutResult> {
  try {
    if (!stripe || !process.env.STRIPE_SECRET_KEY) {
      return {
        success: false,
        error: 'Stripe secret key not configured. Please set STRIPE_SECRET_KEY environment variable.',
      };
    }

    // Create a recurring subscription product and price
    // In production, you would create these in Stripe Dashboard and reference them
    const product = await stripe.products.create({
      name: 'Direct Care Indy Membership',
      description: 'Monthly Direct Primary Care membership',
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: monthlyRate * 100, // Convert to cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/portal?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/join?canceled=true`,
      metadata: {
        memberIds: memberIds.join(','),
        householdId: householdId?.toString() || '',
      },
      customer_email: undefined, // Will be collected in checkout
    });

    return {
      success: true,
      url: session.url || undefined,
    };
  } catch (error) {
    console.error('Stripe checkout creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create checkout session',
    };
  }
}

