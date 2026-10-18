'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Store,
  Plus,
  Eye,
  Star,
  MapPin,
  Percent,
  UtensilsCrossed,
  CheckCircle2,
  Trash2,
  Clock,
  Users,
  X,
  AlertCircle,
  Tag,
  Check,
} from 'lucide-react';
import { store } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import { Restaurant, RestaurantOffer } from '@/types';

const STATUS_STYLE = {
  published: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  pending_approval: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  draft: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  rejected: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  archived: 'bg-slate-700/20 text-slate-500 border-slate-700/30',
};

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function VendorDiningPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(store.getAllRestaurants());
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Deal Modal state
  const [selectedRestForDeal, setSelectedRestForDeal] = useState<Restaurant | null>(null);
  const [dealTitle, setDealTitle] = useState('');
  const [discountPct, setDiscountPct] = useState(20);
  const [dealDescription, setDealDescription] = useState('');
  const [availableDays, setAvailableDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [validFrom, setValidFrom] = useState('12:00');
  const [validTo, setValidTo] = useState('23:00');
  const [coverCharge, setCoverCharge] = useState(0);
  const [maxCoversPerSlot, setMaxCoversPerSlot] = useState(24);
  const [submittingDeal, setSubmittingDeal] = useState(false);

  const reload = () => {
    setRestaurants([...store.getAllRestaurants()]);
  };

  const handleToggleDay = (day: string) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleOpenDealModal = (restaurant: Restaurant) => {
    setSelectedRestForDeal(restaurant);
    setDealTitle(`20% OFF Table Reservation`);
    setDiscountPct(20);
    setDealDescription('Valid on total food and beverage menu.');
    setAvailableDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    setValidFrom('12:00');
    setValidTo('23:00');
    setCoverCharge(0);
    setMaxCoversPerSlot(20);
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestForDeal || !discountPct) return;

    try {
      setSubmittingDeal(true);
      const res = await fetch('/api/vendor/dining', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_deal',
          restaurantId: selectedRestForDeal.id,
          title: dealTitle.trim() || `${discountPct}% OFF Table Booking`,
          discountPct: Number(discountPct),
          description: dealDescription.trim(),
          availableDays,
          validFrom,
          validTo,
          coverCharge: Number(coverCharge),
          maxCoversPerSlot: Number(maxCoversPerSlot),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add deal');

      setFeedback(data.message || 'Deal added successfully!');
      setSelectedRestForDeal(null);
      reload();
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Error creating deal');
    } finally {
      setSubmittingDeal(false);
    }
  };

  const handleToggleDeal = async (restaurantId: string, offerId: string) => {
    try {
      const res = await fetch('/api/vendor/dining', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_deal', restaurantId, offerId }),
      });
      if (res.ok) {
        reload();
      }
    } catch {
      alert('Failed to toggle deal status');
    }
  };

  const handleDeleteDeal = async (restaurantId: string, offerId: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;
    try {
      const res = await fetch('/api/vendor/dining', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_deal', restaurantId, offerId }),
      });
      if (res.ok) {
        reload();
        setFeedback('Deal deleted successfully');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {
      alert('Failed to delete deal');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Store className="w-3.5 h-3.5" />
            <span>Dining & Offers Management</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-0.5">My Restaurants & Deals</h1>
          <p className="text-xs text-slate-400">
            Create restaurant listings, configure discount deals, and control table capacity.
          </p>
        </div>
        <Link
          href="/vendor/dining/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl saffron-gradient text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          List New Restaurant
        </Link>
      </div>

      {feedback && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {restaurants.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="glass-card rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between">
              <div>
                {/* Image */}
                <div className="relative h-44">
                  <img
                    src={restaurant.images[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[restaurant.status] || STATUS_STYLE.draft}`}>
                      {restaurant.status.replace('_', ' ')}
                    </span>
                    {restaurant.isFeatured && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-amber-400" /> Featured
                      </span>
                    )}
                    {restaurant.socialTableEnabled && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                        <Users className="w-2.5 h-2.5" /> Social Table
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-700/50">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-white">{restaurant.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white">{restaurant.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-400" /> {restaurant.area}, {restaurant.city}</span>
                      <span>₹{restaurant.avgCostForTwo} for 2</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {restaurant.cuisineTypes.map((c) => (
                        <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Deals / Offers Section */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <Percent className="w-3 h-3" /> Dining Deals ({restaurant.offers.length})
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenDealModal(restaurant)}
                        className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Add Deal
                      </button>
                    </div>

                    {restaurant.offers.length > 0 ? (
                      <div className="space-y-2">
                        {restaurant.offers.map((offer) => (
                          <div
                            key={offer.id}
                            className={`p-3 rounded-xl border transition-all ${
                              offer.isActive
                                ? 'bg-slate-900/80 border-slate-800'
                                : 'bg-slate-950/60 border-slate-800/50 opacity-60'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-white truncate">{offer.title}</span>
                                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                                    {offer.discountPct}% OFF
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 mt-1">
                                  <span>{offer.availableDays.join(', ')}</span>
                                  <span>·</span>
                                  <span>{offer.validFrom} - {offer.validTo}</span>
                                  <span>·</span>
                                  <span className="font-semibold text-slate-300">{offer.maxCoversPerSlot} covers cap/slot</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleToggleDeal(restaurant.id, offer.id)}
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                                    offer.isActive
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                      : 'bg-slate-800 text-slate-400 border-slate-700'
                                  }`}
                                >
                                  {offer.isActive ? 'Active' : 'Paused'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteDeal(restaurant.id, offer.id)}
                                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                                  title="Delete deal"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                        No active deals. Click "Add Deal" to publish discounts for diners.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-5 pt-0">
                <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                  <Link
                    href={`/dining/${restaurant.slug}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    Preview Live Listing
                  </Link>
                  <button
                    onClick={() => handleOpenDealModal(restaurant)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Deal
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-panel rounded-3xl border border-slate-800 space-y-4">
          <UtensilsCrossed className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No restaurants listed</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            List your restaurant or dining bar to configure discounts and attract culinary enthusiasts.
          </p>
          <Link
            href="/vendor/dining/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl saffron-gradient text-slate-950 font-bold text-sm hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Your Restaurant
          </Link>
        </div>
      )}

      {/* Add Deal Modal */}
      {selectedRestForDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Add Exclusive Deal</h3>
                <p className="text-xs text-slate-400 mt-0.5">For {selectedRestForDeal.name}</p>
              </div>
              <button
                onClick={() => setSelectedRestForDeal(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Deal Title *</label>
                  <input
                    type="text"
                    value={dealTitle}
                    onChange={(e) => setDealTitle(e.target.value)}
                    placeholder="e.g. 25% OFF Chef Tasting Menu"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Discount % *</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={discountPct}
                      onChange={(e) => setDiscountPct(Number(e.target.value))}
                      min={5}
                      max={70}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3 pr-7 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50 font-bold"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Description & Terms</label>
                <input
                  type="text"
                  value={dealDescription}
                  onChange={(e) => setDealDescription(e.target.value)}
                  placeholder="e.g. Applicable on a la carte dining; drinks billed separately."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1.5">Applicable Days</label>
                <div className="flex flex-wrap gap-1.5">
                  {DAYS_OF_WEEK.map((day) => {
                    const active = availableDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleDay(day)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                          active
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[10px] font-medium text-slate-400 mb-1">From</label>
                  <input
                    type="time"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-400 mb-1">Until</label>
                  <input
                    type="time"
                    value={validTo}
                    onChange={(e) => setValidTo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-400 mb-1">Cover (₹)</label>
                  <input
                    type="number"
                    value={coverCharge}
                    onChange={(e) => setCoverCharge(Number(e.target.value))}
                    min={0}
                    step={50}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-400 mb-1">Slot Capacity</label>
                  <input
                    type="number"
                    value={maxCoversPerSlot}
                    onChange={(e) => setMaxCoversPerSlot(Number(e.target.value))}
                    min={2}
                    max={200}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedRestForDeal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDeal}
                  className="px-5 py-2 rounded-xl saffron-gradient text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-amber-500/20"
                >
                  {submittingDeal ? 'Adding...' : 'Publish Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
