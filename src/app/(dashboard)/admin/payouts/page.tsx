'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Receipt,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  CreditCard,
  Send,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { store } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import { PayoutRecord } from '@/types';

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<PayoutRecord[]>(store.getPayoutRecords());
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'transferred'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [utrInputModal, setUtrInputModal] = useState<PayoutRecord | null>(null);
  const [customUtr, setCustomUtr] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const settings = store.getSettings();

  const reloadPayouts = () => {
    setPayouts([...store.getPayoutRecords()]);
  };

  const handleGenerateBatch = async () => {
    try {
      const res = await fetch('/api/admin/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMessage(data.message);
        reloadPayouts();
        setTimeout(() => setFeedbackMessage(null), 3500);
      }
    } catch (err: any) {
      alert('Error generating batch');
    }
  };

  const handleSettleRoute = async (payout: PayoutRecord) => {
    try {
      setProcessingId(payout.id);
      const res = await fetch('/api/admin/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'process',
          payoutId: payout.id,
          method: 'razorpay_route',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMessage(data.message);
        reloadPayouts();
      } else {
        alert(data.error || 'Failed to settle via Razorpay Route');
      }
    } catch (err: any) {
      alert('Settlement failed');
    } finally {
      setProcessingId(null);
      setTimeout(() => setFeedbackMessage(null), 3500);
    }
  };

  const handleSettleManualNEFT = async () => {
    if (!utrInputModal) return;
    try {
      setProcessingId(utrInputModal.id);
      const res = await fetch('/api/admin/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'process',
          payoutId: utrInputModal.id,
          method: 'manual_ledger_neft',
          transferRef: customUtr.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMessage(data.message);
        setUtrInputModal(null);
        setCustomUtr('');
        reloadPayouts();
      } else {
        alert(data.error || 'Failed to record manual settlement');
      }
    } catch (err: any) {
      alert('Manual settlement failed');
    } finally {
      setProcessingId(null);
      setTimeout(() => setFeedbackMessage(null), 3500);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Payout ID', 'Vendor Name', 'Period', 'Gross GMV', 'Commission', 'Gateway Fee', 'Net Payout', 'Status', 'Method', 'Bank Account', 'IFSC', 'Reference'];
    const rows = payouts.map((p) => [
      p.id,
      `"${p.vendorName}"`,
      `"${p.period}"`,
      p.grossBookingsGmv,
      p.commissionDeducted,
      p.gatewayFeesDeducted,
      p.netPayoutAmount,
      p.status,
      p.method,
      `"${p.bankAccountNumber || ''}"`,
      `"${p.bankIfsc || ''}"`,
      `"${p.razorpayTransferId || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Dastan_Payouts_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered list
  const filtered = payouts.filter((p) => {
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchSearch =
      p.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalTransferred = payouts
    .filter((p) => p.status === 'transferred')
    .reduce((sum, p) => sum + p.netPayoutAmount, 0);

  const totalPending = payouts
    .filter((p) => p.status !== 'transferred')
    .reduce((sum, p) => sum + p.netPayoutAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Receipt className="w-4 h-4" />
            <span>Host Settlements & Payouts Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Vendor Payout Reports & Ledger</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Process automated settlements via Razorpay Route or record manual bank NEFT/RTGS batch transfers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
          >
            <Download className="w-4 h-4 text-amber-400" />
            Export Bank CSV
          </button>
          <button
            onClick={handleGenerateBatch}
            className="flex items-center gap-2 px-4 py-2 rounded-xl saffron-gradient text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            Run Settlement Batch
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Settlement Totals Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Settled to Date</span>
          <div className="text-2xl font-black text-emerald-400">{formatINR(totalTransferred)}</div>
          <span className="text-[10px] text-slate-500">Transferred via Route & NEFT</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Pending Settlements</span>
          <div className="text-2xl font-black text-amber-400">{formatINR(totalPending)}</div>
          <span className="text-[10px] text-slate-500">Awaiting transfer dispatch</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Default Payout Engine</span>
          <div className="text-sm font-bold text-white flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{settings.razorpayRouteEnabled ? 'Razorpay Route (Enabled)' : 'Manual Ledger (NEFT)'}</span>
          </div>
          <span className="text-[10px] text-slate-500">Configured in Platform Settings</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(['all', 'pending', 'transferred'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterStatus === st
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vendor or period..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      {/* Payouts Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400">
                <th className="py-3.5 px-4 font-semibold">Vendor Host</th>
                <th className="py-3.5 px-4 font-semibold">Period</th>
                <th className="py-3.5 px-4 font-semibold">Gross GMV</th>
                <th className="py-3.5 px-4 font-semibold">Platform Cut</th>
                <th className="py-3.5 px-4 font-semibold">Net Payout</th>
                <th className="py-3.5 px-4 font-semibold">Method & Bank</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Settlement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((p) => {
                const isTransferred = p.status === 'transferred';

                return (
                  <tr key={p.id} className="text-slate-300 hover:bg-slate-900/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{p.vendorName}</div>
                      <div className="text-[10px] text-slate-500">{p.id}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{p.period}</td>

                    <td className="py-3.5 px-4 font-semibold text-slate-200">{formatINR(p.grossBookingsGmv)}</td>

                    <td className="py-3.5 px-4 text-rose-400 font-mono">
                      -{formatINR(p.commissionDeducted + p.gatewayFeesDeducted)}
                      <span className="text-[9px] text-slate-500 block">Comm + Gateway</span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-400 text-sm">
                      {formatINR(p.netPayoutAmount)}
                    </td>

                    <td className="py-3.5 px-4">
                      {p.method === 'razorpay_route' ? (
                        <div className="flex items-center gap-1.5 text-xs text-amber-300">
                          <CreditCard className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Razorpay Route</span>
                        </div>
                      ) : (
                        <div className="text-slate-400 text-[11px]">
                          <div className="flex items-center gap-1 text-slate-300">
                            <Building className="w-3 h-3 text-slate-400" />
                            <span>NEFT / RTGS</span>
                          </div>
                          <span className="text-[10px] text-slate-500 block font-mono">
                            {p.bankIfsc || 'HDFC0000060'}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {isTransferred ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Settled
                          </span>
                          <span className="text-[9px] text-slate-500 block font-mono truncate max-w-[120px]">
                            {p.razorpayTransferId || 'NEFT Confirmed'}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isTransferred ? (
                        <span className="text-[11px] text-slate-500 italic">Disbursed</span>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          {settings.razorpayRouteEnabled ? (
                            <button
                              disabled={processingId === p.id}
                              onClick={() => handleSettleRoute(p)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-all disabled:opacity-50"
                            >
                              {processingId === p.id ? 'Routing...' : 'Route Transfer'}
                            </button>
                          ) : null}

                          <button
                            disabled={processingId === p.id}
                            onClick={() => {
                              setUtrInputModal(p);
                              setCustomUtr(`UTR-${new Date().getFullYear()}-${Math.floor(10000000 + Math.random() * 90000000)}`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-all disabled:opacity-50"
                          >
                            Mark NEFT
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* UTR Input Modal for Manual NEFT */}
      {utrInputModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-400" />
                <span>Record Manual NEFT Settlement</span>
              </div>
              <button
                onClick={() => setUtrInputModal(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400">Vendor: <span className="text-white font-bold">{utrInputModal.vendorName}</span></div>
                <div className="text-slate-400">Amount: <span className="text-emerald-400 font-bold">{formatINR(utrInputModal.netPayoutAmount)}</span></div>
                <div className="text-slate-400">Bank Account: <span className="text-slate-300 font-mono">{utrInputModal.bankAccountNumber || '918239001238'}</span></div>
                <div className="text-slate-400">IFSC Code: <span className="text-slate-300 font-mono">{utrInputModal.bankIfsc || 'HDFC0000060'}</span></div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Bank UTR / Transaction Reference Number
                </label>
                <input
                  type="text"
                  value={customUtr}
                  onChange={(e) => setCustomUtr(e.target.value)}
                  placeholder="e.g. UTR-2026-98124501"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Enter the NEFT/RTGS transaction reference from your corporate net banking.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setUtrInputModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSettleManualNEFT}
                className="px-4 py-2 rounded-xl saffron-gradient text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
              >
                Confirm Manual Settlement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
