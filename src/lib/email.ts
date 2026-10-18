import { Booking } from '@/types';
import { formatINR } from './utils';

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Generates responsive luxury HTML email template for Dastan Experiences
 */
export function generateBookingConfirmationHtml(booking: Booking): string {
  const targetTitle = booking.eventTitle || booking.restaurantName || 'Exclusive Experience';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const ticketUrl = `${appUrl}/customer/bookings/${booking.id}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Dastan Experience Pass</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080C15; color: #F8FAFC; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #0F172A; border: 1px solid #1E293B; border-radius: 24px; padding: 32px; overflow: hidden; }
    .header { text-align: center; border-bottom: 1px dashed #334155; padding-bottom: 24px; margin-bottom: 24px; }
    .brand { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #FFFFFF; }
    .tagline { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #F59E0B; margin-top: 4px; font-weight: 700; }
    .badge { display: inline-block; padding: 6px 16px; border-radius: 9999px; background: rgba(16, 185, 129, 0.15); color: #34D399; font-size: 12px; font-weight: 700; border: 1px solid rgba(16, 185, 129, 0.3); margin-top: 16px; }
    .title { font-size: 22px; font-weight: 800; color: #FFFFFF; margin: 16px 0 8px 0; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; background: #080C15; padding: 16px; border-radius: 16px; border: 1px solid #1E293B; }
    .detail-label { font-size: 11px; color: #94A3B8; text-transform: uppercase; font-weight: 600; }
    .detail-val { font-size: 14px; color: #FFFFFF; font-weight: 700; margin-top: 2px; }
    .breakdown { border-top: 1px solid #1E293B; padding-top: 16px; margin-top: 24px; }
    .row { display: flex; justify-content: space-between; font-size: 13px; color: #94A3B8; margin-bottom: 8px; }
    .total-row { display: flex; justify-content: space-between; font-size: 16px; color: #FFFFFF; font-weight: 800; border-top: 1px solid #334155; padding-top: 12px; margin-top: 12px; }
    .btn { display: block; text-align: center; background: linear-gradient(135deg, #F59E0B 0%, #EA580C 100%); color: #080C15; font-weight: 800; font-size: 14px; padding: 14px 24px; border-radius: 16px; text-decoration: none; margin: 28px 0 16px 0; }
    .footer { text-align: center; font-size: 11px; color: #64748B; margin-top: 24px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="brand">DASTAN EXPERIENCES</div>
      <div class="tagline">Storytelling • Culture • Luxury</div>
      <div class="badge">CONFIRMED PASS & TAX INVOICE</div>
      <div class="title">${targetTitle}</div>
      <div style="font-size: 13px; color: #CBD5E1;">Pass #${booking.bookingNumber}</div>
    </div>

    <div class="detail-grid">
      <div>
        <div class="detail-label">Guest Name</div>
        <div class="detail-val">${booking.customerName}</div>
      </div>
      <div>
        <div class="detail-label">Date & Time</div>
        <div class="detail-val">${booking.bookingDate} · ${booking.timeSlot}</div>
      </div>
      <div>
        <div class="detail-label">Tier / Table</div>
        <div class="detail-val">${booking.tierName || booking.offerTitle || 'Confirmed Table'}</div>
      </div>
      <div>
        <div class="detail-label">Admissions</div>
        <div class="detail-val">${booking.quantity} Guest(s)</div>
      </div>
    </div>

    <div class="breakdown">
      <div class="row">
        <span>Base Amount</span>
        <span>${formatINR(booking.baseAmount)}</span>
      </div>
      ${
        booking.discountAmount > 0
          ? `<div class="row" style="color: #34D399;">
               <span>Special Promo Discount</span>
               <span>- ${formatINR(booking.discountAmount)}</span>
             </div>`
          : ''
      }
      <div class="row">
        <span>Convenience Fee</span>
        <span>${formatINR(booking.convenienceFee)}</span>
      </div>
      <div class="row">
        <span>Statutory GST (18%)</span>
        <span>${formatINR(booking.gstAmount)}</span>
      </div>
      <div class="total-row">
        <span>Total Paid via Razorpay</span>
        <span style="color: #F59E0B;">${formatINR(booking.totalAmount)}</span>
      </div>
    </div>

    <a href="${ticketUrl}" class="btn">View Digital Boarding Pass & QR Ticket</a>

    <div class="footer">
      <div>Payment ID: <code>${booking.razorpayPaymentId || 'pay_demo_test'}</code></div>
      <div>Dastan Experiences Private Limited · Mumbai, India</div>
      <div>Every event becomes a story worth remembering. Every Event Has a Story.</div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Sends booking confirmation email via Resend if API key is provided,
 * or gracefully logs to the console in development/test mode.
 */
export async function sendBookingConfirmationEmail(booking: Booking): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const htmlContent = generateBookingConfirmationHtml(booking);
  const targetTitle = booking.eventTitle || booking.restaurantName || 'Experience';

  // 1. Live Resend integration if key provided
  if (apiKey && apiKey.startsWith('re_')) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Dastan Experiences <concierge@dastanexperiences.com>',
          to: [booking.customerEmail],
          subject: `Pass Confirmed #${booking.bookingNumber} — ${targetTitle} | Dastan Experiences`,
          html: htmlContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.warn('[Email] Resend API error:', errorData);
        return { success: false, error: JSON.stringify(errorData) };
      }

      const data = await response.json();
      console.log(`[Email] Confirmation email sent successfully to ${booking.customerEmail}: ${data.id}`);
      return { success: true, messageId: data.id };
    } catch (err: any) {
      console.error('[Email] Failed to send email via Resend:', err);
      return { success: false, error: err.message };
    }
  }

  // 2. Development sandbox / test mode fallback
  console.log(`\n======================================================`);
  console.log(`[EMAIL DISPATCH SIMULATION] Dastan Experiences`);
  console.log(`To: ${booking.customerEmail} (${booking.customerName})`);
  console.log(`Subject: Pass Confirmed #${booking.bookingNumber} — ${targetTitle}`);
  console.log(`Total Paid: ${formatINR(booking.totalAmount)} via Razorpay (${booking.razorpayPaymentId || 'pay_test'})`);
  console.log(`Boarding Pass Link: http://localhost:3000/customer/bookings/${booking.id}`);
  console.log(`======================================================\n`);

  return { success: true, messageId: `msg_sandbox_${Date.now()}` };
}
