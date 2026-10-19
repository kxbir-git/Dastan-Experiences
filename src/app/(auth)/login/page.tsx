'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

import { store } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';
import { CitySelect } from '@/components/ui/city-select';
import { verifyAndUnlockAdmin, DEFAULT_ADMIN_PIN } from '@/lib/admin-auth';

// Customer and Vendor public demo accounts (Admin hidden for safety)
const DEMO_CREDENTIALS = [
  { role: 'Customer', email: 'rohan.sharma@example.com', password: 'Demo123!' },
  { role: 'Vendor', email: 'ananya@indigoexperiences.in', password: 'Demo123!' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = store.getSelectedCity();
      if (saved) {
        setSelectedCity(saved);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Persist chosen city to store and local storage
    store.setSelectedCity(selectedCity);

    try {
      const isLiveSupabase =
        typeof process.env.NEXT_PUBLIC_SUPABASE_URL === 'string' &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo.supabase.co');

      if (isLiveSupabase) {
        const { data, error: supaErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (data?.user) {
          const role = (data.user.user_metadata?.role || 'customer') as 'customer' | 'vendor' | 'admin';
          store.setCurrentRole(role);
          store.setSelectedCity(selectedCity);
          if (role === 'admin') {
            verifyAndUnlockAdmin(DEFAULT_ADMIN_PIN);
          }
          router.push(`/${role}`);
          return;
        }

        if (supaErr && !DEMO_CREDENTIALS.some((c) => c.email.toLowerCase() === email.toLowerCase())) {
          setError(supaErr.message);
          setLoading(false);
          return;
        }
      }

      // Demo credentials simulation
      await new Promise((r) => setTimeout(r, 600));

      // Admin manual credentials check
      if (email.trim().toLowerCase() === 'admin@dastan.in' && (password === 'AdminDastan!' || password === 'Demo123!')) {
        store.setCurrentRole('admin');
        store.setSelectedCity(selectedCity);
        verifyAndUnlockAdmin(DEFAULT_ADMIN_PIN);
        router.push('/admin');
        return;
      }

      const demo = DEMO_CREDENTIALS.find(
        (c) => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === password
      );

      if (demo) {
        const role = demo.role.toLowerCase() as 'customer' | 'vendor';
        store.setCurrentRole(role);
        store.setSelectedCity(selectedCity);
        router.push(`/${role}`);
      } else {
        setError('Invalid credentials. Use demo credentials or configure Supabase Auth.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
      setLoading(false);
    }
  };

  const fillDemo = (cred: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="font-display-lg text-3xl font-bold text-[#18181B]">Welcome Back</h1>
        <p className="font-body-md text-xs sm:text-sm text-[#4e4635]">
          Sign in to your Dastan Experiences account
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DFD5] shadow-sm space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Indian Cities Selector */}
          <div>
            <CitySelect
              value={selectedCity}
              onChange={(city) => {
                setSelectedCity(city);
                store.setSelectedCity(city);
              }}
              label="Select City / Region (India)"
              placeholder="Search or pick Indian city..."
              allowAllCities={true}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4e4635] mb-1.5 font-label-mono-sm uppercase">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#807663]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#18181B] placeholder-[#807663] focus:outline-none focus:border-[#775a00] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#4e4635] font-label-mono-sm uppercase">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-[#775a00] font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#807663]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-[#18181B] placeholder-[#807663] focus:outline-none focus:border-[#775a00] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#807663] hover:text-[#18181B] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c59a27] via-[#b8860b] to-[#775a00] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#775a00]/20 hover:shadow-[#775a00]/40 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E6DFD5]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-[#71717A]">Don&apos;t have an account?</span>
          </div>
        </div>

        <Link
          href="/signup"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FAF7F2] hover:bg-[#efeeea] text-[#18181B] text-xs sm:text-sm font-semibold border border-[#E6DFD5] transition-colors"
        >
          Create New Account
        </Link>
      </div>

      {/* Demo accounts */}
      <div className="rounded-2xl bg-white p-4 sm:p-5 border border-[#E6DFD5] space-y-3 shadow-sm">
        <div className="font-label-mono-sm text-[10px] font-bold text-[#775a00] uppercase tracking-wider">
          Quick Demo Accounts
        </div>
        <div className="space-y-2">
          {DEMO_CREDENTIALS.map((cred) => (
            <button
              key={cred.role}
              onClick={() => fillDemo(cred)}
              className="w-full text-left flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#ffdf9a]/30 border border-[#E6DFD5] hover:border-[#c59a27] transition-all group"
            >
              <div>
                <div className="text-xs font-bold text-[#18181B]">{cred.role} Persona</div>
                <div className="text-[10px] text-[#71717A] font-label-mono-sm">{cred.email}</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#807663] group-hover:text-[#775a00] transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
