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
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { store } from '@/lib/store';
import { getActiveAdminPin, changeAdminPin } from '@/lib/admin-auth';

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

  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [pinMessage, setPinMessage] = useState<{ text: string; isError: boolean } | null>(null);

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

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinMessage(null);
    if (!currentPinInput || !newPinInput) {
      setPinMessage({ text: 'Current PIN aur New PIN dono enter karein', isError: true });
      return;
    }
    const res = changeAdminPin(currentPinInput, newPinInput);
    if (res.success) {
      setPinMessage({ text: 'Admin PIN safaltapoorvak update ho gaya!', isError: false });
      setCurrentPinInput('');
      setNewPinInput('');
    } else {
      setPinMessage({ text: res.error || 'Failed to update PIN', isError: true });
    }
  };

  const inputClass = "w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl px-3 py-2.5 text-sm text-[#18181B] placeholder-[#A1A1AA] focus:outline-none focus:border-[#775a00] focus:bg-white transition-colors";
  const labelClass = "block text-xs font-semibold text-[#4e4635] mb-1.5";
  const hintClass = "text-[10px] text-[#71717A] mt-1";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#ffdf9a]/40 border border-[#c59a27]/40 flex items-center justify-center shadow-xs">
          <Sliders className="w-5 h-5 text-[#775a00]" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#18181B] tracking-tight">Platform Settings</h1>
          <p className="text-xs text-[#71717A] mt-0.5">Control commission rates, fees, GST, and platform configuration</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Monetization Settings */}
        <div className="bg-white rounded-3xl p-6 border border-[#E6DFD5] shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-[#18181B] flex items-center gap-2">
            <Percent className="w-4 h-4 text-[#775a00]" /> Revenue & Commission Configuration
          </h2>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5] flex items-start gap-2.5">
            <Info className="w-3.5 h-3.5 text-[#775a00] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#807663] leading-relaxed">
              Commission is deducted from vendor payout. Convenience fee is charged to the customer. GST applies on the convenience fee per Indian tax regulations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Platform Commission (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={commissionPct}
                  onChange={(e) => setCommissionPct(e.target.value)}
                  min={0} max={30} step={0.5}
                  className={inputClass}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] text-xs font-bold">%</span>
              </div>
              <p className={hintClass}>Deducted from vendor settlement</p>
            </div>

            <div>
              <label className={labelClass}>Convenience Fee (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A] text-xs">₹</span>
                <input
                  type="number"
                  value={convenienceFee}
                  onChange={(e) => setConvenienceFee(e.target.value)}
                  min={0} max={500}
                  className={inputClass + ' pl-7'}
                />
              </div>
              <p className={hintClass}>Fixed fee charged to customer</p>
            </div>

            <div>
              <label className={labelClass}>GST Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={gstPct}
                  onChange={(e) => setGstPct(e.target.value)}
                  min={0} max={28}
                  className={inputClass + ' pr-8'}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] text-xs font-bold">%</span>
              </div>
              <p className={hintClass}>Applied on convenience fee</p>
            </div>
          </div>

          {/* Advanced Monetization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-[#E6DFD5]">
            <div>
              <label className={labelClass}>Featured Listing Ala-Carte Price (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A] text-xs">₹</span>
                <input
                  type="number"
                  value={featuredListingPrice}
                  onChange={(e) => setFeaturedListingPrice(e.target.value)}
                  min={0}
                  className={inputClass + ' pl-7'}
                />
              </div>
              <p className={hintClass}>Cost per 30-day featured spotlight</p>
            </div>

            <div>
              <label className={labelClass}>Vendor Settlement Cycle</label>
              <select
                value={payoutFrequency}
                onChange={(e) => setPayoutFrequency(e.target.value as any)}
                className={inputClass + ' cursor-pointer'}
              >
                <option value="daily">Daily Automated Batch (T+1)</option>
                <option value="weekly">Weekly Settlement Ledger (T+7)</option>
                <option value="instant">Instant Split (Razorpay Route)</option>
              </select>
              <p className={hintClass}>Frequency of vendor bank disbursements</p>
            </div>
          </div>

          {/* Razorpay Route Toggle */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5] flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#18181B] block">Razorpay Route Automated Transfer Engine</span>
              <span className="text-[11px] text-[#71717A] block leading-relaxed">
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
              <div className="w-11 h-6 bg-[#E6DFD5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#775a00]" />
            </label>
          </div>

          {/* Live Preview */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5]">
            <div className="text-[10px] font-bold text-[#775a00] uppercase tracking-wider mb-3">Live Preview — ₹1,000 ticket</div>
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'Base Ticket Price', value: '₹1,000', highlight: false },
                { label: 'Convenience Fee', value: `₹${convenienceFee}`, highlight: false },
                { label: `GST on fee (${gstPct}%)`, value: `₹${Math.round(Number(convenienceFee) * Number(gstPct) / 100)}`, highlight: false },
                { label: 'Customer Pays', value: `₹${1000 + Number(convenienceFee) + Math.round(Number(convenienceFee) * Number(gstPct) / 100)}`, highlight: true },
                { label: `Platform Commission (${commissionPct}%)`, value: `₹${Math.round(1000 * Number(commissionPct) / 100)}`, highlight: false },
                { label: 'Vendor Net Payout', value: `₹${1000 - Math.round(1000 * Number(commissionPct) / 100)}`, highlight: true },
              ].map((row) => (
                <div key={row.label} className={`flex justify-between ${row.highlight ? 'font-bold text-[#18181B] border-t border-[#E6DFD5] pt-1.5 mt-1' : 'text-[#71717A]'}`}>
                  <span>{row.label}</span>
                  <span className={row.highlight ? 'text-[#775a00]' : ''}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-white rounded-3xl p-6 border border-[#E6DFD5] shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#18181B] flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#775a00]" /> Support Contact Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Support Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Support Phone</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Admin Passkey Security */}
        <div className="bg-white rounded-3xl p-6 border border-[#E6DFD5] shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-sm font-bold text-[#18181B] flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#775a00]" /> Admin Passkey & Access Protection
            </h2>
            <span className="text-[10px] font-mono font-bold text-[#775a00] bg-[#ffdf9a]/40 px-2.5 py-1 rounded-full border border-[#c59a27]/40">
              Active PIN: {typeof window !== 'undefined' ? getActiveAdminPin() : '8899'}
            </span>
          </div>

          <p className="text-xs text-[#71717A]">
            Admin panel sirf aapke passkey se unlock hota hai. Agar aap PIN change karna chahein toh neeche enter karein:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Current PIN</label>
              <input
                type="password"
                placeholder="Current PIN (default 8899)"
                value={currentPinInput}
                onChange={(e) => setCurrentPinInput(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>New PIN (min 4 digits)</label>
              <input
                type="password"
                placeholder="New custom PIN"
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 gap-3 flex-wrap">
            {pinMessage ? (
              <p className={`text-xs font-semibold ${pinMessage.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                {pinMessage.text}
              </p>
            ) : (
              <span className="text-[11px] text-[#71717A]">Normal users ko Admin option nahi dikhega.</span>
            )}
            <button
              type="button"
              onClick={handleUpdatePin}
              className="px-3.5 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#ffdf9a]/40 text-[#775a00] border border-[#c59a27]/40 text-xs font-bold transition-colors cursor-pointer"
            >
              Update Passkey
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Settings saved and applied globally!
            </div>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#775a00] hover:bg-[#5c4600] text-white font-bold text-sm transition-all shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
