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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#251a00] via-[#3a2903] to-[#18181B] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-[#c59a27]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#c59a27]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-[#ffdf9a] uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Monetization &amp; Settlements Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Admin Revenue &amp; Payout Dashboard
          </h1>
          <p className="text-xs text-white/80">
            Real-time platform commissions, Razorpay Route settlements, subscription MRR, and refund auditing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link
            href="/admin/sponsors"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#c59a27] to-[#ffdf9a] text-[#251a00] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md transition-all"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Sponsor Banners</span>
          </Link>
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Ledger</span>
          </button>
          <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1.5 rounded-full text-xs text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Razorpay Route: {settings.razorpayRouteEnabled ? 'Active (Auto-Split)' : 'Manual Ledger (NEFT)'}</span>
          </div>
        </div>
      </div>

      {/* Supabase Live Database Connection Status */}
      <div className="rounded-2xl p-5 border border-[#E6DFD5] bg-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dbStatus.connected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#18181B]">Database Status:</span>
              {dbStatus.loading ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FAF7F2] text-[#807663] border border-[#E6DFD5]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c59a27] animate-ping" />
                  Pinging Supabase...
                </span>
              ) : dbStatus.connected ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Supabase PostgreSQL Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                  Disconnected ({dbStatus.error || 'Check .env.local'})
                </span>
              )}
            </div>
            <p className="text-xs text-[#71717A] mt-0.5">
              Target: <span className="text-[#18181B] font-mono font-medium">{dbStatus.projectUrl || 'ptnnqyzepdpvufismcvp.supabase.co'}</span>
              {dbStatus.latencyMs ? <span className="ml-2 text-emerald-700 font-medium">• Latency: {dbStatus.latencyMs}ms</span> : null}
            </p>
          </div>
        </div>

        {dbStatus.tableCounts && Object.keys(dbStatus.tableCounts).length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#4e4635]">
            {Object.entries(dbStatus.tableCounts).map(([table, count]) => (
              <span key={table} className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E6DFD5] font-mono">
                <span className="text-[#807663]">{table}:</span> <strong className="text-[#775a00]">{count ?? '—'}</strong>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross GMV */}
        <div className="rounded-3xl p-6 bg-white border border-[#E6DFD5] shadow-xs space-y-2 relative overflow-hidden group hover:shadow-md hover:border-[#c59a27]/50 transition-all">
          <div className="flex items-center justify-between text-[#807663] text-xs font-bold uppercase tracking-wider">
            <span>Gross GMV</span>
            <div className="w-9 h-9 rounded-xl bg-[#c59a27]/10 text-[#775a00] border border-[#c59a27]/25 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#18181B]">{formatINR(summary.grossGMV)}</div>
          <p className="text-[11px] text-[#71717A] flex items-center gap-1">
            <span className="text-emerald-700 font-semibold">+18.4%</span> vs previous cycle
          </p>
        </div>

        {/* Net Platform Revenue */}
        <div className="rounded-3xl p-6 bg-white border border-[#c59a27]/40 bg-gradient-to-b from-[#ffdf9a]/15 to-transparent space-y-2 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-[#775a00] text-xs font-bold uppercase tracking-wider">
            <span>Net Platform Take</span>
            <div className="w-9 h-9 rounded-xl bg-[#775a00]/15 text-[#775a00] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#775a00]">{formatINR(summary.totalPlatformRevenue)}</div>
          <p className="text-[11px] text-[#4e4635] font-medium">
            Commissions + Convenience Fees + Subscriptions
          </p>
        </div>

        {/* Vendor Payouts Disbursed */}
        <div className="rounded-3xl p-6 bg-white border border-[#E6DFD5] shadow-xs space-y-2 relative overflow-hidden group hover:shadow-md hover:border-[#c59a27]/50 transition-all">
          <div className="flex items-center justify-between text-[#807663] text-xs font-bold uppercase tracking-wider">
            <span>Settled Payouts</span>
            <div className="w-9 h-9 rounded-xl bg-[#4f5e81]/10 text-[#4f5e81] border border-[#4f5e81]/25 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#18181B]">{formatINR(summary.totalPayoutsDisbursed)}</div>
          <p className="text-[11px] text-[#71717A]">
            Pending batch: <span className="text-[#775a00] font-semibold">{formatINR(summary.pendingPayouts)}</span>
          </p>
        </div>

        {/* Refunds Handled */}
        <div className="rounded-3xl p-6 bg-white border border-[#E6DFD5] shadow-xs space-y-2 relative overflow-hidden group hover:shadow-md hover:border-[#c59a27]/50 transition-all">
          <div className="flex items-center justify-between text-[#807663] text-xs font-bold uppercase tracking-wider">
            <span>Refunds Processed</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#18181B]">{formatINR(summary.totalRefundsAmount)}</div>
          <p className="text-[11px] text-[#71717A]">
            {refunds.length} successful automated refunds
          </p>
        </div>
      </div>

      {/* Quick Monetization Navigation Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/admin/payouts"
          className="flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-[#FAF7F2] border border-[#E6DFD5] text-[#18181B] shadow-xs hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c59a27]/10 text-[#775a00] flex items-center justify-center shrink-0 border border-[#c59a27]/20">
              <Receipt className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#18181B]">Payout Reports</div>
              <div className="text-[10px] text-[#71717A]">Route &amp; NEFT Ledger</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#807663] group-hover:text-[#775a00] transition-colors" />
        </Link>

        <Link
          href="/admin/refunds"
          className="flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-[#FAF7F2] border border-[#E6DFD5] text-[#18181B] shadow-xs hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#18181B]">Refund Operations</div>
              <div className="text-[10px] text-[#71717A]">Razorpay API Dispatch</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#807663] group-hover:text-rose-600 transition-colors" />
        </Link>

        <Link
          href="/admin/promos"
          className="flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-[#FAF7F2] border border-[#E6DFD5] text-[#18181B] shadow-xs hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              <Tag className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#18181B]">Promo Codes</div>
              <div className="text-[10px] text-[#71717A]">Discounts &amp; Limits</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#807663] group-hover:text-emerald-600 transition-colors" />
        </Link>

        <Link
          href="/admin/settings"
          className="flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-[#FAF7F2] border border-[#E6DFD5] text-[#18181B] shadow-xs hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4f5e81]/10 text-[#4f5e81] flex items-center justify-center shrink-0 border border-[#4f5e81]/20">
              <Sliders className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#18181B]">Platform Rates</div>
              <div className="text-[10px] text-[#71717A]">Fees, GST &amp; Route</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#807663] group-hover:text-[#4f5e81] transition-colors" />
        </Link>
      </div>

      {/* Two Column Layout: Revenue Breakdown & Financial Rule Configurator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Revenue Streams Breakdown (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl p-6 sm:p-8 bg-white border border-[#E6DFD5] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#775a00] uppercase tracking-wider">
              <Percent className="w-4 h-4" />
              <span>Revenue Streams &amp; Margin Breakdown</span>
            </div>
            <span className="text-xs font-mono text-[#775a00] font-bold">Total Net: {formatINR(summary.totalPlatformRevenue)}</span>
          </div>

          {/* Visual Progress Bar Split */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-full overflow-hidden flex">
              <div style={{ width: `${commShare}%` }} className="bg-[#c59a27] h-full" title="Commissions" />
              <div style={{ width: `${feeShare}%` }} className="bg-emerald-600 h-full" title="Convenience Fees" />
              <div style={{ width: `${subShare}%` }} className="bg-[#4f5e81] h-full" title="Subscriptions" />
            </div>
            <div className="flex flex-wrap items-center justify-between text-[11px] text-[#71717A] pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c59a27]" />
                <span className="text-[#18181B] font-medium">Ticket Commission ({commShare}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-[#18181B] font-medium">Convenience Fees ({feeShare}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4f5e81]" />
                <span className="text-[#18181B] font-medium">Vendor SaaS MRR ({subShare}%)</span>
              </div>
            </div>
          </div>

          {/* Detailed Stream Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5] space-y-1">
              <span className="text-[10px] text-[#807663] uppercase font-bold">Commissions</span>
              <div className="text-lg font-black text-[#775a00]">{formatINR(summary.commissionRevenue)}</div>
              <p className="text-[10px] text-[#71717A]">
                {settings.platformCommissionPct}% standard rate on ticket bookings
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5] space-y-1">
              <span className="text-[10px] text-[#807663] uppercase font-bold">Convenience Fees</span>
              <div className="text-lg font-black text-emerald-700">{formatINR(summary.convenienceFeeRevenue)}</div>
              <p className="text-[10px] text-[#71717A]">
                Fixed ₹{settings.convenienceFeeFixed}/order (+ {settings.gstPct}% GST)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5] space-y-1">
              <span className="text-[10px] text-[#807663] uppercase font-bold">Vendor SaaS MRR</span>
              <div className="text-lg font-black text-[#4f5e81]">{formatINR(summary.subscriptionRevenue)}</div>
              <p className="text-[10px] text-[#71717A]">
                {summary.activeSubscriptionsCount} active Pro &amp; Luxury subscriptions
              </p>
            </div>
          </div>

          {/* Settlement Route Status Box */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-[#18181B] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Razorpay Route Settlement Mode</span>
              </div>
              <p className="text-[11px] text-[#71717A]">
                {settings.razorpayRouteEnabled
                  ? 'Automated split enabled. Payouts transfer directly to vendor virtual linked accounts.'
                  : 'Manual Ledger mode active. Payouts require exportable NEFT/RTGS batch bank file.'}
              </p>
            </div>
            <Link
              href="/admin/payouts"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#efeeea] border border-[#E6DFD5] text-xs font-bold text-[#775a00] transition-colors shrink-0 shadow-xs"
            >
              <span>Manage Payouts</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Rate Configurator (1 col) */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white border border-[#E6DFD5] shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#775a00] uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>Monetization Controls</span>
          </div>

          <form onSubmit={handleSaveFinancials} className="space-y-4 text-xs">
            <div>
              <label className="text-[#18181B] font-semibold block mb-1">
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
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD5] focus:bg-white focus:border-[#775a00] focus:outline-none rounded-xl px-3 py-2 text-[#18181B] font-mono font-bold transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#807663] font-bold">%</span>
              </div>
              <span className="text-[10px] text-[#71717A] mt-1 block">
                Applied on event ticket tiers and dining covers.
              </span>
            </div>

            <div>
              <label className="text-[#18181B] font-semibold block mb-1">
                Customer Convenience Fee (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#807663] font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  max="250"
                  value={convenienceFee}
                  onChange={(e) => setConvenienceFee(Number(e.target.value))}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD5] focus:bg-white focus:border-[#775a00] focus:outline-none rounded-xl pl-7 pr-3 py-2 text-[#18181B] font-mono font-bold transition-colors"
                />
              </div>
              <span className="text-[10px] text-[#71717A] mt-1 block">
                Charged to guest per checkout order.
              </span>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-[#18181B] font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={routeEnabled}
                  onChange={(e) => setRouteEnabled(e.target.checked)}
                  className="rounded border-[#E6DFD5] bg-[#FAF7F2] text-[#775a00] focus:ring-0"
                />
                <span>Enable Razorpay Route automated transfers</span>
              </label>
              <span className="text-[10px] text-[#71717A] mt-1 block pl-5">
                Transfers net vendor earnings automatically via Razorpay Route API.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#c59a27] to-[#775a00] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md cursor-pointer"
            >
              Update Financial Parameters
            </button>

            {savedSettingsNotice && (
              <p className="text-emerald-700 font-semibold text-center text-xs">
                Platform financial parameters updated!
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Featured Listings Moderation & Controls */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white border border-[#E6DFD5] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#775a00] uppercase tracking-wider mb-1">
              <Star className="w-4 h-4 fill-[#c59a27] text-[#c59a27]" />
              <span>Featured Listings &amp; Spotlight Promotion</span>
            </div>
            <h2 className="text-lg font-bold text-[#18181B]">Curated Platform Placement &amp; Badging</h2>
            <p className="text-xs text-[#71717A]">
              Toggle Featured status for events and restaurants (gives top billboard placement and golden badge).
            </p>
          </div>
          <div className="text-xs text-[#71717A]">
            Active Featured: <span className="text-[#775a00] font-bold">{summary.featuredListingsCount}</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#E6DFD5]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E6DFD5] bg-[#FAF7F2] text-[#4e4635]">
                <th className="py-3 px-4 font-bold">Listing</th>
                <th className="py-3 px-4 font-bold">Type</th>
                <th className="py-3 px-4 font-bold">City</th>
                <th className="py-3 px-4 font-bold">Vendor Host</th>
                <th className="py-3 px-4 font-bold">Featured Badge</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD5]">
              {events.map((e) => (
                <tr key={e.id} className="text-[#18181B] hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#18181B] max-w-xs truncate">{e.title}</td>
                  <td className="py-3.5 px-4 text-[#775a00] uppercase font-mono text-[10px] font-bold">Live Event</td>
                  <td className="py-3.5 px-4 text-[#4e4635]">{e.city}</td>
                  <td className="py-3.5 px-4 text-[#71717A]">{e.vendorName}</td>
                  <td className="py-3.5 px-4">
                    {e.isFeatured ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ffdf9a]/40 text-[#775a00] border border-[#c59a27]/30">
                        <Star className="w-2.5 h-2.5 fill-[#c59a27]" /> Featured
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#807663] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E6DFD5]">Standard</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleFeatured('event', e.id, e.isFeatured)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        e.isFeatured
                          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                          : 'bg-[#FAF7F2] text-[#775a00] hover:bg-[#ffdf9a]/30 border border-[#c59a27]/30'
                      }`}
                    >
                      {e.isFeatured ? 'Demote' : 'Boost to Featured'}
                    </button>
                  </td>
                </tr>
              ))}

              {restaurants.map((r) => (
                <tr key={r.id} className="text-[#18181B] hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#18181B] max-w-xs truncate">{r.name}</td>
                  <td className="py-3.5 px-4 text-[#4f5e81] uppercase font-mono text-[10px] font-bold">Dining Spot</td>
                  <td className="py-3.5 px-4 text-[#4e4635]">{r.city} ({r.area})</td>
                  <td className="py-3.5 px-4 text-[#71717A]">{r.vendorName}</td>
                  <td className="py-3.5 px-4">
                    {r.isFeatured ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ffdf9a]/40 text-[#775a00] border border-[#c59a27]/30">
                        <Star className="w-2.5 h-2.5 fill-[#c59a27]" /> Featured
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#807663] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E6DFD5]">Standard</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleFeatured('dining', r.id, r.isFeatured)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        r.isFeatured
                          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                          : 'bg-[#FAF7F2] text-[#775a00] hover:bg-[#ffdf9a]/30 border border-[#c59a27]/30'
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
