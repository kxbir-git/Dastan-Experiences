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
  confirmed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  checked_in: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  pending_payment: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  cancelled: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  refunded: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">All Bookings</h1>
        <p className="text-xs text-slate-400 mt-0.5">Platform-wide booking management and refund controls</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: bookings.length, color: 'text-white' },
          { label: 'Confirmed', value: bookings.filter((b) => b.status === 'confirmed').length, color: 'text-emerald-400' },
          { label: 'GMV', value: formatINR(totalGMV), color: 'text-amber-400' },
          { label: 'Refunded', value: formatINR(totalRefunds), color: 'text-rose-400' },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-2xl p-4 border border-slate-800">
            <div className={`text-lg font-black ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Issue Refund Panel */}
      <div className="glass-panel rounded-3xl p-6 border border-rose-500/20 space-y-4">
        <h2 className="text-sm font-bold text-rose-400 flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Issue Refund via Razorpay
        </h2>
        <form onSubmit={handleRefund} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={refundId}
            onChange={(e) => setRefundId(e.target.value)}
            placeholder="Booking ID (e.g. bk-94821)"
            required
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50 transition-colors"
          />
          <input
            type="text"
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            placeholder="Refund reason"
            required
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={refundLoading || !refundId}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-sm border border-rose-500/30 transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {refundLoading ? (
              <div className="w-4 h-4 border-2 border-rose-300/30 border-t-rose-300 rounded-full animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            Issue Refund
          </button>
        </form>
        {refundMessage && (
          <div className={`flex items-start gap-2 p-3 rounded-xl text-xs font-medium ${
            refundMessage.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}>
            {refundMessage.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            {refundMessage.text}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
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
          <div key={booking.id} className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-bold text-amber-400">{booking.bookingNumber}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[booking.status]}`}>
                  {booking.status.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-slate-500">
                  {booking.bookingType === 'event' ? '🎫 Event' : '🍽️ Dining'}
                </span>
              </div>
              <div className="text-sm font-bold text-white">{booking.eventTitle || booking.restaurantName}</div>
              <div className="text-xs text-slate-400 mt-0.5">
                {booking.customerName} · {booking.bookingDate} · {booking.quantity} guest{booking.quantity > 1 ? 's' : ''}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-slate-500">Total</div>
              <div className="text-sm font-black text-amber-400">{formatINR(booking.totalAmount)}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">ID: {booking.id}</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">No bookings match your filters.</div>
        )}
      </div>
    </div>
  );
}
