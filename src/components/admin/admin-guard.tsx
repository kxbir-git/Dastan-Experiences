'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Unlock, Eye, EyeOff, KeyRound, ArrowLeft, LogOut, CheckCircle2 } from 'lucide-react';
import { isAdminUnlocked, verifyAndUnlockAdmin, lockAdmin } from '@/lib/admin-auth';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    // Check initial unlock status
    setUnlocked(isAdminUnlocked());

    const handleStatusChange = (e: any) => {
      setUnlocked(Boolean(e?.detail?.unlocked));
    };

    window.addEventListener('dastan_admin_status_changed', handleStatusChange);
    return () => window.removeEventListener('dastan_admin_status_changed', handleStatusChange);
  }, []);

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin.trim()) {
      setError('Kripya apna Admin PIN darj karein');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      const res = verifyAndUnlockAdmin(pin);
      if (res.success) {
        setUnlocked(true);
        setPin('');
      } else {
        setError(res.error || 'Galat Passkey / Incorrect PIN');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
      setLoading(false);
    }, 250);
  };

  const handleLock = () => {
    lockAdmin();
    setUnlocked(false);
    router.push('/');
  };

  const handleKeypadPress = (val: string) => {
    if (val === 'C') {
      setPin('');
      setError('');
    } else if (val === '⌫') {
      setPin((prev) => prev.slice(0, -1));
      setError('');
    } else {
      if (pin.length < 8) {
        setPin((prev) => prev + val);
        setError('');
      }
    }
  };

  // While determining initial client status
  if (unlocked === null) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#775a00] border-t-transparent animate-spin" />
      </div>
    );
  }

  // If locked, render the luxury Admin Gate
  if (!unlocked) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div
          className={`w-full max-w-md bg-white border border-[#E6DFD5] rounded-3xl p-6 sm:p-8 shadow-[0_16px_48px_rgba(119,90,0,0.12)] transition-transform duration-200 ${
            shake ? 'translate-x-[-8px] animate-[shake_0.4s_ease-in-out]' : ''
          }`}
        >
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#ffdf9a]/30 border border-[#c59a27]/40 shadow-inner">
              <img
                src="/dastan-emblem.png"
                alt="Dastan Emblem"
                className="w-10 h-10 object-contain drop-shadow"
              />
            </div>
            <div>
              <div className="font-label-mono-sm text-[10px] uppercase tracking-widest text-[#775a00] font-bold">
                Executive Security Gate
              </div>
              <h1 className="font-headline-sm text-2xl font-bold text-[#18181B] mt-0.5">
                Admin Panel Lock
              </h1>
              <p className="text-xs text-[#71717A] mt-1.5 max-w-xs mx-auto">
                Yeh section restricted hai. Admin panel access karne ke liye apna master passkey darj karein.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#4e4635] mb-2 text-center">
                Enter Master Passkey / PIN
              </label>

              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  autoFocus
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError('');
                  }}
                  placeholder="• • • •"
                  className="w-full text-center tracking-[0.4em] font-mono text-xl sm:text-2xl font-bold py-3.5 px-10 rounded-2xl bg-[#FAF7F2] border-2 border-[#E6DFD5] text-[#18181B] focus:outline-none focus:border-[#775a00] focus:bg-white transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#807663] hover:text-[#18181B] p-1"
                  tabIndex={-1}
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <p className="text-[11px] font-semibold text-rose-600 mt-2 text-center animate-fade-in">
                  {error}
                </p>
              )}
            </div>

            {/* Numeric Keypad for convenience */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleKeypadPress(k)}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
                    k === 'C'
                      ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                      : k === '⌫'
                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                      : 'bg-[#FAF7F2] hover:bg-[#ffdf9a]/30 text-[#18181B] border border-[#E6DFD5]'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Unlock Button */}
            <button
              type="submit"
              disabled={loading || !pin}
              className="w-full mt-2 py-3.5 rounded-2xl bg-[#775a00] hover:bg-[#5c4600] disabled:opacity-50 text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Unlock Admin Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Hint & Back link */}
          <div className="mt-6 pt-5 border-t border-[#E6DFD5] flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E6DFD5] text-[11px] text-[#71717A]">
              <span>Default Master PIN:</span>
              <span className="font-mono font-bold text-[#775a00]">8899</span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#807663] hover:text-[#18181B] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Experiences</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If unlocked, render children with top lock bar
  return (
    <div>
      {/* Active Admin Top Bar */}
      <div className="bg-[#FAF7F2] border-b border-[#c59a27]/30 px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-[#775a00]">Dastan Admin Console Active</span>
          <span className="text-[10px] text-[#71717A] hidden sm:inline">• Master Session Unlocked</span>
        </div>
        <button
          onClick={handleLock}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E6DFD5] hover:border-rose-300 hover:bg-rose-50 text-rose-600 font-semibold text-[11px] transition-all cursor-pointer shadow-xs"
          title="Lock Admin session and return to customer view"
        >
          <LogOut className="w-3 h-3" />
          <span>Lock Admin</span>
        </button>
      </div>

      {children}
    </div>
  );
}
