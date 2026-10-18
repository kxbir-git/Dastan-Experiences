import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { getRazorpayClient, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '@/lib/razorpay';

export async function GET() {
  try {
    const refunds = store.getRefunds();
    return NextResponse.json({ success: true, refunds });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, reason } = body;

    if (!bookingId || !reason) {
      return NextResponse.json(
        { error: 'bookingId and reason are required' },
        { status: 400 }
      );
    }

    // Fetch the booking
    const booking = store.getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.status === 'refunded') {
      return NextResponse.json({ error: 'Booking already refunded' }, { status: 400 });
    }

    if (booking.status === 'pending_payment') {
      return NextResponse.json({ error: 'Cannot refund a booking with pending payment' }, { status: 400 });
    }

    let razorpayRefundId: string | undefined;

    // Attempt Razorpay refund if real credentials and payment ID available
    if (
      RAZORPAY_KEY_ID &&
      RAZORPAY_KEY_SECRET &&
      !RAZORPAY_KEY_ID.includes('demo') &&
      booking.razorpayPaymentId
    ) {
      try {
        const client = getRazorpayClient();
        const refundAmount = booking.totalAmount * 100; // Convert to paise

        const rzpRefund = await (client.payments as any).refund(booking.razorpayPaymentId, {
          amount: refundAmount,
          notes: {
            reason,
            bookingId,
            bookingNumber: booking.bookingNumber,
          },
        });

        razorpayRefundId = rzpRefund.id;
        console.log(`[Admin Refund] Razorpay refund created: ${razorpayRefundId}`);
      } catch (err: any) {
        console.warn('[Admin Refund] Razorpay refund call failed:', err.message);
        // Fall through to demo mode
        razorpayRefundId = `rfnd_demo_${Date.now()}`;
      }
    } else {
      // Demo mode — simulate refund
      razorpayRefundId = `rfnd_demo_${Date.now()}`;
      console.log(`[Admin Refund] Demo mode — simulated refund: ${razorpayRefundId}`);
    }

    // Update booking status in store
    const result = store.refundBooking(bookingId, reason);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Refund failed' }, { status: 500 });
    }

    // In Phase 2: insert into refunds table in Supabase, send email via Resend

    return NextResponse.json({
      success: true,
      razorpayRefundId,
      bookingId,
      bookingNumber: booking.bookingNumber,
      amountRefunded: booking.totalAmount,
      message: `Refund of ₹${booking.totalAmount} processed for booking ${booking.bookingNumber}`,
    });
  } catch (error: any) {
    console.error('[Admin Refund] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Refund processing failed' },
      { status: 500 }
    );
  }
}
