import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-[#18181B] bg-[#FDFBF7]">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E6DFD5] text-xs font-label-mono-sm font-bold text-[#127c56] uppercase shadow-sm">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          <span>India DPDP Act Compliant</span>
        </div>
        <h1 className="font-display-lg text-3xl sm:text-5xl font-bold tracking-tight text-[#18181B]">
          Privacy Policy
        </h1>
      </div>

      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E6DFD5] shadow-sm space-y-6 text-xs sm:text-sm text-[#4e4635] leading-relaxed font-body-md">
        <p>
          Your privacy is sacred at Dastan Experiences. This policy outlines our strict commitments to how data is collected, stored, and displayed under India&apos;s Digital Personal Data Protection (DPDP) standards.
        </p>

        <h2 className="font-headline-sm text-base font-bold text-[#18181B]">1. Strict Protection in Social Discovery</h2>
        <p>
          Social Discovery is strictly opt-in. When enabled, only your first name, chosen interests, and short bio are shown to other confirmed guests booked for the exact same event or restaurant slot. Your phone number and email address are never exposed to other users under any circumstances.
        </p>

        <h2 className="font-headline-sm text-base font-bold text-[#18181B]">2. Payment Security</h2>
        <p>
          Financial credentials (card numbers, CVV, NetBanking passwords, UPI PINs) are processed directly by Razorpay on PCI-DSS Level 1 certified servers. Dastan Experiences receives only a cryptographic transaction token and verification status.
        </p>

        <h2 className="font-headline-sm text-base font-bold text-[#18181B]">3. Your Rights &amp; Data Deletion</h2>
        <p>
          You may request an export or permanent deletion of your profile data at any time by contacting privacy@dastanexperiences.com.
        </p>
      </div>
    </div>
  );
}
