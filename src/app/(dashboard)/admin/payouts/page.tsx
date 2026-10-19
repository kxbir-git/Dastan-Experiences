'use client';

import React, { useState } from 'react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DFD5] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#775a00] uppercase tracking-wider mb-1">
            <Receipt className="w-4 h-4" />
            <span>Host Settlements & Payouts Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight">
            Vendor Payout Reports & Ledger
          </h1>
          <p className="text-xs text-[#71717A] mt-1 max-w-xl">
            Process automated settlements via Razorpay Route or record manual bank NEFT/RTGS batch transfers with complete audit tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E6DFD5] text-xs font-bold text-[#18181B] hover:bg-[#FAF7F2] transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#775a00]" />
            Export Bank CSV
          </button>
          <button
            onClick={handleGenerateBatch}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#775a00] hover:bg-[#5c4600] text-white font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Run Settlement Batch
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Settlement Totals Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E6DFD5] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block mb-1">Total Settled to Date</span>
          <div className="text-2xl font-black text-emerald-700">{formatINR(totalTransferred)}</div>
          <span className="text-[11px] text-[#71717A] mt-0.5 block">Transferred via Route & NEFT</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E6DFD5] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block mb-1">Pending Settlements</span>
          <div className="text-2xl font-black text-[#775a00]">{formatINR(totalPending)}</div>
          <span className="text-[11px] text-[#71717A] mt-0.5 block">Awaiting transfer dispatch</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E6DFD5] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block mb-1">Default Payout Engine</span>
          <div className="text-sm font-bold text-[#18181B] flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{settings.razorpayRouteEnabled ? 'Razorpay Route (Enabled)' : 'Manual Ledger (NEFT)'}</span>
          </div>
          <span className="text-[11px] text-[#71717A] mt-0.5 block">Configured in Platform Settings</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(['all', 'pending', 'transferred'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#775a00] text-white shadow-xs'
                  : 'bg-white text-[#71717A] border border-[#E6DFD5] hover:text-[#18181B] hover:bg-[#FAF7F2]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vendor or period..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E6DFD5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#18181B] placeholder-[#A1A1AA] focus:outline-none focus:border-[#775a00] shadow-xs"
          />
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-white rounded-3xl border border-[#E6DFD5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E6DFD5] bg-[#FAF7F2] text-[#775a00]">
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Vendor Host</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Period</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Gross GMV</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Platform Cut</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Net Payout</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Method & Bank</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Status</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-right">Settlement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD5]">
              {filtered.map((p) => {
                const isTransferred = p.status === 'transferred';

                return (
                  <tr key={p.id} className="text-[#18181B] hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#18181B]">{p.vendorName}</div>
                      <div className="text-[10px] text-[#71717A] font-mono">{p.id}</div>
                    </td>

                    <td className="py-3.5 px-4 text-[#71717A] font-mono text-[11px]">{p.period}</td>

                    <td className="py-3.5 px-4 font-semibold text-[#18181B]">{formatINR(p.grossBookingsGmv)}</td>

                    <td className="py-3.5 px-4 text-rose-600 font-mono font-medium">
                      -{formatINR(p.commissionDeducted + p.gatewayFeesDeducted)}
                      <span className="text-[10px] text-[#71717A] block font-sans">Comm + Gateway</span>
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-emerald-700 text-sm">
                      {formatINR(p.netPayoutAmount)}
                    </td>

                    <td className="py-3.5 px-4">
                      {p.method === 'razorpay_route' ? (
                        <div className="flex items-center gap-1.5 text-xs text-[#775a00] font-semibold">
                          <CreditCard className="w-3.5 h-3.5 text-[#775a00] shrink-0" />
                          <span>Razorpay Route</span>
                        </div>
                      ) : (
                        <div className="text-[#71717A] text-[11px]">
                          <div className="flex items-center gap-1 text-[#18181B] font-medium">
                            <Building className="w-3 h-3 text-[#775a00]" />
                            <span>NEFT / RTGS</span>
                          </div>
                          <span className="text-[10px] text-[#71717A] block font-mono">
                            {p.bankIfsc || 'HDFC0000060'}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {isTransferred ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Settled
                          </span>
                          <span className="text-[9px] text-[#71717A] block font-mono truncate max-w-[120px]">
                            {p.razorpayTransferId || 'NEFT Confirmed'}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isTransferred ? (
                        <span className="text-[11px] text-[#71717A] italic">Disbursed</span>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          {settings.razorpayRouteEnabled ? (
                            <button
                              disabled={processingId === p.id}
                              onClick={() => handleSettleRoute(p)}
                              className="px-2.5 py-1 rounded-lg bg-[#ffdf9a]/40 hover:bg-[#ffdf9a]/70 text-[#775a00] border border-[#c59a27]/40 text-[11px] font-bold transition-all disabled:opacity-50 cursor-pointer"
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
                            className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#FAF7F2] text-[#18181B] border border-[#E6DFD5] text-[11px] font-semibold transition-all disabled:opacity-50 shadow-xs cursor-pointer"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E6DFD5] rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-3">
              <div className="text-sm font-bold text-[#18181B] flex items-center gap-2">
                <Building className="w-4 h-4 text-[#775a00]" />
                <span>Record Manual NEFT Settlement</span>
              </div>
              <button
                onClick={() => setUtrInputModal(null)}
                className="text-[#71717A] hover:text-[#18181B] text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5] space-y-1.5">
                <div className="text-[#71717A]">Vendor: <span className="text-[#18181B] font-bold">{utrInputModal.vendorName}</span></div>
                <div className="text-[#71717A]">Amount: <span className="text-emerald-700 font-bold">{formatINR(utrInputModal.netPayoutAmount)}</span></div>
                <div className="text-[#71717A]">Bank Account: <span className="text-[#18181B] font-mono">{utrInputModal.bankAccountNumber || '918239001238'}</span></div>
                <div className="text-[#71717A]">IFSC Code: <span className="text-[#18181B] font-mono">{utrInputModal.bankIfsc || 'HDFC0000060'}</span></div>
              </div>

              <div>
                <label className="text-[#18181B] font-semibold block mb-1">
                  Bank UTR / Transaction Reference Number
                </label>
                <input
                  type="text"
                  value={customUtr}
                  onChange={(e) => setCustomUtr(e.target.value)}
                  placeholder="e.g. UTR-2026-98124501"
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl px-3 py-2 text-[#18181B] font-mono text-xs focus:outline-none focus:border-[#775a00] focus:bg-white"
                />
                <p className="text-[10px] text-[#71717A] mt-1">
                  Enter the NEFT/RTGS transaction reference from your corporate net banking.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setUtrInputModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#71717A] hover:text-[#18181B] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSettleManualNEFT}
                className="px-4 py-2 rounded-xl bg-[#775a00] hover:bg-[#5c4600] text-white font-bold text-xs transition-all shadow-md cursor-pointer"
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
