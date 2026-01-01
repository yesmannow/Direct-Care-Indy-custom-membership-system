'use server';

// Feature flag: PAYMENTS_MODE controls whether Stripe is enabled
// Set PAYMENTS_MODE=stripe to enable Stripe, otherwise demo mode is used
const PAYMENTS_MODE = process.env.PAYMENTS_MODE || 'demo';

// Lazy load Stripe only when needed (prevents import in demo mode)
async function getStripe() {
  if (PAYMENTS_MODE !== 'stripe' || !process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  // Dynamic import to prevent Stripe from loading in demo mode
  const Stripe = (await import('stripe')).default;
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover',
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
  // Demo mode: return no-op response
  if (PAYMENTS_MODE !== 'stripe') {
    return {
      success: false,
      error: 'Payments are disabled in demo mode. Set PAYMENTS_MODE=stripe to enable Stripe.',
    };
  }

  try {
    const stripe = await getStripe();

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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/onboarding/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/join?canceled=true`,
      metadata: {
        // HIPAA Compliance: Only store internal IDs, never PHI (Date of Birth, Medical IDs, etc.)
        // Use only MemberUUID (internal member IDs) for reconciliation
        memberIds: memberIds.join(','), // Internal member IDs only - no PHI
        householdId: householdId?.toString() || '', // Internal household ID only - no PHI
        // NOTE: Do NOT include dateOfBirth, email, or any other PHI in metadata
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

