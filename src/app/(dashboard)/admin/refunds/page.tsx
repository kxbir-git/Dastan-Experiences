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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DFD5] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Razorpay Payments & Chargebacks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight">
            Refund Management Hub
          </h1>
          <p className="text-xs text-[#71717A] mt-1 max-w-xl">
            Automated payment reversals, booking cancellation audits, and seat inventory recovery.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#FAF7F2] border border-[#E6DFD5] px-4 py-2.5 rounded-2xl shadow-xs">
          <div className="text-right">
            <div className="text-[10px] text-[#71717A] uppercase font-bold tracking-wider">Total Reversals</div>
            <div className="text-xl font-black text-rose-600">{formatINR(totalRefundAmount)}</div>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 shadow-xs ${
            feedback.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Two Column Layout: Trigger Refund Card & Policy Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Trigger Refund Card (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DFD5] shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider">
            <RotateCcw className="w-4 h-4" />
            <span>Process Instant Razorpay Refund</span>
          </div>

          <form onSubmit={handleExecuteRefund} className="space-y-4 text-xs">
            <div>
              <label className="text-[#18181B] font-semibold block mb-1.5">
                Select Confirmed Booking to Refund
              </label>
              <select
                value={selectedBookingId}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl px-3 py-2.5 text-[#18181B] cursor-pointer focus:outline-none focus:border-rose-500 focus:bg-white font-medium"
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
              <label className="text-[#18181B] font-semibold block mb-1.5">Refund Reason Category</label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl px-3 py-2.5 text-[#18181B] cursor-pointer focus:outline-none focus:border-rose-500 focus:bg-white font-medium"
              >
                <option value="Customer cancellation within 48h window">Customer cancellation within 48h window</option>
                <option value="Event rescheduled or lineup change">Event rescheduled or lineup change</option>
                <option value="Host capacity or booking dispute resolved">Host capacity or booking dispute resolved</option>
                <option value="Technical or duplicate payment error">Technical or duplicate payment error</option>
                <option value="Other">Other (specify below)</option>
              </select>
            </div>

            <div>
              <label className="text-[#18181B] font-semibold block mb-1.5">Additional Internal Notes / Audit Memo</label>
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Optional detailed reason or ticket ID..."
                className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl px-3 py-2.5 text-[#18181B] placeholder-[#A1A1AA] focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={processing || !selectedBookingId}
              className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <RotateCcw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
              <span>{processing ? 'Processing Razorpay Reversal...' : 'Execute Razorpay Instant Refund'}</span>
            </button>
          </form>
        </div>

        {/* Policy & Inventory Recovery Box (1 col) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DFD5] shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#775a00] uppercase tracking-wider">
            <Info className="w-4 h-4" />
            <span>Settlement Recovery Rules</span>
          </div>

          <div className="space-y-3 text-xs text-[#71717A] leading-relaxed">
            <p>
              When an admin refund is executed:
            </p>
            <ul className="list-disc pl-4 space-y-2 text-[#18181B]">
              <li>
                <strong className="text-[#775a00]">Live Razorpay API</strong>: Reverses payment directly to the customer source account (UPI/Card).
              </li>
              <li>
                <strong className="text-[#775a00]">Seat Capacity Restored</strong>: Event ticket capacity or restaurant covers are automatically restored to public inventory.
              </li>
              <li>
                <strong className="text-[#775a00]">Payout Ledger Adjusted</strong>: The vendor settlement ledger deducts the refunded GMV to prevent over-disbursement.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Refunds History Table */}
      <div className="bg-white rounded-3xl border border-[#E6DFD5] shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#18181B]">Refunded Transactions Audit Trail</h2>
            <p className="text-xs text-[#71717A]">Complete record of reversed transactions and gateway IDs</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by booking or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#18181B] placeholder-[#A1A1AA] focus:outline-none focus:border-[#775a00] focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E6DFD5] bg-[#FAF7F2] text-[#775a00]">
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">Booking ID</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">Customer</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">Amount</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">Reason</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">Razorpay Refund ID</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">Initiated By</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD5]">
              {filteredRefunds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#71717A]">
                    No refunds matching search.
                  </td>
                </tr>
              ) : (
                filteredRefunds.map((r) => (
                  <tr key={r.id} className="text-[#18181B] hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#18181B]">{r.bookingNumber}</td>
                    <td className="py-3 px-3 font-semibold text-[#18181B]">{r.customerName}</td>
                    <td className="py-3 px-3 font-bold text-rose-600">{formatINR(r.amount)}</td>
                    <td className="py-3 px-3 max-w-xs truncate text-[#71717A]">{r.reason}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#775a00] font-semibold">{r.razorpayRefundId || 'rfnd_simulated'}</td>
                    <td className="py-3 px-3 text-[#71717A]">{r.initiatedBy}</td>
                    <td className="py-3 px-3 text-right text-[#71717A] font-mono text-[11px]">
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
