'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Ticket,
  Calendar,
  Clock,
  QrCode,
  Sparkles,
  ArrowRight,
  UtensilsCrossed,
} from 'lucide-react';
import { store } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import { DEMO_USERS } from '@/lib/mock-data';

export default function CustomerDashboardPage() {
  const user = DEMO_USERS.customer;
  const bookings = store.getBookings(user.id);
  const [socialOptIn, setSocialOptIn] = useState(user.isSocialOptedIn);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#FDFBF7] text-[#18181B]">
      {/* Welcome Header & Profile Brief */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E6DFD5] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#c59a27]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display-lg text-2xl font-bold text-[#18181B]">{user.fullName}</h1>
              <span className="font-label-mono-sm text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffdf9a]/50 text-[#775a00] border border-[#c59a27]/30">
                Verified Patron
              </span>
            </div>
            <p className="font-label-mono-sm text-xs text-[#71717A] mt-0.5">{user.email} • {user.city}</p>
            <p className="font-body-sm text-xs text-[#4e4635] italic mt-1 max-w-md">&quot;{user.bio}&quot;</p>
          </div>
        </div>

        {/* Social Discovery Master Toggle */}
        <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E6DFD5] flex items-center gap-3">
          <input
            type="checkbox"
            id="social-toggle"
            checked={socialOptIn}
            onChange={(e) => setSocialOptIn(e.target.checked)}
            className="w-4 h-4 rounded text-[#775a00] focus:ring-[#775a00] border-[#E6DFD5]"
          />
          <label htmlFor="social-toggle" className="cursor-pointer">
            <div className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#775a00]" />
              <span>Social Discovery Active</span>
            </div>
            <div className="text-[11px] text-[#71717A]">
              {socialOptIn
                ? 'Tablemates can see your name & interests'
                : 'Your bookings are currently 100% private'}
            </div>
          </label>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-headline-sm text-xl font-bold text-[#18181B]">
              My Active Passes &amp; Reservations
            </h2>
            <p className="font-body-sm text-xs text-[#71717A] mt-0.5">
              Access your digital QR passes for upcoming live soirées and dining enclaves.
            </p>
          </div>

          <Link
            href="/events"
            className="self-start sm:self-auto bg-gradient-to-r from-[#c59a27] to-[#775a00] text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm hover:shadow-md transition-all"
          >
            + Book New Experience
          </Link>
        </div>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => {
              const isEvent = booking.bookingType === 'event';
              const isCheckedIn = booking.status === 'checked_in';
              const isRefunded = booking.status === 'refunded';

              return (
                <div
                  key={booking.id}
                  className="rounded-3xl bg-white p-6 border border-[#E6DFD5] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-label-mono-sm font-bold text-[#775a00] uppercase tracking-wider">
                        {isEvent ? <Ticket className="w-4 h-4" /> : <UtensilsCrossed className="w-4 h-4" />}
                        <span>{isEvent ? 'Live Soirée Pass' : 'Dining Table'}</span>
                      </div>

                      <span
                        className={`font-label-mono-sm text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isCheckedIn
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : isRefunded
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-[#d1fae5] text-[#003b28] border border-[#127c56]/30'
                        }`}
                      >
                        {isCheckedIn ? 'Checked In' : isRefunded ? 'Refunded' : 'Confirmed'}
                      </span>
                    </div>

                    <h3 className="font-headline-sm text-base font-bold text-[#18181B]">
                      {booking.eventTitle || booking.restaurantName}
                    </h3>

                    <p className="font-label-mono-sm text-xs text-[#775a00] font-semibold">
                      {booking.tierName || booking.offerTitle}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs text-[#4e4635] pt-2 border-t border-[#E6DFD5] font-label-mono-sm">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#775a00]" />
                        <span>{booking.bookingDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#775a00]" />
                        <span>{booking.timeSlot || '19:30'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E6DFD5] flex items-center justify-between">
                    <div>
                      <span className="font-label-mono-sm text-[10px] uppercase text-[#71717A] block">
                        Total Paid
                      </span>
                      <span className="font-label-mono-lg text-sm font-bold text-[#18181B]">
                        {formatINR(booking.totalAmount)}
                      </span>
                    </div>

                    <Link
                      href={`/customer/bookings/${booking.id}`}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#efeeea] text-[#18181B] text-xs font-semibold border border-[#E6DFD5] transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#775a00]" />
                      <span>View Pass &amp; QR</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#807663]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E6DFD5] space-y-3">
            <Ticket className="w-10 h-10 text-[#807663] mx-auto" />
            <h3 className="font-headline-sm text-base font-bold text-[#18181B]">No active passes yet</h3>
            <p className="font-body-sm text-xs text-[#71717A]">
              Browse our live soirées or restaurant deals to reserve your first experience.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
