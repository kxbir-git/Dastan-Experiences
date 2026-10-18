'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { store } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import { RestaurantOffer } from '@/types';
import { CheckoutModal } from '@/components/booking/checkout-modal';
import { TablematesPreview } from '@/components/social/tablemates-preview';

interface RestaurantDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function RestaurantDetailPage({ params }: RestaurantDetailPageProps) {
  const resolvedParams = use(params);
  const restaurant = store.getRestaurantBySlug(resolvedParams.slug);

  if (!restaurant) {
    notFound();
  }

  const [selectedOffer, setSelectedOffer] = useState<RestaurantOffer>(
    restaurant.offers[0]
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>('20:00');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const timeSlots = ['18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];
  const socialProfiles = store.getSocialAttendees(restaurant.id, selectedDate);

  const coverTotal = (selectedOffer?.coverCharge || 200) * guestCount;

  return (
    <div className="flex flex-col w-full bg-[#FDFBF7]">
      {/* CINEMATIC HERO SECTION */}
      <section className="relative w-full overflow-hidden border-b border-[#E6DFD5]">
        <div className="absolute inset-0 z-0">
          <img
            src={restaurant.images[0]}
            alt={restaurant.name}
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/85 to-[#FDFBF7]/35 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7] via-[#FDFBF7]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 flex flex-col justify-end min-h-[460px]">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/dining"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#775a00] hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>All Dining Enclaves</span>
            </Link>
            <span className="text-[#807663]">•</span>
            <span className="text-xs font-label-mono-sm text-[#71717A] uppercase">
              {restaurant.city}
            </span>
          </div>

          {/* Badges Pill */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {restaurant.cuisineTypes.map((c) => (
              <span
                key={c}
                className="px-3 py-1 rounded-full bg-white/95 border border-[#E6DFD5] text-[#775a00] font-label-mono-sm text-xs font-bold uppercase tracking-wider shadow-sm"
              >
                {c}
              </span>
            ))}
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#ffdf9a] text-[#251a00] font-label-mono-sm text-xs font-bold border border-[#c59a27]/30 shadow-sm">
              <span className="material-symbols-outlined text-[14px]">star</span>
              <span>{restaurant.rating} Rating ({restaurant.reviewCount} reviews)</span>
            </div>
          </div>

          <h1 className="font-display-lg text-3xl sm:text-5xl lg:text-6xl text-[#18181B] tracking-tight leading-[1.1] max-w-3xl mb-4">
            {restaurant.name}
          </h1>

          <p className="font-body-lg text-base sm:text-lg text-[#4e4635] max-w-2xl mb-8 leading-relaxed">
            {restaurant.description}
          </p>

          {/* Key Details Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#E6DFD5] shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] flex items-center justify-center text-[#775a00] shrink-0">
                <span className="material-symbols-outlined text-[20px]">location_on</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-mono-sm text-[10px] text-[#71717A] uppercase font-semibold">
                  Location &amp; Area
                </span>
                <span className="font-title-md text-sm text-[#18181B] font-semibold truncate">
                  {restaurant.area}, {restaurant.city}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] flex items-center justify-center text-[#775a00] shrink-0">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-mono-sm text-[10px] text-[#71717A] uppercase font-semibold">
                  Approximate Cost
                </span>
                <span className="font-title-md text-sm text-[#18181B] font-semibold truncate">
                  ~{formatINR(restaurant.avgCostForTwo)} for two
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] flex items-center justify-center text-[#127c56] shrink-0">
                <span className="material-symbols-outlined text-[20px]">percent</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-mono-sm text-[10px] text-[#71717A] uppercase font-semibold">
                  Exclusive Privilege
                </span>
                <span className="font-title-md text-sm text-[#127c56] font-semibold truncate">
                  {selectedOffer?.title || 'Up to 25% Off'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN 2/3 + 1/3 SPLIT WORKSPACE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Gallery Mosaic */}
            <div className="grid grid-cols-2 gap-4">
              {restaurant.images.map((img, i) => (
                <div key={i} className="h-56 rounded-2xl overflow-hidden border border-[#E6DFD5] bg-[#eae8e4]">
                  <img
                    src={img}
                    alt={`${restaurant.name} photo ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>

            {/* Privilege Offers */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E6DFD5] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6DFD5]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#127c56]"></span>
                  <h2 className="font-headline-sm text-xl text-[#18181B] font-semibold">
                    Available Dining Deals &amp; Perks
                  </h2>
                </div>
                <span className="font-label-mono-sm text-xs text-[#71717A] uppercase">
                  Select Deal
                </span>
              </div>

              <div className="space-y-3">
                {restaurant.offers.map((offer) => {
                  const isSelected = selectedOffer?.id === offer.id;
                  return (
                    <div
                      key={offer.id}
                      onClick={() => setSelectedOffer(offer)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#127c56] ring-2 ring-[#127c56]/30 bg-white shadow-md'
                          : 'border-[#E6DFD5] bg-white hover:border-[#127c56]/60 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-title-md text-base font-bold text-[#18181B]">
                              {offer.title}
                            </span>
                            <span className="font-label-mono-sm text-[10px] px-2 py-0.5 rounded bg-[#d1fae5] text-[#003b28] font-bold">
                              {offer.discountPct}% OFF
                            </span>
                          </div>
                          <p className="font-body-sm text-xs text-[#4e4635]">
                            {offer.description}
                          </p>
                          <div className="text-[11px] font-label-mono-sm text-[#71717A] pt-1">
                            Available: {offer.availableDays?.join(', ') || 'All Days'} • Slot cap: {offer.maxCoversPerSlot} guests
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-label-mono-sm text-[10px] text-[#71717A] block">
                            Cover Deposit
                          </span>
                          <span className="font-label-mono-lg text-lg font-bold text-[#775a00]">
                            {formatINR(offer.coverCharge)}
                          </span>
                          <span className="font-body-sm text-[10px] text-[#71717A] block">
                            / guest
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Discovery Table */}
            <div className="rounded-2xl bg-white border border-[#E6DFD5] p-6 shadow-sm">
              <TablematesPreview
                targetId={restaurant.id}
                targetTitle={restaurant.name}
                profiles={socialProfiles}
              />
            </div>

            {/* Address & Rules */}
            <div className="p-6 rounded-2xl bg-white border border-[#E6DFD5] space-y-2 text-xs text-[#71717A] shadow-sm">
              <h4 className="font-title-md font-bold text-[#18181B] text-sm uppercase tracking-wider">
                Location &amp; Table Policy
              </h4>
              <p className="font-semibold text-[#18181B]">{restaurant.address}</p>
              <p className="leading-relaxed">
                Reservations are held for up to 15 minutes past the booking slot. The cover charge is 100% adjusted against your final food and beverage bill.
              </p>
            </div>
          </div>

          {/* Right Column: Sticky Slot & Party Selector */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E6DFD5] shadow-[0_12px_40px_rgba(119,90,0,0.08)] space-y-6">
              <div>
                <span className="font-label-mono-sm text-xs uppercase text-[#127c56] font-bold tracking-wider block mb-1">
                  Table Reservation
                </span>
                <h3 className="font-headline-sm text-2xl font-bold text-[#18181B]">
                  Reserve Your Table
                </h3>
              </div>

              {/* Guest Count */}
              <div className="space-y-1.5">
                <label className="font-label-mono-sm text-xs text-[#4e4635] font-semibold">
                  Number of Diners
                </label>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5]">
                  <span className="font-title-md text-sm font-semibold text-[#18181B]">
                    {guestCount} Guests
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-[#E6DFD5] flex items-center justify-center font-bold text-sm shadow-sm"
                    >
                      −
                    </button>
                    <button
                      onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-[#E6DFD5] flex items-center justify-center font-bold text-sm text-[#775a00] shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Date Selector */}
              <div className="space-y-1.5">
                <label className="font-label-mono-sm text-xs text-[#4e4635] font-semibold">
                  Dining Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-[#18181B] text-xs font-label-mono-sm focus:outline-none focus:border-[#775a00]"
                />
              </div>

              {/* Time Slots */}
              <div className="space-y-1.5">
                <label className="font-label-mono-sm text-xs text-[#4e4635] font-semibold">
                  Preferred Seating Slot
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 rounded-lg text-xs font-label-mono-sm transition-all border ${
                        selectedTime === time
                          ? 'bg-[#127c56] text-white font-bold border-[#127c56] shadow-sm'
                          : 'bg-[#FAF7F2] text-[#4e4635] border-[#E6DFD5] hover:bg-white'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover Charge Breakdown */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] space-y-2">
                <div className="flex items-center justify-between font-label-mono-sm text-xs">
                  <span className="text-[#71717A]">Adjustable Cover Deposit</span>
                  <span className="font-bold text-[#18181B]">{formatINR(coverTotal)}</span>
                </div>
                <p className="text-[11px] text-[#71717A] leading-relaxed">
                  100% of this deposit is credited to your final bill at the restaurant.
                </p>
              </div>

              {/* Primary CTA */}
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#127c56] to-[#0e6344] text-white font-body-md font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-[#127c56]/20 hover:shadow-[#127c56]/40 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">table_restaurant</span>
                <span>Confirm Reservation</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          bookingType="dining"
          targetId={restaurant.id}
          targetTitle={restaurant.name}
          targetSubtitle={`${restaurant.area}, ${restaurant.city}`}
          bannerImage={restaurant.images[0]}
          offerId={selectedOffer?.id}
          offerTitle={selectedOffer?.title}
          unitPrice={selectedOffer?.coverCharge || 200}
          initialQuantity={guestCount}
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTime}
        />
      )}
    </div>
  );
}
