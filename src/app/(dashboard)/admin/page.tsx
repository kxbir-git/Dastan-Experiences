'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  TrendingUp,
  Percent,
  Receipt,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Sliders,
  DollarSign,
  Users,
  Sparkles,
  Tag,
  ArrowUpRight,
  ExternalLink,
  Building,
  CreditCard,
  RefreshCw,
  Star,
} from 'lucide-react';
import { store } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import { RevenueSummary, PayoutRecord, RefundRecord } from '@/types';

export default function AdminRevenueDashboardPage() {
  const [summary, setSummary] = useState<RevenueSummary>(store.getRevenueSummary());
  const [settings, setSettings] = useState(store.getSettings());
  const [payouts, setPayouts] = useState<PayoutRecord[]>(store.getPayoutRecords().slice(0, 5));
  const [refunds, setRefunds] = useState<RefundRecord[]>(store.getRefunds().slice(0, 5));
  const [events, setEvents] = useState(store.getAllEvents());
  const [restaurants, setRestaurants] = useState(store.getAllRestaurants());

  // Quick commission / fee editor modal or inline
  const [commissionPct, setCommissionPct] = useState(settings.platformCommissionPct);
  const [convenienceFee, setConvenienceFee] = useState(settings.convenienceFeeFixed);
  const [routeEnabled, setRouteEnabled] = useState(Boolean(settings.razorpayRouteEnabled));
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  const refreshData = () => {
    setSummary(store.getRevenueSummary());
    setSettings(store.getSettings());
    setPayouts(store.getPayoutRecords().slice(0, 5));
    setRefunds(store.getRefunds().slice(0, 5));
    setEvents([...store.getAllEvents()]);
    setRestaurants([...store.getAllRestaurants()]);
  };

  const handleSaveFinancials = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings({
      platformCommissionPct: Number(commissionPct),
      convenienceFeeFixed: Number(convenienceFee),
      razorpayRouteEnabled: routeEnabled,
    });
    setSavedSettingsNotice(true);
    refreshData();
    setTimeout(() => setSavedSettingsNotice(false), 3000);
  };

  const handleToggleFeatured = async (type: 'event' | 'dining', id: string, current: boolean) => {
    if (type === 'event') {
      store.toggleFeaturedEvent(id, !current);
    } else {
      store.toggleFeaturedRestaurant(id, !current);
    }
    refreshData();
  };

  // Calculate percentage splits
  const totalRev = summary.totalPlatformRevenue || 1;
  const commShare = Math.round((summary.commissionRevenue / totalRev) * 100);
  const feeShare = Math.round((summary.convenienceFeeRevenue / totalRev) * 100);
  const subShare = Math.round((summary.subscriptionRevenue / totalRev) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Monetization & Settlements Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Admin Revenue & Payout Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Real-time platform commissions, Razorpay Route settlements, subscription MRR, and refund auditing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Ledger
          </button>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Razorpay Route: {settings.razorpayRouteEnabled ? 'Active (Auto-Split)' : 'Manual Ledger (NEFT)'}</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross GMV */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-2 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Gross GMV</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{formatINR(summary.grossGMV)}</div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">+18.4%</span> vs previous cycle
          </p>
        </div>

        {/* Net Platform Revenue */}
        <div className="glass-card rounded-3xl p-6 border border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-amber-400 text-xs font-bold uppercase tracking-wider">
            <span>Net Platform Take</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-300">{formatINR(summary.totalPlatformRevenue)}</div>
          <p className="text-[11px] text-amber-400/80">
            Commissions + Convenience Fees + Subscriptions
          </p>
        </div>

        {/* Vendor Payouts Disbursed */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-2 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Settled Payouts</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-400">{formatINR(summary.totalPayoutsDisbursed)}</div>
          <p className="text-[11px] text-slate-400">
            Pending batch: <span className="text-amber-400 font-semibold">{formatINR(summary.pendingPayouts)}</span>
          </p>
        </div>

        {/* Refunds Handled */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-2 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Refunds Processed</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-400">{formatINR(summary.totalRefundsAmount)}</div>
          <p className="text-[11px] text-slate-400">
            {refunds.length} successful automated refunds
          </p>
        </div>
      </div>

      {/* Quick Monetization Navigation Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/admin/payouts"
          className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Receipt className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold">Payout Reports</div>
              <div className="text-[10px] text-slate-500">Route & NEFT Ledger</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
        </Link>

        <Link
          href="/admin/refunds"
          className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold">Refund Operations</div>
              <div className="text-[10px] text-slate-500">Razorpay API Dispatch</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
        </Link>

        <Link
          href="/admin/promos"
          className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Tag className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold">Promo Codes</div>
              <div className="text-[10px] text-slate-500">Discounts & Limits</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
        </Link>

        <Link
          href="/admin/settings"
          className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold">Platform Rates</div>
              <div className="text-[10px] text-slate-500">Fees, GST & Route</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
        </Link>
      </div>

      {/* Two Column Layout: Revenue Breakdown & Financial Rule Configurator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Revenue Streams Breakdown (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Percent className="w-4 h-4" />
              <span>Revenue Streams & Margin Breakdown</span>
            </div>
            <span className="text-xs font-mono text-slate-400">Total Net: {formatINR(summary.totalPlatformRevenue)}</span>
          </div>

          {/* Visual Progress Bar Split */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex">
              <div style={{ width: `${commShare}%` }} className="bg-amber-400 h-full" title="Commissions" />
              <div style={{ width: `${feeShare}%` }} className="bg-emerald-400 h-full" title="Convenience Fees" />
              <div style={{ width: `${subShare}%` }} className="bg-indigo-400 h-full" title="Subscriptions" />
            </div>
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Ticket Commission ({commShare}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Convenience Fees ({feeShare}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                <span>Vendor SaaS MRR ({subShare}%)</span>
              </div>
            </div>
          </div>

          {/* Detailed Stream Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Commissions</span>
              <div className="text-lg font-black text-amber-400">{formatINR(summary.commissionRevenue)}</div>
              <p className="text-[10px] text-slate-500">
                {settings.platformCommissionPct}% standard rate on ticket bookings
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Convenience Fees</span>
              <div className="text-lg font-black text-emerald-400">{formatINR(summary.convenienceFeeRevenue)}</div>
              <p className="text-[10px] text-slate-500">
                Fixed ₹{settings.convenienceFeeFixed}/order (+ {settings.gstPct}% GST)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Vendor SaaS MRR</span>
              <div className="text-lg font-black text-indigo-400">{formatINR(summary.subscriptionRevenue)}</div>
              <p className="text-[10px] text-slate-500">
                {summary.activeSubscriptionsCount} active Pro & Luxury subscriptions
              </p>
            </div>
          </div>

          {/* Settlement Route Status Box */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                Razorpay Route Settlement Mode
              </div>
              <p className="text-[11px] text-slate-400">
                {settings.razorpayRouteEnabled
                  ? 'Automated split enabled. Payouts transfer directly to vendor virtual linked accounts.'
                  : 'Manual Ledger mode active. Payouts require exportable NEFT/RTGS batch bank file.'}
              </p>
            </div>
            <Link
              href="/admin/payouts"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors shrink-0"
            >
              <span>Manage Payouts</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Rate Configurator (1 col) */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>Monetization Controls</span>
          </div>

          <form onSubmit={handleSaveFinancials} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Platform Commission Cut (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="40"
                  value={commissionPct}
                  onChange={(e) => setCommissionPct(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Applied on event ticket tiers and dining covers.
              </span>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Customer Convenience Fee (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  max="250"
                  value={convenienceFee}
                  onChange={(e) => setConvenienceFee(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-white font-mono"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Charged to guest per checkout order.
              </span>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={routeEnabled}
                  onChange={(e) => setRouteEnabled(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-amber-400 focus:ring-0"
                />
                <span>Enable Razorpay Route automated transfers</span>
              </label>
              <span className="text-[10px] text-slate-500 mt-1 block pl-5">
                Transfers net vendor earnings automatically via Razorpay Route API.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl saffron-gradient text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
            >
              Update Financial Parameters
            </button>

            {savedSettingsNotice && (
              <p className="text-emerald-400 font-medium text-center text-xs">
                Platform financial parameters updated!
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Featured Listings Moderation & Controls */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Featured Listings & Spotlight Promotion</span>
            </div>
            <h2 className="text-lg font-bold text-white">Curated Platform Placement & Badging</h2>
            <p className="text-xs text-slate-400">
              Toggle Featured status for events and restaurants (gives top billboard placement and golden badge).
            </p>
          </div>
          <div className="text-xs text-slate-400">
            Active Featured: <span className="text-amber-400 font-bold">{summary.featuredListingsCount}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Listing</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">City</th>
                <th className="pb-3 font-semibold">Vendor Host</th>
                <th className="pb-3 font-semibold">Featured Badge</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {events.map((e) => (
                <tr key={e.id} className="text-slate-300">
                  <td className="py-3 font-semibold text-white max-w-xs truncate">{e.title}</td>
                  <td className="py-3 text-amber-400 uppercase font-mono text-[10px]">Live Event</td>
                  <td className="py-3">{e.city}</td>
                  <td className="py-3 text-slate-400">{e.vendorName}</td>
                  <td className="py-3">
                    {e.isFeatured ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Star className="w-2.5 h-2.5 fill-amber-400" /> Featured
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">Standard</span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleToggleFeatured('event', e.id, e.isFeatured)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        e.isFeatured
                          ? 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
                      }`}
                    >
                      {e.isFeatured ? 'Demote' : 'Boost to Featured'}
                    </button>
                  </td>
                </tr>
              ))}

              {restaurants.map((r) => (
                <tr key={r.id} className="text-slate-300">
                  <td className="py-3 font-semibold text-white max-w-xs truncate">{r.name}</td>
                  <td className="py-3 text-indigo-400 uppercase font-mono text-[10px]">Dining Spot</td>
                  <td className="py-3">{r.city} ({r.area})</td>
                  <td className="py-3 text-slate-400">{r.vendorName}</td>
                  <td className="py-3">
                    {r.isFeatured ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Star className="w-2.5 h-2.5 fill-amber-400" /> Featured
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">Standard</span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleToggleFeatured('dining', r.id, r.isFeatured)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        r.isFeatured
                          ? 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
                      }`}
                    >
                      {r.isFeatured ? 'Demote' : 'Boost to Featured'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
