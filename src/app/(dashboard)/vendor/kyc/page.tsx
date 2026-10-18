'use client';

import React, { useState, useEffect } from 'react';
import {
  Building,
  CreditCard,
  ShieldCheck,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Landmark,
  Info,
  Clock,
  XCircle,
  FileCheck,
  Trash2,
  Eye,
  Check,
} from 'lucide-react';
import { store } from '@/lib/store';
import type { KycDocument, KycStatus, Vendor } from '@/types';

export default function VendorKYCPage() {
  const vendorId = 'ven-indigo-hospitality';
  const [vendor, setVendor] = useState<Vendor | undefined>(store.getVendorById(vendorId));
  const [tab, setTab] = useState<'business' | 'bank' | 'documents'>('business');
  const [submitting, setSubmitting] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Business KYC fields
  const [pan, setPan] = useState(vendor?.pan || 'AABCI4821E');
  const [gstin, setGstin] = useState(vendor?.gstin || '27AABCI4821E1Z3');
  const [legalName, setLegalName] = useState(vendor?.businessName || 'Indigo Experiences Mumbai');

  // Bank details
  const [bankName, setBankName] = useState(vendor?.bankName || 'HDFC Bank');
  const [accountNumber, setAccountNumber] = useState(vendor?.bankAccountNumber || '918239001238');
  const [ifsc, setIfsc] = useState(vendor?.bankIfsc || 'HDFC0000060');
  const [beneficiary, setBeneficiary] = useState(vendor?.bankBeneficiaryName || 'Indigo Hospitality Ventures Pvt Ltd');

  // Documents list
  const [documents, setDocuments] = useState<KycDocument[]>(
    vendor?.kycDocuments || [
      {
        id: 'doc-pan-init',
        docType: 'pan',
        docName: 'Indigo_PAN_Card.pdf',
        fileUrl: '#',
        fileSize: '1.2 MB',
        uploadedAt: new Date().toISOString(),
      },
      {
        id: 'doc-gst-init',
        docType: 'gst',
        docName: 'GST_Certificate_27AABCI.pdf',
        fileUrl: '#',
        fileSize: '2.4 MB',
        uploadedAt: new Date().toISOString(),
      },
    ]
  );

  // File upload simulation
  const [dragActive, setDragActive] = useState(false);

  const reloadVendor = () => {
    const v = store.getVendorById(vendorId);
    setVendor(v ? { ...v } : undefined);
    if (v?.kycDocuments) setDocuments([...v.kycDocuments]);
  };

  const handleSimulateFileUpload = (type: KycDocument['docType']) => {
    const fileNames: Record<string, string> = {
      pan: `PAN_Card_${pan || 'Verified'}.pdf`,
      gst: `GST_Certificate_${gstin || '27AABCI'}.pdf`,
      fssai_license: `FSSAI_License_${legalName.slice(0, 10).replace(/\s+/g, '_')}.pdf`,
      cancelled_cheque: `Cancelled_Cheque_${bankName.replace(/\s+/g, '_')}.jpg`,
      business_proof: `Shop_Act_Incorporation_${legalName.slice(0, 10).replace(/\s+/g, '_')}.pdf`,
    };

    const newDoc: KycDocument = {
      id: `doc-${Date.now()}`,
      docType: type,
      docName: fileNames[type] || 'KYC_Document.pdf',
      fileUrl: '#',
      fileSize: `${(Math.random() * 2 + 0.8).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString(),
    };

    setDocuments((prev) => [...prev.filter((d) => d.docType !== type), newDoc]);
    setSavedMessage(`Uploaded ${newDoc.docName}`);
    setTimeout(() => setSavedMessage(null), 3000);
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSubmitKYC = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pan || !accountNumber || !ifsc || !beneficiary) {
      alert('Please fill in all mandatory PAN, IFSC, and Bank details.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/vendor/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          pan: pan.trim().toUpperCase(),
          gstin: gstin.trim().toUpperCase(),
          bankName: bankName.trim(),
          bankAccountNumber: accountNumber.trim(),
          bankIfsc: ifsc.trim().toUpperCase(),
          bankBeneficiaryName: beneficiary.trim(),
          documents,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit KYC');

      reloadVendor();
      setSavedMessage(data.message || 'KYC submitted successfully!');
      setTimeout(() => setSavedMessage(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  const kycStatus = vendor?.kycStatus || 'pending_review';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl saffron-gradient flex items-center justify-center shrink-0">
            <Building className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">KYC Verification & Bank Payouts</h1>
            <p className="text-xs text-slate-400 mt-0.5">Government tax verification & automated settlement setup</p>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {kycStatus === 'verified' && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Verified Partner
            </span>
          )}
          {kycStatus === 'pending_review' && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
              <Clock className="w-4 h-4 text-amber-400" />
              Under Admin Review
            </span>
          )}
          {kycStatus === 'rejected' && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold">
              <XCircle className="w-4 h-4 text-rose-400" />
              Action Required
            </span>
          )}
          {kycStatus === 'unsubmitted' && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold">
              Unsubmitted
            </span>
          )}
        </div>
      </div>

      {/* Status Notice Banner */}
      {kycStatus === 'verified' && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-300">
            <span className="font-bold">KYC Fully Verified.</span> Your business entity and bank ledger are approved for automated Razorpay Route instant settlements.
          </div>
        </div>
      )}

      {kycStatus === 'pending_review' && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-300">
            <span className="font-bold">Verification In Progress.</span> Documents submitted on {new Date(vendor?.kycSubmittedAt || Date.now()).toLocaleDateString('en-IN')}. Platform compliance team will verify within 24–48 hours.
          </div>
        </div>
      )}

      {kycStatus === 'rejected' && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-rose-300">
            <span className="font-bold">Verification Feedback: </span>
            {vendor?.kycRejectionReason || 'Please upload legible copies of your PAN and GST certificate.'}
          </div>
        </div>
      )}

      {savedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 font-bold">
          <Check className="w-4 h-4 text-emerald-400" />
          {savedMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
        {[
          { id: 'business', label: '1. Business & Tax', icon: FileText },
          { id: 'documents', label: '2. KYC Documents', icon: Upload },
          { id: 'bank', label: '3. Bank Settlement', icon: Landmark },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === t.id
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmitKYC} className="space-y-6">
        {/* Tab 1: Business & Tax */}
        {tab === 'business' && (
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Legal Entity & Tax Identifiers
            </h2>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Registered Legal Entity Name *</label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Company / Proprietor PAN *</label>
                <input
                  type="text"
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  placeholder="e.g. AABCI4821E"
                  maxLength={10}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono uppercase focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">GSTIN (for B2B Invoicing)</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="e.g. 27AABCI4821E1Z3"
                  maxLength={15}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono uppercase focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setTab('documents')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
              >
                Next: Upload Documents →
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Document Uploads */}
        {tab === 'documents' && (
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" /> Government & Business Verification Files
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload clear PDF or JPG scans. Our compliance team verifies signatures and GST registration.
              </p>
            </div>

            {/* Document upload grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { type: 'pan', title: 'PAN Card Scan *', desc: 'Company or Director PAN' },
                { type: 'gst', title: 'GST Certificate (Form REG-06)', desc: 'Registration Certificate' },
                { type: 'fssai_license', title: 'FSSAI License / Food Safety', desc: 'For dining & culinary fests' },
                { type: 'cancelled_cheque', title: 'Cancelled Cheque / Bank Passbook *', desc: 'To verify IFSC and name' },
              ].map((item) => {
                const uploaded = documents.find((d) => d.docType === item.type);
                return (
                  <div
                    key={item.type}
                    className={`p-4 rounded-2xl border transition-all ${
                      uploaded
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          {uploaded ? (
                            <FileCheck className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <FileText className="w-4 h-4 text-amber-400" />
                          )}
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                      </div>

                      {uploaded && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc(uploaded.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="mt-3">
                      {uploaded ? (
                        <div className="flex items-center justify-between text-[11px] bg-slate-950/60 p-2 rounded-xl">
                          <span className="text-emerald-300 font-mono truncate max-w-[160px]">{uploaded.docName}</span>
                          <span className="text-slate-500">{uploaded.fileSize}</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSimulateFileUpload(item.type as any)}
                          className="w-full py-2 rounded-xl border border-dashed border-slate-700 hover:border-amber-500/50 text-slate-400 hover:text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Upload className="w-3 h-3" />
                          Attach Document
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setTab('business')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setTab('bank')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
              >
                Next: Bank Details →
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Bank Settlement Details */}
        {tab === 'bank' && (
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Landmark className="w-4 h-4 text-amber-400" /> Bank Account for Razorpay Route Settlements
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Bank Name *</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. HDFC Bank, ICICI Bank"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">IFSC Code *</label>
                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  placeholder="e.g. HDFC0000060"
                  maxLength={11}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono uppercase focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Account Number *</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter bank account number"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Beneficiary / Account Holder Name *</label>
              <input
                type="text"
                value={beneficiary}
                onChange={(e) => setBeneficiary(e.target.value)}
                placeholder="Exact name as in bank records"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-300/90">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Payouts are settled directly to this account via <strong>Razorpay Route</strong> or manual NEFT batch after platform commission.
              </span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setTab('documents')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl saffron-gradient text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                {submitting ? 'Submitting KYC...' : 'Submit KYC for Admin Review'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
