'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SUPPORTED_CITIES } from '@/lib/mock-data';
import { ALL_INDIAN_CITIES, POPULAR_INDIAN_CITIES } from '@/lib/indian-cities';
import { store } from '@/lib/store';
import { UserRole } from '@/types';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = store.getSelectedCity();
      if (saved) setSelectedCity(saved);

      const handleCityChange = (e: any) => {
        if (e.detail?.city) {
          setSelectedCity(e.detail.city);
        }
      };
      window.addEventListener('dastan_city_changed', handleCityChange);
      return () => window.removeEventListener('dastan_city_changed', handleCityChange);
    }
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    store.setCurrentRole(role);
    setIsRoleOpen(false);
    router.push(`/${role}`);
  };

  const navLinks = [
    { label: 'Live Events', href: '/events' },
    { label: 'Dining Deals', href: '/dining' },
    { label: 'Social Table', href: '/#social-experience' },
    { label: 'Vendor Portal', href: '/vendor' },
    { label: 'Admin Hub', href: '/admin' },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-xl border-b border-[#E6DFD5] shadow-[0_2px_16px_rgba(119,90,0,0.06)]">
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo & City Picker */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/dastan-emblem.png"
              alt="Dastan Heritage Experiences Emblem"
              className="h-11 w-11 object-contain rounded-md shadow-sm group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-xl sm:text-2xl tracking-wider text-[#775a00] font-bold leading-none">
                DASTAN
              </span>
              <span className="font-label-mono-sm text-[9px] text-[#4e4635] tracking-[0.25em] uppercase leading-tight font-semibold">
                Experiences
              </span>
            </div>
          </Link>

          {/* Enclave City Selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setIsCityOpen(!isCityOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5f3ef]/80 border border-[#d1c5af]/60 text-[#4e4635] hover:border-[#775a00]/50 hover:text-[#1b1c1a] transition-all duration-200 group"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-[#775a00]">
                location_on
              </span>
              <span className="text-xs font-semibold tracking-wide">{selectedCity}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#c59a27] shadow-[0_0_8px_rgba(197,154,39,0.5)]"></span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-y-0.5 transition-transform text-[#807663]">
                arrow_drop_down
              </span>
            </button>

            {isCityOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl p-2 z-50 border border-[#E6DFD5] max-h-80 flex flex-col">
                <div className="p-1.5 border-b border-[#E6DFD5] mb-1">
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    placeholder="Search Indian cities..."
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD5] focus:border-[#775a00] rounded-lg px-2.5 py-1.5 text-xs text-[#18181B] placeholder-[#807663] focus:outline-none transition-colors"
                  />
                </div>
                <div className="font-label-mono-sm text-[10px] font-bold text-[#807663] px-3 py-1 uppercase tracking-wider">
                  {citySearch ? 'Matching Cities' : 'Enclave & Major Cities'}
                </div>
                <div className="overflow-y-auto flex-1 space-y-0.5">
                  {(citySearch
                    ? ALL_INDIAN_CITIES.filter((c) =>
                        c.toLowerCase().includes(citySearch.toLowerCase())
                      )
                    : (POPULAR_INDIAN_CITIES as readonly string[])
                  ).map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        store.setSelectedCity(city);
                        setIsCityOpen(false);
                        setCitySearch('');
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-xl flex items-center justify-between transition-colors ${
                        selectedCity === city
                          ? 'bg-[#ffdf9a]/40 text-[#775a00] font-bold'
                          : 'text-[#18181b] hover:bg-[#f5f3ef]'
                      }`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#775a00]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 h-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`font-body-md text-sm py-2 transition-colors ${
                  isActive
                    ? 'font-bold text-[#775a00] border-b-2 border-[#775a00]'
                    : 'text-[#4e4635] hover:text-[#18181b]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Search */}
          <div className="relative hidden xl:flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[#807663] text-[18px]">
              search
            </span>
            <input
              className="w-52 pl-9 pr-12 py-1.5 rounded-full bg-white border border-[#d1c5af]/70 text-[#1b1c1a] font-body-sm text-xs placeholder:text-[#807663] focus:outline-none focus:border-[#775a00] transition-all shadow-sm"
              placeholder="Search experiences..."
              type="text"
            />
            <kbd className="absolute right-2.5 px-1.5 py-0.5 rounded bg-[#eae8e4] border border-[#d1c5af]/50 font-label-mono-sm text-[10px] text-[#4e4635]">
              ⌘K
            </kbd>
          </div>

          {/* Host Experience Button */}
          <Link
            href="/vendor"
            className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-lg border border-[#775a00]/40 hover:border-[#775a00] bg-[#775a00]/5 hover:bg-[#775a00]/10 text-[#775a00] font-title-md text-xs font-semibold tracking-wide transition-all shadow-sm"
          >
            Host an Experience
          </Link>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsRoleOpen(!isRoleOpen)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f5f3ef] border border-[#e6dfd5] text-xs font-medium text-[#4e4635] hover:border-[#775a00]"
              title="Switch Platform View"
            >
              <span className="material-symbols-outlined text-[15px] text-[#775a00]">
                shield_person
              </span>
              <span className="capitalize text-[11px] font-bold">{currentRole}</span>
              <span className="material-symbols-outlined text-[14px] text-[#807663]">
                expand_more
              </span>
            </button>

            {isRoleOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white shadow-xl p-2 z-50 border border-[#E6DFD5]">
                <div className="font-label-mono-sm text-[10px] font-bold text-[#807663] px-3 py-1 uppercase tracking-wider">
                  Select Persona
                </div>
                {(['customer', 'vendor', 'admin'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-xl capitalize flex items-center justify-between transition-colors ${
                      currentRole === role
                        ? 'bg-[#ffdf9a]/40 text-[#775a00] font-bold'
                        : 'text-[#18181b] hover:bg-[#f5f3ef]'
                    }`}
                  >
                    <span>{role}</span>
                    {currentRole === role && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#775a00]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Customer Profile Icon */}
          <Link
            href="/customer"
            className="relative flex items-center p-[2px] rounded-full ring-2 ring-[#775a00]/60 shadow-[0_0_12px_rgba(197,154,39,0.35)] hover:scale-105 transition-transform"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#775a00] to-[#c59a27] text-white flex items-center justify-center font-bold text-xs shadow-inner">
              DE
            </div>
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#c59a27] ring-2 ring-white"></span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 rounded-xl text-[#4e4635] hover:text-[#18181b] hover:bg-[#f5f3ef]"
            aria-label="Toggle navigation"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isMobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden border-t border-[#E6DFD5] bg-white px-4 py-6 space-y-4 shadow-xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#18181b] hover:bg-[#f5f3ef] hover:text-[#775a00]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-[#E6DFD5] flex flex-col gap-2">
            <Link
              href="/vendor"
              onClick={() => setIsMobileOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#c59a27] to-[#775a00] text-white font-semibold text-xs shadow-md"
            >
              Host an Experience
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
