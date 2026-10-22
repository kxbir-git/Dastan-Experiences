'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [showPopup, setShowPopup] = useState(false);
  const [popupCampaign, setPopupCampaign] = useState<SponsorCampaign | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Auto-rotate every 4 seconds
  const startAutoRotate = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (campaigns.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIdx((prev) => (prev + 1) % campaigns.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);
  }, [campaigns.length]);

  useEffect(() => {
    startAutoRotate();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoRotate]);

  // Pause auto-rotate on popup open
  useEffect(() => {
    if (showPopup) {
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      startAutoRotate();
    }
  }, [showPopup, startAutoRotate]);

  // Close popup on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowPopup(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showPopup]);

  const handleAdClick = (campaign: SponsorCampaign) => {
    setPopupCampaign(campaign);
    setShowPopup(true);
  };

  const handleDotClick = (idx: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setIsTransitioning(false);
    }, 300);
    // Reset auto-rotate timer
    startAutoRotate();
  };

  if (!isVisible || campaigns.length === 0) return null;

  const campaign = campaigns[activeIdx % campaigns.length] || campaigns[0];

  // ─── POPUP MODAL (shared across all variants) ───
  const PopupModal = () => {
    if (!showPopup || !popupCampaign) return null;
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        onClick={() => setShowPopup(false)}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

        {/* Modal Content */}
        <div
          className="relative w-full max-w-lg rounded-3xl overflow-hidden bg-white shadow-2xl border border-[#E6DFD5] animate-[popIn_0.3s_ease-out]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white/90 hover:text-white transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>

          {/* Image Section */}
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <img
              src={popupCampaign.image}
              alt={popupCampaign.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-label-mono-sm font-bold tracking-widest uppercase bg-[#c59a27] text-[#251a00] shadow-sm">
                ✦ {popupCampaign.badge || 'LUXURY PARTNER'}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-4">
            {/* Sponsor Info */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#ffdf9a]/40 border border-[#c59a27]/30 flex items-center justify-center text-[#775a00]">
                <span className="material-symbols-outlined text-[22px]">{popupCampaign.logo}</span>
              </div>
              <div>
                <div className="font-label-mono-sm text-[11px] uppercase tracking-wider text-[#775a00] font-bold">
                  {popupCampaign.sponsor}
                </div>
                <div className="text-[11px] text-[#807663]">{popupCampaign.tagline}</div>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="font-headline-sm text-xl font-bold text-[#18181B] leading-snug">
              {popupCampaign.title}
            </h3>
            <p className="font-body-md text-sm text-[#4e4635] leading-relaxed">
              {popupCampaign.description}
            </p>

            {/* Perk Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#ffdf9a]/20 border border-[#c59a27]/30 text-sm text-[#775a00] font-medium">
              <span className="material-symbols-outlined text-[18px] text-[#c59a27]">card_membership</span>
              <span>{popupCampaign.perk}</span>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                href={popupCampaign.ctaHref || '/events'}
                onClick={() => setShowPopup(false)}
                className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-[#c59a27] to-[#775a00] text-white font-bold text-sm uppercase tracking-wider text-center hover:brightness-110 shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>{popupCampaign.ctaText || 'Explore Now'}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-sm text-[#4e4635] font-medium hover:bg-[#efeeea] transition-colors cursor-pointer"
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── DOT INDICATORS ───
  const DotIndicators = ({ light = false }: { light?: boolean }) => {
    if (campaigns.length <= 1) return null;
    return (
      <div className="flex items-center gap-1.5 justify-center">
        {campaigns.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDotClick(idx);
            }}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              idx === activeIdx % campaigns.length
                ? `w-5 h-2 ${light ? 'bg-[#ffdf9a]' : 'bg-[#c59a27]'}`
                : `w-2 h-2 ${light ? 'bg-white/40 hover:bg-white/60' : 'bg-[#d1c5af] hover:bg-[#807663]'}`
            }`}
            aria-label={`Go to sponsor ${idx + 1}`}
          />
        ))}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════
  // 1. BAR VARIANT — Image-only carousel with click to open popup
  // ═══════════════════════════════════════════════════
  if (variant === 'bar') {
    return (
      <>
        <PopupModal />
        <div className={`w-full max-w-4xl mx-auto ${className}`}>
          <div
            className="relative rounded-2xl overflow-hidden border border-[#c59a27]/30 shadow-[0_8px_30px_rgba(119,90,0,0.08)] cursor-pointer group hover:border-[#775a00] hover:shadow-lg transition-all duration-300"
            onClick={() => handleAdClick(campaign)}
          >
            {/* Image Only */}
            <div className={`relative w-full h-32 sm:h-40 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

              {/* SPONSORED Badge */}
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm text-[9px] font-label-mono-sm font-bold text-[#ffdf9a] uppercase tracking-wider flex items-center gap-1.5 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c59a27] animate-pulse"></span>
                <span>SPONSORED</span>
              </div>
            </div>

            {/* Dot Indicators at the bottom */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10">
              <DotIndicators light />
            </div>
          </div>
        </div>
      </>
    );
  }

  // ═══════════════════════════════════════════════════
  // 2. BANNER VARIANT — Image-only carousel banner with click popup
  // ═══════════════════════════════════════════════════
  if (variant === 'banner') {
    return (
      <>
        <PopupModal />
        <div className={`relative w-full rounded-3xl overflow-hidden border border-[#E6DFD5] shadow-[0_8px_32px_rgba(119,90,0,0.08)] cursor-pointer group ${className}`}
          onClick={() => handleAdClick(campaign)}
        >
          {/* Full Image Only */}
          <div className={`relative w-full h-48 sm:h-64 lg:h-72 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            {/* SPONSORED Badge */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-label-mono-sm font-bold tracking-widest uppercase bg-[#c59a27] text-[#251a00] shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#251a00] animate-pulse"></span>
              ✦ SPONSORED
            </div>

            {/* Dot Indicators at bottom */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
              <DotIndicators light />
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
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
      </>
    );
  }

  // ═══════════════════════════════════════════════════
  // 3. PILL VARIANT
  // ═══════════════════════════════════════════════════
  if (variant === 'pill') {
    return (
      <>
        <PopupModal />
        <div
          className={`relative inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#c59a27]/40 shadow-[0_4px_16px_rgba(119,90,0,0.1)] group transition-all duration-300 hover:border-[#775a00] hover:shadow-md cursor-pointer ${className}`}
          onClick={() => handleAdClick(campaign)}
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c59a27] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#775a00]"></span>
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-label-mono-sm font-bold bg-[#775a00]/10 text-[#775a00] uppercase tracking-wider border border-[#775a00]/20">
            SPONSORED
          </span>
          <span className="font-label-mono-sm text-xs text-[#4e4635] tracking-wider uppercase flex items-center gap-1.5">
            <span className="text-[#18181B] font-bold">{campaign.sponsor}</span>
            <span className="text-[#d1c5af]">•</span>
            <span className="hidden sm:inline text-[#775a00] font-medium">{campaign.tagline}</span>
            <span className="material-symbols-outlined text-[15px] text-[#775a00] group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </span>
        </div>
      </>
    );
  }

  // ═══════════════════════════════════════════════════
  // 4. CARD VARIANT — Image-only with click popup
  // ═══════════════════════════════════════════════════
  return (
    <>
      <PopupModal />
      <div
        className={`rounded-2xl overflow-hidden bg-white border border-[#c59a27]/40 shadow-sm hover:shadow-md transition-all relative group cursor-pointer ${className}`}
        onClick={() => handleAdClick(campaign)}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffdf9a]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Image */}
        <div className={`relative aspect-[16/9] overflow-hidden transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* SPONSORED Badge */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-label-mono-sm font-bold bg-[#775a00]/90 text-[#ffdf9a] uppercase tracking-wider border border-white/10">
            SPONSORED
          </div>
        </div>

        {/* Dots */}
        <div className="py-2.5">
          <DotIndicators />
        </div>
      </div>
    </>
  );
}
