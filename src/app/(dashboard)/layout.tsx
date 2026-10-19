'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Ticket,
  UtensilsCrossed,
  User,
  QrCode,
  TrendingUp,
  Store,
  Calendar,
  ChevronRight,
  Sparkles,
  Building,
  Receipt,
  Sliders,
  FileText,
  RotateCcw,
  Tag,
  Menu,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { store } from '@/lib/store';

import { useRouter } from 'next/navigation';
import { isAdminUnlocked, lockAdmin } from '@/lib/admin-auth';

const NAV_ITEMS = {
  customer: [
    { href: '/customer', icon: LayoutDashboard, label: 'My Dashboard' },
    { href: '/customer/profile', icon: User, label: 'Profile & Settings' },
    { href: '/events', icon: Ticket, label: 'Browse Events' },
    { href: '/dining', icon: UtensilsCrossed, label: 'Browse Dining' },
  ],
  vendor: [
    { href: '/vendor', icon: LayoutDashboard, label: 'Overview' },
    { href: '/vendor/events', icon: Calendar, label: 'My Events' },
    { href: '/vendor/dining', icon: Store, label: 'Restaurants & Deals' },
    { href: '/vendor/bookings', icon: Ticket, label: 'Bookings' },
    { href: '/vendor/subscription', icon: Sparkles, label: 'Subscriptions & Boosts' },
    { href: '/vendor/payouts', icon: Receipt, label: 'Earnings & Payouts' },
    { href: '/vendor/scanner', icon: QrCode, label: 'QR Check-In Scanner' },
    { href: '/vendor/kyc', icon: Building, label: 'KYC & Bank Details' },
  ],
  admin: [
    { href: '/admin', icon: TrendingUp, label: 'Revenue Dashboard' },
    { href: '/admin/sponsors', icon: ImageIcon, label: 'Sponsors & Ad Banners' },
    { href: '/admin/payouts', icon: Receipt, label: 'Payout Reports & Route' },
    { href: '/admin/refunds', icon: RotateCcw, label: 'Refund Management' },
    { href: '/admin/promos', icon: Tag, label: 'Promo Codes' },
    { href: '/admin/vendors', icon: Store, label: 'Vendors & KYC' },
    { href: '/admin/events', icon: Calendar, label: 'Listings Moderation' },
    { href: '/admin/bookings', icon: Ticket, label: 'All Bookings' },
    { href: '/admin/settings', icon: Sliders, label: 'Platform Settings' },
  ],
};

const ROLE_LABELS = {
  customer: 'Customer',
  vendor: 'Vendor',
  admin: 'Admin',
};

