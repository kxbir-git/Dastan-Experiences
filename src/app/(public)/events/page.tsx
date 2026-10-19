'use client';

import React, { useState } from 'react';
import { store } from '@/lib/store';
import { EventCard } from '@/components/events/event-card';
import { CitySelect } from '@/components/ui/city-select';

export default function EventsListingPage() {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price_asc' | 'price_desc'>('date');
  const [allEvents, setAllEvents] = useState<any[]>(() => store.getAllEvents());

  React.useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        if (data.events) {
          setAllEvents(data.events);
        }
      })
      .catch((err) => console.warn('Could not sync events from API:', err));
  }, []);

  let filtered = allEvents.filter((evt) => {
    const matchCity =
      !selectedCity ||
      selectedCity === 'All' ||
      selectedCity.toLowerCase().startsWith('all') ||
      evt.city.toLowerCase() === selectedCity.toLowerCase();
    const matchCat = selectedCategory === 'All' || evt.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchCat && matchSearch && evt.status === 'published';
  });

  if (sortBy === 'price_asc') {
    filtered.sort((a, b) => a.startingPrice - b.startingPrice);
  } else if (sortBy === 'price_desc') {
    filtered.sort((a, b) => b.startingPrice - a.startingPrice);
  } else {
    filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  const categories = [
    { id: 'All', label: 'All Curations' },
    { id: 'live_music', label: 'Live Jazz & Concerts' },
    { id: 'standup_comedy', label: 'Satire & Comedy' },
    { id: 'food_fest', label: 'Sufi & Ghazal Baithaks' },
    { id: 'club_night', label: 'Secret Rooftops' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#FDFBF7]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-label-mono-sm font-bold text-[#775a00] uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[16px]">confirmation_number</span>
          <span>Selected Enclave Discovery</span>
        </div>
        <h1 className="font-display-lg text-3xl sm:text-5xl font-bold text-[#18181B] tracking-tight">
          Live Soirées &amp; Cultural Gigs
        </h1>
        <p className="font-body-md text-sm sm:text-base text-[#4e4635] mt-2 max-w-2xl leading-relaxed">
          Discover vetted musical concerts, intimate classical baithaks, and rooftop jazz gatherings with verified entry.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E6DFD5] shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#807663] text-[18px]">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by artist, venue or city..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-[#18181B] text-xs font-body-md placeholder:text-[#807663] focus:outline-none focus:border-[#775a00]"
            />
          </div>

          {/* City */}
          <div className="relative">
            <CitySelect
              value={selectedCity}
              onChange={(city) => setSelectedCity(city)}
              placeholder="All Cities"
              allowAllCities={true}
            />
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-[#18181B] text-xs font-body-md font-semibold focus:outline-none focus:border-[#775a00]"
            >
              <option value="date">Featured First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-label-mono-sm transition-all whitespace-nowrap shadow-sm ${
                selectedCategory === cat.id
                  ? 'bg-[#ffdf9a] text-[#251a00] font-bold border border-[#c59a27]'
                  : 'bg-white text-[#4e4635] hover:bg-[#FAF7F2] border border-[#E6DFD5]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E6DFD5]">
          <p className="font-headline-sm text-lg text-[#18181B]">No experiences matched your criteria.</p>
          <button
            onClick={() => {
              setSelectedCity('All');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-bold text-[#775a00] underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      )}
    </div>
  );
}
