'use client';

import React, { useState } from 'react';
import {
  Store,
  DollarSign,
  Ticket,
  Users,
  QrCode,
  Plus,
  CheckCircle2,
  AlertCircle,
  Building,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { store } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import { DEMO_USERS } from '@/lib/mock-data';
import { CitySelect } from '@/components/ui/city-select';

export default function VendorDashboardPage() {
  const vendorUser = DEMO_USERS.vendor;
  const events = store.getAllEvents();
  const bookings = store.getBookings();

  // QR Check-in scanner state
  const [scanHashInput, setScanHashInput] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; booking?: any } | null>(null);
  const [loadingScan, setLoadingScan] = useState(false);

  // New Listing State
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCity, setNewCity] = useState('Mumbai');
  const [newCategory, setNewCategory] = useState<'live_music' | 'standup_comedy' | 'food_fest' | 'club_night'>('live_music');
  const [newPrice, setNewPrice] = useState(799);
  const [newCapacity, setNewCapacity] = useState(100);
  const [newVenue, setNewVenue] = useState('');

  // Metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.status !== 'refunded' ? b.totalAmount : 0), 0);
  const totalCheckedIn = bookings.filter((b) => b.status === 'checked_in').length;

  const handleVerifyCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanHashInput.trim()) return;

    try {
      setLoadingScan(true);
      setScanResult(null);

      const res = await fetch('/api/bookings/verify-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrHash: scanHashInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setScanResult({ success: false, message: data.error || 'Verification failed', booking: data.booking });
      } else {
        setScanResult({ success: true, message: data.message, booking: data.booking });
        setScanHashInput('');
      }
    } catch (err: any) {
      setScanResult({ success: false, message: err.message || 'Error scanning ticket' });
    } finally {
      setLoadingScan(false);
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newVenue) return;

    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    store.addEvent({
      id: `evt-${Date.now()}`,
      vendorId: 'ven-indigo-hospitality',
      vendorName: 'Indigo Experiences Mumbai',
      title: newTitle,
      slug,
      category: newCategory,
      categoryLabel: newCategory.replace('_', ' ').toUpperCase(),
      description: 'Exclusive newly published event created through the Dastan Vendor Portal.',
      city: newCity,
      venueName: newVenue,
      venueAddress: `${newVenue}, ${newCity}`,
      bannerUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
      galleryUrls: [],
      startTime: '2026-11-15T19:00:00+05:30',
      endTime: '2026-11-15T23:00:00+05:30',
      status: 'published',
      isFeatured: false,
      ageRestriction: '21+',
      termsConditions: 'Entry valid with Government Photo ID.',
      startingPrice: Number(newPrice),
      ticketTiers: [
        {
          id: `tier-${Date.now()}-1`,
          eventId: `evt-${Date.now()}`,
          tierName: 'General Admission',
          price: Number(newPrice),
          totalCapacity: Number(newCapacity),
          soldCount: 0,
          perks: ['Standard Venue Admission', '1 Welcome Beverage'],
        },
      ],
    });

    setIsCreatingEvent(false);
    setNewTitle('');
    setNewVenue('');
    alert('Listing created and published successfully on Dastan Experiences!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" />
            <span>Dastan Experiences Partner & Organizer Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Indigo Experiences Mumbai
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Vendor ID: VEN-INDIGO-094 • GSTIN: 27AABCP9482M1Z4 • Razorpay Route: Connected
          </p>
        </div>

        <button
          onClick={() => setIsCreatingEvent(true)}
          className="flex items-center gap-2 saffron-gradient text-slate-950 font-bold px-5 py-3 rounded-2xl text-xs hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Experience</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Gross Sales</span>
          <div className="text-2xl font-black text-amber-400">{formatINR(totalRevenue)}</div>
          <span className="text-[10px] text-slate-500">Across all ticket tiers</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Bookings</span>
          <div className="text-2xl font-black text-white">{bookings.length}</div>
          <span className="text-[10px] text-emerald-400">100% verified Razorpay orders</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Venue Check-Ins</span>
          <div className="text-2xl font-black text-indigo-400">{totalCheckedIn}</div>
          <span className="text-[10px] text-slate-500">Scanned at gate</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Listings</span>
          <div className="text-2xl font-black text-emerald-400">{events.length}</div>
          <span className="text-[10px] text-slate-500">Published live across India</span>
        </div>
      </div>

      {/* Main Vendor Operations Grid: QR Gate Scanner & Active Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Gate QR Check-in Verification Scanner (1 Col) */}
        <div className="lg:col-span-1 glass-panel rounded-3xl p-6 border border-indigo-500/30 space-y-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              <QrCode className="w-4 h-4" />
              <span>Gate Entry Check-in Scanner</span>
            </div>
            <h3 className="text-lg font-bold text-white">Scan Customer Ticket</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Paste or scan the QR Code Hash from the guest's digital pass to verify entry.
            </p>
          </div>

          <form onSubmit={handleVerifyCheckIn} className="space-y-3">
            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1">
                Ticket Hash / Pass Code
              </label>
              <input
                type="text"
                placeholder="e.g. DSTN-QR-BNDR-94821-VERIFIED"
                value={scanHashInput}
                onChange={(e) => setScanHashInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loadingScan}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {loadingScan ? 'Validating...' : 'Verify & Check In'}
            </button>
          </form>

          {/* Quick Test Hash Buttons */}
          <div className="pt-2 border-t border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-medium">Quick Test Passes:</span>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setScanHashInput('DSTN-QR-BNDR-94821-VERIFIED')}
                className="text-[11px] font-mono text-left px-2 py-1 rounded bg-slate-900 text-amber-300 hover:bg-slate-800 truncate"
              >
                DSTN-QR-BNDR-94821-VERIFIED
              </button>
              <button
                type="button"
                onClick={() => setScanHashInput('DSTN-QR-REST-71239-VERIFIED')}
                className="text-[11px] font-mono text-left px-2 py-1 rounded bg-slate-900 text-amber-300 hover:bg-slate-800 truncate"
              >
                DSTN-QR-REST-71239-VERIFIED
              </button>
            </div>
          </div>

          {/* Scan Result Alert */}
          {scanResult && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-1 ${
                scanResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                {scanResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>{scanResult.success ? 'Approved Entry' : 'Check-in Denied'}</span>
              </div>
              <p className="text-[11px]">{scanResult.message}</p>
            </div>
          )}
        </div>

        {/* Listings & Live Bookings Management (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">Recent Customer Bookings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Ref #</th>
                    <th className="pb-3 font-semibold">Guest</th>
                    <th className="pb-3 font-semibold">Experience</th>
                    <th className="pb-3 font-semibold">Covers</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {bookings.map((b) => (
                    <tr key={b.id} className="text-slate-300">
                      <td className="py-3 font-mono text-amber-400">{b.bookingNumber}</td>
                      <td className="py-3">
                        <div className="font-semibold text-white">{b.customerName}</div>
                        <div className="text-[10px] text-slate-500">{b.customerEmail}</div>
                      </td>
                      <td className="py-3">{b.eventTitle || b.restaurantName}</td>
                      <td className="py-3">{b.quantity} Pax</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            b.status === 'checked_in'
                              ? 'bg-blue-500/20 text-blue-300'
                              : b.status === 'refunded'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create Listing Modal */}
      {isCreatingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-slate-700 p-6 sm:p-8 my-8 text-white space-y-6">
            <h3 className="text-xl font-bold">Publish New Live Experience</h3>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune Sunset Acoustic Sessions"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <CitySelect
                    value={newCity}
                    onChange={(city) => setNewCity(city)}
                    label="City *"
                    placeholder="Type city (e.g. Pune, Jaipur)..."
                    allowAllCities={false}
                    dark={true}
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="live_music">Live Music</option>
                    <option value="standup_comedy">Standup Comedy</option>
                    <option value="food_fest">Food Fest</option>
                    <option value="club_night">Club Night</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Venue Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High Street Courtyard, Koregaon Park"
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Base Ticket (₹)</label>
                  <input
                    type="number"
                    min="99"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Capacity</label>
                  <input
                    type="number"
                    min="10"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingEvent(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl saffron-gradient text-slate-950 font-bold"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
