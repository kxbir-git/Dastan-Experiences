'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Printer,
  Receipt,
  CheckCircle2,
} from 'lucide-react';
import { store } from '@/lib/store';
import { QrTicket } from '@/components/booking/qr-ticket';
import { formatINR } from '@/lib/utils';

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BookingDetailPage({ params }: BookingDetailPageProps) {
  const resolvedParams = use(params);
  const [booking, setBooking] = useState<any>(() => store.getBookingById(resolvedParams.id) || null);
  const [refundStatus, setRefundStatus] = useState<string | null>(null);
  const [loadingRefund, setLoadingRefund] = useState(false);

  React.useEffect(() => {
    if (!booking) {
      const found = store.getBookingById(resolvedParams.id) || store.getBookings().find((b) => b.bookingNumber === resolvedParams.id);
      if (found) {
        setBooking(found);
      }
    }
  }, [resolvedParams.id, booking]);

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4 bg-[#FDFBF7]">
        <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E6DFD5] flex items-center justify-center mx-auto text-[#775a00]">
          <span className="material-symbols-outlined text-[32px]">receipt_long</span>
        </div>
        <h1 className="font-display-lg text-2xl font-bold text-[#18181B]">Pass Not Found</h1>
        <p className="text-sm text-[#4e4635]">This booking reference might belong to another session.</p>
        <Link
          href="/customer"
          className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c59a27] to-[#775a00] text-white text-xs font-bold"
        >
          View My Passes →
        </Link>
      </div>
    );
  }

  const handleRequestRefund = async () => {
    if (!confirm('Are you sure you want to request a refund for this booking?')) return;
    try {
      setLoadingRefund(true);
      const res = await fetch('/api/admin/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          reason: 'Customer requested cancellation',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Refund failed');
      setRefundStatus(data.message);
    } catch (err: any) {
      alert(err.message || 'Refund request failed');
    } finally {
      setLoadingRefund(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FDFBF7] text-[#18181B]">
      {/* Back Link */}
      <Link
        href="/customer"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#775a00] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Passes</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-label-mono-sm text-xs uppercase tracking-wider text-[#775a00] font-bold">
            Official Ticket &amp; Invoice
          </span>
          <h1 className="font-display-lg text-2xl sm:text-3xl font-bold text-[#18181B]">
            Booking #{booking.bookingNumber}
          </h1>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#FAF7F2] text-xs text-[#18181B] font-semibold border border-[#E6DFD5] shadow-sm transition-colors"
        >
          <Printer className="w-4 h-4 text-[#775a00]" />
          <span>Print Pass</span>
        </button>
      </div>

      {/* Email Dispatched Notice */}
      <div className="p-3.5 rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] text-left flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[20px] text-[#059669]">mark_email_read</span>
          <div className="text-xs">
            <span className="font-bold text-[#065f46]">Digital Pass Emailed</span>
            <span className="text-[#047857] text-[11px] ml-1.5">
              Receipt &amp; QR Pass dispatched to <strong>{booking.customerEmail || 'your email'}</strong>
            </span>
          </div>
        </div>
        <span className="text-[10px] uppercase font-label-mono-sm font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
          CONFIRMED
        </span>
      </div>

      {refundStatus && (
        <div className="bg-[#d1fae5] border border-[#127c56]/30 rounded-2xl p-4 text-xs text-[#003b28] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#127c56] shrink-0" />
          <span>{refundStatus}</span>
        </div>
      )}

      {/* Grid: QR Ticket Pass on Left, Invoice Breakup on Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Boarding Pass Ticket */}
        <div>
          <QrTicket booking={booking} />
        </div>

        {/* Invoice & Cancellation Card */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 border border-[#E6DFD5] shadow-sm space-y-4 text-[#18181B]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#775a00] font-label-mono-sm uppercase tracking-wider">
              <Receipt className="w-4 h-4" />
              <span>Tax Invoice Summary</span>
            </div>

            <div className="space-y-2 text-xs text-[#4e4635] border-t border-[#E6DFD5] pt-3 font-label-mono-sm">
              <div className="flex justify-between">
                <span>Base Amount ({booking.quantity}x)</span>
                <span className="font-bold text-[#18181B]">{formatINR(booking.baseAmount)}</span>
              </div>

              {booking.discountAmount > 0 && (
                <div className="flex justify-between text-[#127c56] font-semibold">
                  <span>Promo Discount Applied</span>
                  <span>- {formatINR(booking.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#71717A]">
                <span>Platform Convenience Fee</span>
                <span>{formatINR(booking.convenienceFee)}</span>
              </div>

              <div className="flex justify-between text-[#71717A]">
                <span>GST (18% on convenience fee)</span>
                <span>{formatINR(booking.gstAmount)}</span>
              </div>

              <div className="pt-3 border-t border-[#E6DFD5] flex justify-between text-sm font-bold text-[#18181B]">
                <span>Total Amount Paid</span>
                <span className="text-[#775a00] text-base">{formatINR(booking.totalAmount)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E6DFD5] text-[11px] text-[#71717A] space-y-1 font-label-mono-sm">
              <div>Razorpay Order ID: {booking.razorpayOrderId || 'rzp_order_demo'}</div>
              <div>Razorpay Payment ID: {booking.razorpayPaymentId || 'rzp_pay_demo'}</div>
              <div>Date Issued: {new Date(booking.createdAt).toLocaleString('en-IN')}</div>
            </div>
          </div>

          {/* Cancellation Policy / Refund Trigger */}
          <div className="rounded-3xl bg-white p-6 border border-[#E6DFD5] shadow-sm space-y-3">
            <h4 className="font-headline-sm text-xs font-bold text-[#18181B] uppercase tracking-wider">
              Cancellation &amp; Refund Policy
            </h4>
            <p className="font-body-sm text-xs text-[#4e4635] leading-relaxed">
              Live event tickets and dining cover reservations can be cancelled up to 24 hours prior to the scheduled date for a full refund back to original payment mode via Razorpay.
            </p>

            {booking.status === 'confirmed' && (
              <button
                onClick={handleRequestRefund}
                disabled={loadingRefund}
                className="mt-2 w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all disabled:opacity-50"
              >
                {loadingRefund ? 'Processing Refund...' : 'Cancel Booking & Request Refund'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
