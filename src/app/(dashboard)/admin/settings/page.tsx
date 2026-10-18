'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Save,
  CheckCircle2,
  Percent,
  DollarSign,
  Receipt,
  MapPin,
  Mail,
  Phone,
  Info,
} from 'lucide-react';
import { store } from '@/lib/store';

export default function AdminSettingsPage() {
  const settings = store.getSettings();

  const [commissionPct, setCommissionPct] = useState(String(settings.platformCommissionPct));
  const [convenienceFee, setConvenienceFee] = useState(String(settings.convenienceFeeFixed));
  const [gstPct, setGstPct] = useState(String(settings.gstPct));
  const [razorpayRouteEnabled, setRazorpayRouteEnabled] = useState(Boolean(settings.razorpayRouteEnabled));
  const [featuredListingPrice, setFeaturedListingPrice] = useState(String(settings.featuredListingPrice || 999));
  const [payoutFrequency, setPayoutFrequency] = useState<'daily' | 'weekly' | 'instant'>(settings.payoutFrequency || 'daily');
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings({
      platformCommissionPct: Number(commissionPct),
      convenienceFeeFixed: Number(convenienceFee),
      gstPct: Number(gstPct),
      razorpayRouteEnabled,
      featuredListingPrice: Number(featuredListingPrice),
      payoutFrequency,
      contactEmail,
      contactPhone,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl saffron-gradient flex items-center justify-center">
          <Sliders className="w-5 h-5 text-slate-950" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Platform Settings</h1>
          <p className="text-xs text-slate-400 mt-0.5">Control commission rates, fees, GST, and platform configuration</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Monetization Settings */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Percent className="w-4 h-4 text-amber-400" /> Revenue & Commission Configuration
          </h2>

          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-300/80">
              Commission is deducted from vendor payout. Convenience fee is charged to the customer. GST applies on the convenience fee per Indian tax regulations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Platform Commission (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={commissionPct}
                  onChange={(e) => setCommissionPct(e.target.value)}
                  min={0}
                  max={30}
                  step={0.5}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-3 pr-8 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Deducted from vendor settlement</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Convenience Fee (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                <input
                  type="number"
                  value={convenienceFee}
                  onChange={(e) => setConvenienceFee(e.target.value)}
                  min={0}
                  max={500}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-7 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Fixed fee charged to customer</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">GST Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={gstPct}
                  onChange={(e) => setGstPct(e.target.value)}
                  min={0}
                  max={28}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-3 pr-8 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Applied on convenience fee</p>
            </div>
          </div>

          {/* Advanced Monetization & Route Engine */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Featured Listing Ala-Carte Price (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                <input
                  type="number"
                  value={featuredListingPrice}
                  onChange={(e) => setFeaturedListingPrice(e.target.value)}
                  min={0}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-7 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Cost per 30-day featured spotlight</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Vendor Settlement Cycle</label>
              <select
                value={payoutFrequency}
                onChange={(e) => setPayoutFrequency(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
              >
                <option value="daily">Daily Automated Batch (T+1)</option>
                <option value="weekly">Weekly Settlement Ledger (T+7)</option>
                <option value="instant">Instant Split (Razorpay Route)</option>
              </select>
              <p className="text-[10px] text-slate-500 mt-1">Frequency of vendor bank disbursements</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white block">Razorpay Route Automated Transfer Engine</span>
              <span className="text-[11px] text-slate-400 block">
                Automatically split and credit net earnings to vendor linked accounts. When disabled, falls back to manual NEFT ledger.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={razorpayRouteEnabled}
                onChange={(e) => setRazorpayRouteEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
            </label>
          </div>

          {/* Preview */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Live Preview — ₹1,000 ticket</div>
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'Base Ticket Price', value: '₹1,000', highlight: false },
                { label: 'Convenience Fee', value: `₹${convenienceFee}`, highlight: false },
                { label: `GST on fee (${gstPct}%)`, value: `₹${Math.round(Number(convenienceFee) * Number(gstPct) / 100)}`, highlight: false },
                { label: 'Customer Pays', value: `₹${1000 + Number(convenienceFee) + Math.round(Number(convenienceFee) * Number(gstPct) / 100)}`, highlight: true },
                { label: `Platform Commission (${commissionPct}%)`, value: `₹${Math.round(1000 * Number(commissionPct) / 100)}`, highlight: false },
                { label: 'Vendor Net Payout', value: `₹${1000 - Math.round(1000 * Number(commissionPct) / 100)}`, highlight: true },
              ].map((row) => (
                <div key={row.label} className={`flex justify-between ${row.highlight ? 'font-bold text-white border-t border-slate-800 pt-1.5 mt-1' : 'text-slate-400'}`}>
                  <span>{row.label}</span>
                  <span className={row.highlight ? 'text-amber-400' : ''}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" /> Support Contact Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Support Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Support Phone</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Settings saved and applied globally!
            </div>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl saffron-gradient text-slate-950 font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
