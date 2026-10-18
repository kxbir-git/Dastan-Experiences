'use client';

import React from 'react';
import { SocialDiscoveryProfile } from '@/types';

interface TablematesPreviewProps {
  targetId: string;
  targetTitle: string;
  profiles: SocialDiscoveryProfile[];
}

export function TablematesPreview({ targetId, targetTitle, profiles }: TablematesPreviewProps) {
  return (
    <div className="rounded-2xl bg-white p-6 sm:p-7 border border-[#E6DFD5] text-[#18181B] relative overflow-hidden shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E6DFD5]">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-label-mono-sm font-bold text-[#775a00] uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">groups</span>
            <span>Community Table Discovery</span>
          </div>
          <h3 className="font-headline-sm text-xl font-bold text-[#18181B]">
            Who's Joining This Experience?
          </h3>
          <p className="font-body-sm text-xs text-[#71717A] mt-0.5">
            Meet fascinating individuals attending this session. Opt in during booking to connect.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E6DFD5] text-[11px] font-label-mono-sm text-[#127c56] font-semibold self-start sm:self-auto">
          <span className="material-symbols-outlined text-[16px]">shield</span>
          <span>Strict Privacy: Phone &amp; Email Hidden</span>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-[#FAF7F2] rounded-xl p-4 border border-[#E6DFD5] hover:border-[#c59a27]/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2.5">
                  <img
                    src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={profile.firstName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#c59a27]"
                  />
                  <div>
                    <h4 className="font-title-md font-bold text-sm text-[#18181B] flex items-center gap-1">
                      <span>{profile.firstName}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#127c56]" />
                    </h4>
                    <span className="font-label-mono-sm text-[10px] text-[#71717A]">Confirmed Patron</span>
                  </div>
                </div>

                <p className="font-body-sm text-xs text-[#4e4635] line-clamp-2 italic leading-relaxed">
                  "{profile.bio}"
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#E6DFD5]/80 flex flex-wrap gap-1">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="font-label-mono-sm text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#E6DFD5] text-[#18181B]"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8 bg-[#FAF7F2] rounded-xl border border-[#E6DFD5]">
            <span className="material-symbols-outlined text-[28px] text-[#807663] mb-1">
              table_restaurant
            </span>
            <p className="font-headline-sm text-sm text-[#18181B]">Be the first patron to claim a seat at this table.</p>
            <p className="text-xs text-[#71717A] mt-0.5">Opt in during booking to connect with other art &amp; culture patrons.</p>
          </div>
        )}
      </div>
    </div>
  );
}
