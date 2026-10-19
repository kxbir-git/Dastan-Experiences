'use client';

import React, { useState } from 'react';
import { store } from '@/lib/store';
import { RestaurantCard } from '@/components/dining/restaurant-card';
import { CitySelect } from '@/components/ui/city-select';

export default function DiningListingPage() {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const allRestaurants = store.getAllRestaurants();

  const cuisines = [
    'All',
    'Modern Indian',
    'Craft Beer',
    'Mediterranean',
    'Wood-fired Pizza',
    'Cocktails',
  ];

  const filtered = allRestaurants.filter((rest) => {
    const matchCity =
      !selectedCity ||
      selectedCity === 'All' ||
      selectedCity.toLowerCase().startsWith('all') ||
      rest.city.toLowerCase() === selectedCity.toLowerCase();
    const matchCuisine =
      selectedCuisine === 'All' ||
      rest.cuisineTypes.some((c) =>
        c.toLowerCase().includes(selectedCuisine.toLowerCase())
      );
    const matchSearch =
      !searchQuery ||
      rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchCuisine && matchSearch && rest.status === 'published';
  });

  filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#FDFBF7]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-label-mono-sm font-bold text-[#127c56] uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[16px]">restaurant</span>
          <span>Exclusive Culinary Perks &amp; Social Tables</span>
        </div>
        <h1 className="font-display-lg text-3xl sm:text-5xl font-bold text-[#18181B] tracking-tight">
          Dining Enclaves &amp; Secret Deals
        </h1>
        <p className="font-body-md text-sm sm:text-base text-[#4e4635] mt-2 max-w-2xl leading-relaxed">
          Reserve prime restaurant tables across India's top gastronomic destinations with up to 30% discount on food and signature cocktails.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E6DFD5] shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#807663] text-[18px]">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurant, area or cuisine..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-[#18181B] text-xs font-body-md placeholder:text-[#807663] focus:outline-none focus:border-[#775a00]"
            />
          </div>

          {/* City */}
          <div className="relative">
            <CitySelect
              value={selectedCity}
              onChange={(city) => setSelectedCity(city)}
              placeholder="All Enclave Cities"
              allowAllCities={true}
            />
          </div>

          {/* Cuisine */}
          <div className="relative">
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-[#18181B] text-xs font-body-md font-semibold focus:outline-none focus:border-[#775a00]"
            >
              {cuisines.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Cuisines' : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E6DFD5]">
          <p className="font-headline-sm text-lg text-[#18181B]">No dining enclaves matched your query.</p>
          <button
            onClick={() => {
              setSelectedCity('All');
              setSelectedCuisine('All');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-bold text-[#775a00] underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((rest) => (
            <RestaurantCard key={rest.id} restaurant={rest} />
          ))}
        </div>
      )}
    </div>
  );
}
