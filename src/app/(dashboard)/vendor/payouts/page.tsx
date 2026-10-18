'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Receipt,
  Download,
  CheckCircle2,
  Clock,
  Building,
  CreditCard,
  DollarSign,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { store } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import { PayoutRecord } from '@/types';

export default function VendorPayoutsPage() {
  const vendorId = 'ven-indigo-hospitality';
  const vendor = store.getVendorById(vendorId) || store.getVendors()[0];
  const subscription = store.getVendorSubscription(vendorId);
  const [payouts, setPayouts] = useState<PayoutRecord[]>(
    store.getPayoutRecords(vendorId)
  );

  const totalSettled = payouts
    .filter((p) => p.status === 'transferred')
    .reduce((sum, p) => sum + p.netPayoutAmount, 0);

  const pendingSettlement = payouts
    .filter((p) => p.status !== 'transferred')
    .reduce((sum, p) => sum + p.netPayoutAmount, 0);

  const totalGross = payouts.reduce((sum, p) => sum + p.grossBookingsGmv, 0);
  const totalCommission = payouts.reduce((sum, p) => sum + p.commissionDeducted, 0);

  const handleDownloadInvoice = (payout: PayoutRecord) => {
    const text = `
========================================
       DASTAN EXPERIENCES VENDOR PAYOUT
========================================
Payout ID: ${payout.id}
Vendor: ${payout.vendorName}
Period: ${payout.period}
Date: ${payout.processedAt || new Date().toISOString()}

Gross Ticket Sales: ₹${payout.grossBookingsGmv}
Platform Commission: -₹${payout.commissionDeducted} (${subscription.commissionPct}%)
Payment Gateway Fee: -₹${payout.gatewayFeesDeducted} (2%)
----------------------------------------
NET PAYOUT SETTLED: ₹${payout.netPayoutAmount}
----------------------------------------
Method: ${payout.method === 'razorpay_route' ? 'Razorpay Route Auto Split' : 'Manual Bank NEFT/RTGS'}
Reference UTR / Transfer ID: ${payout.razorpayTransferId || 'UTR-CONFIRMED'}
Bank Account: ${payout.bankAccountNumber || 'HDFC Bank'}
Status: ${payout.status.toUpperCase()}
========================================
`;
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Payout_Statement_${payout.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Receipt className="w-4 h-4" />
            <span>Host Settlement Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Earnings & Payout Statements</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent breakdown of gross ticket sales, platform commissions, gateway cuts, and bank transfers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/vendor/kyc"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <Building className="w-4 h-4 text-amber-400" />
            <span>Update Bank & IFSC</span>
          </Link>
          <Link
            href="/vendor/subscription"
            className="flex items-center gap-2 px-4 py-2 rounded-xl saffron-gradient text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
          >
            <span>Reduce Commission ({subscription.commissionPct}%)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Gross Bookings</span>
          <div className="text-2xl font-black text-white">{formatINR(totalGross)}</div>
          <span className="text-[10px] text-slate-500">Gross ticket & dining revenue</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Platform Commission Cut</span>
          <div className="text-2xl font-black text-rose-400">-{formatINR(totalCommission)}</div>
          <span className="text-[10px] text-slate-500">{subscription.commissionPct}% rate under {subscription.tierName}</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Settled to Bank Account</span>
          <div className="text-2xl font-black text-emerald-400">{formatINR(totalSettled)}</div>
          <span className="text-[10px] text-slate-500">Completed disbursements</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Pending Payout</span>
          <div className="text-2xl font-black text-amber-400">{formatINR(pendingSettlement)}</div>
          <span className="text-[10px] text-slate-500">Scheduled for next batch</span>
        </div>
      </div>

      {/* Payout Routing Method Details Card */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            {vendor.razorpayAccountId ? (
              <CreditCard className="w-6 h-6" />
            ) : (
              <Building className="w-6 h-6" />
            )}
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {vendor.razorpayAccountId ? 'Razorpay Route Linked Account' : 'Manual NEFT Bank Account'}
            </div>
            <div className="text-base font-bold text-white">
              {vendor.bankBeneficiaryName || vendor.businessName}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              {vendor.razorpayAccountId && (
                <span className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-amber-300">
                  Route ID: {vendor.razorpayAccountId}
                </span>
              )}
              <span className="font-mono">A/C: {vendor.bankAccountNumber || '918239001238'}</span>
              <span className="font-mono">IFSC: {vendor.bankIfsc || 'HDFC0000060'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs text-emerald-400 shrink-0">
          <CheckCircle2 className="w-4 h-4" />
          <span>KYC & Settlement Account Verified</span>
        </div>
      </div>

      {/* Settlement History Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Settlement Ledger & Statements</h2>
            <p className="text-xs text-slate-400">Period-wise breakdown of sales, deductions, and transfer references</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Period</th>
                <th className="pb-3 font-semibold">Gross GMV</th>
                <th className="pb-3 font-semibold">Commission ({subscription.commissionPct}%)</th>
                <th className="pb-3 font-semibold">Net Received</th>
                <th className="pb-3 font-semibold">Disbursement Mode</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Statement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payouts.map((p) => {
                const isTransferred = p.status === 'transferred';

                return (
                  <tr key={p.id} className="text-slate-300">
                    <td className="py-3.5">
                      <div className="font-semibold text-white">{p.period}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{p.id}</div>
                    </td>

                    <td className="py-3.5 font-semibold text-slate-200">{formatINR(p.grossBookingsGmv)}</td>

                    <td className="py-3.5 text-rose-400 font-mono">
                      -{formatINR(p.commissionDeducted)}
                    </td>

                    <td className="py-3.5 font-bold text-emerald-400 text-sm">
                      {formatINR(p.netPayoutAmount)}
                    </td>

                    <td className="py-3.5">
                      {p.method === 'razorpay_route' ? (
                        <div className="text-amber-300 font-medium flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                          <span>Razorpay Route</span>
                        </div>
                      ) : (
                        <div className="text-slate-300 font-medium flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>NEFT Bank Transfer</span>
                        </div>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono block">
                        {p.razorpayTransferId || 'Direct Bank Settlement'}
                      </span>
                    </td>

                    <td className="py-3.5">
                      {isTransferred ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Transferred
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <Clock className="w-3 h-3" /> Processing
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleDownloadInvoice(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                        title="Download Payout Statement"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
