'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Plus,
  Ticket,
  Users,
  MapPin,
  Clock,
  Star,
  Eye,
  ArrowRight,
  Sparkles,
  Crown,
  CheckCircle,
  Sliders,
  X,
  Trash2,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { store } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import type { EventListing, ListingStatus, TicketTier } from '@/types';

const STATUS_STYLE: Record<ListingStatus, string> = {
  published: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  pending_approval: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  draft: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  rejected: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  archived: 'bg-slate-700/20 text-slate-500 border-slate-700/30',
};

export default function VendorEventsPage() {
  const vendorId = 'ven-indigo-hospitality';
  const [events, setEvents] = useState<EventListing[]>(store.getAllEvents());
  const [subscription, setSubscription] = useState(store.getVendorSubscription(vendorId));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [boostingId, setBoostingId] = useState<string | null>(null);

  // Tier & Capacity Modal State
  const [tierModalEvent, setTierModalEvent] = useState<EventListing | null>(null);
  const [editingTiers, setEditingTiers] = useState<TicketTier[]>([]);
  const [newTierName, setNewTierName] = useState('');
  const [newTierPrice, setNewTierPrice] = useState(999);
  const [newTierCapacity, setNewTierCapacity] = useState(50);
  const [newTierPerks, setNewTierPerks] = useState('');
  const [savingTiers, setSavingTiers] = useState(false);

  const availableCredits = Math.max(
    0,
    subscription.featuredListingCredits - subscription.usedListingCredits
  );

  const reloadData = () => {
    setEvents([...store.getAllEvents()]);
    setSubscription({ ...store.getVendorSubscription(vendorId) });
  };

  const handleBoost = async (eventId: string) => {
    try {
      setBoostingId(eventId);
      const res = await fetch('/api/vendor/feature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          listingId: eventId,
          listingType: 'event',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback(data.message || 'Event boosted to Featured badge!');
        reloadData();
      } else {
        alert(data.error || 'Failed to boost listing');
      }
    } catch {
      alert('Error boosting listing');
    } finally {
      setBoostingId(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleOpenTiersModal = (event: EventListing) => {
    setTierModalEvent(event);
    setEditingTiers(JSON.parse(JSON.stringify(event.ticketTiers)));
    setNewTierName('');
    setNewTierPrice(899);
    setNewTierCapacity(50);
    setNewTierPerks('');
  };

  const handleUpdateTierCapacity = (tierId: string, newCap: number) => {
    setEditingTiers((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, totalCapacity: Math.max(t.soldCount, newCap) } : t))
    );
  };

  const handleUpdateTierPrice = (tierId: string, newPrice: number) => {
    setEditingTiers((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, price: Math.max(0, newPrice) } : t))
    );
  };

  const handleAddTierInline = async () => {
    if (!tierModalEvent || !newTierName.trim()) return;

    try {
      setSavingTiers(true);
      const perksArr = newTierPerks.split(',').map((p) => p.trim()).filter(Boolean);
      const res = await fetch('/api/vendor/events/tiers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_tier',
          eventId: tierModalEvent.id,
          tierName: newTierName.trim(),
          price: Number(newTierPrice),
          totalCapacity: Number(newTierCapacity),
          perks: perksArr,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add tier');

      setEditingTiers((prev) => [...prev, data.tier]);
      setNewTierName('');
      setNewTierPerks('');
      reloadData();
      setFeedback(`Ticket Tier "${data.tier.tierName}" created with ${data.tier.totalCapacity} capacity!`);
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Error creating tier');
    } finally {
      setSavingTiers(false);
    }
  };

  const handleSaveAllTiers = async () => {
    if (!tierModalEvent) return;

    try {
      setSavingTiers(true);
      for (const tier of editingTiers) {
        await fetch('/api/vendor/events/tiers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_tier',
            eventId: tierModalEvent.id,
            tierId: tier.id,
            updates: {
              totalCapacity: tier.totalCapacity,
              price: tier.price,
            },
          }),
        });
      }

      reloadData();
      setFeedback('Ticket tiers and capacities updated successfully!');
      setTierModalEvent(null);
      setTimeout(() => setFeedback(null), 3500);
    } catch {
      alert('Error saving tier capacities');
    } finally {
      setSavingTiers(false);
    }
  };

  const handleDeleteTier = async (tierId: string) => {
    if (!tierModalEvent) return;
    if (editingTiers.length <= 1) {
      alert('An event must have at least one ticket tier.');
      return;
    }

    try {
      setSavingTiers(true);
      const res = await fetch('/api/vendor/events/tiers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_tier',
          eventId: tierModalEvent.id,
          tierId,
        }),
      });

      if (res.ok) {
        setEditingTiers((prev) => prev.filter((t) => t.id !== tierId));
        reloadData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete tier');
      }
    } catch {
      alert('Error deleting tier');
    } finally {
      setSavingTiers(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Ticket className="w-3.5 h-3.5" />
            <span>Ticket Inventory & Venue Seating</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-0.5">My Events & Ticket Tiers</h1>
          <p className="text-xs text-slate-400">Manage live experiences, capacity thresholds, and pricing tiers</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/vendor/subscription"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Featured Credits: {availableCredits}</span>
          </Link>
          <Link
            href="/vendor/events/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl saffron-gradient text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            Create New Event
          </Link>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Events Grid */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event) => {
            const totalCapacity = event.ticketTiers.reduce((s, t) => s + t.totalCapacity, 0);
            const totalSold = event.ticketTiers.reduce((s, t) => s + t.soldCount, 0);
            const fillPct = totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0;
            const isBoosting = boostingId === event.id;

            return (
              <div key={event.id} className="glass-card rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between">
                <div>
                  {/* Banner */}
                  <div className="relative h-40">
                    <img
                      src={event.bannerUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[event.status] || STATUS_STYLE.draft}`}>
                        {event.status.replace('_', ' ')}
                      </span>
                      {event.isFeatured && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md">
                          <Sparkles className="w-2.5 h-2.5 fill-slate-950" /> Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                        {event.categoryLabel}
                      </div>
                      <h3 className="text-sm font-bold text-white leading-snug">{event.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1.5">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-400" /> {event.city}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" /> {new Date(event.startTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>

                    {/* Capacity bar */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1.5">
                        <span className="font-semibold">{totalSold} booked of {totalCapacity} seats</span>
                        <span className={fillPct >= 90 ? 'text-rose-400 font-bold' : fillPct >= 70 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {fillPct}% capacity filled
                        </span>
                      </div>
                      <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            fillPct >= 90 ? 'bg-rose-500' : fillPct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, fillPct)}%` }}
                        />
                      </div>
                    </div>

                    {/* Ticket tiers list */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Ticket Tiers ({event.ticketTiers.length})</span>
                        <button
                          onClick={() => handleOpenTiersModal(event)}
                          className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                        >
                          <Sliders className="w-3 h-3" /> Manage Capacity
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-1.5">
                        {event.ticketTiers.map((tier) => (
                          <div
                            key={tier.id}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
                          >
                            <span className="font-medium text-slate-200">{tier.tierName}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-slate-400">{tier.soldCount}/{tier.totalCapacity} sold</span>
                              <span className="font-bold text-emerald-400">{formatINR(tier.price)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-5 pt-0">
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                    <Link
                      href={`/events/${event.slug}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      Preview
                    </Link>

                    <button
                      onClick={() => handleOpenTiersModal(event)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      Tiers & Capacity
                    </button>

                    {!event.isFeatured ? (
                      <button
                        onClick={() => handleBoost(event.id)}
                        disabled={isBoosting}
                        className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-bold border border-amber-500/30 transition-all disabled:opacity-50"
                        title="Boost to Featured"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="px-3 py-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 glass-panel rounded-3xl border border-slate-800 space-y-4">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No events yet</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Create your first event to configure ticket tiers, set capacity caps, and start selling passes.
          </p>
          <Link
            href="/vendor/events/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl saffron-gradient text-slate-950 font-bold text-sm hover:brightness-110 transition-all mt-2"
          >
            <Plus className="w-4 h-4" />
            Create Your First Event
          </Link>
        </div>
      )}

      {/* Tiers & Capacity Management Modal */}
      {tierModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Tier & Capacity Controls</span>
                </div>
                <h3 className="text-lg font-black text-white mt-0.5">{tierModalEvent.title}</h3>
                <p className="text-xs text-slate-400">
                  Adjust ticket tier capacities, update pricing, or introduce new seating categories.
                </p>
              </div>
              <button
                onClick={() => setTierModalEvent(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing Tiers */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Active Ticket Tiers ({editingTiers.length})
              </h4>

              <div className="space-y-3">
                {editingTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{tier.tierName}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-400">
                          Sold: <strong className="text-amber-400">{tier.soldCount}</strong>
                        </span>
                        {editingTiers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteTier(tier.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Delete tier"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">
                          Total Capacity (Min: {tier.soldCount})
                        </label>
                        <input
                          type="number"
                          value={tier.totalCapacity}
                          onChange={(e) => handleUpdateTierCapacity(tier.id, Number(e.target.value))}
                          min={tier.soldCount}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-amber-500/50"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">Price (₹)</label>
                        <input
                          type="number"
                          value={tier.price}
                          onChange={(e) => handleUpdateTierPrice(tier.id, Number(e.target.value))}
                          min={0}
                          step={50}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Tier Form */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add New Ticket Category
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-medium text-slate-400 mb-1">Tier Name *</label>
                  <input
                    type="text"
                    value={newTierName}
                    onChange={(e) => setNewTierName(e.target.value)}
                    placeholder="e.g. Early Bird Access"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-slate-400 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={newTierPrice}
                    onChange={(e) => setNewTierPrice(Number(e.target.value))}
                    min={0}
                    step={50}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-slate-400 mb-1">Capacity *</label>
                  <input
                    type="number"
                    value={newTierCapacity}
                    onChange={(e) => setNewTierCapacity(Number(e.target.value))}
                    min={1}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-1">Perks (comma-separated)</label>
                <input
                  type="text"
                  value={newTierPerks}
                  onChange={(e) => setNewTierPerks(e.target.value)}
                  placeholder="e.g. Fast-track entry, 1 cocktail included, Reserved deck"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddTierInline}
                  disabled={savingTiers || !newTierName.trim()}
                  className="px-4 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold transition-all disabled:opacity-50"
                >
                  + Add Category
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setTierModalEvent(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAllTiers}
                disabled={savingTiers}
                className="px-5 py-2 rounded-xl saffron-gradient text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {savingTiers ? 'Saving Capacities...' : 'Save Tier Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
