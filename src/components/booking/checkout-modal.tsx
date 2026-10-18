'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatINR } from '@/lib/utils';
import { Booking } from '@/types';
import { store } from '@/lib/store';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingType: 'event' | 'dining';
  targetId: string;
  targetTitle: string;
  targetSubtitle?: string;
  bannerImage?: string;
  tierId?: string;
  tierName?: string;
  offerId?: string;
  offerTitle?: string;
  unitPrice: number;
  initialQuantity?: number;
  selectedDate?: string;
  selectedTimeSlot?: string;
}

export function CheckoutModal({
  isOpen,
  onClose,
  bookingType,
  targetId,
  targetTitle,
  targetSubtitle,
  bannerImage,
  tierId,
  tierName,
  offerId,
  offerTitle,
  unitPrice,
  initialQuantity = 1,
  selectedDate = new Date().toISOString().split('T')[0],
  selectedTimeSlot = '19:30',
}: CheckoutModalProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [isSocialOptedIn, setIsSocialOptedIn] = useState(true);
  const [customerName, setCustomerName] = useState('Rohan Sharma');
  const [customerEmail, setCustomerEmail] = useState('rohan.sharma@example.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98210 44556');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!isOpen) return null;

  // Real-time calculations with admin-configurable settings
  const settings = store.getSettings();
  const baseAmount = unitPrice * quantity;
  const discountedBase = Math.max(0, baseAmount - promoDiscount);
  const convenienceFeeFixed = settings.convenienceFeeFixed ?? 29;
  const gstPct = settings.gstPct ?? 18;
  const convenienceFee = quantity > 0 ? convenienceFeeFixed * Math.min(quantity, 4) : 0;
  const convenienceFeeGst = Math.round(convenienceFee * (gstPct / 100));
  const totalAmount = discountedBase + convenienceFee + convenienceFeeGst;

  const handleApplyPromo = async () => {
    setError(null);
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    try {
      const res = await fetch('/api/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'validate', code, amount: baseAmount }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid promo code. Try DASTAN50 or WELCOME100');
        setAppliedPromo(null);
        setPromoDiscount(0);
        setPromoMessage(null);
      } else {
        setPromoDiscount(data.discountAmount);
        setAppliedPromo(code);
        setPromoMessage(data.message);
      }
    } catch {
      if (code === 'DASTAN50') {
        const discount = Math.min(250, Math.round(baseAmount * 0.5));
        setPromoDiscount(discount);
        setAppliedPromo(code);
        setPromoMessage(`'${code}' applied! Saved ${formatINR(discount)}.`);
      } else if (code === 'WELCOME100') {
        const discount = Math.min(100, baseAmount);
        setPromoDiscount(discount);
        setAppliedPromo(code);
        setPromoMessage(`'WELCOME100' applied! Saved ${formatINR(discount)}.`);
      } else {
        setError('Invalid promo code. Try DASTAN50 or WELCOME100');
      }
    }
  };

  const handleInitiatePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create order
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingType,
          targetId,
          tierId,
          offerId,
          quantity,
          bookingDate: selectedDate,
          timeSlot: selectedTimeSlot,
          promoCode: appliedPromo,
          customerDetails: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
          },
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment order');
      }

      const completeVerification = async (paymentId: string, signature: string) => {
        const verifyRes = await fetch('/api/razorpay/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderData.orderId,
            paymentId,
            signature,
            bookingType,
            targetId,
            tierId,
            offerId,
            quantity,
            bookingDate: selectedDate,
            timeSlot: selectedTimeSlot,
            socialOptIn: isSocialOptedIn,
            customerDetails: {
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
            },
          }),
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok || !verifyData.success) {
          throw new Error(verifyData.error || 'Payment verification failed');
        }

        setConfirmedBooking(verifyData.booking);
      };

      if (typeof window !== 'undefined' && (window as any).Razorpay && !orderData.orderId.startsWith('order_test_')) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: 'INR',
          name: 'Dastan Experiences',
          description: targetTitle,
          order_id: orderData.orderId,
          handler: async (response: any) => {
            await completeVerification(
              response.razorpay_payment_id,
              response.razorpay_signature
            );
          },
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone,
          },
          theme: {
            color: '#775A00',
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        setTimeout(async () => {
          const mockPaymentId = `pay_mock_${Date.now()}`;
          const mockSig = `demo_sig_${Date.now()}`;
          await completeVerification(mockPaymentId, mockSig);
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E6DFD5] shadow-2xl p-6 sm:p-8 my-8 text-[#18181B]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF7F2] text-[#807663] hover:text-[#18181B] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {confirmedBooking ? (
          /* Confirmation Success State */
          <div className="text-center py-4 space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#d1fae5] text-[#127c56] border border-[#127c56]/30 flex items-center justify-center mx-auto animate-bounce">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>

            <div>
              <span className="font-label-mono-sm text-xs uppercase tracking-widest text-[#127c56] font-bold">
                Payment Verified &amp; Confirmed
              </span>
              <h2 className="font-display-lg text-2xl font-bold mt-1 text-[#18181B]">
                You're on the Guestlist!
              </h2>
              <p className="font-label-mono-sm text-xs text-[#71717A] mt-1">
                Booking Reference: <strong className="text-[#18181B]">{confirmedBooking.bookingNumber}</strong>
              </p>
            </div>

            {/* Pass Summary Card */}
            <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#E6DFD5] text-left space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-title-md font-bold text-sm text-[#18181B]">{targetTitle}</h4>
                  <p className="font-label-mono-sm text-xs text-[#775a00] font-semibold mt-0.5">
                    {tierName || offerTitle || 'Confirmed Reservation'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-label-mono-lg text-sm font-bold text-[#18181B]">
                    {formatINR(confirmedBooking.totalAmount)}
                  </div>
                  <div className="font-label-mono-sm text-[10px] text-[#71717A]">
                    {confirmedBooking.quantity} Guest(s)
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E6DFD5] flex items-center justify-between text-xs text-[#4e4635] font-label-mono-sm">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#775a00]">calendar_today</span>
                  <span>{confirmedBooking.bookingDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#775a00]">schedule</span>
                  <span>{confirmedBooking.timeSlot || 'Evening Session'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <Link
                href={`/customer`}
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#c59a27] to-[#775a00] text-white font-bold py-3.5 rounded-2xl text-xs hover:shadow-lg transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">qr_code</span>
                <span>View Digital Boarding Pass &amp; QR</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-2xl bg-[#FAF7F2] text-[#4e4635] text-xs font-semibold hover:bg-[#efeeea] transition-colors"
              >
                Close &amp; Continue Exploring
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Formulation State */
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-label-mono-sm font-bold text-[#775a00] mb-1">
                <span className="material-symbols-outlined text-[16px]">confirmation_number</span>
                <span>{bookingType === 'event' ? 'Live Event Pass' : 'Exclusive Dining Table'}</span>
              </div>
              <h3 className="font-headline-sm text-xl font-bold text-[#18181B]">{targetTitle}</h3>
              <p className="font-body-sm text-xs text-[#71717A] mt-0.5">
                {tierName || offerTitle || targetSubtitle}
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E6DFD5] flex items-center justify-between">
              <div>
                <span className="text-xs font-label-mono-sm text-[#71717A]">Number of Passes / Seats</span>
                <div className="text-sm font-label-mono-lg font-bold text-[#18181B] mt-0.5">
                  {formatINR(unitPrice)} <span className="text-xs text-[#71717A] font-normal">per head</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-[#E6DFD5] shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#18181B] hover:bg-[#efeeea] flex items-center justify-center font-bold"
                >
                  −
                </button>
                <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#775a00] hover:bg-[#efeeea] flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Social Discovery Opt-In (Privacy First) */}
            <div className="bg-[#f1ecdf]/60 rounded-2xl p-4 border border-[#c59a27]/30">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSocialOptedIn}
                  onChange={(e) => setIsSocialOptedIn(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[#775a00] focus:ring-[#775a00] border-[#E6DFD5]"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#18181B]">
                    <span className="material-symbols-outlined text-[16px] text-[#775a00]">auto_awesome</span>
                    <span>Opt-In to Community Tablemates</span>
                  </div>
                  <p className="text-[11px] text-[#4e4635] mt-0.5 leading-relaxed">
                    Allow other confirmed guests for this session to see your first name &amp; bio.
                    <strong className="text-[#18181B]"> Your phone and email remain strictly private.</strong>
                  </p>
                </div>
              </label>
            </div>

            {/* Promo Code Input */}
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined text-[16px] text-[#807663] absolute left-3 top-3">
                    sell
                  </span>
                  <input
                    type="text"
                    placeholder="Promo code (e.g. DASTAN50)"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#18181B] placeholder-[#807663] focus:outline-none focus:border-[#775a00]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-white hover:bg-[#FAF7F2] border border-[#E6DFD5] text-xs font-semibold text-[#775a00] rounded-xl transition-colors shadow-sm"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p className="text-xs text-[#127c56] mt-1 font-semibold">{promoMessage}</p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E6DFD5] space-y-2 text-xs font-label-mono-sm">
              <div className="flex justify-between text-[#4e4635]">
                <span>Base Subtotal ({quantity} x {formatINR(unitPrice)})</span>
                <span>{formatINR(baseAmount)}</span>
              </div>

              {promoDiscount > 0 && (
                <div className="flex justify-between text-[#127c56] font-semibold">
                  <span>Special Promo Discount</span>
                  <span>- {formatINR(promoDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#71717A]">
                <span>Platform Convenience Fee</span>
                <span>{formatINR(convenienceFee)}</span>
              </div>

              <div className="flex justify-between text-[#71717A]">
                <span>Statutory GST (18%)</span>
                <span>{formatINR(convenienceFeeGst)}</span>
              </div>

              <div className="pt-2 border-t border-[#E6DFD5] flex justify-between text-sm font-bold text-[#18181B]">
                <span>Total Payable</span>
                <span className="text-[#775a00] text-base">{formatINR(totalAmount)}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleInitiatePayment}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#c59a27] via-[#b8860b] to-[#775a00] text-white font-body-md font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-[#775a00]/20 hover:shadow-[#775a00]/40 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Securing with Razorpay...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span>Pay {formatINR(totalAmount)} via Razorpay</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
