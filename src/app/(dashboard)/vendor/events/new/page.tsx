'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  CheckCircle2,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { SUPPORTED_CITIES } from '@/lib/mock-data';
import type { EventListing, TicketTier } from '@/types';

const CATEGORIES = [
  { value: 'live_music', label: 'Live Music & Jazz' },
  { value: 'standup_comedy', label: 'Standup Comedy' },
  { value: 'food_fest', label: 'Food Festival / Culinary' },
  { value: 'club_night', label: 'Club Night / Sundowner' },
  { value: 'cultural_experience', label: 'Cultural Experience' },
];

interface TierDraft {
  tierName: string;
  price: string;
  totalCapacity: string;
  perks: string;
}

const EMPTY_TIER: TierDraft = { tierName: '', price: '', totalCapacity: '', perks: '' };

export default function NewEventPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Basic details
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('live_music');
  const [city, setCity] = useState('Mumbai');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('18:30');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('22:30');
  const [ageRestriction, setAgeRestriction] = useState('18+');
  const [terms, setTerms] = useState('');

  // Ticket tiers
  const [tiers, setTiers] = useState<TierDraft[]>([{ ...EMPTY_TIER }]);

  const addTier = () => setTiers((prev) => [...prev, { ...EMPTY_TIER }]);
  const removeTier = (i: number) => setTiers((prev) => prev.filter((_, idx) => idx !== i));
  const updateTier = (i: number, field: keyof TierDraft, val: string) =>
    setTiers((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: val } : t)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !venueName || !startDate || tiers.length === 0) return;

    setSaving(true);

    const categoryObj = CATEGORIES.find((c) => c.value === category)!;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50);

    const startingPrice = Math.min(...tiers.map((t) => Number(t.price) || 0));

    const newEvent: EventListing = {
      id: `evt-${Date.now()}`,
      vendorId: 'ven-demo-vendor',
      vendorName: 'Demo Vendor',
      title,
      slug: `${slug}-${Date.now()}`,
      category: category as EventListing['category'],
      categoryLabel: categoryObj.label,
      description,
      city,
      venueName,
      venueAddress,
      bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80',
      galleryUrls: [],
      startTime: startDate && startTime ? `${startDate}T${startTime}:00+05:30` : new Date().toISOString(),
      endTime: endDate && endTime ? `${endDate}T${endTime}:00+05:30` : new Date().toISOString(),
      status: 'pending_approval',
      isFeatured: false,
      ageRestriction,
      termsConditions: terms,
      startingPrice,
      ticketTiers: tiers.map((t, i) => ({
        id: `tier-new-${Date.now()}-${i}`,
        eventId: `evt-${Date.now()}`,
        tierName: t.tierName,
        price: Number(t.price) || 0,
        totalCapacity: Number(t.totalCapacity) || 50,
        soldCount: 0,
        perks: t.perks.split(',').map((p) => p.trim()).filter(Boolean),
      })),
    };

    store.addEvent(newEvent);
    setSaving(false);
    setSaved(true);
    setTimeout(() => router.push('/vendor/events'), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/vendor/events"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white">Create New Event</h1>
          <p className="text-xs text-slate-400 mt-0.5">Submit for admin review — goes live within 24 hours</p>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-sm font-bold text-emerald-300">Event submitted for review!</div>
            <div className="text-xs text-emerald-400/70">Redirecting to your events list...</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" /> Event Details
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Event Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. The Bandra Rooftop Jazz & Wine Soiree"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value} className="bg-slate-900">{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">City *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
              >
                {SUPPORTED_CITIES.map((c) => (
                  <option key={c} value={c} className="bg-slate-900">{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Venue Name *</label>
            <input
              type="text"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              required
              placeholder="e.g. The High Tide Terrace, Bandra West"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Venue Address</label>
            <input
              type="text"
              value={venueAddress}
              onChange={(e) => setVenueAddress(e.target.value)}
              placeholder="Full address including pin code"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              placeholder="Describe the event experience — what guests can expect, artists, food, atmosphere..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none transition-colors"
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" /> Date & Time
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Start Date *</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Start Time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">End Time</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Age Restriction</label>
              <select value={ageRestriction} onChange={(e) => setAgeRestriction(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors">
                {['All Ages', '16+', '18+', '21+'].map((a) => (
                  <option key={a} value={a} className="bg-slate-900">{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Banner Image URL</label>
              <input type="url" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://... (Unsplash or Cloudinary URL)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
          </div>
        </div>

        {/* Ticket Tiers */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Ticket className="w-4 h-4 text-amber-400" /> Ticket Tiers
            </h2>
            <button
              type="button"
              onClick={addTier}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Tier
            </button>
          </div>

          <div className="space-y-4">
            {tiers.map((tier, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">Tier {i + 1}</span>
                  {tiers.length > 1 && (
                    <button type="button" onClick={() => removeTier(i)} className="text-rose-400 hover:text-rose-300 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-medium text-slate-400 mb-1">Tier Name *</label>
                    <input
                      type="text"
                      value={tier.tierName}
                      onChange={(e) => updateTier(i, 'tierName', e.target.value)}
                      placeholder="e.g. General Access"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={tier.price}
                      onChange={(e) => updateTier(i, 'price', e.target.value)}
                      placeholder="799"
                      min={0}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-1">Capacity</label>
                    <input
                      type="number"
                      value={tier.totalCapacity}
                      onChange={(e) => updateTier(i, 'totalCapacity', e.target.value)}
                      placeholder="100"
                      min={1}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-400 mb-1">Perks (comma-separated)</label>
                  <input
                    type="text"
                    value={tier.perks}
                    onChange={(e) => updateTier(i, 'perks', e.target.value)}
                    placeholder="e.g. Entry ticket, 1 welcome drink, Reserved seating"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Terms */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400" /> Terms & Conditions (shown to guests)
          </h2>
          <textarea
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            rows={3}
            placeholder="e.g. Entry with valid photo ID. No refunds within 48 hours..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none transition-colors"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/vendor/events"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold border border-slate-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl saffron-gradient text-slate-950 font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-70"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4" /> Submit for Review</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
