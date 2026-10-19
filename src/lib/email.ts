import { Booking } from '@/types';
import { formatINR } from './utils';

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Generates a scannable QR code image URL using the free QR server API.
 * No external dependency needed — works in emails directly.
 */
function getQrImageUrl(data: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}&bgcolor=FFFFFF&color=18181B&qzone=2`;
}

/**
 * Generates rich HTML email with payment receipt + embedded QR gate pass
 */
export function generateBookingConfirmationHtml(booking: Booking): string {
  const targetTitle = booking.eventTitle || booking.restaurantName || 'Exclusive Experience';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const ticketUrl = `${appUrl}/customer/bookings/${booking.id}`;
  const paymentRef = booking.razorpayPaymentId || 'UPI-DIRECT';
  const isMultiDay = booking.passType === 'multi_day' && booking.dailyPasses && booking.dailyPasses.length > 1;

  // Build QR section — multi-day shows each day's QR, single-day shows main QR
  const qrSection = isMultiDay && booking.dailyPasses
    ? booking.dailyPasses.map((dp) => `
      <div style="display:inline-block; text-align:center; margin:8px; vertical-align:top;">
        <img src="${getQrImageUrl(dp.qrCodeHash)}" width="140" height="140" alt="Day ${dp.dayNumber} QR" style="border-radius:12px; border:2px solid #E6DFD5; display:block;" />
        <div style="font-size:10px; font-weight:700; color:#775a00; margin-top:6px; text-transform:uppercase; letter-spacing:1px;">${dp.dayLabel}</div>
        <div style="font-size:9px; color:#71717A; margin-top:2px;">${dp.date}</div>
        <div style="font-size:9px; color:#c59a27; margin-top:1px; font-weight:600;">ONE-TIME USE</div>
      </div>`).join('')
    : `
      <img src="${getQrImageUrl(booking.qrCodeHash)}" width="180" height="180" alt="Gate Pass QR" style="border-radius:16px; border:2px solid #E6DFD5; display:block; margin:0 auto 8px;" />
      <div style="font-size:10px; color:#71717A; font-family:monospace;">${booking.qrCodeHash}</div>`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Dastan Gate Pass</title>
</head>
<body style="margin:0; padding:0; background:#F5F0E8; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8; padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#FFFFFF; border-radius:24px; border:1px solid #E6DFD5; overflow:hidden;">

        <!-- HEADER / BRAND -->
        <tr>
          <td style="background:linear-gradient(135deg,#c59a27,#775a00); padding:28px 32px; text-align:center;">
            <div style="font-size:22px; font-weight:900; letter-spacing:4px; color:#FFFFFF;">DASTAN</div>
            <div style="font-size:10px; font-weight:700; letter-spacing:3px; color:#ffdf9a; margin-top:3px; text-transform:uppercase;">EXPERIENCES</div>
            <div style="display:inline-block; margin-top:14px; padding:6px 18px; border-radius:999px; background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.3);">
              <span style="font-size:11px; font-weight:700; color:#FFFFFF; text-transform:uppercase; letter-spacing:1px;">✅ PASS CONFIRMED</span>
            </div>
          </td>
        </tr>

        <!-- EVENT TITLE -->
        <tr>
          <td style="padding:28px 32px 0; text-align:center;">
            <div style="font-size:11px; font-weight:700; color:#775a00; text-transform:uppercase; letter-spacing:2px; margin-bottom:8px;">
              ${booking.bookingType === 'event' ? '🎫 Event Entry Pass' : '🍽️ Dining Reservation'}
            </div>
            <h1 style="margin:0; font-size:22px; font-weight:800; color:#18181B; line-height:1.3;">${targetTitle}</h1>
            <p style="margin:8px 0 0; font-size:13px; color:#775a00; font-weight:600;">${booking.tierName || booking.offerTitle || 'Confirmed Reservation'}</p>
            <p style="margin:4px 0 0; font-size:11px; color:#71717A; font-family:monospace;">Booking Ref: <strong style="color:#18181B;">${booking.bookingNumber}</strong></p>
          </td>
        </tr>

        <!-- DASHED DIVIDER -->
        <tr><td style="padding:20px 32px;">
          <div style="border-top:2px dashed #E6DFD5;"></div>
        </td></tr>

        <!-- QR GATE PASS SECTION -->
        <tr>
          <td style="padding:0 32px 24px; text-align:center;">
            <div style="font-size:11px; font-weight:700; color:#775a00; text-transform:uppercase; letter-spacing:2px; margin-bottom:16px;">
              ${isMultiDay ? '📅 Daily Gate Passes (One-Time Use Each)' : '🔐 Gate Pass QR Code'}
            </div>
            <div style="background:#FAF7F2; border-radius:16px; border:1px solid #E6DFD5; padding:20px; display:inline-block; min-width:220px;">
              ${qrSection}
              <div style="margin-top:12px; font-size:11px; color:#4e4635; font-weight:600;">
                ${isMultiDay
                  ? `${booking.dailyPasses?.length} Day Passes • Each QR is single-use only`
                  : `Admit ${booking.quantity} Guest(s) • Scan once at gate`}
              </div>
              ${isMultiDay
                ? '<div style="margin-top:4px; font-size:10px; color:#e11d48; font-weight:700;">⚠️ Each daily QR expires after one scan. Get new pass for next day.</div>'
                : ''}
            </div>
          </td>
        </tr>

        <!-- DASHED DIVIDER -->
        <tr><td style="padding:0 32px;">
          <div style="border-top:2px dashed #E6DFD5;"></div>
        </td></tr>

        <!-- BOOKING DETAILS GRID -->
        <tr>
          <td style="padding:24px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" style="padding:0 8px 16px 0;">
                  <div style="font-size:10px; color:#71717A; text-transform:uppercase; font-weight:700; letter-spacing:1px; margin-bottom:4px;">Guest Name</div>
                  <div style="font-size:14px; color:#18181B; font-weight:700;">${booking.customerName}</div>
                </td>
                <td width="50%" style="padding:0 0 16px 8px;">
                  <div style="font-size:10px; color:#71717A; text-transform:uppercase; font-weight:700; letter-spacing:1px; margin-bottom:4px;">Date</div>
                  <div style="font-size:14px; color:#18181B; font-weight:700;">${booking.bookingDate}</div>
                </td>
              </tr>
              <tr>
                <td width="50%" style="padding:0 8px 0 0;">
                  <div style="font-size:10px; color:#71717A; text-transform:uppercase; font-weight:700; letter-spacing:1px; margin-bottom:4px;">Time Slot</div>
                  <div style="font-size:14px; color:#18181B; font-weight:700;">${booking.timeSlot || '19:30'} IST</div>
                </td>
                <td width="50%" style="padding:0 0 0 8px;">
                  <div style="font-size:10px; color:#71717A; text-transform:uppercase; font-weight:700; letter-spacing:1px; margin-bottom:4px;">Admissions</div>
                  <div style="font-size:14px; color:#18181B; font-weight:700;">${booking.quantity} Guest(s)</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- PAYMENT RECEIPT -->
        <tr>
          <td style="padding:0 32px 24px;">
            <div style="background:#FAF7F2; border-radius:16px; border:1px solid #E6DFD5; padding:16px;">
              <div style="font-size:11px; font-weight:700; color:#775a00; text-transform:uppercase; letter-spacing:2px; margin-bottom:12px;">💳 Payment Receipt</div>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:12px; color:#4e4635; padding-bottom:6px;">Base Amount (${booking.quantity} × ticket)</td>
                  <td align="right" style="font-size:12px; color:#4e4635; padding-bottom:6px;">${formatINR(booking.baseAmount)}</td>
                </tr>
                ${booking.discountAmount > 0 ? `
                <tr>
                  <td style="font-size:12px; color:#127c56; padding-bottom:6px;">🎟️ Promo Discount</td>
                  <td align="right" style="font-size:12px; color:#127c56; padding-bottom:6px;">− ${formatINR(booking.discountAmount)}</td>
                </tr>` : ''}
                <tr>
                  <td style="font-size:12px; color:#71717A; padding-bottom:6px;">Platform Fee + GST</td>
                  <td align="right" style="font-size:12px; color:#71717A; padding-bottom:6px;">${formatINR(booking.convenienceFee + booking.gstAmount)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="border-top:1px solid #E6DFD5; padding-top:10px;"></td>
                </tr>
                <tr>
                  <td style="font-size:15px; font-weight:800; color:#18181B; padding-top:4px;">Total Paid</td>
                  <td align="right" style="font-size:18px; font-weight:900; color:#775a00; padding-top:4px;">${formatINR(booking.totalAmount)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="font-size:10px; color:#71717A; padding-top:8px; font-family:monospace;">Payment Ref: ${paymentRef}</td>
                </tr>
              </table>
            </div>
          </td>
        </tr>

        <!-- CTA BUTTON -->
        <tr>
          <td style="padding:0 32px 28px; text-align:center;">
            <a href="${ticketUrl}" style="display:inline-block; background:linear-gradient(135deg,#c59a27,#775a00); color:#FFFFFF; font-size:13px; font-weight:800; padding:14px 32px; border-radius:16px; text-decoration:none; letter-spacing:0.5px;">
              View Pass &amp; Full Ticket Details →
            </a>
            <p style="margin:12px 0 0; font-size:11px; color:#71717A;">
              Show this QR at the venue gate. Our team will scan and issue your wristband.
            </p>
          </td>
        </tr>

        <!-- IMPORTANT NOTE -->
        <tr>
          <td style="padding:0 32px 24px;">
            <div style="background:#FFF7ED; border-radius:12px; border:1px solid #FED7AA; padding:14px;">
              <div style="font-size:11px; font-weight:700; color:#B45309; margin-bottom:4px;">⚠️ Important — Gate Entry Policy</div>
              <div style="font-size:11px; color:#78350F; line-height:1.6;">
                ${isMultiDay
                  ? 'This is a multi-day event. Each day has its own unique QR code. Each QR is single-use and expires after scanning. For subsequent days, use the corresponding day\'s QR from your booking page.'
                  : 'This QR code is unique to your booking and is single-use only. Once scanned at the gate, it cannot be reused. Do not share or screenshot your QR publicly.'}
              </div>
            </div>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#FAF7F2; padding:20px 32px; text-align:center; border-top:1px solid #E6DFD5;">
            <div style="font-size:12px; font-weight:700; color:#775a00; letter-spacing:2px; margin-bottom:6px;">DASTAN EXPERIENCES</div>
            <div style="font-size:11px; color:#71717A; line-height:1.7;">
              Every Event Has a Story.<br>
              Dastan Experiences Pvt. Ltd. · Mumbai, India<br>
              <a href="${appUrl}" style="color:#775a00; text-decoration:none;">${appUrl}</a>
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Sends booking confirmation email via Resend (if API key present),
 * or logs to console in dev/sandbox mode.
 */
export async function sendBookingConfirmationEmail(booking: Booking): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const htmlContent = generateBookingConfirmationHtml(booking);
  const targetTitle = booking.eventTitle || booking.restaurantName || 'Experience';
  const isMultiDay = booking.passType === 'multi_day';
  const subject = `${isMultiDay ? '📅' : '🎫'} Pass Confirmed — ${booking.bookingNumber} | ${targetTitle} | Dastan Experiences`;

  if (!booking.customerEmail) {
    console.warn('[Email] No customer email — skipping send');
    return { success: false, error: 'No customer email provided' };
  }

  // Live Resend integration (only if a real, valid API key is configured)
  const isRealResendKey =
    Boolean(apiKey) &&
    apiKey!.startsWith('re_') &&
    !apiKey!.includes('your_resend_api_key') &&
    apiKey!.length > 20;

  if (isRealResendKey) {
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
          subject,
          html: htmlContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.warn('[Email] Resend API error:', errorData);
        // Fall back gracefully rather than throwing
        return { success: false, error: JSON.stringify(errorData) };
      }

      const data = await response.json();
      console.log(`[Email] ✅ Dispatched via Resend to ${booking.customerEmail} → ID: ${data.id}`);
      return { success: true, messageId: data.id };
    } catch (err: any) {
      console.error('[Email] Failed to send via Resend:', err);
      return { success: false, error: err.message };
    }
  }

  // Dev / sandbox fallback
  console.log(`\n======================================================`);
  console.log(`[EMAIL SIMULATION] Dastan Experiences — PASS CONFIRMED`);
  console.log(`To: ${booking.customerEmail} (${booking.customerName})`);
  console.log(`Subject: ${subject}`);
  console.log(`Event: ${targetTitle} — ${booking.tierName || booking.offerTitle || 'Reservation'}`);
  console.log(`Total Paid: ₹${booking.totalAmount}`);
  console.log(`QR Hash: ${booking.qrCodeHash}`);
  if (booking.dailyPasses && booking.dailyPasses.length > 1) {
    booking.dailyPasses.forEach((dp) => {
      console.log(`  Day ${dp.dayNumber} (${dp.dayLabel}): ${dp.qrCodeHash}`);
    });
  }
  console.log(`View Pass: http://localhost:3000/customer/bookings/${booking.id}`);
  console.log(`======================================================\n`);

  return { success: true, messageId: `msg_sandbox_${Date.now()}` };
}
