'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, ArrowRight, Store } from 'lucide-react';
import { store } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';
import { CitySelect } from '@/components/ui/city-select';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Lucknow');
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const isLiveSupabase =
        typeof process.env.NEXT_PUBLIC_SUPABASE_URL === 'string' &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo.supabase.co');

      if (isLiveSupabase) {
        const { data, error: supaErr } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName,
              city,
              role,
            },
          },
        });

        if (supaErr) {
          setError(supaErr.message);
          setLoading(false);
          return;
        }
      }

      await new Promise((r) => setTimeout(r, 600));
      store.setCurrentRole(role);
      router.push(`/${role}`);
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="font-display-lg text-3xl font-bold text-[#18181B]">Join Dastan Experiences</h1>
        <p className="font-body-md text-xs sm:text-sm text-[#4e4635]">
          Storytelling • Culture • Luxury — Every event becomes a story worth remembering.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DFD5] shadow-sm space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4 text-xs font-body-md">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF7F2] rounded-xl border border-[#E6DFD5]">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${role === 'customer'
                  ? 'bg-gradient-to-r from-[#c59a27] to-[#775a00] text-white shadow-sm'
                  : 'text-[#4e4635] hover:text-[#18181B]'
                }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Guest Member</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('vendor')}
              className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${role === 'vendor'
                  ? 'bg-gradient-to-r from-[#c59a27] to-[#775a00] text-white shadow-sm'
                  : 'text-[#4e4635] hover:text-[#18181B]'
                }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Event/Venue Host</span>
            </button>
          </div>

          <div>
            <label className="text-[#4e4635] font-semibold block mb-1 font-label-mono-sm uppercase">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Siddharth Kapoor"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl px-3 py-2.5 text-[#18181B] focus:outline-none focus:border-[#775a00]"
            />
          </div>

          <div>
            <label className="text-[#4e4635] font-semibold block mb-1 font-label-mono-sm uppercase">
              Email ID
            </label>
            <input
              type="email"
              required
              placeholder="siddharth@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl px-3 py-2.5 text-[#18181B] focus:outline-none focus:border-[#775a00]"
            />
          </div>

          <div>
            <label className="text-[#4e4635] font-semibold block mb-1 font-label-mono-sm uppercase">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl px-3 py-2.5 text-[#18181B] focus:outline-none focus:border-[#775a00]"
            />
          </div>

          <div>
            <CitySelect
              value={city}
              onChange={(newCity) => {
                setCity(newCity);
                store.setSelectedCity(newCity);
              }}
              label="Preferred City / Region (India)"
              placeholder="Search or pick your Indian city..."
              allowAllCities={false}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c59a27] via-[#b8860b] to-[#775a00] text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-[#775a00]/20 hover:shadow-[#775a00]/40 transition-all text-xs sm:text-sm disabled:opacity-50"
          >
            {loading ? (
              <span>Creating your account...</span>
            ) : (
              <>
                <span>Create {role === 'vendor' ? 'Host' : 'Member'} Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-[#71717A]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#775a00] font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
