'use client';

import React from 'react';
import Link from 'next/link';
import { SUPPORTED_CITIES } from '@/lib/mock-data';

export function Footer() {
  return (
    <footer className="border-t border-[#E6DFD5] bg-[#FAF7F2] text-[#4E4635] text-sm mt-24">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-[#E6DFD5] bg-[#FFFFFF]/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FFFFFF] border border-[#E6DFD5] shadow-sm">
            <div className="p-3 rounded-xl bg-[#c59a27]/10 text-[#775a00] border border-[#c59a27]/30 shrink-0">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <div>
              <div className="text-[#18181B] font-bold text-sm">100% Curated &amp; Verified</div>
              <div className="text-xs text-[#71717A] mt-0.5">
                Handcrafted soirées with India's celebrated musicians, artists &amp; performers.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FFFFFF] border border-[#E6DFD5] shadow-sm">
            <div className="p-3 rounded-xl bg-[#4f5e81]/10 text-[#4f5e81] border border-[#4f5e81]/30 shrink-0">
              <span className="material-symbols-outlined text-[24px]">lock</span>
            </div>
            <div>
              <div className="text-[#18181B] font-bold text-sm">Razorpay Secured Checkout</div>
              <div className="text-xs text-[#71717A] mt-0.5">
                Instant encrypted UPI, Cards &amp; NetBanking with live QR passes.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FFFFFF] border border-[#E6DFD5] shadow-sm">
            <div className="p-3 rounded-xl bg-[#127c56]/10 text-[#127c56] border border-[#127c56]/30 shrink-0">
              <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
            </div>
            <div>
              <div className="text-[#18181B] font-bold text-sm">Verified QR Gate Passes</div>
              <div className="text-xs text-[#71717A] mt-0.5">
                Instant digital gate pass emailed with one-time scannable QR code security.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Contact & Concierge Support Bar */}
      <div className="border-b border-[#E6DFD5] bg-[#FFFFFF] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#127c56]/10 text-[#127c56] text-[10px] font-label-mono-sm font-bold uppercase tracking-wider border border-[#127c56]/20">
              <span className="w-2 h-2 rounded-full bg-[#127c56] animate-pulse"></span>
              Direct Contact &amp; Concierge Support
            </div>
            <h3 className="font-headline-sm text-lg sm:text-xl font-bold text-[#18181B]">
              Need help or have questions? Contact us via WhatsApp or Email
            </h3>
            <p className="text-xs text-[#71717A]">
              Our concierge team is directly accessible for booking queries, private soirées &amp; host partnerships.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* WhatsApp / Phone 1 */}
            <a
              href="https://wa.me/917830854846"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] hover:border-[#127c56] hover:bg-white text-xs font-semibold text-[#18181B] shadow-sm hover:shadow transition-all group"
            >
              <span className="w-7 h-7 rounded-lg bg-[#25D366]/15 text-[#127c56] flex items-center justify-center font-bold text-base">
                💬
              </span>
              <div className="text-left">
                <div className="text-[10px] text-[#71717A] uppercase font-bold tracking-wider group-hover:text-[#127c56] transition-colors">
                  WhatsApp &amp; Call
                </div>
                <div className="font-bold text-xs text-[#18181B]">+91 7830854846</div>
              </div>
            </a>

            {/* WhatsApp / Phone 2 */}
            <a
              href="https://wa.me/917376134786"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] hover:border-[#127c56] hover:bg-white text-xs font-semibold text-[#18181B] shadow-sm hover:shadow transition-all group"
            >
              <span className="w-7 h-7 rounded-lg bg-[#25D366]/15 text-[#127c56] flex items-center justify-center font-bold text-base">
                💬
              </span>
              <div className="text-left">
                <div className="text-[10px] text-[#71717A] uppercase font-bold tracking-wider group-hover:text-[#127c56] transition-colors">
                  WhatsApp &amp; Call
                </div>
                <div className="font-bold text-xs text-[#18181B]">+91 7376134786</div>
              </div>
            </a>

            {/* Direct Email */}
            <a
              href="mailto:kxbir.o@gmail.com"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#c59a27] to-[#775a00] text-white text-xs font-bold shadow-md hover:brightness-110 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">mail</span>
              <div className="text-left">
                <div className="text-[10px] text-white/80 uppercase font-medium tracking-wider">
                  Direct Mail
                </div>
                <div>kxbir.o@gmail.com</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/dastan-emblem.png"
              alt="Dastan Emblem"
              className="w-10 h-10 object-contain rounded-md"
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-lg font-bold text-[#775a00]">
                DASTAN EXPERIENCES
              </span>
              <span className="font-label-mono-sm text-[9px] uppercase tracking-widest text-[#71717A]">
                Storytelling • Culture • Luxury
              </span>
            </div>
          </div>
          <p className="text-xs leading-relaxed max-w-sm text-[#575249]">
            Every event becomes a story worth remembering. India's premier curated cultural soirées, live storytelling, and musical gatherings. Every Event Has a Story.
          </p>

          <div className="pt-2 flex flex-col gap-1.5 text-xs text-[#71717A]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#18181B]">Direct Inquiries:</span>
              <a href="mailto:kxbir.o@gmail.com" className="text-[#775a00] hover:underline font-medium">
                kxbir.o@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#18181B]">Hotline / WhatsApp:</span>
              <span className="text-[#4E4635]">+91 7830854846, +91 7376134786</span>
            </div>
          </div>
        </div>

        <div>
          <div className="font-title-md text-xs font-bold text-[#18181B] uppercase tracking-wider mb-4">
            Curations
          </div>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/about" className="hover:text-[#775a00] transition-colors font-medium">About Dastan</Link></li>
            <li><Link href="/events" className="hover:text-[#775a00] transition-colors">Live Concerts &amp; Jazz</Link></li>
            <li><Link href="/events" className="hover:text-[#775a00] transition-colors">Sufi &amp; Ghazal Baithaks</Link></li>
            <li><Link href="/events" className="hover:text-[#775a00] transition-colors">Intimate Comedy &amp; Satire</Link></li>
            <li><Link href="/events" className="hover:text-[#775a00] transition-colors">Secret Rooftop Soirées</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-title-md text-xs font-bold text-[#18181B] uppercase tracking-wider mb-4">
            Enclaves
          </div>
          <ul className="space-y-2.5 text-xs">
            {SUPPORTED_CITIES.slice(0, 4).map((city) => (
              <li key={city}>
                <Link href={`/events?city=${city}`} className="hover:text-[#775a00] transition-colors">
                  {city} Experiences
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-title-md text-xs font-bold text-[#18181B] uppercase tracking-wider mb-4">
            Legal &amp; Trust
          </div>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/terms" className="hover:text-[#775a00] transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-[#775a00] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/refund-policy" className="hover:text-[#775a00] transition-colors">Refund &amp; Cancellation</Link></li>
            <li><Link href="/faq" className="hover:text-[#775a00] transition-colors">Patron FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-[#775a00] transition-colors">Concierge &amp; Contact</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#E6DFD5] py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-[#71717A] max-w-7xl mx-auto">
        <div>
          © {new Date().getFullYear()} Dastan Experiences Technologies Pvt. Ltd. All rights reserved.
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span>Concierge: +91 7830854846 / +91 7376134786</span>
          <span>•</span>
          <a href="mailto:kxbir.o@gmail.com" className="text-[#775a00] hover:underline font-semibold">
            kxbir.o@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
