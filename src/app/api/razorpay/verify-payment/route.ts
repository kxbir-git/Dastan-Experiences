import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { generateBookingNumber } from '@/lib/utils';
import { Booking } from '@/types';
import { sendBookingConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required Razorpay payment credentials' },
        { status: 400 }
      );
    }

    // Server-side cryptographic signature check
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature. Payment verification failed.' },
        { status: 400 }
      );
    }

    const {
      bookingType,
      targetId,
      tierId,
      offerId,
      quantity,
      bookingDate,
      timeSlot,
      priceBreakup,
      customerDetails,
      isSocialOptedIn,
    } = bookingData;

    let eventTitle: string | undefined;
    let eventBanner: string | undefined;
    let tierName: string | undefined;
    let restaurantName: string | undefined;
    let restaurantImage: string | undefined;
    let offerTitle: string | undefined;

    if (bookingType === 'event') {
      const event = store.getEventById(targetId);
      if (event) {
        eventTitle = event.title;
        eventBanner = event.bannerUrl;
        const tier = event.ticketTiers.find((t) => t.id === tierId);
        tierName = tier?.tierName;
      }
    } else {
      const restaurant = store.getRestaurantById(targetId);
      if (restaurant) {
        restaurantName = restaurant.name;
        restaurantImage = restaurant.images[0];
        const offer = restaurant.offers.find((o) => o.id === offerId);
        offerTitle = offer?.title;
      }
    }

    const bookingNumber = generateBookingNumber();
    const qrCodeHash = `AZD-QR-${bookingNumber}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingNumber,
      userId: customerDetails?.id || 'usr-demo-customer',
      customerName: customerDetails?.name || 'Rohan Sharma',
      customerEmail: customerDetails?.email || 'rohan.sharma@example.com',
      customerPhone: customerDetails?.phone || '+91 98210 44556',
      bookingType,
      eventId: bookingType === 'event' ? targetId : undefined,
      eventTitle,
      eventBanner,
      tierId,
      tierName,
      restaurantId: bookingType === 'dining' ? targetId : undefined,
      restaurantName,
      restaurantImage,
      offerId,
      offerTitle,
      quantity,
      bookingDate: bookingDate || new Date().toISOString().split('T')[0],
      timeSlot: timeSlot || '19:30',
      baseAmount: priceBreakup.baseAmount,
      discountAmount: priceBreakup.discountAmount,
      convenienceFee: priceBreakup.convenienceFee,
      gstAmount: priceBreakup.totalGst,
      totalAmount: priceBreakup.totalAmount,
      status: 'confirmed',
      qrCodeHash,
      isSocialOptedIn: Boolean(isSocialOptedIn),
      createdAt: new Date().toISOString(),
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    };

    const result = store.createBooking(newBooking);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to complete booking inventory lock' },
        { status: 409 }
      );
    }

    // Record verified transaction in payments table
    store.recordPayment({
      id: `pay_rec_${Date.now()}`,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: newBooking.totalAmount,
      status: 'captured',
      currency: 'INR',
      customerEmail: newBooking.customerEmail,
      signature: razorpay_signature,
      createdAt: new Date().toISOString(),
    });

    // Send transactional confirmation email asynchronously
    if (result.booking) {
      sendBookingConfirmationEmail(result.booking).catch((err) =>
        console.warn('[Email] Non-blocking confirmation email error:', err)
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and booking confirmed successfully!',
      booking: result.booking,
    });
  } catch (error: any) {
    console.error('Verify Payment Error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
