import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { store } from '@/lib/store';

// Set of processed event IDs to guarantee idempotency
const processedWebhookEvents = new Set<string>();

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing x-razorpay-signature header' },
        { status: 400 }
      );
    }

    // Verify cryptographic webhook authenticity
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || payload.payload?.payment?.entity?.id || String(Date.now());

    // Idempotency check: prevent duplicate handling of the same webhook payload
    if (processedWebhookEvents.has(eventId)) {
      return NextResponse.json({ status: 'already_processed' }, { status: 200 });
    }
    processedWebhookEvents.add(eventId);

    const eventType = payload.event;

    switch (eventType) {
      case 'payment.captured': {
        const payment = payload.payload.payment.entity;
        const orderId = payment.order_id;
        console.log(`[Webhook] Payment captured: ${payment.id} for order ${orderId}`);

        // Update payment table record
        store.recordPayment({
          id: `pay_rec_${payment.id}`,
          orderId,
          paymentId: payment.id,
          amount: Math.round(payment.amount / 100),
          status: 'captured',
          currency: payment.currency || 'INR',
          method: payment.method,
          customerEmail: payment.email,
          createdAt: new Date().toISOString(),
        });

        // Sync booking if found
        const allBookings = store.getBookings();
        const booking = allBookings.find(
          (b) => b.razorpayOrderId === orderId || b.razorpayPaymentId === payment.id
        );
        if (booking && booking.status !== 'confirmed') {
          booking.status = 'confirmed';
          booking.razorpayPaymentId = payment.id;
        }
        break;
      }

      case 'payment.failed': {
        const payment = payload.payload.payment.entity;
        console.warn(`[Webhook] Payment failed: ${payment.id}, reason: ${payment.error_description}`);

        store.recordPayment({
          id: `pay_rec_${payment.id}`,
          orderId: payment.order_id,
          paymentId: payment.id,
          amount: Math.round(payment.amount / 100),
          status: 'failed',
          currency: payment.currency || 'INR',
          method: payment.method,
          customerEmail: payment.email,
          createdAt: new Date().toISOString(),
        });
        break;
      }

      case 'refund.processed': {
        const refund = payload.payload.refund.entity;
        const paymentId = refund.payment_id;
        console.log(`[Webhook] Refund processed: ${refund.id} on payment ${paymentId}`);

        const allBookings = store.getBookings();
        const booking = allBookings.find((b) => b.razorpayPaymentId === paymentId);
        if (booking && booking.status !== 'refunded') {
          store.refundBooking(booking.id, 'Webhook refund.processed');
        }
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event received: ${eventType}`);
    }

    return NextResponse.json({ status: 'success', event: eventType });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
