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
import { CitySelect } from '@/components/ui/city-select';
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

  const [publishImmediately, setPublishImmediately] = useState(true);
  const [createdEvent, setCreatedEvent] = useState<EventListing | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Ticket tiers
  const [tiers, setTiers] = useState<TierDraft[]>([
    { tierName: 'Standard Pass', price: '899', totalCapacity: '50', perks: 'Gate Entry, Welcome Drink' }
  ]);

  const addTier = () => setTiers((prev) => [...prev, { ...EMPTY_TIER }]);
  const removeTier = (i: number) => setTiers((prev) => prev.filter((_, idx) => idx !== i));
  const updateTier = (i: number, field: keyof TierDraft, val: string) =>
    setTiers((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: val } : t)));

  const PRESET_BANNERS = [
    { label: '🎷 Live Jazz & Wine', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80' },
    { label: '🎭 Standup Comedy', url: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1200&q=80' },
    { label: '🪕 Sufi & Classical', url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80' },
    { label: '🌃 Rooftop Lounge', url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !venueName || !startDate || tiers.length === 0) return;

    setSaving(true);
    setErrorMsg(null);

    const categoryObj = CATEGORIES.find((c) => c.value === category)!;
    const finalBanner = bannerUrl || PRESET_BANNERS[0].url;

    try {
      const res = await fetch('/api/vendor/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          categoryLabel: categoryObj.label,
          city,
          venueName,
          venueAddress: venueAddress || `${venueName}, ${city}`,
          description,
          bannerUrl: finalBanner,
          startTime: startDate && startTime ? `${startDate}T${startTime}:00+05:30` : new Date().toISOString(),
          endTime: endDate && endTime ? `${endDate}T${endTime}:00+05:30` : new Date().toISOString(),
          status: publishImmediately ? 'published' : 'pending_approval',
          ageRestriction,
          termsConditions: terms,
          ticketTiers: tiers.map((t) => ({
            tierName: t.tierName || 'Standard Pass',
            price: Number(t.price) || 0,
            totalCapacity: Number(t.totalCapacity) || 50,
            perks: t.perks,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to publish event');
      }

      setCreatedEvent(data.event);
      setSaved(true);
    } catch (err: any) {
      console.error('Error creating event:', err);
      setErrorMsg(err.message || 'Failed to create event. Please check inputs.');
    } finally {
      setSaving(false);
    }
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
          <p className="text-xs text-slate-400 mt-0.5">Register your experience and make it live for patrons to book</p>
        </div>
      </div>

      {saved && createdEvent && (
        <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
            <div>
              <div className="text-base font-bold text-white">
                🎉 Event &quot;{createdEvent.title}&quot; is Registered!
              </div>
              <div className="text-xs text-emerald-300/80 mt-0.5">
                {createdEvent.status === 'published'
                  ? 'Your event is LIVE on the Customer portal right now. Patrons can browse and purchase passes.'
                  : 'Your event draft has been saved successfully.'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/events/${createdEvent.slug}`}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <span>View Live on Customer Portal →</span>
            </Link>
            <Link
              href="/vendor/events"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
            >
              Manage in Vendor Dashboard
            </Link>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
          ⚠️ {errorMsg}
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
              <CitySelect
                value={city}
                onChange={(newCity) => setCity(newCity)}
                label="City *"
                placeholder="Type city (e.g. Pune, Jaipur)..."
                allowAllCities={false}
                dark={true}
              />
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
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Banner Image</label>
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="Paste Image URL or pick a preset below..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[10px] text-slate-400 font-medium">Quick Presets:</span>
                {PRESET_BANNERS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setBannerUrl(preset.url)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                      bannerUrl === preset.url
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
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

        {/* Publication Control & Submit */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={publishImmediately}
              onChange={(e) => setPublishImmediately(e.target.checked)}
              className="w-5 h-5 rounded-md accent-amber-500 bg-slate-900 border-slate-700 cursor-pointer"
            />
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Publish Live Immediately</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  RECOMMENDED
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Instantly displays on Customer View so patrons can discover and book tickets right away.
              </div>
            </div>
          </label>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/vendor/events"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-70 cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>Publishing Experience...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{publishImmediately ? '🚀 Publish Live Now' : 'Save as Draft'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
