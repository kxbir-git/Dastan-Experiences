'use client';

import React from 'react';
import Link from 'next/link';
import { EventListing } from '@/types';
import { formatDate, formatINR } from '@/lib/utils';

interface EventCardProps {
  event: EventListing;
}

export function EventCard({ event }: EventCardProps) {
  const remainingSeats = (event.ticketTiers || []).reduce(
    (acc, t) => acc + Math.max(0, (t.totalCapacity || 50) - (t.soldCount || 0)),
    0
  );

  return (
    <article className="group rounded-2xl bg-[#FFFFFF] border border-[#E6DFD5] overflow-hidden shadow-[0_6px_24px_rgba(119,90,0,0.06)] hover:shadow-[0_12px_32px_rgba(119,90,0,0.14)] hover:border-[#c59a27]/60 transition-all duration-300 flex flex-col">
      {/* Image Banner */}
      <div className="relative h-60 w-full overflow-hidden bg-[#eae8e4]">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-md bg-[#FFFFFF]/90 backdrop-blur-md text-[#775a00] font-label-mono-sm text-[10px] font-bold tracking-wider uppercase border border-[#E6DFD5] shadow-sm">
            {event.categoryLabel}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[#ffdf9a] font-label-mono-sm text-[10px] border border-white/20">
            {event.ageRestriction}
          </span>
        </div>

        {/* Price Floating Overlay */}
        <div className="absolute bottom-3 left-4 flex items-baseline gap-1.5 text-white">
          <span className="font-label-mono-sm text-[10px] text-white/80 uppercase">Patron Seat</span>
          <span className="font-label-mono-lg text-lg text-[#ffdf9a] font-bold tracking-tight">
            {formatINR(event.startingPrice)}
          </span>
          <span className="font-body-sm text-[10px] text-white/70">onwards</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-[#FFFFFF]">
        <div className="space-y-2">
          {/* Date & Location telemetry */}
          <div className="flex items-center justify-between text-xs text-[#71717A] font-label-mono-sm">
            <span className="flex items-center gap-1 text-[#775a00]">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              {formatDate(event.startTime)}
            </span>
            <span className="flex items-center gap-1 text-[#4e4635]">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              {event.city}
            </span>
          </div>

          <h3 className="font-headline-sm text-lg font-bold text-[#18181B] group-hover:text-[#775a00] transition-colors line-clamp-1">
            {event.title}
          </h3>

          <p className="font-body-sm text-xs text-[#4e4635] line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-[#71717A] pt-1">
            <span className="material-symbols-outlined text-[14px] text-[#807663]">storefront</span>
            <span className="truncate">{event.venueName}</span>
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-3 border-t border-[#E6DFD5] flex items-center justify-between">
          <div className="text-[11px] font-label-mono-sm text-[#71717A]">
            <span className="text-[#127c56] font-bold">● {remainingSeats} Seats</span> Available
          </div>

          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#775a00]/10 hover:bg-[#775a00] text-[#775a00] hover:text-white font-body-md text-xs font-semibold tracking-wide border border-[#775a00]/30 hover:border-[#775a00] transition-all shadow-sm"
          >
            <span>Reserve Passes</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
