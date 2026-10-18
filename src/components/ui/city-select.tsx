'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, Search, ChevronDown, Check, X, Sparkles } from 'lucide-react';
import {
  INDIAN_CITIES_DATA,
  POPULAR_INDIAN_CITIES,
  ALL_INDIAN_CITIES,
  filterIndianCities,
} from '@/lib/indian-cities';

interface CitySelectProps {
  value: string;
  onChange: (city: string) => void;
  label?: string;
  placeholder?: string;
  allowAllCities?: boolean;
  className?: string;
  name?: string;
}

export function CitySelect({
  value,
  onChange,
  label = 'Select City / Region',
  placeholder = 'Select your city...',
  allowAllCities = true,
  className = '',
  name = 'city',
}: CitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Filtered cities based on query
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) {
      return INDIAN_CITIES_DATA;
    }
    return filterIndianCities(searchQuery);
  }, [searchQuery]);

  const handleSelect = (cityName: string) => {
    onChange(cityName);
    setIsOpen(false);
  };

  const isAllCities = value === 'All' || value === 'All Cities';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-semibold text-[#4e4635] mb-1.5 font-label-mono-sm uppercase">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#FAF7F2] border border-[#E6DFD5] hover:border-[#c59a27] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#18181B] flex items-center justify-between gap-2 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#775a00]/20 focus:border-[#775a00]"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-[#c59a27]/10 flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5 text-[#775a00]" />
          </div>
          <div className="truncate">
            <span className="font-semibold text-[#18181B]">
              {isAllCities ? 'All Cities (Pan-India)' : value || placeholder}
            </span>
            {!isAllCities && value && (
              <span className="ml-1.5 text-[10px] text-[#807663] font-medium bg-[#efeeea] px-1.5 py-0.5 rounded">
                India
              </span>
            )}
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-[#807663] shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Hidden input for HTML form compliance */}
      <input type="hidden" name={name} value={value} />

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl border border-[#E6DFD5] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 max-h-[380px] flex flex-col">
          {/* Search Box Header */}
          <div className="p-3 border-b border-[#E6DFD5] bg-[#FAF7F2] shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#807663]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all Indian cities..."
                className="w-full bg-white border border-[#E6DFD5] focus:border-[#775a00] rounded-xl pl-9 pr-8 py-2 text-xs text-[#18181B] placeholder-[#807663] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#807663] hover:text-[#18181B] p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Popular Cities Quick Pills */}
            {!searchQuery && (
              <div className="mt-2.5">
                <div className="text-[10px] font-bold text-[#807663] uppercase tracking-wider font-label-mono-sm mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#c59a27]" />
                  <span>Popular Hubs</span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto no-scrollbar">
                  {allowAllCities && (
                    <button
                      type="button"
                      onClick={() => handleSelect('All')}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                        isAllCities
                          ? 'bg-[#775a00] text-white border-[#775a00]'
                          : 'bg-white text-[#4e4635] border-[#E6DFD5] hover:border-[#c59a27]'
                      }`}
                    >
                      All India
                    </button>
                  )}
                  {POPULAR_INDIAN_CITIES.slice(0, 8).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleSelect(city)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                        value === city
                          ? 'bg-[#775a00] text-white border-[#775a00]'
                          : 'bg-white text-[#4e4635] border-[#E6DFD5] hover:border-[#c59a27]'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cities Scroll List */}
          <div className="overflow-y-auto py-1 px-1.5 flex-1 divide-y divide-[#FAF7F2]">
            {allowAllCities && !searchQuery && (
              <button
                type="button"
                onClick={() => handleSelect('All')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                  isAllCities
                    ? 'bg-[#ffdf9a]/40 text-[#775a00] font-bold'
                    : 'text-[#18181B] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#c59a27]/20 flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-[#775a00]" />
                  </div>
                  <div>
                    <span className="font-semibold">All Indian Cities (Pan-India)</span>
                    <span className="block text-[10px] text-[#807663]">
                      Browse all nationwide experiences
                    </span>
                  </div>
                </div>
                {isAllCities && <Check className="w-4 h-4 text-[#775a00]" />}
              </button>
            )}

            {filteredCities.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#807663]">
                <p className="font-medium text-[#18181B]">No city found for &quot;{searchQuery}&quot;</p>
                <p className="mt-1 text-[11px]">
                  You can select &quot;All Indian Cities&quot; to continue with pan-India experiences.
                </p>
                <button
                  type="button"
                  onClick={() => handleSelect('All')}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-[#FAF7F2] text-[#775a00] font-semibold text-xs border border-[#E6DFD5] hover:border-[#c59a27]"
                >
                  Select All Cities
                </button>
              </div>
            ) : (
              filteredCities.map((item) => {
                const isSelected = value === item.name;
                return (
                  <button
                    key={`${item.name}-${item.state}`}
                    type="button"
                    onClick={() => handleSelect(item.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#ffdf9a]/40 text-[#775a00] font-bold'
                        : 'text-[#18181B] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-[10px] text-[#807663] bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#E6DFD5]">
                        {item.state}
                      </span>
                      {item.isPopular && (
                        <span className="text-[9px] text-[#775a00] font-bold uppercase tracking-wider bg-[#c59a27]/10 px-1 rounded">
                          Top Hub
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#775a00] shrink-0" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-2 border-t border-[#E6DFD5] bg-[#FAF7F2] text-[10px] text-center text-[#807663] shrink-0 font-label-mono-sm">
            Featuring 150+ Indian Cities & Cultural Enclaves
          </div>
        </div>
      )}
    </div>
  );
}
