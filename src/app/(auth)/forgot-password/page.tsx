'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-6">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#775a00] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Login</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DFD5] shadow-sm space-y-4">
        <h1 className="font-display-lg text-2xl font-bold text-[#18181B]">Reset Password</h1>
        <p className="font-body-md text-xs sm:text-sm text-[#4e4635]">
          Enter your registered email address and we&apos;ll send a password recovery link.
        </p>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-[#d1fae5] border border-[#127c56]/30 text-xs text-[#003b28] text-center space-y-1">
            <CheckCircle2 className="w-6 h-6 mx-auto text-[#127c56]" />
            <div className="font-bold text-sm">Recovery Link Sent</div>
            <p>Please check your email inbox to reset your password.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4 text-xs font-body-md"
          >
            <div>
              <label className="text-[#4e4635] font-semibold block mb-1 font-label-mono-sm uppercase">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl px-3 py-2.5 text-[#18181B] focus:outline-none focus:border-[#775a00]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c59a27] via-[#b8860b] to-[#775a00] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#775a00]/20 hover:shadow-[#775a00]/40 transition-all"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
