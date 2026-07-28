import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { customerId } = await req.json();
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;

    if (apiKey && customerId) {
      const res = await fetch(`https://api.lemonsqueezy.com/v1/customers/${customerId}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/vnd.api+json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const portalUrl = json.data?.attributes?.urls?.customer_portal;
        if (portalUrl) {
          return NextResponse.json({ url: portalUrl });
        }
      }
    }

    // Default Customer Portal link
    return NextResponse.json({ url: 'https://mediadock.lemonsqueezy.com/billing' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Billing portal request failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
