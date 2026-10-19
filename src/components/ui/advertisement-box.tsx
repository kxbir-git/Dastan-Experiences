'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { SponsorCampaign } from '@/types';
import { INITIAL_SPONSORS } from '@/lib/mock-data';

export interface AdvertisementProps {
  variant?: 'pill' | 'banner' | 'card' | 'sidebar' | 'bar';
  className?: string;
  onClose?: () => void;
}

export function AdvertisementBox({
  variant = 'bar',
  className = '',
  onClose,
}: AdvertisementProps) {
  const [campaigns, setCampaigns] = useState<SponsorCampaign[]>(() => {
    if (typeof store?.getActiveSponsors === 'function') {
      try {
        const active = store.getActiveSponsors();
        if (active && active.length > 0) return active;
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_SPONSORS;
  });
  const [activeIdx, setActiveIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleUpdate = () => {
      if (typeof store?.getActiveSponsors === 'function') {
        try {
          const active = store.getActiveSponsors();
          setCampaigns(active && active.length > 0 ? active : INITIAL_SPONSORS);
          return;
        } catch (e) {}
      }
      setCampaigns(INITIAL_SPONSORS);
    };

    window.addEventListener('dastan_sponsors_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('dastan_sponsors_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  if (!isVisible || campaigns.length === 0) return null;

  const campaign = campaigns[activeIdx % campaigns.length] || campaigns[0];

  // 1. FULL BAR VARIANT WITH SPONSOR IMAGE: Perfect replacement for Hero pills
  if (variant === 'bar') {
    return (
      <div className={`w-full max-w-4xl mx-auto rounded-2xl bg-white/95 backdrop-blur-xl border border-[#c59a27]/40 shadow-[0_8px_30px_rgba(119,90,0,0.08)] p-2.5 sm:p-3 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 transition-all duration-300 hover:border-[#775a00] hover:shadow-lg relative overflow-hidden group ${className}`}>
        {/* Subtle Ambient Gold Glow */}
        <div className="pointer-events-none absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-[#ffdf9a]/30 blur-2xl" />

        {/* Left Side: Real Sponsor Image from Admin Panel */}
        <div className="relative w-full sm:w-44 md:w-56 h-28 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-[#E6DFD5] shadow-xs group-hover:border-[#c59a27]/60 transition-all bg-[#FAF7F2]">
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[9px] font-label-mono-sm font-bold text-[#ffdf9a] uppercase tracking-wider flex items-center gap-1 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c59a27] animate-pulse"></span>
            <span>SPONSORED</span>
          </div>
          <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] text-white/90 font-medium truncate">
            {campaign.sponsor}
          </div>
        </div>

        {/* Center: Details & Perks */}
        <div className="flex-1 text-left space-y-1 min-w-0 w-full sm:w-auto px-1 sm:px-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[9px] font-label-mono-sm font-bold tracking-widest uppercase bg-[#775a00]/10 text-[#775a00] border border-[#775a00]/25">
              ✦ {campaign.badge || 'LUXURY PARTNER'}
            </span>
            <span className="text-[11px] font-label-mono-sm uppercase tracking-wider text-[#4e4635] font-semibold">
              {campaign.sponsor}
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-[11px] text-[#807663] font-medium hidden sm:inline">
              {campaign.tagline}
            </span>
          </div>

          <h3 className="font-headline-sm text-sm sm:text-base font-bold text-[#18181B] leading-snug line-clamp-1 group-hover:text-[#775a00] transition-colors">
            {campaign.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#775a00] font-semibold bg-[#ffdf9a]/25 border border-[#c59a27]/30 px-2.5 py-0.5 rounded-lg">
              <span className="material-symbols-outlined text-[15px] text-[#775a00]">card_membership</span>
              <span>{campaign.perk}</span>
            </span>
          </div>
        </div>

        {/* Right: CTA Button & Sponsor Switcher */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-1 sm:pt-0 border-t sm:border-t-0 border-[#E6DFD5]">
          {campaigns.length > 1 && (
            <button
              type="button"
              onClick={() => setActiveIdx((prev) => (prev + 1) % campaigns.length)}
              className="p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#efeeea] border border-[#E6DFD5] text-[#775a00] hover:text-[#18181B] transition-colors cursor-pointer shrink-0"
              title="Next Sponsor Campaign"
            >
              <span className="material-symbols-outlined text-[18px]">autorenew</span>
            </button>
          )}

          <Link
            href={campaign.ctaHref || '/events'}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#c59a27] to-[#775a00] text-white font-title-md font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md shadow-[#775a00]/20 transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>{campaign.ctaText || 'Claim Privilege'}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    );
  }

  // 1. PILL VARIANT: Directly replaces/enhances the Hero & About badge pill shown in screenshots
  if (variant === 'pill') {
    return (
      <div className={`relative inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#c59a27]/40 shadow-[0_4px_16px_rgba(119,90,0,0.1)] group transition-all duration-300 hover:border-[#775a00] hover:shadow-md ${className}`}>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c59a27] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#775a00]"></span>
        </span>
        <span className="px-1.5 py-0.5 rounded text-[9px] font-label-mono-sm font-bold bg-[#775a00]/10 text-[#775a00] uppercase tracking-wider border border-[#775a00]/20">
          SPONSORED
        </span>
        <Link
          href={campaign.ctaHref}
          className="font-label-mono-sm text-xs text-[#4e4635] tracking-wider uppercase flex items-center gap-1.5 hover:text-[#775a00] transition-colors"
        >
          <span className="text-[#18181B] font-bold">{campaign.sponsor}</span>
          <span className="text-[#d1c5af]">•</span>
          <span className="hidden sm:inline text-[#775a00] font-medium">{campaign.tagline}</span>
          <span className="material-symbols-outlined text-[15px] text-[#775a00] group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </Link>
      </div>
    );
  }

  // 2. BANNER VARIANT: Full luxury showcase advertisement card
  if (variant === 'banner') {
    return (
      <div className={`relative w-full rounded-3xl overflow-hidden bg-[#FAF7F2] border border-[#E6DFD5] shadow-[0_8px_32px_rgba(119,90,0,0.08)] group ${className}`}>
        {/* Ambient Warm Gradient Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#251a00] via-[#3a2903] to-[#1a1300] opacity-95" />
        
        {/* Decorative Luxury Lattice / Glow */}
        <div className="pointer-events-none absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#c59a27]/20 blur-[90px]" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 sm:p-8 lg:p-10 text-white">
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-label-mono-sm font-bold tracking-widest uppercase bg-[#c59a27] text-[#251a00] shadow-sm">
                ✦ {campaign.badge}
              </span>
              <span className="text-xs font-label-mono-sm uppercase tracking-wider text-[#ffdf9a] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">{campaign.logo}</span>
                {campaign.sponsor} • {campaign.tagline}
              </span>
            </div>

            <h3 className="font-display-lg text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              {campaign.title}
            </h3>

            <p className="font-body-md text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
              {campaign.description}
            </p>

            {/* Exclusive Patron Benefit Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#ffdf9a]">
              <span className="material-symbols-outlined text-[18px] text-[#ffdf9a]">card_membership</span>
              <span>{campaign.perk}</span>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href={campaign.ctaHref}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c59a27] to-[#ffdf9a] text-[#251a00] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg transition-all flex items-center gap-2"
              >
                <span>{campaign.ctaText}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>

              <button
                type="button"
                onClick={() => setActiveIdx((prev) => (prev + 1) % campaigns.length)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs text-white/90 font-medium transition-colors flex items-center gap-1.5"
                title="View next sponsored curation"
              >
                <span className="material-symbols-outlined text-[16px]">autorenew</span>
                <span>Next Sponsor ({((activeIdx % campaigns.length) + 1)}/{campaigns.length})</span>
              </button>

              <Link
                href="/contact?topic=sponsorship"
                className="text-xs text-white/60 hover:text-white underline underline-offset-4 transition-colors ml-auto sm:ml-0"
              >
                Advertise with Dastan →
              </Link>
            </div>
          </div>

          {/* Right Image Showcase Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#c59a27]/30 shadow-2xl aspect-16/10 lg:aspect-4/3 group-hover:border-[#c59a27]/60 transition-all">
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/90">
                <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10 font-label-mono-sm">
                  Verified Heritage Partner
                </span>
                <span className="text-white/70">Limited Guest Capacities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Close Button */}
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white/70 hover:text-white transition-colors cursor-pointer z-20"
          title="Dismiss sponsor spotlight"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    );
  }

  // 3. CARD VARIANT: Ideal for placing inline inside the events listing or right sidebars
  return (
    <div className={`p-6 rounded-2xl bg-white border border-[#c59a27]/40 shadow-sm hover:shadow-md transition-all space-y-3 relative overflow-hidden group ${className}`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffdf9a]/20 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-center justify-between">
        <span className="px-2 py-0.5 rounded text-[9px] font-label-mono-sm font-bold bg-[#775a00]/10 text-[#775a00] uppercase tracking-wider border border-[#775a00]/20">
          SPONSORED SHOWCASE
        </span>
        <span className="material-symbols-outlined text-[18px] text-[#775a00]">
          {campaign.logo}
        </span>
      </div>

      <div className="aspect-16/9 rounded-xl overflow-hidden relative">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-white font-medium">
          {campaign.sponsor}
        </div>
      </div>

      <h4 className="font-headline-sm text-base font-bold text-[#18181B] group-hover:text-[#775a00] transition-colors">
        {campaign.title}
      </h4>
      <p className="font-body-sm text-xs text-[#71717A] line-clamp-2 leading-relaxed">
        {campaign.description}
      </p>

      <div className="pt-1 flex items-center justify-between text-xs">
        <span className="text-[11px] text-[#775a00] font-semibold">{campaign.perk}</span>
        <Link
          href={campaign.ctaHref}
          className="font-bold text-[#775a00] hover:underline flex items-center gap-1"
        >
          <span>Reserve</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
