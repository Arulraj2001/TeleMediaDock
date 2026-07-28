import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { LemonSqueezyWebhookSchema } from '@mediadock/validation';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature');
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    // HMAC Signature Verification
    if (webhookSecret && signature) {
      const hmac = crypto.createHmac('sha256', webhookSecret);
      const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
      const signatureBuffer = Buffer.from(signature, 'utf8');

      if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
        return NextResponse.json({ error: 'Invalid HMAC webhook signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const parsed = LemonSqueezyWebhookSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid webhook schema payload' }, { status: 400 });
    }

    const eventName = parsed.data.meta.event_name;
    const eventId = parsed.data.data.id;
    const customUserId = parsed.data.meta.custom_data?.user_id;

    // eslint-disable-next-line no-console
    console.log(`[LemonSqueezy Webhook] Received ${eventName} for event ${eventId} (user: ${customUserId})`);

    // Webhook event processing based on event name
    switch (eventName) {
      case 'subscription_created':
      case 'subscription_resumed':
        // Active subscription grant
        break;
      case 'subscription_updated':
        // Updated subscription status
        break;
      case 'subscription_cancelled':
        // Cancelled subscription (active until period ends)
        break;
      case 'subscription_expired':
        // Expired subscription downgrade
        break;
      case 'order_created':
        // One-time lifetime order purchase
        break;
    }

    return NextResponse.json({ received: true, eventName, eventId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook processing failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
