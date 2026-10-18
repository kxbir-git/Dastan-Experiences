'use client';

import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  Clock,
  Ticket,
  Eye,
  UtensilsCrossed,
  Percent,
  Sliders,
  Filter,
  Users,
  X,
  Sparkles,
  AlertCircle,
  Building,
} from 'lucide-react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import type { EventListing, ListingStatus, Restaurant } from '@/types';

const STATUS_STYLE: Record<ListingStatus, string> = {
  published: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  pending_approval: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  draft: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  rejected: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  archived: 'bg-slate-700/20 text-slate-500 border-slate-700/30',
};

export default function AdminModerationPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'dining'>('events');
  const [events, setEvents] = useState<EventListing[]>(store.getAllEvents());
  const [restaurants, setRestaurants] = useState<Restaurant[]>(store.getAllRestaurants());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [processing, setProcessing] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Rejection modal
  const [rejectModal, setRejectModal] = useState<{
    type: 'event' | 'dining';
    id: string;
    title: string;
  } | null>(null);
  const [rejectionFeedback, setRejectionFeedback] = useState('Incomplete event details or pricing terms. Please revise.');

  const reload = () => {
    setEvents([...store.getAllEvents()]);
    setRestaurants([...store.getAllRestaurants()]);
  };

  const handleApprove = async (type: 'event' | 'dining', id: string) => {
    try {
      setProcessing(id);
      const res = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, status: 'published' }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Listing approved and published!');
        reload();
      } else {
        alert(data.error || 'Approval failed');
      }
    } catch {
      alert('Error approving listing');
    } finally {
      setProcessing(null);
      setTimeout(() => setMessage(null), 3500);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModal) return;
    try {
      setProcessing(rejectModal.id);
      const res = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: rejectModal.type,
          id: rejectModal.id,
          status: 'rejected',
          feedback: rejectionFeedback.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Listing rejected with feedback note.');
        setRejectModal(null);
        reload();
      } else {
        alert(data.error || 'Rejection failed');
      }
    } catch {
      alert('Error rejecting listing');
    } finally {
      setProcessing(null);
      setTimeout(() => setMessage(null), 3500);
    }
  };

  const handleToggleFeatured = (type: 'event' | 'dining', id: string, current: boolean) => {
    if (type === 'event') {
      store.toggleFeaturedEvent(id, !current);
    } else {
      store.toggleFeaturedRestaurant(id, !current);
    }
    setMessage(`${type === 'event' ? 'Event' : 'Restaurant'} featured badge updated!`);
    reload();
    setTimeout(() => setMessage(null), 3000);
  };

  const filteredEvents = events.filter((e) => statusFilter === 'all' || e.status === statusFilter);
  const filteredRestaurants = restaurants.filter((r) => statusFilter === 'all' || r.status === statusFilter);

  const pendingEvents = events.filter((e) => e.status === 'pending_approval');
  const pendingRestaurants = restaurants.filter((r) => r.status === 'pending_approval');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>Listing Governance & Quality Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Listings Moderation & Publishing Hub
          </h1>
          <p className="text-xs text-slate-400">
            Audit live events, dining deals, ticket tier capacities, and approve listings for public discovery.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            href="/admin/vendors"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
          >
            <Building className="w-4 h-4 text-amber-400" />
            <span>Vendor Approvals</span>
          </Link>
          <Link
            href="/admin/refunds"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl saffron-gradient text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
          >
            <span>Refunds Hub</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pending Review', value: pendingEvents.length + pendingRestaurants.length, color: 'text-amber-400' },
          { label: 'Published Events', value: events.filter((e) => e.status === 'published').length, color: 'text-emerald-400' },
          { label: 'Published Dining', value: restaurants.filter((r) => r.status === 'published').length, color: 'text-indigo-400' },
          { label: 'Featured Spotlight', value: events.filter((e) => e.isFeatured).length + restaurants.filter((r) => r.isFeatured).length, color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-2xl p-4 border border-slate-800">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {message && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Tabs & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'events'
                ? 'saffron-gradient text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900/50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Live Events ({events.length})</span>
            {pendingEvents.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                {pendingEvents.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('dining')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'dining'
                ? 'saffron-gradient text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900/50'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
            <span>Restaurants & Deals ({restaurants.length})</span>
            {pendingRestaurants.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                {pendingRestaurants.length}
              </span>
            )}
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
          >
            <option value="all">All Statuses</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* TAB 1: LIVE EVENTS MODERATION */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const totalCapacity = event.ticketTiers.reduce((s, t) => s + t.totalCapacity, 0);
            const isProc = processing === event.id;

            return (
              <div
                key={event.id}
                className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <img
                      src={event.bannerUrl}
                      alt={event.title}
                      className="w-24 h-20 rounded-2xl object-cover shrink-0 border border-slate-800"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[event.status]}`}>
                          {event.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-amber-400 border border-slate-800">
                          {event.categoryLabel}
                        </span>
                        <span className="text-xs text-slate-400">Host: <strong className="text-white">{event.vendorName}</strong></span>
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug">{event.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-400" /> {event.venueName}, {event.city}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-500" /> {new Date(event.startTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        <span>Total Capacity: <strong className="text-white">{totalCapacity} seats</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleFeatured('event', event.id, event.isFeatured)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                        event.isFeatured
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${event.isFeatured ? 'fill-amber-400 text-amber-400' : ''}`} />
                      {event.isFeatured ? 'Featured' : 'Make Featured'}
                    </button>
                    <Link
                      href={`/events/${event.slug}`}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                      title="Preview Public Page"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Ticket Tiers Details */}
                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Ticket Tiers & Capacity Distribution
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {event.ticketTiers.map((t) => (
                      <div key={t.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-0.5">
                        <div className="font-bold text-white flex items-center justify-between">
                          <span>{t.tierName}</span>
                          <span className="text-emerald-400">{formatINR(t.price)}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Capacity: {t.totalCapacity} ({t.soldCount} sold)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center justify-end gap-3 pt-1 border-t border-slate-800">
                  {event.status !== 'published' && (
                    <button
                      onClick={() => handleApprove('event', event.id)}
                      disabled={isProc}
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve & Publish Live
                    </button>
                  )}

                  {event.status !== 'rejected' && (
                    <button
                      onClick={() =>
                        setRejectModal({
                          type: 'event',
                          id: event.id,
                          title: event.title,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors"
                    >
                      Reject with Feedback
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: RESTAURANTS & DINING DEALS MODERATION */}
      {activeTab === 'dining' && (
        <div className="space-y-4">
          {filteredRestaurants.map((restaurant) => {
            const isProc = processing === restaurant.id;

            return (
              <div
                key={restaurant.id}
                className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <img
                      src={restaurant.images[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'}
                      alt={restaurant.name}
                      className="w-24 h-20 rounded-2xl object-cover shrink-0 border border-slate-800"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[restaurant.status]}`}>
                          {restaurant.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400">Host: <strong className="text-white">{restaurant.vendorName}</strong></span>
                        {restaurant.socialTableEnabled && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Social Table Active
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug">{restaurant.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-400" /> {restaurant.area}, {restaurant.city}</span>
                        <span>₹{restaurant.avgCostForTwo} for 2</span>
                        <span>Cuisine: <strong className="text-slate-300">{restaurant.cuisineTypes.join(', ')}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleFeatured('dining', restaurant.id, restaurant.isFeatured)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                        restaurant.isFeatured
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${restaurant.isFeatured ? 'fill-amber-400 text-amber-400' : ''}`} />
                      {restaurant.isFeatured ? 'Featured' : 'Make Featured'}
                    </button>
                    <Link
                      href={`/dining/${restaurant.slug}`}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                      title="Preview Restaurant"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Offers & Deals details */}
                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Percent className="w-3 h-3" /> Dining Deals Configured ({restaurant.offers.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {restaurant.offers.map((offer) => (
                      <div key={offer.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{offer.title}</span>
                          <span className="font-black text-emerald-400">{offer.discountPct}% OFF</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {offer.availableDays.join(', ')} · {offer.validFrom} - {offer.validTo} · {offer.maxCoversPerSlot} covers capacity/slot
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-1 border-t border-slate-800">
                  {restaurant.status !== 'published' && (
                    <button
                      onClick={() => handleApprove('dining', restaurant.id)}
                      disabled={isProc}
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve & Publish Restaurant
                    </button>
                  )}

                  {restaurant.status !== 'rejected' && (
                    <button
                      onClick={() =>
                        setRejectModal({
                          type: 'dining',
                          id: restaurant.id,
                          title: restaurant.name,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors"
                    >
                      Reject with Feedback
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Listing Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400" />
                Reject Listing: {rejectModal.title}
              </h3>
              <button
                onClick={() => setRejectModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Provide feedback for the vendor explaining why this listing was not approved so they can correct it.
            </p>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Feedback Note *</label>
              <textarea
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
                rows={3}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500/50"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
