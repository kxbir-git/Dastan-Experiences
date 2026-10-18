import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-[#18181B] bg-[#FDFBF7]">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E6DFD5] text-xs font-label-mono-sm font-bold text-[#775a00] uppercase shadow-sm">
          <span className="material-symbols-outlined text-[16px]">gavel</span>
          <span>Legal &amp; Compliance</span>
        </div>
        <h1 className="font-display-lg text-3xl sm:text-5xl font-bold tracking-tight text-[#18181B]">
          Terms of Service
        </h1>
      </div>

      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E6DFD5] shadow-sm space-y-6 text-xs sm:text-sm text-[#4e4635] leading-relaxed font-body-md">
        <p>
          Welcome to Dastan Experiences. By accessing or using our website, services, and applications, you agree to be bound by these terms.
        </p>
        <h2 className="font-headline-sm text-base font-bold text-[#18181B]">1. Platform Service</h2>
        <p>
          Dastan Experiences is a curated multi-vendor marketplace celebrating storytelling, culture, and luxury dining by connecting guests with independent venues and event curators across India.
        </p>
        <h2 className="font-headline-sm text-base font-bold text-[#18181B]">2. Payments &amp; Razorpay</h2>
        <p>
          All electronic transactions are processed securely through RBI-licensed payment aggregator Razorpay. Dastan Experiences does not store or process payment card details directly.
        </p>
        <h2 className="font-headline-sm text-base font-bold text-[#18181B]">3. Social Discovery Guidelines</h2>
        <p>
          Users participating in Social Discovery agree to maintain respectful, civil, and lawful conduct. Harassment, solicitation, or misuse of fellow guest information is strictly prohibited and results in immediate permanent ban.
        </p>
      </div>
    </div>
  );
}
