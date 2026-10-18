'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Ticket,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  QrCode,
  UtensilsCrossed,
  Calendar,
  Download,
  Check,
  User,
  Filter,
} from 'lucide-react';
import { store } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import type { Booking, BookingStatus } from '@/types';

const STATUS_STYLE: Record<BookingStatus, string> = {
  confirmed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  checked_in: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  pending_payment: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  cancelled: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  refunded: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  pending_payment: 'Awaiting Payment',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export default function VendorBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(store.getBookings());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'event' | 'dining'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [checkInFeedback, setCheckInFeedback] = useState<string | null>(null);

  const reload = () => setBookings([...store.getBookings()]);

  const filtered = bookings.filter((b) => {
    const matchSearch =
      !search ||
      b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (b.eventTitle || b.restaurantName || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.tierName || b.offerTitle || '').toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || b.bookingType === typeFilter;
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const totalRevenue = filtered
    .filter((b) => b.status !== 'refunded' && b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const handleInstantCheckIn = async (qrHash: string, customerName: string) => {
    try {
      const res = await fetch('/api/bookings/verify-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrHash }),
      });
      const data = await res.json();
      if (res.ok) {
        setCheckInFeedback(`Checked in ${customerName} successfully!`);
        reload();
        setTimeout(() => setCheckInFeedback(null), 3500);
      } else {
        alert(data.error || 'Check-in failed');
      }
    } catch {
      alert('Network error during check-in');
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Booking Ref',
      'Customer Name',
      'Email',
      'Booking Type',
      'Listing Title',
      'Tier / Deal',
      'Guests',
      'Date',
      'Amount',
      'Status',
      'QR Hash',
    ];

    const rows = filtered.map((b) => [
      b.bookingNumber,
      `"${b.customerName}"`,
      b.customerEmail,
      b.bookingType,
      `"${b.eventTitle || b.restaurantName || ''}"`,
      `"${b.tierName || b.offerTitle || ''}"`,
      b.quantity,
      b.bookingDate,
      b.totalAmount,
      b.status,
      b.qrCodeHash,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bookings_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Ticket className="w-3.5 h-3.5" />
            <span>Guest List & Reservation Roster</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-0.5">Booking Management</h1>
          <p className="text-xs text-slate-400">
            Admit attendees, review ticket tiers, track revenue splits, and export guest manifests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            Export CSV
          </button>
          <Link
            href="/vendor/scanner"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl saffron-gradient text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
          >
            <QrCode className="w-4 h-4" />
            QR Scanner
          </Link>
        </div>
      </div>

      {checkInFeedback && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{checkInFeedback}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: bookings.length, color: 'text-white' },
          { label: 'Confirmed Guests', value: bookings.filter((b) => b.status === 'confirmed').length, color: 'text-emerald-400' },
          { label: 'Admitted / Checked In', value: bookings.filter((b) => b.status === 'checked_in').length, color: 'text-blue-400' },
          { label: 'Total Value', value: formatINR(totalRevenue), color: 'text-amber-400' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-4 border border-slate-800">
            <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, booking #, event, or tier..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
        >
          <option value="all">All Experiences</option>
          <option value="event">Live Events</option>
          <option value="dining">Social Dining</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
        >
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked_in">Checked In</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="refunded">Refunded</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Bookings List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <div
              key={booking.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-amber-400">{booking.bookingNumber}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[booking.status]}`}>
                    {STATUS_LABEL[booking.status]}
                  </span>
                  {booking.bookingType === 'event' ? (
                    <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Ticket className="w-2.5 h-2.5" /> Event
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <UtensilsCrossed className="w-2.5 h-2.5" /> Dining
                    </span>
                  )}
                  {booking.tierName && (
                    <span className="text-[10px] font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                      Tier: {booking.tierName}
                    </span>
                  )}
                  {booking.offerTitle && (
                    <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      Deal: {booking.offerTitle}
                    </span>
                  )}
                </div>

                <div className="text-sm font-bold text-white">
                  {booking.eventTitle || booking.restaurantName}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    {booking.customerName} ({booking.customerEmail})
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {booking.bookingDate} {booking.timeSlot ? `· ${booking.timeSlot}` : ''}
                  </span>
                  <span>×{booking.quantity} guest{booking.quantity > 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Amount</div>
                  <div className="text-base font-black text-amber-400">{formatINR(booking.totalAmount)}</div>
                </div>

                <div className="flex items-center gap-2">
                  {booking.status === 'confirmed' && (
                    <button
                      type="button"
                      onClick={() => handleInstantCheckIn(booking.qrCodeHash, booking.customerName)}
                      className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Admit
                    </button>
                  )}

                  <Link
                    href={`/customer/bookings/${booking.id}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors whitespace-nowrap"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-400" />
                    Pass
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-panel rounded-3xl border border-slate-800 space-y-3">
          <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No bookings found</h3>
          <p className="text-xs text-slate-400">
            {search || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search filters.'
              : 'Bookings will appear here when customers book your live events or table deals.'}
          </p>
        </div>
      )}
    </div>
  );
}
