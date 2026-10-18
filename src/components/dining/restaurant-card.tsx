'use client';

import React from 'react';
import Link from 'next/link';
import { Restaurant } from '@/types';
import { formatINR } from '@/lib/utils';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const bestOffer = restaurant.offers[0];

  return (
    <article className="group rounded-2xl bg-[#FFFFFF] border border-[#E6DFD5] overflow-hidden shadow-[0_6px_24px_rgba(119,90,0,0.06)] hover:shadow-[0_12px_32px_rgba(119,90,0,0.14)] hover:border-[#c59a27]/60 transition-all duration-300 flex flex-col">
      {/* Image Banner */}
      <div className="relative h-60 w-full overflow-hidden bg-[#eae8e4]">
        <img
          src={restaurant.images[0]}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          {bestOffer ? (
            <span className="px-2.5 py-1 rounded-md bg-[#127c56] text-white font-label-mono-sm text-[10px] font-bold tracking-wider uppercase shadow-sm">
              {bestOffer.discountPct}% OFF • Secret Deal
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-md bg-[#FFFFFF]/90 backdrop-blur-md text-[#775a00] font-label-mono-sm text-[10px] font-bold tracking-wider uppercase border border-[#E6DFD5]">
              Fine Dining
            </span>
          )}

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-[#ffdf9a]">
            <span className="material-symbols-outlined text-[14px] text-[#ffdf9a]">star</span>
            <span>{restaurant.rating}</span>
            <span className="text-[10px] text-white/70 font-normal">({restaurant.reviewCount})</span>
          </div>
        </div>

        {/* Location & Cost overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-label-mono-sm">
          <span className="flex items-center gap-1 text-white/90">
            <span className="material-symbols-outlined text-[14px] text-[#ffdf9a]">location_on</span>
            {restaurant.area}, {restaurant.city}
          </span>
          <span className="text-[11px] text-[#ffdf9a]">
            ~{formatINR(restaurant.avgCostForTwo)} for two
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-[#FFFFFF]">
        <div className="space-y-2">
          <h3 className="font-headline-sm text-lg font-bold text-[#18181B] group-hover:text-[#775a00] transition-colors line-clamp-1">
            {restaurant.name}
          </h3>

          {/* Cuisines Pills */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {restaurant.cuisineTypes.map((c) => (
              <span
                key={c}
                className="text-[10px] font-label-mono-sm px-2 py-0.5 rounded-full bg-[#f5f3ef] border border-[#e6dfd5] text-[#4e4635]"
              >
                {c}
              </span>
            ))}
          </div>

          <p className="font-body-sm text-xs text-[#4e4635] line-clamp-2 leading-relaxed">
            {restaurant.description}
          </p>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-3 border-t border-[#E6DFD5] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-label-mono-sm uppercase text-[#71717A] block">
              Cover Deposit
            </span>
            <span className="text-sm font-label-mono-lg font-bold text-[#775a00]">
              {formatINR(bestOffer?.coverCharge || 200)}
            </span>
          </div>

          <Link
            href={`/dining/${restaurant.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#775a00]/10 hover:bg-[#775a00] text-[#775a00] hover:text-white font-body-md text-xs font-semibold tracking-wide border border-[#775a00]/30 hover:border-[#775a00] transition-all shadow-sm"
          >
            <span>Book Table</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
