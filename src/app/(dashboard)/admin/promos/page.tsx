'use client';

import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Percent,
  Calendar,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
} from 'lucide-react';
import { store } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import { PromoCode } from '@/types';

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<PromoCode[]>(store.getPromoCodes());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New promo form state
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(20);
  const [maxDiscountCap, setMaxDiscountCap] = useState(300);
  const [minBookingAmount, setMinBookingAmount] = useState(500);
  const [validUntilDays, setValidUntilDays] = useState(30);

  const reloadPromos = () => {
    setPromos([...store.getPromoCodes()]);
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      const validUntil = new Date(Date.now() + validUntilDays * 24 * 60 * 60 * 1000).toISOString();
      const newPromo: PromoCode = {
        id: `prm-${Date.now()}`,
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        maxDiscountCap: discountType === 'percentage' && maxDiscountCap ? Number(maxDiscountCap) : undefined,
        minBookingAmount: Number(minBookingAmount) || 0,
        isActive: true,
        validUntil,
        usageCount: 0,
      };

      store.addPromoCode(newPromo);
      setFeedback(`Promo code '${newPromo.code}' created successfully!`);
      setShowCreateModal(false);
      setCode('');
      reloadPromos();
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Error creating promo code');
    }
  };

  const handleToggleActive = (id: string, current: boolean) => {
    store.updatePromoCode(id, { isActive: !current });
    reloadPromos();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this promo code?')) {
      store.deletePromoCode(id);
      reloadPromos();
    }
  };

  const totalUsed = promos.reduce((sum, p) => sum + p.usageCount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Tag className="w-4 h-4" />
            <span>Growth & Promotional Discounts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Promo Codes Engine</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure percentage discounts, flat cashback vouchers, caps, and min booking values.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl saffron-gradient text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          Create Promo Code
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Active Promo Codes</span>
          <div className="text-2xl font-black text-white">{promos.filter((p) => p.isActive).length}</div>
          <span className="text-[10px] text-slate-500">Live across checkout flows</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Redemptions</span>
          <div className="text-2xl font-black text-emerald-400">{totalUsed}</div>
          <span className="text-[10px] text-slate-500">Coupons redeemed by guests</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Most Popular Code</span>
          <div className="text-xl font-mono font-black text-amber-400">DASTAN50</div>
          <span className="text-[10px] text-slate-500">89 bookings completed</span>
        </div>
      </div>

      {/* Promos Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400">
                <th className="py-3.5 px-4 font-semibold">Promo Code</th>
                <th className="py-3.5 px-4 font-semibold">Discount</th>
                <th className="py-3.5 px-4 font-semibold">Min Order</th>
                <th className="py-3.5 px-4 font-semibold">Max Cap</th>
                <th className="py-3.5 px-4 font-semibold">Times Used</th>
                <th className="py-3.5 px-4 font-semibold">Valid Until</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {promos.map((p) => (
                <tr key={p.id} className="text-slate-300 hover:bg-slate-900/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-white bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-xs">
                      {p.code}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-amber-400">
                    {p.discountType === 'percentage' ? `${p.discountValue}% OFF` : `₹${p.discountValue} FLAT OFF`}
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    {p.minBookingAmount ? formatINR(p.minBookingAmount) : 'None'}
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    {p.maxDiscountCap ? formatINR(p.maxDiscountCap) : 'Unlimited'}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">{p.usageCount}</td>

                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {p.validUntil ? new Date(p.validUntil).toLocaleDateString('en-IN') : 'Never'}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(p.id, p.isActive)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                        p.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-700/20 text-slate-500 border border-slate-700/30'
                      }`}
                    >
                      {p.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Promo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Promo Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>Create New Promo Voucher</span>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Promo Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FESTIVE25"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    {discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount (₹)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={discountType === 'percentage' ? 90 : 5000}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Max Discount Cap (₹) {discountType === 'fixed' && '(Optional)'}
                  </label>
                  <input
                    type="number"
                    value={maxDiscountCap}
                    onChange={(e) => setMaxDiscountCap(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Min Booking Amount (₹)</label>
                  <input
                    type="number"
                    value={minBookingAmount}
                    onChange={(e) => setMinBookingAmount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Validity (Days from today)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={validUntilDays}
                  onChange={(e) => setValidUntilDays(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl saffron-gradient text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
                >
                  Publish Promo Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
