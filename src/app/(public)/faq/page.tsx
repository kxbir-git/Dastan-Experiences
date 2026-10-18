import React from 'react';

export default function FAQPage() {
  const faqs = [
    {
      q: 'How does the Dastan Experiences Community Table work?',
      a: 'When booking an event pass or dining reservation, you can opt-in to our Community Discovery feature. Confirmed companions attending the exact same session can view your first name, interests, and bio. Your phone number and email are strictly hidden. You can opt out at any time.',
    },
    {
      q: 'How do I enter the venue or claim my restaurant discount?',
      a: 'Your confirmed booking generates an official digital QR pass in your Customer Dashboard. Present this pass to the gate scanner or restaurant host upon arrival.',
    },
    {
      q: 'Which payment methods are supported?',
      a: 'Through our Razorpay gateway integration, we support all major Indian UPI apps (Google Pay, PhonePe, Paytm, CRED), Credit & Debit cards (Visa, Mastercard, RuPay), and NetBanking across 50+ Indian banks.',
    },
    {
      q: 'Can I cancel or refund my booking?',
      a: 'Yes. Most event passes and dining reservations can be cancelled up to 24 hours prior to start time for an instant refund processed back to your source account via Razorpay.',
    },
    {
      q: 'How do restaurant deals work?',
      a: 'The advertised discount percentage (e.g. 25% off) applies directly to your final food & beverage bill at the restaurant. A small nominal cover deposit paid online is adjusted against your bill at the table.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-[#18181B] bg-[#FDFBF7]">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E6DFD5] text-xs font-label-mono-sm font-bold text-[#775a00] uppercase shadow-sm">
          <span className="material-symbols-outlined text-[16px]">help</span>
          <span>Knowledge &amp; Support</span>
        </div>
        <h1 className="font-display-lg text-3xl sm:text-5xl font-bold tracking-tight text-[#18181B]">
          Frequently Asked Questions
        </h1>
        <p className="font-body-md text-xs sm:text-sm text-[#4e4635]">
          Everything you need to know about booking, social tables, and entry verification.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="rounded-2xl bg-white p-6 border border-[#E6DFD5] shadow-sm space-y-2">
            <h3 className="font-headline-sm text-sm sm:text-base font-bold text-[#775a00] flex items-start gap-2">
              <span className="font-label-mono-sm text-xs text-[#c59a27]">Q{idx + 1}.</span>
              <span>{faq.q}</span>
            </h3>
            <p className="font-body-sm text-xs sm:text-sm text-[#4e4635] leading-relaxed pl-6">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
