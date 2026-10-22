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
  Database,
  Image as ImageIcon,
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
  const [dbStatus, setDbStatus] = useState<{
    loading: boolean;
    connected: boolean;
    provider?: string;
    projectUrl?: string;
    latencyMs?: number;
    tableCounts?: Record<string, number | null>;
    error?: string;
  }>({ loading: true, connected: false });

  const fetchDbHealth = async () => {
    try {
      setDbStatus((prev) => ({ ...prev, loading: true }));
      const res = await fetch('/api/health/db');
      const data = await res.json();
      setDbStatus({
        loading: false,
        connected: Boolean(data.connected),
        provider: data.provider,
        projectUrl: data.projectUrl,
        latencyMs: data.latencyMs,
        tableCounts: data.tableCounts,
        error: data.error,
      });
    } catch (err: any) {
      setDbStatus({
        loading: false,
        connected: false,
        error: err.message || 'Failed to ping database',
      });
    }
  };

  useEffect(() => {
    fetchDbHealth();
  }, []);

  // Quick commission / fee editor modal or inline
  const [commissionPct, setCommissionPct] = useState(settings.platformCommissionPct);
  const [convenienceFee, setConvenienceFee] = useState(settings.convenienceFeeFixed);
  const [routeEnabled, setRouteEnabled] = useState(Boolean(settings.razorpayRouteEnabled));
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  const refreshData = () => {
    fetchDbHealth();
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* ── Header Banner ── */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1C1008] via-[#2D1F06] to-[#111827] text-white p-7 sm:p-9 shadow-2xl relative overflow-hidden border border-[#c59a27]/50">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-[#c59a27]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-[#4f5e81]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#FFD966] uppercase tracking-widest">
              <TrendingUp className="w-4 h-4" />
              <span>Monetization &amp; Settlements Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Admin Revenue &amp; Payout Dashboard
            </h1>
            <p className="text-sm text-white/70 font-medium leading-relaxed max-w-xl">
              Real-time platform commissions, Razorpay Route settlements, subscription MRR, and refund auditing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/sponsors"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD966] to-[#c59a27] text-[#1C1008] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg transition-all"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Sponsor Banners</span>
            </Link>
            <button
              onClick={refreshData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/25 text-xs font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Ledger</span>
            </button>
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 px-3.5 py-2 rounded-full text-xs font-semibold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Razorpay Route: {settings.razorpayRouteEnabled ? 'Active (Auto-Split)' : 'Manual Ledger (NEFT)'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Database Status ── */}
      <div className="rounded-2xl p-5 border border-slate-200 bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${
            dbStatus.connected
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              : 'bg-rose-100 text-rose-600 border border-rose-200'
          }`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-900">Database Status:</span>
              {dbStatus.loading ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  Pinging Supabase…
                </span>
              ) : dbStatus.connected ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Supabase PostgreSQL Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                  Disconnected ({dbStatus.error || 'Check .env.local'})
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Target: <span className="text-slate-800 font-mono font-semibold">{dbStatus.projectUrl || 'ptnnqyzepdpvufismcvp.supabase.co'}</span>
              {dbStatus.latencyMs ? <span className="ml-2 text-emerald-700 font-bold">• {dbStatus.latencyMs}ms latency</span> : null}
            </p>
          </div>
        </div>

        {dbStatus.tableCounts && Object.keys(dbStatus.tableCounts).length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
            {Object.entries(dbStatus.tableCounts).map(([table, count]) => (
              <span key={table} className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-mono">
                <span className="text-slate-500">{table}:</span> <strong className="text-slate-900">{count ?? '—'}</strong>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Primary KPI Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl p-6 bg-white border border-slate-200 shadow-sm space-y-3 group hover:shadow-md hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gross GMV</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">{formatINR(summary.grossGMV)}</div>
          <p className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
            <span className="text-emerald-600 font-extrabold">+18.4%</span> vs previous cycle
          </p>
        </div>

        <div className="rounded-2xl p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-sm space-y-3 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Net Platform Take</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-900 tracking-tight">{formatINR(summary.totalPlatformRevenue)}</div>
          <p className="text-xs text-amber-700 font-semibold">Commissions + Convenience Fees + Subscriptions</p>
        </div>

        <div className="rounded-2xl p-6 bg-white border border-slate-200 shadow-sm space-y-3 group hover:shadow-md hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Settled Payouts</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">{formatINR(summary.totalPayoutsDisbursed)}</div>
          <p className="text-xs text-slate-500 font-semibold">
            Pending: <span className="text-amber-700 font-extrabold">{formatINR(summary.pendingPayouts)}</span>
          </p>
        </div>

        <div className="rounded-2xl p-6 bg-white border border-slate-200 shadow-sm space-y-3 group hover:shadow-md hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Refunds Processed</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">{formatINR(summary.totalRefundsAmount)}</div>
          <p className="text-xs text-slate-500 font-semibold">{refunds.length} successful automated refunds</p>
        </div>
      </div>

      {/* ── Quick Navigation Pills ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          { href: '/admin/payouts', Icon: Receipt, label: 'Payout Reports', sub: 'Route & NEFT Ledger', cls: 'text-amber-700 bg-amber-50 border-amber-200' },
          { href: '/admin/refunds', Icon: RotateCcw, label: 'Refund Operations', sub: 'Razorpay API Dispatch', cls: 'text-rose-600 bg-rose-50 border-rose-200' },
          { href: '/admin/promos', Icon: Tag, label: 'Promo Codes', sub: 'Discounts & Limits', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
          { href: '/admin/settings', Icon: Sliders, label: 'Platform Rates', sub: 'Fees, GST & Route', cls: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
        ] as const).map(({ href, Icon, label, sub, cls }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${cls}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">{label}</div>
                <div className="text-[11px] text-slate-500 font-medium">{sub}</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
          </Link>
        ))}
      </div>

      {/* ── Two Column: Revenue Breakdown & Rate Configurator ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Revenue Streams (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-amber-700" />
              <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Revenue Streams &amp; Margin Breakdown</span>
            </div>
            <span className="text-sm font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-lg">
              Net: {formatINR(summary.totalPlatformRevenue)}
            </span>
          </div>

          <div className="space-y-3">
            <div className="h-3 w-full bg-slate-100 border border-slate-200 rounded-full overflow-hidden flex">
              <div style={{ width: `${commShare}%` }} className="bg-amber-500 h-full transition-all" title="Commissions" />
              <div style={{ width: `${feeShare}%` }} className="bg-emerald-500 h-full transition-all" title="Convenience Fees" />
              <div style={{ width: `${subShare}%` }} className="bg-indigo-500 h-full transition-all" title="Subscriptions" />
            </div>
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-semibold text-slate-800">Ticket Commission ({commShare}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-800">Convenience Fees ({feeShare}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="font-semibold text-slate-800">Vendor SaaS MRR ({subShare}%)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
              <span className="text-[11px] text-amber-700 uppercase font-extrabold tracking-wider">Commissions</span>
              <div className="text-xl font-black text-amber-900">{formatINR(summary.commissionRevenue)}</div>
              <p className="text-xs text-slate-600 font-medium">{settings.platformCommissionPct}% rate on ticket bookings</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
              <span className="text-[11px] text-emerald-700 uppercase font-extrabold tracking-wider">Convenience Fees</span>
              <div className="text-xl font-black text-emerald-800">{formatINR(summary.convenienceFeeRevenue)}</div>
              <p className="text-xs text-slate-600 font-medium">Fixed ₹{settings.convenienceFeeFixed}/order (+ {settings.gstPct}% GST)</p>
            </div>
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2">
              <span className="text-[11px] text-indigo-600 uppercase font-extrabold tracking-wider">Vendor SaaS MRR</span>
              <div className="text-xl font-black text-indigo-800">{formatINR(summary.subscriptionRevenue)}</div>
              <p className="text-xs text-slate-600 font-medium">{summary.activeSubscriptionsCount} active Pro &amp; Luxury subscriptions</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Razorpay Route Settlement Mode</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {settings.razorpayRouteEnabled
                  ? 'Automated split enabled. Payouts transfer directly to vendor virtual linked accounts.'
                  : 'Manual Ledger mode active. Payouts require exportable NEFT/RTGS batch bank file.'}
              </p>
            </div>
            <Link
              href="/admin/payouts"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-amber-800 transition-colors shrink-0 shadow-sm"
            >
              <span>Manage Payouts</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Rate Configurator (1 col) */}
        <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Monetization Controls</span>
          </div>

          <form onSubmit={handleSaveFinancials} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wide">
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
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:outline-none rounded-xl px-3 py-2.5 text-slate-900 font-mono font-bold text-sm transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
              </div>
              <span className="text-xs text-slate-500 mt-1.5 block font-medium">Applied on event ticket tiers and dining covers.</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wide">
                Customer Convenience Fee (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  min="0"
                  max="250"
                  value={convenienceFee}
                  onChange={(e) => setConvenienceFee(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:outline-none rounded-xl pl-8 pr-3 py-2.5 text-slate-900 font-mono font-bold text-sm transition-all"
                />
              </div>
              <span className="text-xs text-slate-500 mt-1.5 block font-medium">Charged to guest per checkout order.</span>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={routeEnabled}
                  onChange={(e) => setRouteEnabled(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-400"
                />
                <div>
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">Enable Razorpay Route automated transfers</span>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">Transfers net vendor earnings automatically via Razorpay Route API.</p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#c59a27] to-[#92700b] text-white font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg cursor-pointer"
            >
              Update Financial Parameters
            </button>

            {savedSettingsNotice && (
              <div className="flex items-center gap-2 justify-center text-emerald-700 font-bold text-xs bg-emerald-50 border border-emerald-200 rounded-xl py-2 px-3">
                <CheckCircle className="w-3.5 h-3.5" />
                Platform financial parameters updated!
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ── Featured Listings ── */}
      <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Featured Listings &amp; Spotlight Promotion</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">Curated Platform Placement &amp; Badging</h2>
            <p className="text-sm text-slate-600 font-medium mt-0.5">
              Toggle Featured status for events and restaurants (gives top billboard placement and golden badge).
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-sm font-semibold text-amber-800 shrink-0">
            Active Featured: <span className="font-extrabold text-amber-900">{summary.featuredListingsCount}</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="py-3 px-4 font-bold text-slate-700 text-xs uppercase tracking-wider">Listing</th>
                <th className="py-3 px-4 font-bold text-slate-700 text-xs uppercase tracking-wider">Type</th>
                <th className="py-3 px-4 font-bold text-slate-700 text-xs uppercase tracking-wider">City</th>
                <th className="py-3 px-4 font-bold text-slate-700 text-xs uppercase tracking-wider">Vendor Host</th>
                <th className="py-3 px-4 font-bold text-slate-700 text-xs uppercase tracking-wider">Badge</th>
                <th className="py-3 px-4 font-bold text-slate-700 text-xs uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 text-sm max-w-xs truncate">{e.title}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold uppercase tracking-wider">Live Event</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 text-sm font-medium">{e.city}</td>
                  <td className="py-3.5 px-4 text-slate-600 text-sm font-medium">{e.vendorName}</td>
                  <td className="py-3.5 px-4">
                    {e.isFeatured ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <Star className="w-2.5 h-2.5 fill-amber-500" /> Featured
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 font-semibold">Standard</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleFeatured('event', e.id, e.isFeatured)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        e.isFeatured
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                      }`}
                    >
                      {e.isFeatured ? 'Demote' : 'Boost to Featured'}
                    </button>
                  </td>
                </tr>
              ))}

              {restaurants.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 text-sm max-w-xs truncate">{r.name}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold uppercase tracking-wider">Dining Spot</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 text-sm font-medium">{r.city} ({r.area})</td>
                  <td className="py-3.5 px-4 text-slate-600 text-sm font-medium">{r.vendorName}</td>
                  <td className="py-3.5 px-4">
                    {r.isFeatured ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <Star className="w-2.5 h-2.5 fill-amber-500" /> Featured
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 font-semibold">Standard</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleFeatured('dining', r.id, r.isFeatured)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        r.isFeatured
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
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
