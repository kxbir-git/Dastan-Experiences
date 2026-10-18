'use client';

import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Search,
  DollarSign,
  Ticket,
  Clock,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';
import { store } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import { RefundRecord, Booking } from '@/types';

export default function AdminRefundsPage() {
  const [refunds, setRefunds] = useState<RefundRecord[]>(store.getRefunds());
  const [bookings, setBookings] = useState<Booking[]>(store.getBookings());
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [refundReason, setRefundReason] = useState('Customer cancellation within 48h window');
  const [customReason, setCustomReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const reloadData = () => {
    setRefunds([...store.getRefunds()]);
    setBookings([...store.getBookings()]);
  };

  const handleExecuteRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) return;

    try {
      setProcessing(true);
      setFeedback(null);

      const finalReason = customReason.trim() || refundReason;

      const res = await fetch('/api/admin/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBookingId,
          reason: finalReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Refund failed');
      }

      setFeedback({
        success: true,
        message: `Refund of ₹${data.amountRefunded} successfully triggered via Razorpay API (Ref: ${data.razorpayRefundId})`,
      });
      setSelectedBookingId('');
      setCustomReason('');
      reloadData();
    } catch (err: any) {
      setFeedback({
        success: false,
        message: err.message || 'Refund dispatch failed',
      });
    } finally {
      setProcessing(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const eligibleBookings = bookings.filter((b) => b.status === 'confirmed');
  const totalRefundAmount = refunds.reduce((sum, r) => sum + r.amount, 0);

  const filteredRefunds = refunds.filter(
    (r) =>
      r.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
            <RotateCcw className="w-4 h-4" />
            <span>Razorpay Payments & Chargebacks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Refund Management Hub</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated payment reversals, booking cancellation audits, and seat inventory recovery.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Total Reversals</div>
            <div className="text-lg font-black text-rose-400">{formatINR(totalRefundAmount)}</div>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center gap-2 ${
            feedback.success
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Two Column Layout: Trigger Refund Card & Policy Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Trigger Refund Card (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-rose-500/20 space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
            <RotateCcw className="w-4 h-4" />
            <span>Process Instant Razorpay Refund</span>
          </div>

          <form onSubmit={handleExecuteRefund} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Select Confirmed Booking to Refund
              </label>
              <select
                value={selectedBookingId}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white cursor-pointer focus:outline-none focus:border-rose-500"
              >
                <option value="">-- Choose eligible confirmed booking ({eligibleBookings.length} available) --</option>
                {eligibleBookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bookingNumber} — {b.customerName} ({formatINR(b.totalAmount)}) —{' '}
                    {b.eventTitle || b.restaurantName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Refund Reason Category</label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white cursor-pointer focus:outline-none focus:border-rose-500"
              >
                <option value="Customer cancellation within 48h window">Customer cancellation within 48h window</option>
                <option value="Event rescheduled or lineup change">Event rescheduled or lineup change</option>
                <option value="Host capacity or booking dispute resolved">Host capacity or booking dispute resolved</option>
                <option value="Technical or duplicate payment error">Technical or duplicate payment error</option>
                <option value="Other">Other (specify below)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Additional Internal Notes / Audit Memo</label>
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Optional detailed reason or ticket ID..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={processing || !selectedBookingId}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <RotateCcw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
              <span>{processing ? 'Processing Razorpay Reversal...' : 'Execute Razorpay Instant Refund'}</span>
            </button>
          </form>
        </div>

        {/* Policy & Inventory Recovery Box (1 col) */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Info className="w-4 h-4" />
            <span>Settlement Recovery Rules</span>
          </div>

          <div className="space-y-3 text-xs text-slate-400">
            <p>
              When an admin refund is executed:
            </p>
            <ul className="list-disc pl-4 space-y-2 text-slate-300">
              <li>
                <strong className="text-white">Live Razorpay API</strong> reverses payment directly to customer source account (UPI/Card).
              </li>
              <li>
                <strong className="text-white">Seat Capacity Restored</strong>: Event ticket capacity or restaurant covers are released back to public availability.
              </li>
              <li>
                <strong className="text-white">Payout Ledger Adjusted</strong>: The vendor settlement ledger deducts the refunded GMV to prevent over-disbursement.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Refunds History Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white">Refunded Transactions Audit Trail</h2>
            <p className="text-xs text-slate-400">Complete record of reversed transactions and gateway IDs</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by booking or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Booking ID</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Reason</th>
                <th className="pb-3 font-semibold">Razorpay Refund ID</th>
                <th className="pb-3 font-semibold">Initiated By</th>
                <th className="pb-3 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRefunds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500">
                    No refunds matching search.
                  </td>
                </tr>
              ) : (
                filteredRefunds.map((r) => (
                  <tr key={r.id} className="text-slate-300">
                    <td className="py-3 font-mono font-bold text-white">{r.bookingNumber}</td>
                    <td className="py-3 font-semibold text-slate-200">{r.customerName}</td>
                    <td className="py-3 font-bold text-rose-400">{formatINR(r.amount)}</td>
                    <td className="py-3 max-w-xs truncate text-slate-400">{r.reason}</td>
                    <td className="py-3 font-mono text-[11px] text-amber-300">{r.razorpayRefundId || 'rfnd_simulated'}</td>
                    <td className="py-3 text-slate-400">{r.initiatedBy}</td>
                    <td className="py-3 text-right text-slate-500 font-mono text-[11px]">
                      {new Date(r.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
