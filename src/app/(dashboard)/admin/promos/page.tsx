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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DFD5] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#775a00] uppercase tracking-wider mb-1">
            <Tag className="w-4 h-4" />
            <span>Growth & Promotional Discounts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight">
            Promo Codes Engine
          </h1>
          <p className="text-xs text-[#71717A] mt-1 max-w-xl">
            Configure percentage discounts, flat cashback vouchers, caps, and minimum booking order values.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#775a00] hover:bg-[#5c4600] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Promo Code
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E6DFD5] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block mb-1">Active Promo Codes</span>
          <div className="text-2xl font-black text-[#18181B]">{promos.filter((p) => p.isActive).length}</div>
          <span className="text-[11px] text-[#71717A] mt-0.5 block">Live across checkout flows</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E6DFD5] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block mb-1">Total Redemptions</span>
          <div className="text-2xl font-black text-emerald-700">{totalUsed}</div>
          <span className="text-[11px] text-[#71717A] mt-0.5 block">Coupons redeemed by guests</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E6DFD5] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block mb-1">Most Popular Code</span>
          <div className="text-xl font-mono font-black text-[#775a00]">DASTAN50</div>
          <span className="text-[11px] text-[#71717A] mt-0.5 block">Platform-wide promotion</span>
        </div>
      </div>

      {/* Promos Table */}
      <div className="bg-white rounded-3xl border border-[#E6DFD5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E6DFD5] bg-[#FAF7F2] text-[#775a00]">
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Promo Code</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Discount</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Min Order</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Max Cap</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Times Used</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Valid Until</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Status</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD5]">
              {promos.map((p) => (
                <tr key={p.id} className="text-[#18181B] hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[#775a00] bg-[#ffdf9a]/30 border border-[#c59a27]/40 px-2.5 py-1 rounded-lg text-xs shadow-xs">
                      {p.code}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-[#775a00]">
                    {p.discountType === 'percentage' ? `${p.discountValue}% OFF` : `₹${p.discountValue} FLAT OFF`}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-[#18181B]">
                    {p.minBookingAmount ? formatINR(p.minBookingAmount) : 'None'}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-[#18181B]">
                    {p.maxDiscountCap ? formatINR(p.maxDiscountCap) : 'Unlimited'}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-emerald-700 font-bold text-sm">{p.usageCount}</td>

                  <td className="py-3.5 px-4 text-[#71717A] font-mono text-[11px]">
                    {p.validUntil ? new Date(p.validUntil).toLocaleDateString('en-IN') : 'Never'}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(p.id, p.isActive)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                        p.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {p.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded-lg text-[#71717A] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E6DFD5] rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-3">
              <div className="text-sm font-bold text-[#18181B] flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#775a00]" />
                <span>Create New Promo Voucher</span>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#71717A] hover:text-[#18181B] text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-4 text-xs">
              <div>
                <label className="text-[#18181B] font-semibold block mb-1">Promo Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FESTIVE25"
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl px-3 py-2 text-[#18181B] font-mono uppercase focus:outline-none focus:border-[#775a00] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#18181B] font-semibold block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl px-3 py-2 text-[#18181B] focus:outline-none focus:border-[#775a00] focus:bg-white cursor-pointer font-medium"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#18181B] font-semibold block mb-1">
                    {discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount (₹)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={discountType === 'percentage' ? 90 : 5000}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl px-3 py-2 text-[#18181B] font-mono focus:outline-none focus:border-[#775a00] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#18181B] font-semibold block mb-1">
                    Max Discount Cap (₹) {discountType === 'fixed' && '(Optional)'}
                  </label>
                  <input
                    type="number"
                    value={maxDiscountCap}
                    onChange={(e) => setMaxDiscountCap(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl px-3 py-2 text-[#18181B] font-mono focus:outline-none focus:border-[#775a00] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[#18181B] font-semibold block mb-1">Min Booking Amount (₹)</label>
                  <input
                    type="number"
                    value={minBookingAmount}
                    onChange={(e) => setMinBookingAmount(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl px-3 py-2 text-[#18181B] font-mono focus:outline-none focus:border-[#775a00] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#18181B] font-semibold block mb-1">Validity (Days from today)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={validUntilDays}
                  onChange={(e) => setValidUntilDays(Number(e.target.value))}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl px-3 py-2 text-[#18181B] font-mono focus:outline-none focus:border-[#775a00] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#71717A] hover:text-[#18181B] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#775a00] hover:bg-[#5c4600] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
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
