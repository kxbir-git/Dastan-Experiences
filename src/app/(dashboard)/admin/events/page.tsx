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
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending_approval: 'bg-amber-50 text-amber-800 border-amber-200',
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  archived: 'bg-slate-100 text-slate-500 border-slate-200',
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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DFD5] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-[#775a00] uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>Listing Governance & Quality Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight">
            Listings Moderation & Publishing Hub
          </h1>
          <p className="text-xs text-[#71717A]">
            Audit live events, dining deals, ticket tier capacities, and approve listings for public discovery.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            href="/admin/vendors"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E6DFD5] text-xs font-semibold text-[#18181B] hover:bg-[#FAF7F2] transition-colors shadow-xs"
          >
            <Building className="w-4 h-4 text-[#775a00]" />
            <span>Vendor Approvals</span>
          </Link>
          <Link
            href="/admin/refunds"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#775a00] hover:bg-[#5c4600] text-white font-bold text-xs transition-all shadow-md"
          >
            <span>Refunds Hub</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <h2 className="text-xl font-bold text-[#18181B] mt-4">Signature Dastans</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pending Review', value: pendingEvents.length + pendingRestaurants.length, color: 'text-[#775a00]' },
          { label: 'Published Events', value: events.filter((e) => e.status === 'published').length, color: 'text-emerald-700' },
          { label: 'Published Dining', value: restaurants.filter((r) => r.status === 'published').length, color: 'text-indigo-700' },
          { label: 'Featured Spotlight', value: events.filter((e) => e.isFeatured).length + restaurants.filter((r) => r.isFeatured).length, color: 'text-[#775a00]' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-[#E6DFD5] shadow-xs">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold mt-0.5">{s.label}</div>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DFD5] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'events'
                ? 'bg-[#775a00] text-white shadow-md'
                : 'text-[#71717A] hover:text-[#18181B] bg-[#FAF7F2] border border-[#E6DFD5]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Live Events ({events.length})</span>
            {pendingEvents.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-black">
                {pendingEvents.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('dining')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'dining'
                ? 'bg-[#775a00] text-white shadow-md'
                : 'text-[#71717A] hover:text-[#18181B] bg-[#FAF7F2] border border-[#E6DFD5]'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Restaurants & Deals ({restaurants.length})</span>
            {pendingRestaurants.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-black">
                {pendingRestaurants.length}
              </span>
            )}
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#71717A]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#E6DFD5] rounded-xl px-3 py-1.5 text-xs text-[#18181B] focus:outline-none focus:border-[#775a00] cursor-pointer font-medium"
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
                className="bg-white rounded-3xl p-5 border border-[#E6DFD5] shadow-xs space-y-4 hover:border-[#c59a27]/40 transition-all"
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
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#775a00] border border-[#E6DFD5]">
                          {event.categoryLabel}
                        </span>
                        <span className="text-xs text-[#71717A]">Host: <strong className="text-[#18181B]">{event.vendorName}</strong></span>
                      </div>
                      <h3 className="text-base font-bold text-[#18181B] leading-snug">{event.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#71717A]">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#775a00]" /> {event.venueName}, {event.city}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#71717A]" /> {new Date(event.startTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        <span>Total Capacity: <strong className="text-[#18181B]">{totalCapacity} seats</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleFeatured('event', event.id, event.isFeatured)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                        event.isFeatured
                          ? 'bg-[#ffdf9a]/40 text-[#775a00] border-[#c59a27]/40'
                          : 'bg-white text-[#71717A] border-[#E6DFD5] hover:text-[#18181B] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${event.isFeatured ? 'fill-[#c59a27] text-[#c59a27]' : ''}`} />
                      {event.isFeatured ? 'Featured' : 'Make Featured'}
                    </button>
                    <Link
                      href={`/events/${event.slug}`}
                      className="p-2 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#71717A] hover:text-[#18181B] border border-[#E6DFD5]"
                      title="Preview Public Page"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Ticket Tiers Details */}
                <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E6DFD5] space-y-2">
                  <div className="text-[10px] font-bold text-[#775a00] uppercase tracking-wider">
                    Ticket Tiers & Capacity Distribution
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {event.ticketTiers.map((t) => (
                      <div key={t.id} className="p-2.5 rounded-xl bg-white border border-[#E6DFD5] text-xs space-y-0.5 shadow-xs">
                        <div className="font-bold text-[#18181B] flex items-center justify-between">
                          <span>{t.tierName}</span>
                          <span className="text-emerald-700 font-mono">{formatINR(t.price)}</span>
                        </div>
                        <div className="text-[11px] text-[#71717A]">
                          Capacity: {t.totalCapacity} ({t.soldCount} sold)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E6DFD5]">
                  {event.status !== 'published' && (
                    <button
                      onClick={() => handleApprove('event', event.id)}
                      disabled={isProc}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
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
                      className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
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
                className="bg-white rounded-3xl p-5 border border-[#E6DFD5] shadow-xs space-y-4 hover:border-[#c59a27]/40 transition-all"
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
                <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E6DFD5] space-y-2">
                  <div className="text-[10px] font-bold text-[#775a00] uppercase tracking-wider flex items-center gap-1">
                    <Percent className="w-3 h-3" /> Dining Deals Configured ({restaurant.offers.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {restaurant.offers.map((offer) => (
                      <div key={offer.id} className="p-2.5 rounded-xl bg-white border border-[#E6DFD5] text-xs space-y-1 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#18181B]">{offer.title}</span>
                          <span className="font-black text-emerald-700">{offer.discountPct}% OFF</span>
                        </div>
                        <div className="text-[11px] text-[#71717A]">
                          {offer.availableDays.join(', ')} · {offer.validFrom} - {offer.validTo} · {offer.maxCoversPerSlot} covers capacity/slot
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E6DFD5]">
                  {restaurant.status !== 'published' && (
                    <button
                      onClick={() => handleApprove('dining', restaurant.id)}
                      disabled={isProc}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
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
                      className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E6DFD5] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#18181B] flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600" />
                Reject Listing: {rejectModal.title}
              </h3>
              <button
                onClick={() => setRejectModal(null)}
                className="text-[#71717A] hover:text-[#18181B] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#71717A]">
              Provide feedback for the vendor explaining why this listing was not approved so they can correct it.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1.5">Feedback Note *</label>
              <textarea
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
                rows={3}
                required
                className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl p-3 text-xs text-[#18181B] focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#71717A] hover:text-[#18181B] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
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
