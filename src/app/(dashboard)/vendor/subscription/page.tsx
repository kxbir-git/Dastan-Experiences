'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Star,
  Zap,
  ShieldCheck,
  CreditCard,
  Crown,
  ChevronRight,
  TrendingDown,
  ArrowRight,
  Building,
} from 'lucide-react';
import { store } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import { SUBSCRIPTION_PLANS } from '@/lib/mock-data';
import { SubscriptionTier, VendorSubscription } from '@/types';

export default function VendorSubscriptionPage() {
  const vendorId = 'ven-indigo-hospitality';
  const [subscription, setSubscription] = useState<VendorSubscription>(
    store.getVendorSubscription(vendorId)
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState('');
  const [boosting, setBoosting] = useState(false);

  // Vendor's events & restaurants
  const vendorEvents = store.getAllEvents().filter((e) => e.vendorId === vendorId);
  const vendorRestaurants = store.getAllRestaurants().filter((r) => r.vendorId === vendorId);

  const availableCredits = Math.max(
    0,
    subscription.featuredListingCredits - subscription.usedListingCredits
  );

  const reloadSub = () => {
    setSubscription({ ...store.getVendorSubscription(vendorId) });
  };

  const handleSelectTier = async (tier: SubscriptionTier) => {
    if (tier === subscription.tier) return;

    try {
      const res = await fetch('/api/vendor/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId, tier }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback(data.message);
        reloadSub();
        setTimeout(() => setFeedback(null), 4000);
      } else {
        alert(data.error || 'Failed to change plan');
      }
    } catch {
      alert('Subscription update failed');
    }
  };

  const handleBoostListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;

    try {
      setBoosting(true);
      const isEvent = vendorEvents.some((ev) => ev.id === selectedListing);
      const listingType = isEvent ? 'event' : 'dining';

      const res = await fetch('/api/vendor/feature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          listingId: selectedListing,
          listingType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Boosting failed');
      } else {
        setFeedback(data.message);
        reloadSub();
        setSelectedListing('');
        setTimeout(() => setFeedback(null), 4000);
      }
    } catch {
      alert('Error boosting listing');
    } finally {
      setBoosting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Host Growth & SaaS Monetization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Subscription Plans & Featured Boosts
          </h1>
          <p className="text-xs text-slate-400">
            Cut your platform commission rates, gain monthly featured listing credits, and unlock instant Razorpay Route settlements.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl relative z-10">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <div className="text-left">
            <span className="text-[10px] text-amber-400 font-bold uppercase block leading-none">Current Active Plan</span>
            <span className="text-sm font-black text-white">{subscription.tierName}</span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Active Plan Overview & Boost Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Plan Details (1 col) */}
        <div className="glass-card rounded-3xl p-6 border border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Your Plan Perks</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Active
            </span>
          </div>

          <div>
            <div className="text-3xl font-black text-white">{subscription.tierName}</div>
            <div className="text-xs text-slate-400 mt-0.5">
              {subscription.monthlyPrice > 0 ? `${formatINR(subscription.monthlyPrice)} / month` : 'Free Plan'}
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Commission Rate</span>
              <span className="text-emerald-400 font-bold">{subscription.commissionPct}% per booking</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Razorpay Route Instant Split</span>
              <span className={subscription.razorpayRouteInstantSettlements ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {subscription.razorpayRouteInstantSettlements ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Priority Social Placement</span>
              <span className={subscription.prioritySocialPlacement ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                {subscription.prioritySocialPlacement ? 'Active Boost' : 'Standard'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Next Billing Renewal</span>
              <span className="text-slate-300 font-mono text-[11px]">
                {new Date(subscription.renewsAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Featured Credits & Boost Tool (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Featured Listing Credits</span>
              </div>
              <h2 className="text-lg font-bold text-white">Boost Your Listings to Platform Top Spots</h2>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-right shrink-0">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Credits Available</span>
              <span className="text-2xl font-black text-amber-400">
                {availableCredits} / {subscription.featuredListingCredits}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Featured listings receive a glowing golden badge, top ranking on city search results, and 3x more guest impressions.
          </p>

          <form onSubmit={handleBoostListing} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Select Your Event or Restaurant to Boost
              </label>
              <select
                value={selectedListing}
                onChange={(e) => setSelectedListing(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white cursor-pointer focus:outline-none focus:border-amber-500"
              >
                <option value="">-- Choose listing to promote --</option>
                <optgroup label="My Live Events">
                  {vendorEvents.map((ev) => (
                    <option key={ev.id} value={ev.id} disabled={ev.isFeatured}>
                      {ev.title} {ev.isFeatured ? '(Already Featured ⭐)' : ''}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="My Restaurants">
                  {vendorRestaurants.map((res) => (
                    <option key={res.id} value={res.id} disabled={res.isFeatured}>
                      {res.name} {res.isFeatured ? '(Already Featured ⭐)' : ''}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={boosting || !selectedListing || availableCredits <= 0}
                className="px-5 py-2.5 rounded-xl saffron-gradient text-slate-950 font-bold text-xs hover:brightness-110 transition-all disabled:opacity-40 shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{boosting ? 'Boosting...' : 'Redeem 1 Credit & Boost Listing'}</span>
              </button>

              {availableCredits <= 0 && (
                <span className="text-xs text-amber-400/80 italic">
                  No credits left? Upgrade below for more monthly credits.
                </span>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Plan Comparison Cards */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white">Compare Host Subscription Tiers</h2>
          <p className="text-xs text-slate-400">Choose the ideal plan for your venue or events portfolio</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {(Object.keys(SUBSCRIPTION_PLANS) as SubscriptionTier[]).map((tierKey) => {
            const plan = SUBSCRIPTION_PLANS[tierKey];
            const isCurrent = subscription.tier === tierKey;
            const isPopular = tierKey === 'curator_pro';

            return (
              <div
                key={tierKey}
                className={`glass-card rounded-3xl p-6 sm:p-8 border flex flex-col justify-between transition-all relative ${
                  isCurrent
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : isPopular
                    ? 'border-amber-500/40 bg-amber-500/5'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {isPopular && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-3 py-0.5 rounded-full shadow-lg shadow-amber-500/30">
                    Most Popular
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-400 text-slate-950 font-black text-[10px] uppercase px-3 py-0.5 rounded-full shadow-lg shadow-emerald-500/30">
                    Your Current Plan
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.description}</p>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">
                        {plan.monthlyPrice === 0 ? 'Free' : formatINR(plan.monthlyPrice)}
                      </span>
                      {plan.monthlyPrice > 0 && <span className="text-xs text-slate-400">/month</span>}
                    </div>
                    <div className="text-xs font-bold text-emerald-400 mt-1">
                      {plan.commissionPct}% Commission Cut
                    </div>
                  </div>

                  {/* Feature list */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
                    {plan.perks.map((perk, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/60">
                  <button
                    disabled={isCurrent}
                    onClick={() => handleSelectTier(tierKey)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                      isCurrent
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                        : isPopular
                        ? 'saffron-gradient text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {isCurrent ? 'Current Plan' : `Switch to ${plan.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
