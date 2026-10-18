import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign In | Dastan Experiences',
  description: 'Sign in to your Dastan Experiences account to access your bookings, storytelling tables, and cultural experiences.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-[#FDFBF7] text-[#18181B]">
      {/* Brand mark */}
      <Link href="/" className="flex items-center gap-3 mb-8 group">
        <img
          src="/dastan-emblem.png"
          alt="Dastan Experiences Emblem"
          className="w-12 h-12 object-contain rounded-md shadow-sm group-hover:scale-105 transition-transform"
        />
        <div>
          <div className="font-headline-sm font-bold text-2xl tracking-wider text-[#775a00] leading-none">
            DASTAN
          </div>
          <div className="font-label-mono-sm text-[9px] text-[#4e4635] font-semibold uppercase tracking-[0.25em] leading-none mt-1">
            Storytelling • Culture • Luxury
          </div>
        </div>
      </Link>

      <div className="w-full max-w-md">{children}</div>

      <p className="font-body-sm text-xs text-[#71717A] mt-8 text-center max-w-sm leading-relaxed">
        By continuing, you agree to Dastan Experiences&apos;{' '}
        <Link href="/terms" className="text-[#775a00] font-semibold hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-[#775a00] font-semibold hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
