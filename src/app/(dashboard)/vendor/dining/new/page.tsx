'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Store,
  MapPin,
  Clock,
  Percent,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  CheckCircle2,
  UtensilsCrossed,
  Sparkles,
  Users,
  Image as ImageIcon,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { SUPPORTED_CITIES } from '@/lib/mock-data';

const CUISINE_OPTIONS = [
  'Modern Indian',
  'Mughlai & Awadhi',
  'Coastal Seafood',
  'Pan-Asian & Dim Sum',
  'European & Mediterranean',
  'Artisanal Italian',
  'Cocktail & Tapas Bar',
  'Heritage Storytelling Dining',
];

const SAMPLE_IMAGES = [
  {
    name: 'Luxury Dining Hall',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Intimate Rooftop Lounge',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Atmospheric Cocktail Bar',
    url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Heritage Courtyard',
    url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
  },
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface DealDraft {
  title: string;
  discountPct: number;
  description: string;
  availableDays: string[];
  validFrom: string;
  validTo: string;
  coverCharge: number;
  maxCoversPerSlot: number;
}

export default function NewRestaurantPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Restaurant details
  const [name, setName] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [avgCostForTwo, setAvgCostForTwo] = useState(2400);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(['Modern Indian', 'Cocktail & Tapas Bar']);
  const [selectedImage, setSelectedImage] = useState(SAMPLE_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [socialTableEnabled, setSocialTableEnabled] = useState(true);

  // Dining Deals
  const [deals, setDeals] = useState<DealDraft[]>([
    {
      title: '20% OFF A La Carte Dining',
      discountPct: 20,
      description: 'Exclusive 20% savings on food bill for Dastan social dining reservations.',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun'],
      validFrom: '12:30',
      validTo: '23:30',
      coverCharge: 0,
      maxCoversPerSlot: 24,
    },
  ]);

  const toggleCuisine = (c: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  const addDeal = () => {
    setDeals((prev) => [
      ...prev,
      {
        title: '25% OFF Chef Tasting Menu',
        discountPct: 25,
        description: 'Special culinary tasting menu discount with priority seating.',
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu'],
        validFrom: '19:00',
        validTo: '23:00',
        coverCharge: 500,
        maxCoversPerSlot: 16,
      },
    ]);
  };

  const removeDeal = (index: number) => {
    setDeals((prev) => prev.filter((_, i) => i !== index));
  };

  const updateDeal = (index: number, field: keyof DealDraft, val: any) => {
    setDeals((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: val } : d))
    );
  };

  const toggleDealDay = (dealIndex: number, day: string) => {
    const deal = deals[dealIndex];
    const exists = deal.availableDays.includes(day);
    const newDays = exists
      ? deal.availableDays.filter((d) => d !== day)
      : [...deal.availableDays, day];
    updateDeal(dealIndex, 'availableDays', newDays);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !area.trim() || !address.trim()) return;

    try {
      setSaving(true);
      const imageUrl = customImageUrl.trim() || selectedImage;

      const res = await fetch('/api/vendor/dining', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_restaurant',
          vendorId: 'ven-indigo-hospitality',
          vendorName: 'Indigo Experiences Mumbai',
          name: name.trim(),
          description: description.trim(),
          cuisineTypes: selectedCuisines.length ? selectedCuisines : ['Modern Indian'],
          city,
          area: area.trim(),
          address: address.trim(),
          images: [imageUrl],
          avgCostForTwo: Number(avgCostForTwo),
          socialTableEnabled,
          offers: deals,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create restaurant listing');
      }

      setSaved(true);
      setTimeout(() => {
        router.push('/vendor/dining');
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Error creating restaurant');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/vendor/dining"
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Store className="w-3.5 h-3.5" />
            <span>Restaurant & Deals Portal</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-0.5">List New Restaurant & Exclusive Deals</h1>
          <p className="text-xs text-slate-400">
            Publish your venue with tailored discounts, slot capacity limits, and social dining tables.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <div className="text-xs">
            <span className="font-bold">Restaurant submitted for Admin Moderation!</span> Your listing and deals are now queued for review and will be published to the public directory.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Restaurant Info */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-amber-400" /> Venue Profile & Location
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Restaurant Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Saffron & Smoke Dining Lounge"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">City *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
              >
                {SUPPORTED_CITIES.map((c) => (
                  <option key={c} value={c} className="bg-slate-900">{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Area / Neighborhood *</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Bandra West, Indiranagar, Connaught Place"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Average Cost for 2 (₹) *</label>
              <input
                type="number"
                value={avgCostForTwo}
                onChange={(e) => setAvgCostForTwo(Number(e.target.value))}
                min={300}
                step={100}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Complete Address *</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              placeholder="e.g. 3rd Floor, Palladium Mall, High Street Phoenix, Lower Parel, Mumbai"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description & Story</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Tell guests about your dining story, culinary philosophy, atmosphere, and special pairings..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          {/* Cuisine selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Cuisine Specialities</label>
            <div className="flex flex-wrap gap-2">
              {CUISINE_OPTIONS.map((c) => {
                const active = selectedCuisines.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCuisine(c)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                      active
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Venue Photography</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SAMPLE_IMAGES.map((img) => (
                <div
                  key={img.url}
                  onClick={() => {
                    setSelectedImage(img.url);
                    setCustomImageUrl('');
                  }}
                  className={`relative h-24 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImage === img.url && !customImageUrl
                      ? 'border-amber-400 ring-2 ring-amber-400/20 scale-[1.02]'
                      : 'border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] font-bold text-white truncate">{img.name}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="Or paste custom image URL (Unsplash or Cloudinary)..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Social Discovery Table Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white">Enable Social Discovery Table</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Allows solo patrons and culture lovers to opt-in to shared networking community tables at your venue.
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={socialTableEnabled}
                onChange={(e) => setSocialTableEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>

        {/* Deals & Offers Section */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-400" /> Exclusive Dining Deals & Capacity
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure discount rates, slot validity, cover guarantees, and seat capacity limits.
              </p>
            </div>
            <button
              type="button"
              onClick={addDeal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-bold text-amber-300 hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Another Deal
            </button>
          </div>

          <div className="space-y-5">
            {deals.map((deal, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    Deal #{idx + 1}
                  </span>
                  {deals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDeal(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                      title="Remove Deal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Deal Title *</label>
                    <input
                      type="text"
                      value={deal.title}
                      onChange={(e) => updateDeal(idx, 'title', e.target.value)}
                      placeholder="e.g. 20% OFF Total Food Bill"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Discount % *</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={deal.discountPct}
                        onChange={(e) => updateDeal(idx, 'discountPct', Number(e.target.value))}
                        min={5}
                        max={70}
                        required
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3 pr-8 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50 font-bold"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Deal Description & Inclusions</label>
                  <input
                    type="text"
                    value={deal.description}
                    onChange={(e) => updateDeal(idx, 'description', e.target.value)}
                    placeholder="e.g. Valid on food menu and non-alcoholic beverages. Cannot be clubbed with happy hours."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Days of week */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1.5">Applicable Days</label>
                  <div className="flex flex-wrap gap-1.5">
                    {DAYS_OF_WEEK.map((day) => {
                      const isSel = deal.availableDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDealDay(idx, day)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                            isSel
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Timings, Cover & Capacity */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-1">Valid From</label>
                    <input
                      type="time"
                      value={deal.validFrom}
                      onChange={(e) => updateDeal(idx, 'validFrom', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-1">Valid Until</label>
                    <input
                      type="time"
                      value={deal.validTo}
                      onChange={(e) => updateDeal(idx, 'validTo', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-1">Cover Charge (₹)</label>
                    <input
                      type="number"
                      value={deal.coverCharge}
                      onChange={(e) => updateDeal(idx, 'coverCharge', Number(e.target.value))}
                      min={0}
                      step={50}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-1">Max Covers / Slot (Capacity)</label>
                    <input
                      type="number"
                      value={deal.maxCoversPerSlot}
                      onChange={(e) => updateDeal(idx, 'maxCoversPerSlot', Number(e.target.value))}
                      min={2}
                      max={200}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50 font-bold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/vendor/dining"
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl saffron-gradient text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Submitting for Moderation...' : 'Publish Listing & Deals'}
          </button>
        </div>
      </form>
    </div>
  );
}
