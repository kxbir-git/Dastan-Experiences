'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-[#18181B] bg-[#FDFBF7]">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E6DFD5] text-xs font-label-mono-sm font-bold text-[#775a00] uppercase shadow-sm">
          <span className="material-symbols-outlined text-[16px]">support_agent</span>
          <span>Dastan Protocol Concierge</span>
        </div>
        <h1 className="font-display-lg text-3xl sm:text-5xl font-bold tracking-tight text-[#18181B]">
          Concierge &amp; Patron Support
        </h1>
        <p className="font-body-md text-xs sm:text-sm text-[#4e4635] max-w-md mx-auto leading-relaxed">
          Need assistance with your booking pass, corporate dining salon, or listing your sanctuary? Our India concierge desk is available 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="rounded-2xl bg-white p-6 sm:p-8 border border-[#E6DFD5] shadow-sm space-y-6">
          <h2 className="font-headline-sm text-lg font-bold text-[#18181B]">Direct Channels</h2>

          <div className="space-y-4 text-xs font-body-md">
            <a
              href="mailto:kxbir.o@gmail.com"
              className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] hover:border-[#775a00] transition-colors"
            >
              <div className="p-2.5 rounded-lg bg-[#c59a27]/10 text-[#775a00] border border-[#c59a27]/30 shrink-0">
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </div>
              <div>
                <span className="text-[#71717A] block font-medium">Concierge Email</span>
                <span className="font-bold text-[#18181B]">kxbir.o@gmail.com</span>
              </div>
            </a>

            <div className="space-y-2">
              <a
                href="https://wa.me/917830854846"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] hover:border-[#127c56] transition-colors"
              >
                <div className="p-2.5 rounded-lg bg-[#25D366]/15 text-[#127c56] border border-[#127c56]/30 shrink-0 font-bold text-base">
                  💬
                </div>
                <div>
                  <span className="text-[#71717A] block font-medium">WhatsApp &amp; Voice 1</span>
                  <span className="font-bold text-[#18181B]">+91 7830854846</span>
                </div>
              </a>

              <a
                href="https://wa.me/917376134786"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] hover:border-[#127c56] transition-colors"
              >
                <div className="p-2.5 rounded-lg bg-[#25D366]/15 text-[#127c56] border border-[#127c56]/30 shrink-0 font-bold text-base">
                  💬
                </div>
                <div>
                  <span className="text-[#71717A] block font-medium">WhatsApp &amp; Voice 2</span>
                  <span className="font-bold text-[#18181B]">+91 7376134786</span>
                </div>
              </a>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5]">
              <div className="p-2.5 rounded-lg bg-[#127c56]/10 text-[#127c56] border border-[#127c56]/30 shrink-0">
                <span className="material-symbols-outlined text-[20px]">location_on</span>
              </div>
              <div>
                <span className="text-[#71717A] block font-medium">Headquarters</span>
                <span className="font-bold text-[#18181B]">
                  Dastan Experiences HQ, Lower Parel, Mumbai, MH 400013
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 sm:p-8 border border-[#E6DFD5] shadow-sm space-y-4">
          <h2 className="font-headline-sm text-lg font-bold text-[#18181B]">Send an Inquiry</h2>

          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <span className="material-symbols-outlined text-[36px] text-[#127c56]">
                check_circle
              </span>
              <h3 className="font-headline-sm text-base font-bold text-[#18181B]">
                Message Received by Concierge
              </h3>
              <p className="font-body-sm text-xs text-[#71717A]">
                Our concierge liaison will reach out to you within 2 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4 text-xs font-body-md"
            >
              <div className="space-y-1">
                <label className="text-[#4e4635] font-semibold">Your Full Name</label>
                <input
                  required
                  placeholder="e.g. Aanya Singhania"
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl px-3 py-2.5 text-[#18181B] focus:outline-none focus:border-[#775a00]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#4e4635] font-semibold">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="aanya@singhania.com"
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl px-3 py-2.5 text-[#18181B] focus:outline-none focus:border-[#775a00]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#4e4635] font-semibold">Message or Booking Request</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us how we may curate your evening..."
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl p-3 text-[#18181B] focus:outline-none focus:border-[#775a00]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#c59a27] to-[#775a00] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#775a00]/20 hover:shadow-[#775a00]/40 transition-all"
              >
                <span>Send to Concierge</span>
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
