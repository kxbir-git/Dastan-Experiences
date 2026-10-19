'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { store } from '@/lib/store';
import { formatDate, formatTime, formatINR } from '@/lib/utils';
import { TicketTier, EventListing } from '@/types';
import { CheckoutModal } from '@/components/booking/checkout-modal';
import { TablematesPreview } from '@/components/social/tablemates-preview';
import { AdvertisementBox } from '@/components/ui/advertisement-box';

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const resolvedParams = use(params);
  const [event, setEvent] = useState<EventListing | null>(
    () => store.getEventBySlug(resolvedParams.slug) || store.getEventById(resolvedParams.slug) || null
  );
  const [loading, setLoading] = useState(!event);

  React.useEffect(() => {
    if (!event) {
      fetch('/api/events')
        .then((res) => res.json())
        .then((data) => {
          if (data.events) {
            const found = data.events.find(
              (e: any) => e.slug === resolvedParams.slug || e.id === resolvedParams.slug
            );
            if (found) {
              setEvent(found);
              if (found.ticketTiers?.length) {
                setSelectedTier(found.ticketTiers[0]);
              }
            }
          }
        })
        .catch((e) => console.warn('Error hydrating event:', e))
        .finally(() => setLoading(false));
    }
  }, [resolvedParams.slug, event]);

  const [selectedTier, setSelectedTier] = useState<TicketTier>(() => {
    const initial = store.getEventBySlug(resolvedParams.slug) || store.getEventById(resolvedParams.slug);
    return (
      initial?.ticketTiers?.[0] || {
        id: 'tier-default',
        eventId: initial?.id || '',
        tierName: 'General Pass',
        price: initial?.startingPrice || 0,
        totalCapacity: 100,
        soldCount: 0,
        perks: ['Gate Entry'],
      }
    );
  });
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-[#FDFBF7]">
        <div className="w-10 h-10 border-3 border-[#775a00]/20 border-t-[#775a00] rounded-full animate-spin mb-4" />
        <div className="font-display-lg text-lg text-[#18181B] font-bold">Curating Your Dastan...</div>
        <div className="text-xs text-[#71717A] mt-1">Retrieving pass inventory & seating protocols</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E6DFD5] flex items-center justify-center mx-auto text-[#775a00]">
          <span className="material-symbols-outlined text-[32px]">event_busy</span>
        </div>
        <h1 className="font-display-lg text-2xl font-bold text-[#18181B]">Experience Not Found</h1>
        <p className="text-sm text-[#4e4635]">
          This curation may have concluded, or the pass URL is inactive.
        </p>
        <Link
          href="/events"
          className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c59a27] to-[#775a00] text-white text-xs font-bold"
        >
          Explore All Live Experiences →
        </Link>
      </div>
    );
  }

  const socialProfiles = store.getSocialAttendees(
    event.id,
    event.startTime.split('T')[0]
  );

  const activeTier = selectedTier || event.ticketTiers?.[0];
  const isSoldOut = activeTier ? activeTier.soldCount >= activeTier.totalCapacity : false;
  const remainingTickets = activeTier ? Math.max(0, activeTier.totalCapacity - activeTier.soldCount) : 50;

  return (
    <div className="flex flex-col w-full bg-[#FDFBF7]">
      {/* CINEMATIC HERO SECTION */}
      <section className="relative w-full overflow-hidden border-b border-[#E6DFD5]">
        {/* Background Canvas */}
        <div className="absolute inset-0 z-0">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/85 to-[#FDFBF7]/35 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7] via-[#FDFBF7]/70 to-transparent" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 flex flex-col justify-end min-h-[460px]">
          {/* Breadcrumb / Back Link */}
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#775a00] hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>All Experiences</span>
            </Link>
            <span className="text-[#807663]">•</span>
            <span className="text-xs font-label-mono-sm text-[#71717A] uppercase">
              {event.city}
            </span>
          </div>

          {/* Badges Pill */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-white/95 border border-[#E6DFD5] text-[#775a00] font-label-mono-sm text-xs font-bold uppercase tracking-wider shadow-sm">
              {event.categoryLabel}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#ffdf9a] text-[#251a00] font-label-mono-sm text-xs font-bold border border-[#c59a27]/30 shadow-sm">
              Age: {event.ageRestriction}
            </span>
          </div>

          <h1 className="font-display-lg text-3xl sm:text-5xl lg:text-6xl text-[#18181B] tracking-tight leading-[1.1] max-w-3xl mb-4">
            {event.title}
          </h1>

          <p className="font-body-lg text-base sm:text-lg text-[#4e4635] max-w-2xl mb-8 leading-relaxed">
            {event.description}
          </p>

          {/* Key Details Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#E6DFD5] shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] flex items-center justify-center text-[#775a00] shrink-0">
                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-mono-sm text-[10px] text-[#71717A] uppercase font-semibold">
                  Date &amp; Evening
                </span>
                <span className="font-title-md text-sm text-[#18181B] font-semibold truncate">
                  {formatDate(event.startTime)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] flex items-center justify-center text-[#775a00] shrink-0">
                <span className="material-symbols-outlined text-[20px]">schedule</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-mono-sm text-[10px] text-[#71717A] uppercase font-semibold">
                  Timings
                </span>
                <span className="font-title-md text-sm text-[#18181B] font-semibold truncate">
                  {formatTime(event.startTime)} – {formatTime(event.endTime)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] flex items-center justify-center text-[#775a00] shrink-0">
                <span className="material-symbols-outlined text-[20px]">location_on</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-mono-sm text-[10px] text-[#71717A] uppercase font-semibold">
                  Sanctuary
                </span>
                <span className="font-title-md text-sm text-[#18181B] font-semibold truncate">
                  {event.venueName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN 2/3 + 1/3 SPLIT WORKSPACE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 2/3 COLUMN: STORY, TIERS, SPOTLIGHT */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Story & Vibe Overview Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E6DFD5] shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6DFD5]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#c59a27]"></span>
                  <h2 className="font-headline-sm text-xl text-[#18181B] font-semibold tracking-wide">
                    About This Dastan
                  </h2>
                </div>
                <span className="font-label-mono-sm text-xs text-[#71717A] uppercase">
                  {event.city} Chapter
                </span>
              </div>

              <p className="font-body-md text-sm text-[#27272A] leading-relaxed whitespace-pre-line">
                {event.description}
              </p>

              {/* Aesthetic Grid Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#775a00]">
                    <span className="material-symbols-outlined text-[18px]">styler</span>
                    <span className="font-label-mono-sm text-[10px] uppercase font-bold">
                      Dress Code
                    </span>
                  </div>
                  <span className="font-title-md text-sm text-[#18181B] font-semibold">
                    Smart Casuals
                  </span>
                  <span className="font-body-sm text-xs text-[#71717A]">
                    Linen jackets, silk accents or evening elegance.
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#775a00]">
                    <span className="material-symbols-outlined text-[18px]">storefront</span>
                    <span className="font-label-mono-sm text-[10px] uppercase font-bold">
                      Sanctuary
                    </span>
                  </div>
                  <span className="font-title-md text-sm text-[#18181B] font-semibold truncate">
                    {event.venueName}
                  </span>
                  <span className="font-body-sm text-xs text-[#71717A] truncate">
                    {event.venueAddress}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#127c56]">
                    <span className="material-symbols-outlined text-[18px]">shield</span>
                    <span className="font-label-mono-sm text-[10px] uppercase font-bold">
                      Protocol
                    </span>
                  </div>
                  <span className="font-title-md text-sm text-[#18181B] font-semibold">
                    Escrow Protected
                  </span>
                  <span className="font-body-sm text-xs text-[#71717A]">
                    Statutory GST &amp; Razorpay verified passes.
                  </span>
                </div>
              </div>
            </div>

            {/* TICKET TIER SELECTOR */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-headline-sm text-xl text-[#18181B] font-semibold">
                    Select Access Tier
                  </h2>
                  <p className="font-body-sm text-xs text-[#71717A] mt-0.5">
                    Guaranteed entry with verified patron privileges and escrow safety.
                  </p>
                </div>
                <span className="font-label-mono-sm text-xs px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E6DFD5] text-[#807663] font-medium">
                  All prices in INR (₹)
                </span>
              </div>

              <div className="space-y-4">
                {(event.ticketTiers || []).map((tier: TicketTier) => {
                  const soldOut = tier.soldCount >= tier.totalCapacity;
                  const isSelected = selectedTier.id === tier.id;
                  const remaining = Math.max(0, tier.totalCapacity - tier.soldCount);
                  const pctBooked = Math.round((tier.soldCount / tier.totalCapacity) * 100);

                  return (
                    <div
                      key={tier.id}
                      onClick={() => !soldOut && setSelectedTier(tier)}
                      className={`p-6 rounded-2xl bg-white border transition-all duration-300 relative group cursor-pointer ${
                        soldOut
                          ? 'opacity-50 border-[#E6DFD5] bg-[#FAF7F2] cursor-not-allowed'
                          : isSelected
                          ? 'border-[#c59a27] ring-2 ring-[#c59a27]/30 shadow-md'
                          : 'border-[#E6DFD5] hover:border-[#c59a27]/60 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex flex-col gap-2 max-w-md">
                          <div className="flex items-center gap-2">
                            <span className="font-title-lg text-lg text-[#18181B] font-bold">
                              {tier.tierName}
                            </span>
                            {soldOut ? (
                              <span className="font-label-mono-sm text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
                                Sold Out
                              </span>
                            ) : (
                              <span className="font-label-mono-sm text-[10px] px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E6DFD5] text-[#71717A]">
                                Verified Pass
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 pt-1">
                            {(tier.perks || []).map((perk: string, idx: number) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-xs text-[#4e4635] bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#E6DFD5]"
                              >
                                <span className="material-symbols-outlined text-[14px] text-[#127c56]">
                                  check
                                </span>
                                {perk}
                              </span>
                            ))}
                          </div>

                          {/* Capacity Gauge */}
                          <div className="pt-2 max-w-xs space-y-1">
                            <div className="flex items-center justify-between font-label-mono-sm text-[11px] text-[#71717A]">
                              <span>Remaining</span>
                              <span className="text-[#775a00] font-bold">
                                {remaining} / {tier.totalCapacity} spots left
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E6DFD5]">
                              <div
                                className="h-full bg-[#c59a27] rounded-full transition-all"
                                style={{ width: `${pctBooked}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                          <div className="flex flex-col sm:text-right">
                            <span className="font-label-mono-lg text-2xl font-bold text-[#775a00]">
                              {formatINR(tier.price)}
                            </span>
                            <span className="font-label-mono-sm text-[11px] text-[#71717A]">
                              per guest • incl. perks
                            </span>
                          </div>

                          {isSelected && !soldOut && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ffdf9a] text-[#251a00] font-label-mono-sm text-xs font-bold shadow-sm">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              Selected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>


            {/* Venue Guidelines Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#E6DFD5] space-y-2 text-xs text-[#71717A] shadow-sm">
              <h4 className="font-title-md font-bold text-[#18181B] text-sm uppercase tracking-wider">
                Sanctuary Protocol &amp; Guidelines
              </h4>
              <p className="leading-relaxed">{event.termsConditions}</p>
            </div>
          </div>

          {/* RIGHT 1/3 COLUMN: STICKY BOOKING SUMMARY */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E6DFD5] shadow-[0_12px_40px_rgba(119,90,0,0.08)] space-y-6">
              <div>
                <span className="font-label-mono-sm text-xs uppercase text-[#775a00] font-bold tracking-wider block mb-1">
                  Pass Summary
                </span>
                <h3 className="font-headline-sm text-2xl font-bold text-[#18181B]">
                  Reserve Your Seat
                </h3>
              </div>

              {/* Selected Tier Info */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-title-md text-base font-bold text-[#18181B]">
                      {selectedTier.tierName}
                    </div>
                    <div className="font-label-mono-sm text-xs text-[#71717A]">
                      {formatINR(selectedTier.price)} each
                    </div>
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center bg-white border border-[#E6DFD5] rounded-lg p-1 shadow-sm">
                    <button
                      onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                      className="w-7 h-7 rounded flex items-center justify-center text-[#18181B] hover:bg-[#FAF7F2] font-bold"
                    >
                      −
                    </button>
                    <span className="font-label-mono-sm text-sm font-bold px-3 text-[#18181B]">
                      {ticketQuantity}
                    </span>
                    <button
                      onClick={() => setTicketQuantity(Math.min(remainingTickets, ticketQuantity + 1))}
                      disabled={ticketQuantity >= remainingTickets}
                      className="w-7 h-7 rounded flex items-center justify-center text-[#775a00] hover:bg-[#FAF7F2] font-bold disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E6DFD5] flex items-center justify-between font-label-mono-sm text-xs">
                  <span className="text-[#71717A]">Pass Total</span>
                  <span className="font-bold text-[#18181B] text-base">
                    {formatINR(selectedTier.price * ticketQuantity)}
                  </span>
                </div>
              </div>

              {/* Primary CTA Button */}
              <button
                onClick={() => setIsCheckoutOpen(true)}
                disabled={isSoldOut}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#c59a27] via-[#b8860b] to-[#775a00] text-white font-body-md font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-[#775a00]/20 hover:shadow-[#775a00]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                <span>{isSoldOut ? 'Sold Out' : `Proceed to Checkout`}</span>
              </button>

              {/* Trust Assurances */}
              <div className="space-y-2 pt-2 border-t border-[#E6DFD5] text-xs text-[#71717A]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#127c56]">
                    verified_user
                  </span>
                  <span>Instant Scannable QR Boarding Pass</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#775a00]">
                    shield
                  </span>
                  <span>Razorpay Escrow &amp; 100% Refundable per Policy</span>
                </div>
              </div>
            </div>

            {/* Official Brand Partner / Sponsored Showcase */}
            <AdvertisementBox variant="card" className="mt-6" />
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          bookingType="event"
          targetId={event.id}
          targetTitle={event.title}
          targetSubtitle={`${event.venueName}, ${event.city}`}
          bannerImage={event.bannerUrl}
          tierId={selectedTier.id}
          tierName={selectedTier.tierName}
          unitPrice={selectedTier.price}
          initialQuantity={ticketQuantity}
          selectedDate={event.startTime}
        />
      )}
    </div>
  );
}
