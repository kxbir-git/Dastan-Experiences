'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  Download,
  Share2,
} from 'lucide-react';
import { Booking } from '@/types';
import { formatINR, generateQrCodeDataUrl } from '@/lib/utils';

interface QrTicketProps {
  booking: Booking;
}

export function QrTicket({ booking }: QrTicketProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    generateQrCodeDataUrl(booking.qrCodeHash).then(setQrCodeUrl);
  }, [booking.qrCodeHash]);

  const isCheckedIn = booking.status === 'checked_in';
  const isRefunded = booking.status === 'refunded';

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl overflow-hidden bg-white border border-[#E6DFD5] shadow-xl relative text-[#18181B]">
      {/* Top Banner & Title */}
      <div className="relative p-6 bg-[#FAF7F2] border-b border-dashed border-[#E6DFD5]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="font-label-mono-sm text-xs font-bold tracking-widest text-[#775a00]">
              DASTAN PASS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#4e4635] border border-[#E6DFD5] font-label-mono-sm">
              #{booking.bookingNumber}
            </span>
          </div>

          <div
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-label-mono-sm ${
              isCheckedIn
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : isRefunded
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : 'bg-[#d1fae5] text-[#003b28] border border-[#127c56]/30'
            }`}
          >
            {isCheckedIn ? 'Checked-In' : isRefunded ? 'Refunded' : 'Valid Entry'}
          </div>
        </div>

        <h3 className="font-headline-sm text-xl font-bold tracking-tight text-[#18181B]">
          {booking.eventTitle || booking.restaurantName}
        </h3>
        <p className="font-label-mono-sm text-xs text-[#775a00] font-semibold mt-0.5">
          {booking.tierName || booking.offerTitle || 'Confirmed Reservation'}
        </p>

        <div className="mt-4 pt-3 border-t border-[#E6DFD5] grid grid-cols-2 gap-3 text-xs text-[#4e4635] font-label-mono-sm">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#775a00]" />
            <span>{booking.bookingDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#775a00]" />
            <span>{booking.timeSlot || '19:30 IST'}</span>
          </div>
        </div>
      </div>

      {/* Ticket Cutout Notches */}
      <div className="relative h-6 bg-[#FAF7F2] flex items-center justify-between">
        <div className="w-4 h-8 bg-[#FDFBF7] rounded-r-full -ml-1 border-r border-[#E6DFD5]" />
        <div className="w-full border-t border-dashed border-[#E6DFD5] mx-2" />
        <div className="w-4 h-8 bg-[#FDFBF7] rounded-l-full -mr-1 border-l border-[#E6DFD5]" />
      </div>

      {/* QR Code and Gate Verification Section */}
      <div className="p-6 bg-white text-center space-y-4">
        <div className="p-4 bg-white rounded-2xl border-2 border-[#E6DFD5] inline-block shadow-sm">
          {qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt="Scan Ticket"
              className="w-44 h-44 mx-auto object-contain"
            />
          ) : (
            <div className="w-44 h-44 bg-[#FAF7F2] rounded-xl flex items-center justify-center text-xs text-[#71717A] font-label-mono-sm">
              Generating Secure QR...
            </div>
          )}
        </div>

        <div>
          <span className="font-label-mono-sm text-[11px] text-[#71717A] uppercase tracking-wider block">
            Scan at Sanctuary Gate
          </span>
          <span className="font-label-mono-sm text-xs font-bold text-[#18181B] mt-0.5 block">
            Admit {booking.quantity} Guest(s) • {formatINR(booking.totalAmount)}
          </span>
        </div>

        {/* Guest Details */}
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DFD5] text-left text-xs font-body-md space-y-1">
          <div className="flex justify-between">
            <span className="text-[#71717A]">Patron Name:</span>
            <span className="font-semibold text-[#18181B]">{booking.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#71717A]">Email:</span>
            <span className="font-semibold text-[#18181B] truncate max-w-[180px]">
              {booking.customerEmail}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#efeeea] text-xs font-semibold text-[#18181B] border border-[#E6DFD5] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#775a00]" />
            <span>Save / Print</span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Dastan Pass #${booking.bookingNumber}`,
                  text: `My booking for ${booking.eventTitle || booking.restaurantName}`,
                  url: window.location.href,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Pass link copied to clipboard!');
              }
            }}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#efeeea] text-xs font-semibold text-[#18181B] border border-[#E6DFD5] transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-[#775a00]" />
            <span>Share Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
}
