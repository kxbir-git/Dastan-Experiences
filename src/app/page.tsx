'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { EventCard } from '@/components/events/event-card';
import { CitySelect } from '@/components/ui/city-select';
import { AdvertisementBox } from '@/components/ui/advertisement-box';

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [allEvents, setAllEvents] = useState<any[]>(() => store.getAllEvents());

  React.useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        if (data.events) {
          setAllEvents(data.events);
        }
      })
      .catch((e) => console.warn('Could not sync events for homepage:', e));
  }, []);

  // Filter events
  const filteredEvents = allEvents.filter((evt) => {
    const matchCity =
      !selectedCity ||
      selectedCity === 'All' ||
      selectedCity.toLowerCase().startsWith('all') ||
      evt.city.toLowerCase() === selectedCity.toLowerCase();
    const matchCategory =
      activeCategory === 'All' || evt.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchCategory && matchSearch && (evt.status === 'published' || !evt.status);
  });

  const categories = [
    { id: 'All', label: '✦ All Curations' },
    { id: 'live_music', label: 'Live Jazz & Cellar Wine' },
    { id: 'standup_comedy', label: 'Intimate Comedy & Satire' },
    { id: 'food_fest', label: 'Sufi & Ghazal Baithaks' },
    { id: 'club_night', label: 'Secret Rooftop Diners' },
  ];

  return (
    <div className="flex flex-col w-full relative overflow-hidden bg-[#FDFBF7]">
      {/* Atmospheric Ambient Background Orbs */}
      <div className="pointer-events-none absolute -top-40 -left-32 w-[600px] h-[600px] rounded-full bg-[#ffdf9a]/35 blur-[140px] -z-10" />
      <div className="pointer-events-none absolute top-48 -right-32 w-[540px] h-[540px] rounded-full bg-[#c5d4fd]/30 blur-[150px] -z-10" />
      <div className="pointer-events-none absolute top-[980px] left-1/3 w-[500px] h-[500px] rounded-full bg-[#ffdeae]/40 blur-[130px] -z-10" />

      {/* SECTION 1: HERO & UNIFIED GLASS SEARCH */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Full Sponsored Brand Showcase Bar with Image */}
        <AdvertisementBox variant="bar" className="mb-8" />

        {/* Editorial Typography Title */}
        <div className="max-w-4xl mx-auto space-y-4 mb-8">
          <h1 className="font-display-lg text-4xl sm:text-6xl lg:text-7xl text-[#18181B] tracking-tight leading-[1.08]">
            Every Event Has a Story.{' '}
            <span className="italic font-normal block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-[#775a00] via-[#c59a27] to-[#604100]">
              Dastan Experiences.
            </span>
          </h1>
          <p className="font-body-lg text-base sm:text-lg text-[#4e4635] max-w-2xl mx-auto font-normal leading-relaxed">
            Handcrafted musical soirées, intimate classical baithaks, comedy nights, and curated live cultural gatherings designed exclusively for patrons who seek extraordinary evenings.
          </p>
        </div>

        {/* Unified Glassmorphic Search Bar */}
        <div className="w-full max-w-5xl mt-2 p-2 sm:p-2.5 rounded-2xl bg-white/85 backdrop-blur-2xl border border-[#E6DFD5] shadow-[0_12px_32px_rgba(119,90,0,0.08)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 text-left">
            {/* Keyword Input */}
            <div className="lg:col-span-5 p-3 rounded-xl bg-[#f5f3ef]/60 hover:bg-white border border-transparent hover:border-[#E6DFD5] transition-all flex flex-col justify-center">
              <label className="font-label-mono-sm text-[11px] text-[#775a00] tracking-widest uppercase flex items-center gap-1 mb-1 font-semibold">
                <span className="material-symbols-outlined text-[14px]">search</span>
                Search Artiste, Vibe or Venue
              </label>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-[#18181B] font-title-md text-base placeholder:text-[#807663] focus:outline-none w-full"
                placeholder="Jazz, Sufi, Rooftop..."
                type="text"
              />
            </div>

            {/* City Selector */}
            <div className="lg:col-span-4 p-3 rounded-xl bg-[#f5f3ef]/60 hover:bg-white border border-transparent hover:border-[#E6DFD5] transition-all flex flex-col justify-center relative group">
              <label className="font-label-mono-sm text-[11px] text-[#4e4635] tracking-widest uppercase flex items-center gap-1 mb-1 font-semibold">
                <span className="material-symbols-outlined text-[14px] text-[#775a00]">location_on</span>
                Enclave City
              </label>
              <CitySelect
                value={selectedCity}
                onChange={(city) => setSelectedCity(city)}
                placeholder="Search any Indian city..."
                allowAllCities={true}
                compact={true}
              />
            </div>

            {/* CTA Button */}
            <div className="lg:col-span-3 flex items-stretch">
              <button
                onClick={() => {
                  const el = document.getElementById('signature-dastans');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-br from-[#c59a27] via-[#b8860b] to-[#775a00] text-white font-body-md font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md shadow-[#775a00]/20 hover:shadow-[#775a00]/40 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200"
                type="button"
              >
                <span>Explore Soirées</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="w-full max-w-5xl mt-6 flex items-center gap-2 overflow-x-auto pb-2 justify-start lg:justify-center">
          <span className="font-label-mono-sm text-[11px] text-[#807663] uppercase tracking-widest flex items-center gap-1 flex-shrink-0 mr-1">
            <span className="material-symbols-outlined text-[14px]">tune</span>
            Genre:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full font-label-mono-sm text-xs transition-all whitespace-nowrap shadow-sm ${
                activeCategory === cat.id
                  ? 'bg-[#ffdf9a] text-[#251a00] font-bold border border-[#c59a27]'
                  : 'bg-white text-[#4e4635] hover:text-[#18181B] hover:bg-[#efeeea] border border-[#E6DFD5]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 2: CURATED TRENDING SIGNATURE DASTANS */}
      <section id="signature-dastans" className="w-full px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#E6DFD5]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#c59a27]"></span>
              <span className="font-label-mono-sm text-xs uppercase text-[#775a00] font-bold tracking-widest">
                Selected Enclave Access
              </span>
            </div>
            <h2 className="font-headline-lg text-2xl sm:text-4xl text-[#18181B] tracking-tight">
              This Week’s Signature Dastans
            </h2>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 font-title-md font-semibold text-[#775a00] hover:text-[#c59a27] transition-colors group"
          >
            <span>View All Experiences ({filteredEvents.length})</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_right_alt
            </span>
          </Link>
        </div>

        {/* 3-Column Luxury Experience Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E6DFD5]">
            <p className="font-headline-sm text-lg text-[#18181B]">No experiences found in this enclave.</p>
            <button
              onClick={() => {
                setSelectedCity('All');
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-bold text-[#775a00] underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* LUXURY SPONSORED SPOTLIGHT ADVERTISEMENT SHOWCASE BANNER */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6">
        <AdvertisementBox variant="banner" />
      </section>

      {/* SECTION 3: HOW DASTAN GATE PASSES WORK */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-14 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-[#FAF7F2] border border-[#E6DFD5] p-8 sm:p-12 shadow-[0_8px_30px_rgba(119,90,0,0.05)] overflow-hidden">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="font-label-mono-sm text-xs uppercase tracking-widest text-[#775a00] font-bold">
              Seamless Patron Experience
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-4xl text-[#18181B] font-bold">
              How Your Entry Pass Works
            </h2>
            <p className="font-body-md text-sm text-[#4e4635]">
              Direct from verified artists and curators into your inbox — no paper tickets, no ticket resale bots.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E6DFD5] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#ffdf9a]/40 border border-[#c59a27]/30 flex items-center justify-center text-[#775a00]">
                <span className="material-symbols-outlined text-[24px]">confirmation_number</span>
              </div>
              <div className="font-label-mono-sm text-[10px] text-[#775a00] uppercase font-bold tracking-wider">
                Step 01
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-[#18181B]">Choose Your Soirée</h3>
              <p className="font-body-sm text-xs text-[#71717A] leading-relaxed">
                Explore vetted musical concerts, standup comedy, Sufi baithaks, and rooftop gatherings across your enclave.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E6DFD5] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#d1fae5] border border-[#127c56]/30 flex items-center justify-center text-[#127c56]">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <div className="font-label-mono-sm text-[10px] text-[#127c56] uppercase font-bold tracking-wider">
                Step 02
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-[#18181B]">Instant UPI / Card Payment</h3>
              <p className="font-body-sm text-xs text-[#71717A] leading-relaxed">
                Pay in seconds via Google Pay, PhonePe, Paytm, or Razorpay Secured Gateway with 100% escrow protection.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E6DFD5] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#c5d4fd]/40 border border-[#4f5e81]/30 flex items-center justify-center text-[#4f5e81]">
                <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
              </div>
              <div className="font-label-mono-sm text-[10px] text-[#4f5e81] uppercase font-bold tracking-wider">
                Step 03
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-[#18181B]">Email Gate Pass &amp; QR Entry</h3>
              <p className="font-body-sm text-xs text-[#71717A] leading-relaxed">
                Instant payment receipt and scannable QR Gate Pass dispatched to your email for seamless wristband entry.
              </p>
            </div>
          </div>

          {/* Host an Event CTA */}
          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-[#251a00] to-[#422e03] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="font-label-mono-sm text-xs text-[#ffdf9a] uppercase tracking-wider font-bold">
                For Artists &amp; Independent Curators
              </div>
              <h3 className="font-headline-sm text-xl sm:text-2xl font-bold">
                Host Your Live Experience on Dastan
              </h3>
              <p className="font-body-sm text-xs text-white/80 max-w-xl">
                Register your event in under 3 minutes, set custom ticket tiers, and issue automated QR gate passes.
              </p>
            </div>
            <Link
              href="/vendor/events/new"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#c59a27] to-[#ffdf9a] text-[#251a00] font-bold text-xs uppercase tracking-wider hover:brightness-105 transition-all shrink-0 text-center shadow-lg"
            >
              Register An Event →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: PRIVILEGE & TRUST PROTOCOL BAR */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto mb-8">
        <div className="rounded-2xl bg-white border border-[#E6DFD5] p-6 sm:p-8 shadow-[0_4px_20px_rgba(119,90,0,0.05)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#ffdf9a]/50 border border-[#c59a27]/20 flex items-center justify-center text-[#775a00] shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">shield</span>
              </div>
              <div className="space-y-0.5">
                <h4 className="font-headline-sm text-sm text-[#18181B] font-bold">Escrow Protected</h4>
                <p className="font-body-sm text-xs text-[#71717A]">
                  100% funds held via Razorpay escrow until the soirée concludes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#efeeea] flex items-center justify-center text-[#775a00] shrink-0 shadow-sm border border-[#E6DFD5]">
                <span className="material-symbols-outlined text-[20px]">castle</span>
              </div>
              <div className="space-y-0.5">
                <h4 className="font-headline-sm text-sm text-[#18181B] font-bold">Intimate Sanctums</h4>
                <p className="font-body-sm text-xs text-[#71717A]">
                  Capacities capped at 12 to 80 patrons. No commercial chaos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#c5d4fd]/40 flex items-center justify-center text-[#4f5e81] shrink-0 shadow-sm border border-[#E6DFD5]">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </div>
              <div className="space-y-0.5">
                <h4 className="font-headline-sm text-sm text-[#18181B] font-bold">Guest Charter</h4>
                <p className="font-body-sm text-xs text-[#71717A]">
                  Curated decorum code preserving courtly Indian hospitality.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#d1fae5] flex items-center justify-center text-[#127c56] shrink-0 shadow-sm border border-[#E6DFD5]">
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
              </div>
              <div className="space-y-0.5">
                <h4 className="font-headline-sm text-sm text-[#18181B] font-bold">Private Concierge</h4>
                <p className="font-body-sm text-xs text-[#71717A]">
                  Dedicated concierge for dietary notes and valet reservations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
