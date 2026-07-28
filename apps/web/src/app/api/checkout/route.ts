import { NextResponse } from 'next/server';
import { CheckoutRequestSchema } from '@mediadock/validation';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CheckoutRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid checkout request payload' }, { status: 400 });
    }

    const { plan, email, userId } = parsed.data;

    // Lemon Squeezy Hosted Checkout URL generation
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;

    // Variant IDs mapped from environment or default fallbacks
    const variantMap: Record<string, string | undefined> = {
      pro_monthly: process.env.LEMONSQUEEZY_VARIANT_PRO_MONTHLY,
      pro_annual: process.env.LEMONSQUEEZY_VARIANT_PRO_ANNUAL,
      lifetime: process.env.LEMONSQUEEZY_VARIANT_LIFETIME,
    };

    const variantId = variantMap[plan];

    if (apiKey && storeId && variantId) {
      // Call Lemon Squeezy Checkout API
      const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/vnd.api+json',
          Accept: 'application/vnd.api+json',
        },
        body: JSON.stringify({
          data: {
            type: 'checkouts',
            attributes: {
              checkout_data: {
                email: email || undefined,
                custom: {
                  user_id: userId || '',
                  plan_type: plan,
                },
              },
            },
            relationships: {
              store: {
                data: {
                  type: 'stores',
                  id: storeId,
                },
              },
              variant: {
                data: {
                  type: 'variants',
                  id: variantId,
                },
              },
            },
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const checkoutUrl = json.data?.attributes?.url;
        if (checkoutUrl) {
          return NextResponse.json({ url: checkoutUrl });
        }
      }
    }

    // Fallback direct hosted checkout URL
    const fallbackUrl = `https://mediadock.lemonsqueezy.com/buy/${plan}?checkout[custom][user_id]=${encodeURIComponent(
      userId || ''
    )}`;

    return NextResponse.json({ url: fallbackUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Checkout creation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
