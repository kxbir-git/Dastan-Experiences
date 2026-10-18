'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { EventCard } from '@/components/events/event-card';
import { RestaurantCard } from '@/components/dining/restaurant-card';
import { SUPPORTED_CITIES } from '@/lib/mock-data';

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const allEvents = store.getAllEvents();
  const allRestaurants = store.getAllRestaurants();

  // Filter events
  const filteredEvents = allEvents.filter((evt) => {
    const matchCity = selectedCity === 'All' || evt.city === selectedCity;
    const matchCategory =
      activeCategory === 'All' || evt.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchCategory && matchSearch;
  });

  // Filter restaurants
  const filteredRestaurants = allRestaurants.filter((rest) => {
    const matchCity = selectedCity === 'All' || rest.city === selectedCity;
    const matchSearch =
      !searchQuery ||
      rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.cuisineTypes.some((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      rest.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchSearch;
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
        {/* Royal Badge Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E6DFD5] shadow-sm mb-6 group cursor-default transition-all duration-300 hover:bg-[#efeeea]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#775a00] animate-pulse"></span>
          <span className="font-label-mono-sm text-xs text-[#4e4635] tracking-wider uppercase flex items-center gap-1.5">
            <span className="text-[#775a00] font-bold">DASTAN PROTOCOL</span>
            <span className="text-[#d1c5af]">•</span>
            <span>Curated Indian Heritage &amp; Contemporary Soirées</span>
          </span>
          <span className="material-symbols-outlined text-[16px] text-[#775a00]">
            auto_awesome
          </span>
        </div>

        {/* Editorial Typography Title */}
        <div className="max-w-4xl mx-auto space-y-4 mb-8">
          <h1 className="font-display-lg text-4xl sm:text-6xl lg:text-7xl text-[#18181B] tracking-tight leading-[1.08]">
            Every Event Has a Story.{' '}
            <span className="italic font-normal block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-[#775a00] via-[#c59a27] to-[#604100]">
              Dastan Experiences.
            </span>
          </h1>
          <p className="font-body-lg text-base sm:text-lg text-[#4e4635] max-w-2xl mx-auto font-normal leading-relaxed">
            Handcrafted musical soirées, private palace dining, and curated social tables designed exclusively for patrons who seek extraordinary evenings.
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
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent font-title-md text-sm font-semibold text-[#18181B] focus:outline-none w-full cursor-pointer appearance-none"
              >
                <option value="All">All Indian Enclaves</option>
                {SUPPORTED_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
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

      {/* SECTION 3: CURATED SECRET CHEF DINING TABLES */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#E6DFD5]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#127c56]"></span>
              <span className="font-label-mono-sm text-xs uppercase text-[#127c56] font-bold tracking-widest">
                Fine Dining Enclaves
              </span>
            </div>
            <h2 className="font-headline-lg text-2xl sm:text-4xl text-[#18181B] tracking-tight">
              Secret Chef Tables &amp; Exclusive Deals
            </h2>
          </div>
          <Link
            href="/dining"
            className="inline-flex items-center gap-1.5 font-title-md font-semibold text-[#775a00] hover:text-[#c59a27] transition-colors group"
          >
            <span>View All Dining Enclaves ({filteredRestaurants.length})</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_right_alt
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* SECTION 4: THE SOCIAL TABLE (NEVER DINE ALONE) */}
      <section id="social-experience" className="w-full px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-[#FAF7F2] border border-[#E6DFD5] p-8 sm:p-12 shadow-[0_12px_40px_rgba(119,90,0,0.06)] overflow-hidden">
          <div className="pointer-events-none absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#c5d4fd]/20 blur-[100px]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Story & Philosophy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5d4fd]/40 text-[#4f5e81] border border-[#4f5e81]/20">
                <span className="material-symbols-outlined text-[14px]">groups</span>
                <span className="font-label-mono-sm text-xs tracking-wider uppercase font-semibold">
                  Signature Innovation
                </span>
              </div>

              <div className="space-y-3">
                <h2 className="font-display-lg text-3xl sm:text-5xl text-[#18181B] leading-tight">
                  Never Dine Alone. <br />
                  <span className="italic text-[#775a00] font-display-lg">
                    The Curated Social Table.
                  </span>
                </h2>
                <p className="font-body-md text-base text-[#4e4635] font-normal leading-relaxed">
                  We hand-match 6 to 8 fascinating strangers around shared passions—from architecture and rare vinyl to founder stories. No networking awkwardness; only sublime food, vintage pours, and magnetic dialogue.
                </p>
              </div>

              {/* Feature Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-[#E6DFD5] space-y-1 shadow-sm">
                  <div className="flex items-center gap-2 text-[#775a00]">
                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                    <span className="font-headline-sm text-sm font-semibold">94% Synergy Match</span>
                  </div>
                  <p className="font-body-sm text-xs text-[#71717A]">
                    Matched by cultural tastes &amp; conversational archetypes.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E6DFD5] space-y-1 shadow-sm">
                  <div className="flex items-center gap-2 text-[#127c56]">
                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                    <span className="font-headline-sm text-sm font-semibold">Vetted Patrons</span>
                  </div>
                  <p className="font-body-sm text-xs text-[#71717A]">
                    Verified profiles preserving intimacy and courtly decorum.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {['A', 'K', 'S', 'R'].map((initial, i) => (
                      <div
                        key={i}
                        className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#775a00] to-[#c59a27] text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm"
                      >
                        {initial}
                      </div>
                    ))}
                  </div>
                  <span className="font-body-sm text-xs text-[#4e4635]">
                    Over 340+ patrons seated across 48 tables this month
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Social Table Preview Card */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-white border border-[#E6DFD5] p-6 sm:p-8 shadow-[0_8px_30px_rgba(119,90,0,0.08)] space-y-5">
                {/* Table Status Banner */}
                <div className="flex items-center justify-between pb-4 border-b border-[#E6DFD5]">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c59a27] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#c59a27]"></span>
                    </span>
                    <span className="font-label-mono-sm text-xs uppercase text-[#775a00] tracking-wider font-bold">
                      Table Formation Active
                    </span>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-[#ffdf9a] text-[#251a00] font-label-mono-sm text-[11px] font-bold border border-[#c59a27]/30">
                    Match Confidence: 94%
                  </div>
                </div>

                {/* Table Headline & Venue */}
                <div className="space-y-1">
                  <span className="font-label-mono-sm text-[10px] text-[#807663] uppercase tracking-widest">
                    Friday Night Salon • 6 Patrons Total
                  </span>
                  <h3 className="font-headline-sm text-xl text-[#18181B] font-bold">
                    The Vinyl, Art &amp; Single Malt Table
                  </h3>
                  <p className="font-body-sm text-xs text-[#4e4635] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#775a00] text-[16px]">restaurant</span>
                    Worli Heritage Village, Mumbai
                  </p>
                </div>

                {/* Visual Seating Archetype Layout */}
                <div className="p-4 rounded-xl bg-[#f5f3ef] border border-[#E6DFD5] space-y-3">
                  <div className="flex items-center justify-between font-label-mono-sm text-[11px] text-[#807663]">
                    <span>CONFIRMED CO-DINERS (4/6 FILLED)</span>
                    <span className="text-[#775a00] font-bold">2 SEATS UNCLAIMED</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg bg-white border border-[#E6DFD5] text-center space-y-1 shadow-sm">
                      <span className="material-symbols-outlined text-[#775a00] text-[20px]">album</span>
                      <div className="font-body-md text-xs text-[#18181B] font-semibold truncate">Vinyl Collector</div>
                      <div className="font-label-mono-sm text-[9px] text-[#807663]">Verified • 32</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-[#E6DFD5] text-center space-y-1 shadow-sm">
                      <span className="material-symbols-outlined text-[#4f5e81] text-[20px]">architecture</span>
                      <div className="font-body-md text-xs text-[#18181B] font-semibold truncate">Architect</div>
                      <div className="font-label-mono-sm text-[9px] text-[#807663]">Verified • 29</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-[#E6DFD5] text-center space-y-1 shadow-sm">
                      <span className="material-symbols-outlined text-[#127c56] text-[20px]">palette</span>
                      <div className="font-body-md text-xs text-[#18181B] font-semibold truncate">Art Curator</div>
                      <div className="font-label-mono-sm text-[9px] text-[#807663]">Verified • 34</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#ffdf9a]/40 border border-[#c59a27]/40 text-center space-y-1 flex flex-col justify-center items-center">
                      <span className="material-symbols-outlined text-[#775a00] text-[20px] animate-pulse">lock_open</span>
                      <div className="font-body-md text-xs text-[#775a00] font-bold">Your Seat</div>
                      <div className="font-label-mono-sm text-[9px] text-[#807663]">Claim Now</div>
                    </div>
                  </div>

                  {/* Shared Topics */}
                  <div className="pt-2 flex flex-wrap gap-1.5 items-center">
                    <span className="font-label-mono-sm text-[10px] text-[#807663] uppercase mr-1">Interests:</span>
                    {['Bebop Jazz', 'Modernist Design', 'Islay Malts', 'Amir Khusrau'].map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-white border border-[#E6DFD5] text-[#18181B] font-body-sm text-[10px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Booking / Claim Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="text-left w-full sm:w-auto">
                    <span className="font-label-mono-sm text-[10px] text-[#807663] uppercase block">
                      Tasting Menu + Curated Pairing
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-label-mono-lg text-xl text-[#775a00] font-bold">₹1,499</span>
                      <span className="font-body-sm text-xs text-[#71717A]">/ patron pass</span>
                    </div>
                  </div>

                  <Link
                    href="/dining"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c59a27] to-[#775a00] hover:from-[#d4af37] hover:to-[#8d6d1b] text-white font-body-md font-semibold text-xs tracking-wide flex items-center justify-center gap-2 shadow-md shadow-[#775a00]/20 transition-all"
                  >
                    <span>Join This Social Table</span>
                    <span className="material-symbols-outlined text-[16px]">key</span>
                  </Link>
                </div>
              </div>
            </div>
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
