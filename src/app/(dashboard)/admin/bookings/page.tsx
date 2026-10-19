'use client';

import React, { useState } from 'react';
import { store } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import {
  Search,
  Ticket,
  UtensilsCrossed,
  Calendar,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Filter,
} from 'lucide-react';
import type { BookingStatus } from '@/types';

const STATUS_STYLE: Record<BookingStatus, string> = {
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  checked_in: 'bg-blue-50 text-blue-700 border-blue-200',
  pending_payment: 'bg-amber-50 text-amber-800 border-amber-200',
  cancelled: 'bg-slate-100 text-slate-700 border-slate-200',
  refunded: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState(store.getBookings());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refundId, setRefundId] = useState('');
  const [refundReason, setRefundReason] = useState('Customer cancellation request');
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundMessage, setRefundMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filtered = bookings.filter((b) => {
    const matchSearch =
      !search ||
      b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (b.eventTitle || b.restaurantName || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundId) return;

    setRefundLoading(true);
    setRefundMessage(null);

    try {
      const res = await fetch('/api/admin/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: refundId, reason: refundReason }),
      });
      const data = await res.json();
      if (data.success) {
        setRefundMessage({ type: 'success', text: `Refund issued for ${refundId}. Razorpay Refund ID: ${data.razorpayRefundId || 'rfnd_demo_' + Date.now()}` });
        setBookings(store.getBookings());
        setRefundId('');
      } else {
        setRefundMessage({ type: 'error', text: data.error || 'Refund failed' });
      }
    } catch {
      setRefundMessage({ type: 'error', text: 'Network error processing refund' });
    } finally {
      setRefundLoading(false);
    }
  };

  const totalGMV = bookings
    .filter((b) => b.status !== 'refunded' && b.status !== 'cancelled')
    .reduce((s, b) => s + b.totalAmount, 0);
  const totalRefunds = bookings.filter((b) => b.status === 'refunded').reduce((s, b) => s + b.totalAmount, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DFD5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#775a00] uppercase tracking-wider mb-1">
            <Ticket className="w-4 h-4" />
            <span>Master Guest Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight">Platform Bookings</h1>
          <p className="text-xs text-[#71717A] mt-1">Platform-wide booking management, guest attendance and refund controls</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: bookings.length, color: 'text-[#18181B]' },
          { label: 'Confirmed', value: bookings.filter((b) => b.status === 'confirmed').length, color: 'text-emerald-700' },
          { label: 'Gross GMV', value: formatINR(totalGMV), color: 'text-[#775a00]' },
          { label: 'Total Refunded', value: formatINR(totalRefunds), color: 'text-rose-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-[#E6DFD5] shadow-xs">
            <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-[#71717A] uppercase tracking-wider mt-1 font-bold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Issue Refund Panel */}
      <div className="bg-white rounded-3xl p-6 border border-[#E6DFD5] shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-rose-700 flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Issue Direct Refund via Razorpay
        </h2>
        <form onSubmit={handleRefund} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={refundId}
            onChange={(e) => setRefundId(e.target.value)}
            placeholder="Booking ID (e.g. bk-94821)"
            required
            className="flex-1 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl px-3.5 py-2.5 text-xs text-[#18181B] placeholder-[#A1A1AA] focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
          />
          <input
            type="text"
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            placeholder="Refund reason"
            required
            className="flex-1 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl px-3.5 py-2.5 text-xs text-[#18181B] placeholder-[#A1A1AA] focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={refundLoading || !refundId}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-60 whitespace-nowrap shadow-xs cursor-pointer"
          >
            {refundLoading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            Issue Refund
          </button>
        </form>
        {refundMessage && (
          <div className={`flex items-start gap-2 p-3 rounded-xl text-xs font-semibold ${
            refundMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}>
            {refundMessage.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            {refundMessage.text}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by booking #, customer, or title..."
            className="w-full bg-white border border-[#E6DFD5] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#18181B] placeholder-[#A1A1AA] focus:outline-none focus:border-[#775a00] shadow-xs"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-[#E6DFD5] rounded-xl px-3 py-2.5 text-xs text-[#18181B] focus:outline-none focus:border-[#775a00] shadow-xs cursor-pointer font-medium"
        >
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked_in">Checked In</option>
          <option value="pending_payment">Pending</option>
          <option value="refunded">Refunded</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {filtered.map((booking) => (
          <div key={booking.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E6DFD5] shadow-xs flex flex-col sm:flex-row sm:items-center gap-4 hover:border-[#775a00]/40 transition-all">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-mono font-bold text-[#775a00]">{booking.bookingNumber}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[booking.status]}`}>
                  {booking.status.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-[#71717A] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#E6DFD5]">
                  {booking.bookingType === 'event' ? '🎫 Event' : '🍽️ Dining'}
                </span>
              </div>
              <div className="text-sm font-bold text-[#18181B]">{booking.eventTitle || booking.restaurantName}</div>
              <div className="text-xs text-[#71717A] mt-1">
                {booking.customerName} · {booking.bookingDate} · {booking.quantity} guest{booking.quantity > 1 ? 's' : ''}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[10px] text-[#71717A] uppercase font-bold">Total Paid</div>
              <div className="text-base font-extrabold text-[#775a00]">{formatINR(booking.totalAmount)}</div>
              <div className="text-[10px] font-mono text-[#71717A] mt-0.5">ID: {booking.id}</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#E6DFD5] text-[#71717A] text-sm">
            No bookings match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
