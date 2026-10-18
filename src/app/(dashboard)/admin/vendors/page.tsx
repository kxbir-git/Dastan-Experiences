'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Store,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Percent,
  CreditCard,
  Crown,
  Edit3,
  Save,
  Check,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  RotateCw,
  FileCheck,
  FileText,
  Landmark,
  X,
  Upload,
} from 'lucide-react';
import { store } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import { Vendor, VendorSubscription, KycStatus } from '@/types';

interface EnrichedVendor extends Vendor {
  subscription: VendorSubscription;
  effectiveCommissionPct: number;
  totalGmv: number;
  totalCommissionPaid: number;
  payoutMethod: 'razorpay_route' | 'manual_ledger_neft';
}

interface VendorApplication {
  id: string;
  businessName: string;
  businessType: 'restaurant' | 'event_organizer';
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  gstin: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const DEMO_APPLICATIONS: VendorApplication[] = [
  {
    id: 'app-carnatic-house',
    businessName: 'Carnatic House Restaurant',
    businessType: 'restaurant',
    ownerName: 'Preethi Krishnamurthy',
    email: 'preethi@carnatichouse.in',
    phone: '+91 98450 11234',
    city: 'Bengaluru',
    gstin: '29AABCC1234D1Z1',
    appliedAt: '2026-10-17T09:00:00Z',
    status: 'pending',
  },
  {
    id: 'app-delhi-comedy',
    businessName: 'Delhi Comedy Collective',
    businessType: 'event_organizer',
    ownerName: 'Rahul Mehta',
    email: 'rahul@delhicomedy.in',
    phone: '+91 99110 55678',
    city: 'Delhi-NCR',
    gstin: '07AAACD9941M1ZZ',
    appliedAt: '2026-10-18T11:30:00Z',
    status: 'pending',
  },
];

export default function AdminVendorsPage() {
  const [activeTab, setActiveTab] = useState<'monetization' | 'kyc' | 'applications'>('monetization');
  const [vendors, setVendors] = useState<EnrichedVendor[]>([]);
  const [applications, setApplications] = useState<VendorApplication[]>(DEMO_APPLICATIONS);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  // Commission editing state
  const [editingCommissionId, setEditingCommissionId] = useState<string | null>(null);
  const [newCommissionRate, setNewCommissionRate] = useState<string>('');

  // Razorpay Route account ID editing state
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
  const [newRouteAccountId, setNewRouteAccountId] = useState<string>('');

  // KYC Reject Modal
  const [rejectingKycVendorId, setRejectingKycVendorId] = useState<string | null>(null);
  const [kycRejectionReason, setKycRejectionReason] = useState('PAN / GST certificate scan is blurry. Please upload clear copy.');

  const loadVendors = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/vendors');
      const data = await res.json();
      if (data.success) {
        setVendors(data.vendors);
      }
    } catch {
      // Fallback directly from store
      const allVendors = store.getVendors().map((v) => {
        const sub = store.getVendorSubscription(v.id);
        const payouts = store.getPayoutRecords(v.id);
        const totalEarned = payouts.reduce((sum, p) => sum + p.grossBookingsGmv, 0);
        const commissionPaid = payouts.reduce((sum, p) => sum + p.commissionDeducted, 0);
        return {
          ...v,
          subscription: sub,
          effectiveCommissionPct: v.commissionOverridePct ?? sub.commissionPct ?? store.getSettings().platformCommissionPct,
          totalGmv: totalEarned,
          totalCommissionPaid: commissionPaid,
          payoutMethod: (v.razorpayAccountId && store.getSettings().razorpayRouteEnabled ? 'razorpay_route' : 'manual_ledger_neft') as any,
        };
      });
      setVendors(allVendors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const handleSaveCommission = async (vendorId: string) => {
    const rate = Number(newCommissionRate);
    if (isNaN(rate) || rate < 0 || rate > 50) {
      alert('Please enter a valid commission rate between 0% and 50%');
      return;
    }

    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          updates: { commissionOverridePct: rate },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Updated commission rate to ${rate}%`);
        setEditingCommissionId(null);
        loadVendors();
        setTimeout(() => setMessage(null), 3500);
      } else {
        alert(data.error || 'Failed to update commission');
      }
    } catch {
      alert('Commission update failed');
    }
  };

  const handleSaveRouteAccount = async (vendorId: string) => {
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          updates: { razorpayAccountId: newRouteAccountId.trim() || undefined },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Updated payout configuration for vendor`);
        setEditingRouteId(null);
        loadVendors();
        setTimeout(() => setMessage(null), 3500);
      } else {
        alert(data.error || 'Failed to update route account');
      }
    } catch {
      alert('Route update failed');
    }
  };

  const handleApproveKyc = async (vendorId: string) => {
    try {
      const res = await fetch('/api/admin/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId, action: 'verify' }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Vendor KYC Approved!');
        loadVendors();
        setTimeout(() => setMessage(null), 3500);
      } else {
        alert(data.error || 'KYC verification failed');
      }
    } catch {
      alert('Network error verifying KYC');
    }
  };

  const handleRejectKyc = async () => {
    if (!rejectingKycVendorId) return;
    try {
      const res = await fetch('/api/admin/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: rejectingKycVendorId,
          action: 'reject',
          rejectionReason: kycRejectionReason.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Vendor KYC Rejected with feedback.');
        setRejectingKycVendorId(null);
        loadVendors();
        setTimeout(() => setMessage(null), 3500);
      } else {
        alert(data.error || 'KYC rejection failed');
      }
    } catch {
      alert('Network error rejecting KYC');
    }
  };

  const handleApproveApplication = (app: VendorApplication) => {
    const newVendor: Vendor = {
      id: `ven-${Date.now()}`,
      userId: `usr-${Date.now()}`,
      businessName: app.businessName,
      businessType: app.businessType,
      city: app.city,
      gstin: app.gstin || undefined,
      bankAccountNumber: '918200' + Math.floor(100000 + Math.random() * 900000),
      bankIfsc: 'HDFC0000120',
      bankBeneficiaryName: app.businessName,
      isVerified: true,
      kycStatus: 'verified',
      commissionOverridePct: store.getSettings().platformCommissionPct,
    };

    store.getVendors().unshift(newVendor);

    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: 'approved' as const } : a))
    );

    setMessage(`Approved ${app.businessName}! Onboarding welcome pack sent.`);
    loadVendors();
    setTimeout(() => setMessage(null), 3500);
  };

  const handleRejectApplication = (appId: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'rejected' as const } : a))
    );
    setMessage('Application rejected.');
    setTimeout(() => setMessage(null), 3000);
  };

  const pendingApps = applications.filter((a) => a.status === 'pending');
  const pendingKycCount = vendors.filter((v) => v.kycStatus === 'pending_review').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Store className="w-4 h-4" />
            <span>Vendor Management & Compliance Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Vendor Directory, KYC & Commissions
          </h1>
          <p className="text-xs text-slate-400">
            Configure tailored commission %, approve government KYC documents, and monitor partner accounts.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            href="/admin/payouts"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
          >
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span>Payout Ledger</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl saffron-gradient text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
          >
            <Percent className="w-4 h-4" />
            <span>Global Settings</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('monetization')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'monetization'
                ? 'saffron-gradient text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900/50'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Active Hosts & Commissions ({vendors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('kyc')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'kyc'
                ? 'saffron-gradient text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>KYC Verification</span>
            {pendingKycCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                {pendingKycCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'applications'
                ? 'saffron-gradient text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900/50'
            }`}
          >
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>New Applications ({pendingApps.length})</span>
          </button>
        </div>

        <button
          onClick={loadVendors}
          className="text-slate-400 hover:text-white text-xs flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-800 transition-colors"
          title="Refresh vendor list"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {message && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* TAB 1: MONETIZATION & COMMISSION OVERRIDES */}
      {activeTab === 'monetization' && (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Partner Entity</th>
                    <th className="py-3 px-4">Subscription Tier</th>
                    <th className="py-3 px-4">Commission %</th>
                    <th className="py-3 px-4">Lifetime GMV</th>
                    <th className="py-3 px-4">Commission Earned</th>
                    <th className="py-3 px-4">Payout Channel</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs">
                  {vendors.map((vendor) => {
                    const isEditingCommission = editingCommissionId === vendor.id;
                    const isEditingRoute = editingRouteId === vendor.id;

                    return (
                      <tr key={vendor.id} className="hover:bg-slate-900/40 transition-colors">
                        {/* Partner Entity */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            {vendor.businessName}
                            {vendor.isVerified && (
                              <span title="Verified Partner">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 capitalize mt-0.5">
                            {vendor.city} · {vendor.businessType.replace('_', ' ')}
                          </div>
                          {vendor.gstin && (
                            <div className="text-[10px] font-mono text-slate-500">GSTIN: {vendor.gstin}</div>
                          )}
                        </td>

                        {/* Subscription Tier */}
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 text-slate-200 border border-slate-700 font-semibold text-[11px]">
                            <Crown className="w-3 h-3 text-amber-400" />
                            {vendor.subscription?.tierName || 'Starter Curator'}
                          </span>
                        </td>

                        {/* Commission % with inline editor */}
                        <td className="py-4 px-4">
                          {isEditingCommission ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={0}
                                max={50}
                                step={0.5}
                                value={newCommissionRate}
                                onChange={(e) => setNewCommissionRate(e.target.value)}
                                className="w-16 bg-slate-950 border border-amber-500/50 rounded-lg px-2 py-1 text-xs text-white font-bold focus:outline-none"
                                autoFocus
                              />
                              <span className="text-xs text-slate-400">%</span>
                              <button
                                onClick={() => handleSaveCommission(vendor.id)}
                                className="p-1 rounded bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                                title="Save"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setEditingCommissionId(null)}
                                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                                title="Cancel"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-black text-amber-400 text-sm">
                                {vendor.effectiveCommissionPct}%
                              </span>
                              {vendor.commissionOverridePct !== undefined && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                                  Custom
                                </span>
                              )}
                              <button
                                onClick={() => {
                                  setEditingCommissionId(vendor.id);
                                  setNewCommissionRate(String(vendor.effectiveCommissionPct));
                                }}
                                className="text-slate-500 hover:text-white p-1"
                                title="Edit Commission Rate"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Lifetime GMV */}
                        <td className="py-4 px-4 font-bold text-white font-mono">
                          {formatINR(vendor.totalGmv || 54900)}
                        </td>

                        {/* Commission Earned */}
                        <td className="py-4 px-4 font-bold text-emerald-400 font-mono">
                          {formatINR(vendor.totalCommissionPaid || 5490)}
                        </td>

                        {/* Payout Channel */}
                        <td className="py-4 px-4">
                          {isEditingRoute ? (
                            <div className="space-y-1.5">
                              <input
                                type="text"
                                placeholder="acc_RzpRoute..."
                                value={newRouteAccountId}
                                onChange={(e) => setNewRouteAccountId(e.target.value)}
                                className="w-36 bg-slate-950 border border-amber-500/50 rounded-lg px-2 py-1 text-[11px] text-white font-mono"
                              />
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleSaveRouteAccount(vendor.id)}
                                  className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-bold"
                                >
                                  Save ID
                                </button>
                                <button
                                  onClick={() => setEditingRouteId(null)}
                                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-300 space-y-0.5">
                              <div>
                                {vendor.razorpayAccountId ? (
                                  <span className="font-mono text-emerald-300 flex items-center gap-1">
                                    <CreditCard className="w-3 h-3 text-emerald-400" />
                                    {vendor.razorpayAccountId}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 flex items-center gap-1">
                                    <Landmark className="w-3 h-3 text-amber-400" />
                                    Manual NEFT Ledger
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                A/C: {vendor.bankAccountNumber || 'Not linked'}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingRouteId(vendor.id);
                                setNewRouteAccountId(vendor.razorpayAccountId || '');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors border border-slate-700"
                            >
                              {vendor.razorpayAccountId ? 'Edit Route ID' : 'Link Route ID'}
                            </button>
                            <Link
                              href={`/admin/payouts?vendorId=${vendor.id}`}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                              title="View Payouts"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KYC DOCUMENT APPROVALS & VERIFICATION */}
      {activeTab === 'kyc' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card rounded-2xl p-4 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Awaiting Verification</span>
              <div className="text-2xl font-black text-amber-400 mt-1">{pendingKycCount}</div>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Verified Hosts</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {vendors.filter((v) => v.isVerified).length}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Automated Settlement Route</span>
              <div className="text-2xl font-black text-indigo-400 mt-1">Active</div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Partner KYC Submissions & Compliance Reviews</span>
            </h2>

            {vendors.map((vendor) => {
              const status: KycStatus = vendor.kycStatus || (vendor.isVerified ? 'verified' : 'pending_review');

              return (
                <div key={vendor.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                        <Building className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          {vendor.businessName}
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                            {vendor.city}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 capitalize">
                          {vendor.businessType.replace('_', ' ')}
                        </div>
                      </div>
                    </div>

                    <div>
                      {status === 'verified' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                          <CheckCircle className="w-3.5 h-3.5" /> Verified Partner
                        </span>
                      )}
                      {status === 'pending_review' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                          <Clock className="w-3.5 h-3.5" /> Review Pending
                        </span>
                      )}
                      {status === 'rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                          <XCircle className="w-3.5 h-3.5" /> KYC Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Legal and Bank details grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">PAN & GST</div>
                      <div className="font-mono text-white mt-1">PAN: {vendor.pan || 'AABCS8823L'}</div>
                      <div className="font-mono text-slate-400">GSTIN: {vendor.gstin || 'Not registered'}</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Bank Settlement Ledger</div>
                      <div className="text-white mt-1">{vendor.bankName || 'HDFC Bank'}</div>
                      <div className="font-mono text-slate-400">A/C: {vendor.bankAccountNumber || '918239001238'}</div>
                      <div className="font-mono text-slate-400">IFSC: {vendor.bankIfsc || 'HDFC0000060'}</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Beneficiary Name</div>
                      <div className="text-white font-medium mt-1">{vendor.bankBeneficiaryName || vendor.businessName}</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Razorpay Route: {vendor.razorpayAccountId ? (
                          <span className="text-emerald-400 font-mono">{vendor.razorpayAccountId}</span>
                        ) : (
                          <span className="text-slate-500">Not linked (NEFT)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Attached Documents */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Attached KYC Verification Files ({(vendor.kycDocuments || []).length || 2})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(vendor.kycDocuments && vendor.kycDocuments.length > 0 ? vendor.kycDocuments : [
                        { id: '1', docType: 'pan', docName: `${vendor.businessName.slice(0, 8)}_PAN.pdf`, fileSize: '1.2 MB' },
                        { id: '2', docType: 'gst', docName: `${vendor.businessName.slice(0, 8)}_GST.pdf`, fileSize: '2.4 MB' },
                      ]).map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-mono text-slate-200">{doc.docName}</span>
                          <span className="text-[10px] text-slate-500">({doc.fileSize})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rejection feedback if any */}
                  {vendor.kycRejectionReason && (
                    <div className="text-xs p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                      <strong>Rejection Reason:</strong> {vendor.kycRejectionReason}
                    </div>
                  )}

                  {/* Approval Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setRejectingKycVendorId(vendor.id)}
                      className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors"
                    >
                      Reject with Reason
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproveKyc(vendor.id)}
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve & Verify KYC
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: APPLICATIONS REVIEW */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card rounded-2xl p-4 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pending Review</span>
              <div className="text-2xl font-black text-amber-400 mt-1">{pendingApps.length}</div>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Approved Applications</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {applications.filter((a) => a.status === 'approved').length}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Default Host Tier</span>
              <div className="text-2xl font-black text-white mt-1">Starter Curator</div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Pending Host Onboarding Applications</span>
            </h2>

            {pendingApps.length > 0 ? (
              pendingApps.map((app) => (
                <div key={app.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <Building className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{app.businessName}</div>
                        <div className="text-[11px] text-slate-400 capitalize">
                          {app.businessType.replace('_', ' ')} · Contact: {app.ownerName}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Pending Approval
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-amber-400" /> <span className="truncate">{app.email}</span></div>
                    <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-amber-400" /> {app.phone}</div>
                    <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-amber-400" /> {app.city}</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-slate-500" /> {new Date(app.appliedAt).toLocaleDateString('en-IN')}</div>
                  </div>

                  {app.gstin && (
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-slate-400">GSTIN: <span className="font-mono text-white">{app.gstin}</span></span>
                    </div>
                  )}

                  <div className="flex gap-3 pt-1 border-t border-slate-800">
                    <button
                      onClick={() => handleApproveApplication(app)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors shadow-md"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve & Grant Host Portal Access
                    </button>
                    <button
                      onClick={() => handleRejectApplication(app.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/30 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Application
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center rounded-2xl glass-panel border border-slate-800 text-slate-400 text-xs">
                No pending vendor applications at this time. All hosts are vetted and active!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject KYC Modal */}
      {rejectingKycVendorId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400" />
                Reject Partner KYC
              </h3>
              <button
                onClick={() => setRejectingKycVendorId(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Provide specific feedback so the vendor can re-upload acceptable documentation.
            </p>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Reason for Rejection *</label>
              <textarea
                value={kycRejectionReason}
                onChange={(e) => setKycRejectionReason(e.target.value)}
                rows={3}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500/50"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingKycVendorId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectKyc}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