const ROLE_COLORS = {
  customer: 'text-[#775a00] bg-[#ffdf9a]/40 border-[#c59a27]/30',
  vendor: 'text-[#4f5e81] bg-[#c5d4fd]/40 border-[#4f5e81]/30',
  admin: 'text-[#e11d48] bg-rose-50 border-rose-200',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [role, setRole] = useState<'customer' | 'vendor' | 'admin'>(() => {
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/vendor')) return 'vendor';
    return 'customer';
  });

  useEffect(() => {
    setAdminUnlocked(isAdminUnlocked());

    const handleAdminChange = (e: any) => {
      setAdminUnlocked(Boolean(e?.detail?.unlocked));
    };

    window.addEventListener('dastan_admin_status_changed', handleAdminChange);
    return () => window.removeEventListener('dastan_admin_status_changed', handleAdminChange);
  }, []);

  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      setRole('admin');
      store.setCurrentRole('admin');
    } else if (pathname.startsWith('/vendor')) {
      setRole('vendor');
      store.setCurrentRole('vendor');
    } else if (pathname.startsWith('/customer')) {
      setRole('customer');
      store.setCurrentRole('customer');
    }
  }, [pathname]);

  const user = store.getCurrentUser();
  const navItems = NAV_ITEMS[role] || NAV_ITEMS.customer;

  const handleRoleSwitch = (newRole: 'customer' | 'vendor' | 'admin') => {
    store.setCurrentRole(newRole);
    setRole(newRole);
    router.push(`/${newRole}`);
  };

  const handleLockAdmin = () => {
    lockAdmin();
    setAdminUnlocked(false);
    setRole('customer');
    router.push('/');
  };

  const visibleRoles: ('customer' | 'vendor' | 'admin')[] = adminUnlocked
    ? ['customer', 'vendor', 'admin']
    : ['customer', 'vendor'];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white text-[#18181B]">
      {/* Brand */}
      <div className="p-5 border-b border-[#E6DFD5]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/dastan-emblem.png"
            alt="Dastan Emblem"
            className="w-9 h-9 object-contain rounded-md shadow-sm group-hover:scale-105 transition-transform"
          />
          <div className="min-w-0">
            <div className="font-headline-sm font-bold text-[#775a00] text-base tracking-wider leading-none">
              DASTAN
            </div>
            <div className="font-label-mono-sm text-[9px] uppercase tracking-widest text-[#4e4635] font-semibold mt-1">
              Experiences
            </div>
          </div>
        </Link>
      </div>

      {/* User Profile + Role Badge */}
      <div className="p-4 border-b border-[#E6DFD5] bg-[#FAF7F2]">
        <div className="flex items-center gap-3">
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="w-10 h-10 rounded-full object-cover border-2 border-[#c59a27]"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-[#18181B] truncate">{user.fullName}</div>
            <div className="text-[10px] text-[#71717A] truncate font-label-mono-sm">{user.email}</div>
          </div>
        </div>

        {/* Role Switcher - Admin is only visible if unlocked */}
        <div className="mt-3 flex gap-1 items-center">
          {visibleRoles.map((r) => (
            <button
              key={r}
              onClick={() => handleRoleSwitch(r)}
              className={`flex-1 px-1.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                role === r
                  ? ROLE_COLORS[r]
                  : 'text-[#807663] bg-white border-[#E6DFD5] hover:bg-[#FAF7F2]'
              }`}
            >
              {ROLE_LABELS[r]}
            </button>
          ))}
          {adminUnlocked && (
            <button
              onClick={handleLockAdmin}
              title="Lock Admin session"
              className="p-1 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#ffdf9a]/40 text-[#775a00] border border-[#c59a27]/30 font-bold'
                  : 'text-[#4e4635] hover:text-[#18181B] hover:bg-[#FAF7F2]'
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#775a00]' : 'text-[#807663]'}`} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60 text-[#775a00]" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Links */}
      <div className="p-3 border-t border-[#E6DFD5] space-y-0.5 bg-[#FAF7F2]">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#71717A] hover:text-[#18181B] hover:bg-white transition-all"
        >
          <FileText className="w-4 h-4 text-[#807663]" />
          <span>Back to Main Site</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] text-[#18181B]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 xl:w-64 border-r border-[#E6DFD5] bg-white fixed top-0 left-0 h-full z-30 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-[#E6DFD5] z-50 transition-transform duration-300 lg:hidden shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg bg-[#FAF7F2] text-[#807663] hover:text-[#18181B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-60 xl:ml-64 flex flex-col min-h-screen">
        {/* Top Bar (Mobile) */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 border-b border-[#E6DFD5] bg-white/95 backdrop-blur-xl">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-[#FAF7F2] text-[#18181B] hover:bg-[#efeeea] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <img src="/dastan-emblem.png" alt="Dastan" className="w-7 h-7 object-contain rounded" />
            <span className="font-headline-sm font-bold text-[#775a00] text-sm">DASTAN</span>
          </Link>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${ROLE_COLORS[role]}`}>
            {ROLE_LABELS[role]}
          </span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#FDFBF7]">
          {children}
        </main>
      </div>
    </div>
  );
}
