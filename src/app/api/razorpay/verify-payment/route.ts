import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { generateBookingNumber } from '@/lib/utils';
import { Booking, DailyPass } from '@/types';
import { sendBookingConfirmationEmail } from '@/lib/email';
import { saveBookingToSupabase, savePaymentToSupabase } from '@/lib/supabase/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Support both field naming conventions:
    // 1. Razorpay SDK response: razorpay_order_id, razorpay_payment_id, razorpay_signature
    // 2. Direct UPI / checkout-modal: orderId, paymentId, signature
    const orderId = body.razorpay_order_id || body.orderId;
    const paymentId = body.razorpay_payment_id || body.paymentId;
    const signature = body.razorpay_signature || body.signature;

    // Direct booking data (from checkout-modal UPI flow)
    const {
      bookingType,
      targetId,
      tierId,
      offerId,
      quantity,
      bookingDate,
      timeSlot,
      promoCode,
      socialOptIn,
      customerDetails,
    } = body;

    if (!orderId || !paymentId) {
      return NextResponse.json(
        { error: 'Missing payment credentials (orderId / paymentId)' },
        { status: 400 }
      );
    }

    // Verify Razorpay signature only for real Razorpay orders (not test/UPI orders)
    if (
      signature &&
      !orderId.startsWith('order_test_') &&
      !paymentId.startsWith('upi_')
    ) {
      const isValid = verifyRazorpaySignature(orderId, paymentId, signature);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid payment signature. Verification failed.' },
          { status: 400 }
        );
      }
    }

    // --- Idempotency: check if payment was already processed ---
    const existing = store.getBookings().find(
      (b) => b.razorpayPaymentId === paymentId
    );
    if (existing) {
      return NextResponse.json({ success: true, booking: existing });
    }

    // --- Resolve event / restaurant metadata ---
    let eventTitle: string | undefined;
    let eventBanner: string | undefined;
    let tierName: string | undefined;
    let restaurantName: string | undefined;
    let restaurantImage: string | undefined;
    let offerTitle: string | undefined;
    let eventObj: ReturnType<typeof store.getEventById> | undefined;

    if (bookingType === 'event') {
      eventObj = store.getEventById(targetId);
      if (eventObj) {
        eventTitle = eventObj.title;
        eventBanner = eventObj.bannerUrl;
        const tier = eventObj.ticketTiers.find((t) => t.id === tierId);
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

    // --- Compute price from store (source of truth) ---
    const settings = store.getSettings();
    let unitPrice = 0;

    if (bookingType === 'event' && eventObj) {
      const tier = eventObj.ticketTiers.find((t) => t.id === tierId);
      unitPrice = tier?.price || 0;
    } else if (bookingType === 'dining') {
      const restaurant = store.getRestaurantById(targetId);
      const offer = restaurant?.offers.find((o) => o.id === offerId);
      unitPrice = offer?.coverCharge || 0;
    }

    // Promo
    let promoDiscount = 0;
    if (promoCode) {
      const promoResult = store.validatePromoCode(promoCode, unitPrice * quantity);
      if (promoResult.valid) promoDiscount = promoResult.discountAmount;
    }

    const baseAmount = unitPrice * (quantity || 1);
    const discountedBase = Math.max(0, baseAmount - promoDiscount);
    const convenienceFee = (quantity || 1) > 0 ? settings.convenienceFeeFixed * Math.min(quantity || 1, 4) : 0;
    const gstAmount = Math.round(convenienceFee * (settings.gstPct / 100));
    const totalAmount = discountedBase + convenienceFee + gstAmount;

    // --- Generate unique booking reference & QR ---
    const bookingNumber = generateBookingNumber();
    const bookingId = `bk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const qrCodeHash = `DST-QR-${bookingNumber}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // --- Generate daily passes for multi-day events ---
    let dailyPasses: DailyPass[] | undefined;
    let passType: Booking['passType'] = undefined;

    if (bookingType === 'event' && eventObj && eventObj.daysCount && eventObj.daysCount > 1 && eventObj.eventDays) {
      passType = 'multi_day';
      dailyPasses = eventObj.eventDays.map((day) => ({
        passId: `pass-${bookingNumber}-d${day.dayNumber}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        dayNumber: day.dayNumber,
        date: day.date,
        dayLabel: day.label,
        // Each daily pass has its OWN unique QR — never shared, never reused
        qrCodeHash: `DST-DAY${day.dayNumber}-${bookingNumber}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        status: 'valid' as const,
      }));
    } else if (bookingType === 'event') {
      passType = 'single_day';
      // For single-day events, dailyPasses still gets one entry so scanner logic is consistent
      dailyPasses = [{
        passId: `pass-${bookingNumber}-d1`,
        dayNumber: 1,
        date: bookingDate || new Date().toISOString().split('T')[0],
        dayLabel: 'Event Day',
        qrCodeHash,
        status: 'valid' as const,
      }];
    }

    const newBooking: Booking = {
      id: bookingId,
      bookingNumber,
      userId: customerDetails?.id || 'usr-demo-customer',
      customerName: customerDetails?.name || 'Guest',
      customerEmail: customerDetails?.email || '',
      customerPhone: customerDetails?.phone || '',
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
      quantity: quantity || 1,
      bookingDate: bookingDate || new Date().toISOString().split('T')[0],
      timeSlot: timeSlot || '19:30',
      baseAmount,
      discountAmount: promoDiscount,
      convenienceFee,
      gstAmount,
      totalAmount,
      status: 'confirmed',
      qrCodeHash,
      isSocialOptedIn: Boolean(socialOptIn),
      createdAt: new Date().toISOString(),
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      dailyPasses,
      passType,
      totalDays: eventObj?.daysCount,
    };

    const result = store.createBooking(newBooking);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Booking creation failed — possibly sold out' },
        { status: 409 }
      );
    }

    // --- Record payment ---
    store.recordPayment({
      id: `pay_rec_${Date.now()}`,
      orderId,
      paymentId,
      amount: totalAmount,
      status: 'captured',
      currency: 'INR',
      customerEmail: newBooking.customerEmail,
      signature: signature || '',
      createdAt: new Date().toISOString(),
    });

    // --- Persist to Supabase (non-blocking) ---
    saveBookingToSupabase(newBooking).catch((err) =>
      console.warn('[Supabase] Booking insert notice:', err)
    );
    savePaymentToSupabase({
      orderId,
      paymentId,
      amount: totalAmount,
      signature: signature || '',
      status: 'captured',
    }).catch((err) =>
      console.warn('[Supabase] Payment insert notice:', err)
    );

    // --- Send confirmation email with receipt + QR link ---
    let emailResult = { success: false };
    if (result.booking && newBooking.customerEmail) {
      emailResult = await sendBookingConfirmationEmail(result.booking).catch((err) => {
        console.warn('[Email] Confirmation email error:', err);
        return { success: false, error: err.message };
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment confirmed and entry pass generated!',
      booking: result.booking,
      emailSent: emailResult.success,
      recipientEmail: newBooking.customerEmail,
    });
  } catch (error: any) {
    console.error('[verify-payment] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
