'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Sparkles,
  Shield,
  Phone,
  MapPin,
  Heart,
  Camera,
  Save,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { store } from '@/lib/store';
import { SUPPORTED_CITIES } from '@/lib/mock-data';

const INTEREST_OPTIONS = [
  'Live Jazz', 'Standup Comedy', 'Craft Beer', 'Wine Tasting',
  'Food Festivals', 'Rooftop Events', 'Nightlife', 'Cultural Experiences',
  'Architecture', 'Photography', 'Travel', 'Startups & Tech',
  'Fitness & Wellness', 'Art & Design', 'Book Clubs', 'Cycling',
];

export default function CustomerProfilePage() {
  const user = store.getCurrentUser();
  const [fullName, setFullName] = useState(user.fullName);
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [bio, setBio] = useState(user.bio || '');
  const [city, setCity] = useState(user.city);
  const [interests, setInterests] = useState<string[]>(user.interests || []);
  const [socialOptIn, setSocialOptIn] = useState(user.isSocialOptedIn);
  const [saved, setSaved] = useState(false);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In Phase 2 this will call a server action to update Supabase
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl saffron-gradient flex items-center justify-center">
          <User className="w-5 h-5 text-slate-950" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Profile & Privacy Settings</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage your Dastan Experiences identity and social discovery preferences</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Photo (decorative) */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-400" /> Profile Photo
          </h2>
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-20 h-20 rounded-full object-cover border-2 border-amber-400/50"
              />
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-300 font-medium">Upload profile photo</p>
              <p className="text-[11px] text-slate-500 mt-0.5">JPG, PNG · Max 5MB · Supabase Storage in Phase 2</p>
              <button
                type="button"
                className="mt-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                Choose File
              </button>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-amber-400" /> Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Display Name (Public)</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                placeholder="How you appear in social discovery"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              <MapPin className="w-3.5 h-3.5 inline mr-1 text-amber-400" /> City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
            >
              {SUPPORTED_CITIES.map((c) => (
                <option key={c} value={c} className="bg-slate-900">{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Short Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={160}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
              placeholder="Tell the community who you are — shown only in Social Discovery (max 160 chars)"
            />
            <div className="text-right text-[10px] text-slate-500 mt-1">{bio.length}/160</div>
          </div>
        </div>

        {/* Interests */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" /> Interests & Passions
          </h2>
          <p className="text-xs text-slate-400">
            Select interests to help fellow Dastan community members find their match at social tables. Max 8 visible.
          </p>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  interests.includes(interest)
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Social Discovery Settings */}
        <div className="glass-card rounded-3xl p-6 border border-indigo-500/30 space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Social Discovery Table</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Opt-in to connect with like-minded attendees at the same event or dining experience.
              </p>
            </div>
          </div>

          {/* Toggle */}
          <label className="flex items-center justify-between cursor-pointer p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
            <div>
              <div className="text-sm font-semibold text-white">
                {socialOptIn ? '✓ Social Discovery Active' : 'Social Discovery Off'}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {socialOptIn
                  ? 'Other opted-in guests at your bookings can see your first name, bio & interests.'
                  : 'Your bookings are 100% private. No one can see you in Social Discovery.'}
              </div>
            </div>
            <div className="relative ml-4 flex-shrink-0">
              <input
                type="checkbox"
                checked={socialOptIn}
                onChange={(e) => setSocialOptIn(e.target.checked)}
                className="sr-only peer"
              />
              <div
                onClick={() => setSocialOptIn((v) => !v)}
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                  socialOptIn ? 'bg-indigo-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    socialOptIn ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </label>

          {/* Privacy guarantees */}
          <div className="space-y-2">
            {[
              'Phone numbers and email addresses are NEVER shown to other users',
              'Block or report any user from their profile',
              'Admin-moderated — zero tolerance for misuse',
              'Opt-out at any time, instantly effective',
            ].map((note) => (
              <div key={note} className="flex items-start gap-2 text-[11px] text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved successfully!</span>
            </div>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl saffron-gradient text-slate-950 font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="glass-card rounded-3xl p-6 border border-rose-500/20 space-y-3">
        <h2 className="text-sm font-bold text-rose-400 flex items-center gap-2">
          <Info className="w-4 h-4" /> Account Actions
        </h2>
        <p className="text-xs text-slate-400">
          To delete your account or request all personal data, contact us at{' '}
          <a href="mailto:privacy@dastanexperiences.com" className="text-amber-400 hover:underline">
            privacy@dastanexperiences.com
          </a>
          . We comply with IT Act 2000 and DPDPA 2023.
        </p>
      </div>
    </div>
  );
}
