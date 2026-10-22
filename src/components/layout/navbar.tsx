'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ALL_INDIAN_CITIES,
  POPULAR_INDIAN_CITIES,
  filterIndianCities,
} from '@/lib/indian-cities';
import { store } from '@/lib/store';
import { UserRole } from '@/types';
import { isAdminUnlocked as checkAdminUnlocked, lockAdmin } from '@/lib/admin-auth';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [headerSearch, setHeaderSearch] = useState('');
  const [isMobileCityOpen, setIsMobileCityOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync city, role & admin privileges safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCity = store.getSelectedCity();
      if (savedCity) setSelectedCity(savedCity);

      const unlocked = checkAdminUnlocked();
      setIsAdminUnlocked(unlocked);

      const savedRole = store.getCurrentRole();
      if (pathname.startsWith('/admin')) {
        if (unlocked) {
          setCurrentRole('admin');
        }
      } else if (savedRole === 'admin' && !unlocked) {
        store.setCurrentRole('customer');
        setCurrentRole('customer');
      } else if (savedRole) {
        setCurrentRole(savedRole);
      }

      const handleCityChange = (e: any) => {
        if (e.detail?.city) {
          setSelectedCity(e.detail.city);
        }
      };

      const handleAdminStatusChange = (e: any) => {
        const isUnlocked = Boolean(e.detail?.unlocked);
        setIsAdminUnlocked(isUnlocked);
        if (!isUnlocked && currentRole === 'admin') {
          setCurrentRole('customer');
          store.setCurrentRole('customer');
        }
      };

      window.addEventListener('dastan_city_changed', handleCityChange);
      window.addEventListener('dastan_admin_status_changed', handleAdminStatusChange);
      return () => {
        window.removeEventListener('dastan_city_changed', handleCityChange);
        window.removeEventListener('dastan_admin_status_changed', handleAdminStatusChange);
      };
    }
  }, [pathname, currentRole]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsCityOpen(false);
    setIsRoleOpen(false);
    setIsMobileCityOpen(false);
  }, [pathname]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setIsCityOpen(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key and keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsCityOpen(false);
        setIsRoleOpen(false);
        setIsMobileOpen(false);
      }
      // ⌘K or Ctrl+K shortcut to focus search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    store.setSelectedCity(city);
    setIsCityOpen(false);
    setIsMobileCityOpen(false);
    setCitySearch('');
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    store.setCurrentRole(role);
    setIsRoleOpen(false);
    setIsMobileOpen(false);
    router.push(`/${role}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      setIsMobileOpen(false);
      router.push(`/events?q=${encodeURIComponent(headerSearch.trim())}`);
    }
  };

  // Profile system feature flag — hidden until user enables it
  const ENABLE_PROFILE_SYSTEM = false;

  const navLinks = [
    { label: 'Live Events', href: '/events' },
    ...(ENABLE_PROFILE_SYSTEM ? [{ label: 'My Gate Passes', href: '/customer' }] : []),
    { label: 'About', href: '/about' },
  ];

  const portalLinks = [
    { label: 'Vendor Portal', href: '/vendor' },
    ...(isAdminUnlocked ? [{ label: 'Admin Hub', href: '/admin' }] : []),
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-xl border-b border-[#E6DFD5] shadow-[0_2px_16px_rgba(119,90,0,0.06)] transition-all">
      <div className="h-16 sm:h-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">
        {/* Left Side: Brand Logo, City Selector, and Nav Links */}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 xl:gap-6 min-w-0">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <img
              src="/dastan-emblem.png"
              alt="Dastan Heritage Experiences Emblem"
              className="h-8 w-8 sm:h-11 sm:w-11 object-contain rounded-md shadow-sm group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-lg sm:text-2xl tracking-wider text-[#775a00] font-bold leading-none">
                DASTAN
              </span>
              <span className="font-label-mono-sm text-[8px] sm:text-[9px] text-[#4e4635] tracking-[0.22em] uppercase leading-tight font-semibold">
                Experiences
              </span>
            </div>
          </Link>

          {/* Enclave City Selector (Hidden on mobile, accessible in drawer and desktop/tablet) */}
          <div ref={cityDropdownRef} className="relative hidden md:block shrink-0">
            <button
              onClick={() => setIsCityOpen(!isCityOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5f3ef]/80 border border-[#d1c5af]/60 text-[#4e4635] hover:border-[#775a00]/50 hover:text-[#1b1c1a] transition-all duration-200 group cursor-pointer"
              type="button"
              aria-label="Select city"
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
              <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl p-2 z-50 border border-[#E6DFD5] max-h-80 flex flex-col">
                <div className="p-1.5 border-b border-[#E6DFD5] mb-1">
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    placeholder="Type any Indian city or state..."
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD5] focus:border-[#775a00] rounded-lg px-2.5 py-1.5 text-xs text-[#18181B] placeholder-[#807663] focus:outline-none transition-colors"
                    autoFocus
                  />
                </div>

                <div className="overflow-y-auto flex-1 space-y-0.5 max-h-56">
                  {/* Option for custom typed city */}
                  {citySearch.trim().length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleCitySelect(citySearch.trim())}
                      className="w-full text-left px-3 py-1.5 text-xs rounded-xl flex items-center justify-between bg-[#ffdf9a]/30 text-[#775a00] hover:bg-[#ffdf9a]/50 transition-colors mb-1 font-semibold cursor-pointer"
                    >
                      <span>Use &quot;{citySearch.trim()}&quot;</span>
                      <span className="text-[10px] uppercase opacity-75">Custom</span>
                    </button>
                  )}

                  {/* All Cities Option: Visible when empty or when user types all/india/pan */}
                  {(!citySearch ||
                    /all|india|pan|every|any|nation|sab|bharat|desh/i.test(citySearch)) && (
                    <button
                      type="button"
                      onClick={() => handleCitySelect('All')}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer mb-1 ${
                        selectedCity === 'All'
                          ? 'bg-[#ffdf9a]/40 text-[#775a00] font-bold'
                          : 'text-[#18181b] hover:bg-[#f5f3ef]'
                      }`}
                    >
                      <span className="font-semibold">All Indian Cities (Pan-India)</span>
                      {selectedCity === 'All' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#775a00]" />
                      )}
                    </button>
                  )}

                  <div className="font-label-mono-sm text-[10px] font-bold text-[#807663] px-3 py-1 uppercase tracking-wider">
                    {citySearch ? 'Matching Indian Cities' : 'Popular Cultural Hubs'}
                  </div>

                  {(citySearch
                    ? filterIndianCities(citySearch)
                    : POPULAR_INDIAN_CITIES.map((c) => ({ name: c, state: 'India' }))
                  ).map((item) => {
                    const cityName = typeof item === 'string' ? item : item.name;
                    const stateName = typeof item === 'string' ? '' : item.state;
                    return (
                      <button
                        key={`${cityName}-${stateName}`}
                        onClick={() => handleCitySelect(cityName)}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                          selectedCity === cityName
                            ? 'bg-[#ffdf9a]/40 text-[#775a00] font-bold'
                            : 'text-[#18181b] hover:bg-[#f5f3ef]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span>{cityName}</span>
                          {stateName && stateName !== 'India' && (
                            <span className="text-[9px] text-[#807663] bg-[#FAF7F2] px-1 rounded border border-[#E6DFD5]">
                              {stateName}
                            </span>
                          )}
                        </div>
                        {selectedCity === cityName && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#775a00] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links (placed on the LEFT side next to Logo & City) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`font-body-md text-xs xl:text-sm px-2.5 xl:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'font-bold text-[#775a00] bg-[#ffdf9a]/30 shadow-xs'
                      : 'text-[#4e4635] hover:text-[#18181b] hover:bg-[#f5f3ef]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Quick Search, Host Experience, Role Switcher, Profile, Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5 xl:gap-3 shrink-0 ml-4 xl:ml-8">
          {/* Subtle vertical separator to cleanly isolate Navigation links (Live Events, Passes, About) from Tools */}
          <div className="hidden xl:block h-4 w-px bg-[#E6DFD5] mr-1" />

          {/* Quick Search on Desktop */}
          <form onSubmit={handleSearchSubmit} className="relative hidden xl:flex items-center">
            <span className="material-symbols-outlined absolute left-2.5 text-[#807663] text-[17px]">
              search
            </span>
            <input
              ref={searchInputRef}
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              className="w-36 xl:w-40 2xl:w-52 pl-8 pr-11 py-1.5 rounded-full bg-white border border-[#d1c5af]/70 text-[#1b1c1a] font-body-sm text-xs placeholder:text-[#807663] focus:outline-none focus:border-[#775a00] focus:w-48 2xl:focus:w-56 transition-all shadow-sm"
              placeholder="Search experiences..."
              type="text"
            />
            <kbd className="absolute right-2 px-1.5 py-0.5 rounded bg-[#eae8e4] border border-[#d1c5af]/50 font-label-mono-sm text-[9px] text-[#4e4635] pointer-events-none">
              ⌘K
            </kbd>
          </form>

          {/* Host Experience Button */}
          <Link
            href="/vendor"
            className="hidden md:inline-flex items-center px-3 py-1.5 rounded-lg border border-[#775a00]/40 hover:border-[#775a00] bg-[#775a00]/5 hover:bg-[#775a00]/10 text-[#775a00] font-title-md text-xs font-semibold tracking-wide transition-all shadow-sm shrink-0"
          >
            Host an Experience
          </Link>

          {/* Role Switcher Pill — only visible when admin is unlocked */}
          {isAdminUnlocked && (
            <div ref={roleDropdownRef} className="relative">
              <button
                onClick={() => setIsRoleOpen(!isRoleOpen)}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-[#f5f3ef] border border-[#e6dfd5] text-xs font-medium text-[#4e4635] hover:border-[#775a00] transition-colors cursor-pointer"
                title="Switch Persona View"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px] text-[#775a00]">
                  shield_person
                </span>
                <span className="capitalize text-[11px] font-bold hidden sm:inline">{currentRole}</span>
                <span className="material-symbols-outlined text-[14px] text-[#807663]">
                  expand_more
                </span>
              </button>

              {isRoleOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl p-2 z-50 border border-[#E6DFD5]">
                  <div className="font-label-mono-sm text-[10px] font-bold text-[#807663] px-3 py-1 uppercase tracking-wider">
                    Select Persona
                  </div>
                  {(['customer', 'vendor', 'admin'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(role)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl capitalize flex items-center justify-between transition-colors cursor-pointer ${
                        currentRole === role
                          ? 'bg-[#ffdf9a]/40 text-[#775a00] font-bold'
                          : 'text-[#18181b] hover:bg-[#f5f3ef]'
                      }`}
                    >
                      <span>{role} view</span>
                      {currentRole === role && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#775a00]" />
                      )}
                    </button>
                  ))}
                  <div className="pt-1.5 mt-1.5 border-t border-[#E6DFD5]">
                    <button
                      onClick={() => {
                        lockAdmin();
                        setIsAdminUnlocked(false);
                        setIsRoleOpen(false);
                        setCurrentRole('customer');
                        router.push('/');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-semibold flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>Lock Admin</span>
                      <span className="text-[10px]">🔒</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Customer Profile Icon — hidden until user enables profile system */}
          {ENABLE_PROFILE_SYSTEM && (
            <Link
              href="/customer"
              className="relative flex items-center p-[2px] rounded-full ring-2 ring-[#775a00]/60 shadow-[0_0_12px_rgba(197,154,39,0.35)] hover:scale-105 transition-transform shrink-0"
              title="Customer Profile"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#775a00] to-[#c59a27] text-white flex items-center justify-center font-bold text-[11px] sm:text-xs shadow-inner">
                DE
              </div>
              <span className="absolute top-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#c59a27] ring-2 ring-white"></span>
            </Link>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-[#4e4635] hover:text-[#18181b] hover:bg-[#f5f3ef] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileOpen}
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isMobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 top-16 sm:top-20 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Mobile Nav Drawer */}
      {isMobileOpen && (
        <div className="fixed top-16 sm:top-20 left-0 right-0 max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-5rem)] overflow-y-auto bg-white border-b border-[#E6DFD5] shadow-2xl z-50 lg:hidden px-4 py-5 space-y-4">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#807663] text-[18px]">
              search
            </span>
            <input
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Search concerts, dining, soirees..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-xs text-[#18181B] placeholder-[#807663] focus:outline-none focus:border-[#775a00]"
            />
          </form>

          {/* Mobile City Selector Pill & Dropdown */}
          <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E6DFD5]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#775a00]">
                  location_on
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#807663] tracking-wider">
                    Current City
                  </span>
                  <span className="text-xs font-bold text-[#18181B]">{selectedCity}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileCityOpen(!isMobileCityOpen)}
                className="text-xs font-semibold text-[#775a00] bg-white px-2.5 py-1 rounded-lg border border-[#d1c5af] hover:bg-[#f5f3ef] cursor-pointer"
              >
                {isMobileCityOpen ? 'Done' : 'Change City'}
              </button>
            </div>

            {isMobileCityOpen && (
              <div className="mt-3 pt-3 border-t border-[#E6DFD5] space-y-2">
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Type any Indian city or state..."
                  className="w-full bg-white border border-[#E6DFD5] focus:border-[#775a00] rounded-lg px-2.5 py-1.5 text-xs text-[#18181B] placeholder-[#807663] focus:outline-none"
                />

                {citySearch.trim().length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleCitySelect(citySearch.trim())}
                    className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg bg-[#ffdf9a]/40 text-[#775a00] font-semibold flex items-center justify-between"
                  >
                    <span>Use &quot;{citySearch.trim()}&quot;</span>
                    <span className="text-[10px] uppercase opacity-75">Custom</span>
                  </button>
                )}

                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pt-1">
                  {(!citySearch ||
                    /all|india|pan|every|any|nation|sab|bharat|desh/i.test(citySearch)) && (
                    <button
                      type="button"
                      onClick={() => handleCitySelect('All')}
                      className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                        selectedCity === 'All'
                          ? 'bg-[#775a00] text-white font-bold'
                          : 'bg-white border border-[#E6DFD5] text-[#18181B] hover:bg-[#f5f3ef]'
                      }`}
                    >
                      All Indian Cities
                    </button>
                  )}

                  {(citySearch
                    ? filterIndianCities(citySearch)
                    : POPULAR_INDIAN_CITIES.map((c) => ({ name: c, state: 'India' }))
                  ).map((item) => {
                    const cityName = typeof item === 'string' ? item : item.name;
                    return (
                      <button
                        key={cityName}
                        onClick={() => handleCitySelect(cityName)}
                        className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                          selectedCity === cityName
                            ? 'bg-[#775a00] text-white font-bold'
                            : 'bg-white border border-[#E6DFD5] text-[#18181B] hover:bg-[#f5f3ef]'
                        }`}
                      >
                        {cityName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <div className="font-label-mono-sm text-[10px] font-bold text-[#807663] px-3 py-1 uppercase tracking-wider">
              Experiences
            </div>
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#ffdf9a]/40 text-[#775a00] font-bold'
                      : 'text-[#18181b] hover:bg-[#f5f3ef]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Portals — only show when admin is unlocked */}
          {isAdminUnlocked && (
            <div className="space-y-1 pt-2 border-t border-[#E6DFD5]">
              <div className="font-label-mono-sm text-[10px] font-bold text-[#807663] px-3 py-1 uppercase tracking-wider">
                Host & Admin Portals
              </div>
              {portalLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#ffdf9a]/40 text-[#775a00] font-bold'
                        : 'text-[#4e4635] hover:bg-[#f5f3ef]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Mobile Persona Switcher — only visible when admin is unlocked */}
          {isAdminUnlocked && (
            <div className="pt-2 border-t border-[#E6DFD5]">
              <div className="font-label-mono-sm text-[10px] font-bold text-[#807663] px-3 mb-2 uppercase tracking-wider">
                Switch Persona
              </div>
              <div className="grid grid-cols-3 gap-2 px-1">
                {(['customer', 'vendor', 'admin'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold capitalize text-center transition-colors cursor-pointer ${
                      currentRole === role
                        ? 'bg-[#775a00] text-white shadow-sm'
                        : 'bg-[#f5f3ef] text-[#4e4635] hover:bg-[#e6dfd5]'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  lockAdmin();
                  setIsAdminUnlocked(false);
                  setIsMobileOpen(false);
                  setCurrentRole('customer');
                  router.push('/');
                }}
                className="w-full mt-2 py-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl font-semibold text-center hover:bg-rose-100 transition-colors"
              >
                Lock Admin Session 🔒
              </button>
            </div>
          )}

          {/* Mobile Host CTA */}
          <div className="pt-3 border-t border-[#E6DFD5] flex flex-col gap-2">
            <Link
              href="/vendor"
              onClick={() => setIsMobileOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#c59a27] to-[#775a00] text-white font-semibold text-xs shadow-md active:scale-[0.99] transition-transform"
            >
              Host an Experience
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
