'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatINR, generateQrCodeDataUrl } from '@/lib/utils';
import { Booking } from '@/types';
import { store } from '@/lib/store';
import { QrTicket } from './qr-ticket';
import { Smartphone, QrCode, CreditCard, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

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

  // Payment method: Direct UPI QR or Razorpay
  const [paymentMethod, setPaymentMethod] = useState<'upi_qr' | 'razorpay'>('upi_qr');
  const [upiQrDataUrl, setUpiQrDataUrl] = useState<string>('');
  const [utrNumber, setUtrNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!isOpen) return null;

  // Lookup vendor details to check for direct vendor UPI ID
  const eventObj = bookingType === 'event' ? store.getEventById(targetId) : undefined;
  const restObj = bookingType === 'dining' ? store.getRestaurantById(targetId) : undefined;
  const vendorId = eventObj?.vendorId || restObj?.vendorId;
  const vendor = vendorId ? store.getVendorById(vendorId) : undefined;
  const activeUpiId = vendor?.upiId || 'dastan.experiences@okaxis';

  const settings = store.getSettings();
  const baseAmount = unitPrice * quantity;
  const discountedBase = Math.max(0, baseAmount - promoDiscount);
  const convenienceFeeFixed = settings.convenienceFeeFixed ?? 29;
  const gstPct = settings.gstPct ?? 18;
  const convenienceFee = quantity > 0 ? convenienceFeeFixed * Math.min(quantity, 4) : 0;
  const convenienceFeeGst = Math.round(convenienceFee * (gstPct / 100));
  const totalAmount = discountedBase + convenienceFee + convenienceFeeGst;

  // Dynamic UPI string for direct-to-vendor / direct UPI payment
  const upiPaymentUri = `upi://pay?pa=${activeUpiId}&pn=${encodeURIComponent(targetTitle)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent('DASTAN PASS ' + (tierName || 'ENTRY'))}`;

  useEffect(() => {
    if (totalAmount > 0) {
      generateQrCodeDataUrl(upiPaymentUri).then(setUpiQrDataUrl);
    }
  }, [totalAmount, activeUpiId, targetTitle, tierName, upiPaymentUri]);

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

  const handleDirectUpiConfirm = async () => {
    try {
      if (!customerName.trim()) {
        setError('Please enter attendee name.');
        return;
      }
      if (!customerEmail.trim() || !customerEmail.includes('@')) {
        setError('Please enter a valid email address to receive your Gate Pass and payment receipt.');
        return;
      }

      setLoading(true);
      setError(null);

      // Create order in backend
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
        throw new Error(orderData.error || 'Failed to create booking order');
      }

      const upiPaymentId = utrNumber.trim() ? `upi_${utrNumber.trim()}` : `upi_qr_${Date.now()}`;
      const mockSig = `sig_upi_${Date.now()}`;

      const verifyRes = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.orderId,
          paymentId: upiPaymentId,
          signature: mockSig,
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
        throw new Error(verifyData.error || 'Payment confirmation failed');
      }

      setConfirmedBooking(verifyData.booking);
    } catch (err: any) {
      setError(err.message || 'Payment confirmation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInitiatePayment = async () => {
    try {
      if (!customerName.trim()) {
        setError('Please enter attendee name.');
        return;
      }
      if (!customerEmail.trim() || !customerEmail.includes('@')) {
        setError('Please enter a valid email address to receive your Gate Pass and payment receipt.');
        return;
      }

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
          /* Confirmation Success State with Digital Boarding Pass */
          <div className="text-center py-2 space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#d1fae5] text-[#127c56] border border-[#127c56]/30 flex items-center justify-center mx-auto animate-bounce">
              <span className="material-symbols-outlined text-[28px]">check_circle</span>
            </div>

            <div>
              <span className="font-label-mono-sm text-xs uppercase tracking-widest text-[#127c56] font-bold">
                Payment Verified &amp; Confirmed
              </span>
              <h2 className="font-display-lg text-2xl font-bold mt-1 text-[#18181B]">
                You&apos;re on the Guestlist!
              </h2>
              <p className="font-label-mono-sm text-xs text-[#71717A] mt-1">
                Booking Reference: <strong className="text-[#18181B]">{confirmedBooking.bookingNumber}</strong>
              </p>

              {/* Email Sent Confirmation Badge */}
              <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-left flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-emerald-600 shrink-0 mt-0.5">mark_email_read</span>
                <div className="text-xs">
                  <div className="font-bold text-emerald-900">Gate Pass &amp; Payment Receipt Sent!</div>
                  <div className="text-emerald-700 text-[11px] mt-0.5">
                    A digital gate pass with QR code and GST invoice has been emailed to <strong>{confirmedBooking.customerEmail}</strong>.
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Digital Ticket Pass with QR Scanner */}
            <div className="pt-1">
              <QrTicket booking={confirmedBooking} />
            </div>

            {/* Gate Verification Notice */}
            <div className="p-3.5 rounded-2xl bg-[#ffdf9a]/30 border border-[#c59a27]/40 text-left flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#775a00] shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-bold text-[#18181B]">Venue Gate Check-in Ready</div>
                <div className="text-[#4e4635] text-[11px] mt-0.5">
                  Hamari team gate par scanner se yeh QR scan karke physical wristband/entry pass de degi.
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <Link
                href={`/customer/bookings/${confirmedBooking.id}`}
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#c59a27] to-[#775a00] text-white font-bold py-3.5 rounded-2xl text-xs hover:shadow-lg transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Print Official Ticket &amp; Invoice</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-2xl bg-[#FAF7F2] text-[#4e4635] text-xs font-semibold hover:bg-[#efeeea] transition-colors cursor-pointer"
              >
                Close &amp; Return
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Formulation State */
          <div className="space-y-4">
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

            {/* Customer Details Form */}
            <div className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-[#E6DFD5] space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#775a00] uppercase font-label-mono-sm">
                <span>Guest Pass Details</span>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Pass + Receipt Sent to Email
                </span>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-[#71717A] mb-0.5 font-medium">Attendee Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Verma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-white border border-[#E6DFD5] rounded-xl px-2.5 py-1.5 text-xs text-[#18181B] focus:outline-none focus:border-[#775a00]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#71717A] mb-0.5 font-medium">WhatsApp / Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98200 12345"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-white border border-[#E6DFD5] rounded-xl px-2.5 py-1.5 text-xs text-[#18181B] focus:outline-none focus:border-[#775a00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-[#71717A] mb-0.5 font-medium flex items-center justify-between">
                    <span>Email Address (For QR Gate Pass &amp; Payment Receipt) *</span>
                    <span className="text-[9px] text-[#775a00] font-bold">REQUIRED</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-white border border-[#E6DFD5] rounded-xl px-2.5 py-1.5 text-xs text-[#18181B] focus:outline-none focus:border-[#775a00]"
                  />
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-[#E6DFD5] flex items-center justify-between">
              <div>
                <span className="text-xs font-label-mono-sm text-[#71717A]">Number of Passes / Seats</span>
                <div className="text-sm font-label-mono-lg font-bold text-[#18181B] mt-0.5">
                  {formatINR(unitPrice)} <span className="text-xs text-[#71717A] font-normal">per pass</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-[#E6DFD5] shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#18181B] hover:bg-[#efeeea] flex items-center justify-center font-bold cursor-pointer"
                >
                  −
                </button>
                <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#775a00] hover:bg-[#efeeea] flex items-center justify-center font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_qr')}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'upi_qr'
                      ? 'bg-[#ffdf9a]/40 border-[#c59a27] text-[#775a00] shadow-sm'
                      : 'bg-white border-[#E6DFD5] text-[#71717A] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#775a00]" />
                  <span>Direct UPI QR &amp; Apps</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'razorpay'
                      ? 'bg-[#ffdf9a]/40 border-[#c59a27] text-[#775a00] shadow-sm'
                      : 'bg-white border-[#E6DFD5] text-[#71717A] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#775a00]" />
                  <span>Cards / NetBanking</span>
                </button>
              </div>

              {/* UPI QR Display Block */}
              {paymentMethod === 'upi_qr' && (
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#c59a27]/30 text-center space-y-3">
                  <div className="text-[11px] font-bold text-[#775a00] uppercase font-label-mono-sm tracking-wider">
                    Scan with any UPI App or Tap Below
                  </div>

                  {upiQrDataUrl ? (
                    <div className="p-2.5 bg-white rounded-2xl border border-[#E6DFD5] inline-block shadow-sm">
                      <img
                        src={upiQrDataUrl}
                        alt="UPI Payment QR"
                        className="w-36 h-36 mx-auto object-contain"
                      />
                      <div className="text-[10px] text-[#71717A] font-mono mt-1">
                        Amount: <strong className="text-[#18181B]">{formatINR(totalAmount)}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="w-36 h-36 bg-white rounded-2xl border border-[#E6DFD5] mx-auto flex items-center justify-center text-xs text-[#71717A]">
                      Generating QR...
                    </div>
                  )}

                  <div className="text-[11px] text-[#4e4635]">
                    Direct Settlement to: <strong className="font-mono text-[#775a00]">{activeUpiId}</strong>
                    {vendor?.businessName && (
                      <span className="block text-[10px] text-[#71717A]">({vendor.businessName})</span>
                    )}
                  </div>

                  {/* UPI App Buttons for Mobile 1-Tap Payment */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <a
                      href={upiPaymentUri}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E6DFD5] hover:border-[#775a00] text-[11px] font-bold text-[#18181B] shadow-xs flex items-center gap-1"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Google Pay
                    </a>
                    <a
                      href={upiPaymentUri}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E6DFD5] hover:border-[#775a00] text-[11px] font-bold text-[#18181B] shadow-xs flex items-center gap-1"
                    >
                      <span className="w-2 h-2 rounded-full bg-purple-600" />
                      PhonePe
                    </a>
                    <a
                      href={upiPaymentUri}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E6DFD5] hover:border-[#775a00] text-[11px] font-bold text-[#18181B] shadow-xs flex items-center gap-1"
                    >
                      <span className="w-2 h-2 rounded-full bg-sky-500" />
                      Paytm
                    </a>
                    <a
                      href={upiPaymentUri}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E6DFD5] hover:border-[#775a00] text-[11px] font-bold text-[#18181B] shadow-xs flex items-center gap-1"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Any UPI App
                    </a>
                  </div>

                  {/* UTR Reference input */}
                  <div className="pt-2">
                    <input
                      type="text"
                      placeholder="UPI Ref / UTR No. (Optional after paying)"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full text-center bg-white border border-[#E6DFD5] rounded-xl px-3 py-1.5 text-xs text-[#18181B] font-mono placeholder:text-[#807663] focus:outline-none focus:border-[#775a00]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-[#E6DFD5] space-y-1.5 text-xs font-label-mono-sm">
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

              <div className="flex justify-between text-[#71717A] text-[11px]">
                <span>Platform Convenience Fee &amp; GST</span>
                <span>{formatINR(convenienceFee + convenienceFeeGst)}</span>
              </div>

              <div className="pt-2 border-t border-[#E6DFD5] flex justify-between text-sm font-bold text-[#18181B]">
                <span>Total Payable</span>
                <span className="text-[#775a00] text-base">{formatINR(totalAmount)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            {paymentMethod === 'upi_qr' ? (
              <button
                onClick={handleDirectUpiConfirm}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#c59a27] via-[#b8860b] to-[#775a00] text-white font-body-md font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-[#775a00]/20 hover:shadow-[#775a00]/40 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Generating Your Entry Pass...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>I Have Paid • Generate Entry Pass</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleInitiatePayment}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#c59a27] via-[#b8860b] to-[#775a00] text-white font-body-md font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-[#775a00]/20 hover:shadow-[#775a00]/40 transition-all disabled:opacity-50 cursor-pointer"
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
