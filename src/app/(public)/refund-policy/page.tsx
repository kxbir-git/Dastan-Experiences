import React from 'react';

export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-[#18181B] bg-[#FDFBF7]">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E6DFD5] text-xs font-label-mono-sm font-bold text-[#127c56] uppercase shadow-sm">
          <span className="material-symbols-outlined text-[16px]">verified_user</span>
          <span>Transparent Guest Guarantees</span>
        </div>
        <h1 className="font-display-lg text-3xl sm:text-5xl font-bold tracking-tight text-[#18181B]">
          Cancellation &amp; Refund Policy
        </h1>
        <p className="font-label-mono-sm text-xs text-[#71717A]">Effective Date: October 2026</p>
      </div>

      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E6DFD5] shadow-sm space-y-6 text-xs sm:text-sm text-[#4e4635] leading-relaxed font-body-md">
        <section className="space-y-2">
          <h2 className="font-headline-sm text-base font-bold text-[#18181B]">1. Event Tickets Cancellation</h2>
          <p>
            Confirmed live event tickets may be cancelled up to 24 hours prior to the scheduled event start time directly via your Customer Dashboard. Upon cancellation, a full refund of the ticket face value is initiated immediately. Platform convenience fees and applicable statutory GST are non-refundable.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-headline-sm text-base font-bold text-[#18181B]">2. Dining Cover Charge Cancellations</h2>
          <p>
            Dining table cover reservations can be cancelled up to 2 hours before the booked dining slot for a 100% refund of the cover deposit amount.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-headline-sm text-base font-bold text-[#18181B]">3. Event Postponement or Cancellation by Organizer</h2>
          <p>
            If an event is cancelled by the artist or organizer, 100% of the total amount (including convenience fee and GST) is automatically credited back to your original payment method.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-headline-sm text-base font-bold text-[#18181B]">4. Refund Processing Timelines</h2>
          <p>
            All refunds are dispatched via Razorpay Refund API. Depending on your issuing bank or UPI application, funds reflect in your account within 3 to 5 business days.
          </p>
        </section>
      </div>
    </div>
  );
}
