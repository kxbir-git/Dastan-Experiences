'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, ChevronDown, Check, X, Sparkles } from 'lucide-react';
import {
  INDIAN_CITIES_DATA,
  POPULAR_INDIAN_CITIES,
  filterIndianCities,
} from '@/lib/indian-cities';

export interface CitySelectProps {
  value: string;
  onChange: (city: string) => void;
  label?: string;
  placeholder?: string;
  allowAllCities?: boolean;
  className?: string;
  name?: string;
  dark?: boolean;
  compact?: boolean;
}

export function CitySelect({
  value,
  onChange,
  label,
  placeholder = 'Type Indian city (e.g. Lucknow, Delhi)...',
  allowAllCities = true,
  className = '',
  name = 'city',
  dark = false,
  compact = false,
}: CitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external value with input display text when not actively typing
  useEffect(() => {
    if (!isFocused) {
      if (value === 'All' || value === 'All Cities' || value === 'All Indian Cities') {
        setInputValue(allowAllCities ? 'All Indian Cities' : '');
      } else {
        setInputValue(value || '');
      }
    }
  }, [value, isFocused, allowAllCities]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
        // Normalize value on blur
        if (value === 'All' || value === 'All Cities' || value === 'All Indian Cities') {
          setInputValue(allowAllCities ? 'All Indian Cities' : '');
        } else {
          setInputValue(value || '');
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value, allowAllCities]);

  // Filter cities based on what user has typed
  const filteredCities = useMemo(() => {
    const q = inputValue.trim();
    if (!q || q === 'All Indian Cities' || q === 'All Cities') {
      return INDIAN_CITIES_DATA;
    }
    return filterIndianCities(q);
  }, [inputValue]);

  // Reset highlighted index when filtered list changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredCities]);

  const handleSelect = (cityName: string) => {
    onChange(cityName);
    if (cityName === 'All') {
      setInputValue('All Indian Cities');
    } else {
      setInputValue(cityName);
    }
    setIsOpen(false);
    setIsFocused(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);
    setIsOpen(true);

    const trimmed = text.trim();
    if (!trimmed) {
      if (allowAllCities) {
        onChange('All');
      } else {
        onChange('');
      }
      return;
    }

    if (allowAllCities && /^(all|pan|india|entire|any|desh|bharat|sab)/i.test(trimmed)) {
      onChange('All');
      return;
    }

    // Check if exact match with an Indian city name or alias
    const exactMatch = INDIAN_CITIES_DATA.find(
      (c) =>
        c.name.toLowerCase() === trimmed.toLowerCase() ||
        (c.aliases && c.aliases.some((a) => a.toLowerCase() === trimmed.toLowerCase()))
    );

    if (exactMatch) {
      onChange(exactMatch.name);
    } else {
      // Type-to-select: user's typed city is immediately selected
      onChange(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((prev) => Math.min(prev + 1, filteredCities.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (showAllOption && /^(all|india|pan)/i.test(inputValue.trim())) {
        handleSelect('All');
      } else if (filteredCities.length > 0 && highlightedIndex >= 0 && filteredCities[highlightedIndex]) {
        handleSelect(filteredCities[highlightedIndex].name);
      } else if (inputValue.trim()) {
        handleSelect(inputValue.trim());
      } else {
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const isAllCities = value === 'All' || value === 'All Cities' || value === 'All Indian Cities';

  // Check if "All Indian Cities" option should show up
  const showAllOption =
    allowAllCities &&
    (!inputValue.trim() ||
      inputValue === 'All Indian Cities' ||
      /all|india|pan|every|any|nation|sab|bharat|desh/i.test(inputValue.trim()));

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label
          className={`block text-xs font-semibold mb-1.5 font-label-mono-sm uppercase ${dark ? 'text-slate-400' : 'text-[#4e4635]'
            }`}
        >
          {label}
        </label>
      )}

      {/* Direct Input Field: User can type immediately to search and select */}
      <div className="relative flex items-center">
        {!compact && (
          <div
            className={`absolute left-3 pointer-events-none w-5 h-5 rounded-lg flex items-center justify-center shrink-0 z-10 ${dark ? 'text-amber-400' : 'text-[#775a00]'
              }`}
          >
            <MapPin className="w-3.5 h-3.5" />
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className={`w-full transition-all duration-200 focus:outline-none ${compact
              ? 'p-0 bg-transparent text-xs sm:text-sm font-semibold text-[#18181B] placeholder-[#807663]'
              : dark
                ? 'bg-slate-900 border border-slate-700 hover:border-amber-500/50 rounded-xl pl-9 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500'
                : 'bg-[#FAF7F2] border border-[#E6DFD5] hover:border-[#c59a27] rounded-xl pl-9 pr-9 py-2.5 text-xs sm:text-sm text-[#18181B] placeholder-[#807663] focus:ring-2 focus:ring-[#775a00]/20 focus:border-[#775a00]'
            }`}
        />

        {/* Clear or Dropdown Chevron Button */}
        <div className="absolute right-2.5 flex items-center gap-1 z-10">
          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue('');
                if (allowAllCities) {
                  onChange('All');
                } else {
                  onChange('');
                }
                setIsOpen(true);
                inputRef.current?.focus();
              }}
              className={`p-1 rounded-md transition-colors ${dark ? 'text-slate-400 hover:text-white' : 'text-[#807663] hover:text-[#18181B]'
                }`}
              title="Clear city"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            tabIndex={-1}
            onClick={() => {
              setIsOpen(!isOpen);
              if (!isOpen) inputRef.current?.focus();
            }}
            className={`p-0.5 rounded transition-transform duration-200 ${dark ? 'text-slate-400' : 'text-[#807663]'
              } ${isOpen ? 'rotate-180' : ''}`}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hidden input for HTML form compliance */}
      <input type="hidden" name={name} value={value} />

      {/* Dropdown Suggestions Menu */}
      {isOpen && (
        <div
          className={`absolute top-full left-0 right-0 mt-1.5 z-50 rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 max-h-72 flex flex-col min-w-[260px] ${dark
              ? 'bg-slate-900 border-slate-700 text-white shadow-black/80'
              : 'bg-white border-[#E6DFD5] text-[#18181B] shadow-amber-950/10'
            }`}
        >
          {/* Quick Popular Hubs Pills (shown when input is empty or "All Indian Cities") */}
          {(!inputValue.trim() || inputValue === 'All Indian Cities') && (
            <div
              className={`p-2.5 border-b shrink-0 ${dark ? 'bg-slate-950/70 border-slate-800' : 'bg-[#FAF7F2] border-[#E6DFD5]'
                }`}
            >
              <div
                className={`text-[10px] font-bold uppercase tracking-wider font-label-mono-sm mb-1.5 flex items-center gap-1 ${dark ? 'text-slate-400' : 'text-[#807663]'
                  }`}
              >
                <Sparkles className="w-3 h-3 text-[#c59a27]" />
                <span>Popular Hubs</span>
              </div>
              <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                {allowAllCities && (
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect('All');
                    }}
                    className={`text-[11px] px-2 py-0.5 rounded-lg border font-medium transition-colors cursor-pointer ${isAllCities
                        ? 'bg-[#775a00] text-white border-[#775a00]'
                        : dark
                          ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-500'
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
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(city);
                    }}
                    className={`text-[11px] px-2 py-0.5 rounded-lg border font-medium transition-colors cursor-pointer ${value === city
                        ? 'bg-[#775a00] text-white border-[#775a00]'
                        : dark
                          ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-500'
                          : 'bg-white text-[#4e4635] border-[#E6DFD5] hover:border-[#c59a27]'
                      }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cities Scroll List */}
          <div
            className={`overflow-y-auto py-1 px-1 flex-1 divide-y ${dark ? 'divide-slate-800' : 'divide-[#FAF7F2]'
              }`}
          >
            {/* Custom Typed City Confirmation */}
            {inputValue.trim().length > 1 &&
              inputValue !== 'All Indian Cities' &&
              !INDIAN_CITIES_DATA.some(
                (c) => c.name.toLowerCase() === inputValue.trim().toLowerCase()
              ) && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(inputValue.trim());
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors mb-1 cursor-pointer ${dark
                      ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                      : 'bg-[#ffdf9a]/30 text-[#775a00] hover:bg-[#ffdf9a]/50'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#c59a27]" />
                    <span>
                      Select &quot;<strong>{inputValue.trim()}</strong>&quot;
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold opacity-75">Use Custom</span>
                </button>
              )}

            {/* All Indian Cities Option */}
            {showAllOption && (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect('All');
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer mb-1 ${isAllCities
                    ? dark
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'bg-[#ffdf9a]/40 text-[#775a00] font-bold border border-[#c59a27]/30'
                    : dark
                      ? 'text-white hover:bg-slate-800'
                      : 'text-[#18181B] hover:bg-[#FAF7F2]'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#c59a27]/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-3 h-3 text-[#775a00]" />
                  </div>
                  <div>
                    <span className="font-semibold">All Indian Cities (Pan-India)</span>
                    <span className={`block text-[10px] ${dark ? 'text-slate-400' : 'text-[#807663]'}`}>
                      Browse nationwide experiences across all India
                    </span>
                  </div>
                </div>
                {isAllCities && <Check className="w-4 h-4 text-[#775a00] shrink-0" />}
              </button>
            )}

            {filteredCities.length === 0 ? (
              <div className="p-4 text-center text-xs">
                <p className={`font-medium ${dark ? 'text-white' : 'text-[#18181B]'}`}>
                  No prelisted city for &quot;{inputValue}&quot;
                </p>
                <p className={`mt-1 text-[11px] ${dark ? 'text-slate-400' : 'text-[#807663]'}`}>
                  Press Enter or click above to use &quot;{inputValue.trim()}&quot;.
                </p>
                {allowAllCities && (
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect('All');
                    }}
                    className="mt-2.5 px-3 py-1 rounded-lg bg-[#FAF7F2] text-[#775a00] font-semibold text-xs border border-[#E6DFD5] hover:border-[#c59a27] cursor-pointer"
                  >
                    Select All Cities
                  </button>
                )}
              </div>
            ) : (
              filteredCities.map((item, idx) => {
                const isSelected = value === item.name;
                const isHighlighted = idx === highlightedIndex;
                return (
                  <button
                    key={`${item.name}-${item.state}`}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(item.name);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${isSelected
                        ? dark
                          ? 'bg-amber-500/20 text-amber-300 font-bold'
                          : 'bg-[#ffdf9a]/40 text-[#775a00] font-bold'
                        : isHighlighted
                          ? dark
                            ? 'bg-slate-800 text-white'
                            : 'bg-[#f5f3ef] text-[#18181B]'
                          : dark
                            ? 'text-white hover:bg-slate-800'
                            : 'text-[#18181B] hover:bg-[#FAF7F2]'
                      }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-semibold truncate">{item.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 ${dark
                            ? 'bg-slate-800 text-slate-400 border-slate-700'
                            : 'bg-[#FAF7F2] text-[#807663] border-[#E6DFD5]'
                          }`}
                      >
                        {item.state}
                      </span>
                      {item.isPopular && (
                        <span className="text-[9px] text-[#775a00] font-bold uppercase tracking-wider bg-[#c59a27]/10 px-1 rounded shrink-0">
                          Top Hub
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#775a00] shrink-0 ml-2" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div
            className={`p-2 border-t text-[10px] text-center shrink-0 font-label-mono-sm ${dark
                ? 'bg-slate-950/80 border-slate-800 text-slate-400'
                : 'bg-[#FAF7F2] border-[#E6DFD5] text-[#807663]'
              }`}
          >
            Type to search across 310+ Indian Cities &amp; States
          </div>
        </div>
      )}
    </div>
  );
}
