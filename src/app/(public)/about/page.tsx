import React from 'react';
import { AdvertisementBox } from '@/components/ui/advertisement-box';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-[#18181B] bg-[#FDFBF7]">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E6DFD5] text-[#775a00] text-xs font-label-mono-sm font-bold uppercase shadow-sm">
          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
          <span>Storytelling • Culture • Luxury</span>
        </div>
        <h1 className="font-display-lg text-3xl sm:text-5xl font-bold tracking-tight text-[#18181B]">
          Every Event Has a Story.
        </h1>
        <p className="font-title-md text-base sm:text-lg text-[#775a00] font-semibold max-w-xl mx-auto">
          Every event becomes a story worth remembering.
        </p>
        <p className="font-body-md text-xs sm:text-sm text-[#4e4635] max-w-xl mx-auto leading-relaxed">
          Dastan Experiences was born from the timeless art of traditional Indian storytelling fused with modern luxury hospitality. We curate intimate cultural soirées, live performances, and high-table dining where strangers become companions and moments become legends.
        </p>
      </div>

      {/* Brand Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#E6DFD5] space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-[#c59a27]/10 text-[#775a00] border border-[#c59a27]/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">menu_book</span>
          </div>
          <h3 className="font-headline-sm text-base font-bold text-[#18181B]">Storytelling</h3>
          <p className="font-body-sm text-xs text-[#4e4635] leading-relaxed">
            From Persian ghazal evenings to secret speakeasy narratives and live theater, every gathering is curated around a compelling narrative arc.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E6DFD5] space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-[#4f5e81]/10 text-[#4f5e81] border border-[#4f5e81]/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">palette</span>
          </div>
          <h3 className="font-headline-sm text-base font-bold text-[#18181B]">Culture</h3>
          <p className="font-body-sm text-xs text-[#4e4635] leading-relaxed">
            Celebrating the rich tapestry of India&apos;s art, heritage culinary traditions, indie cinema, and classical and modern acoustic sounds.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E6DFD5] space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-[#127c56]/10 text-[#127c56] border border-[#127c56]/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">crown</span>
          </div>
          <h3 className="font-headline-sm text-base font-bold text-[#18181B]">Luxury</h3>
          <p className="font-body-sm text-xs text-[#4e4635] leading-relaxed">
            Uncompromising hospitality, boutique partner venues, sommelier pairings, and private community tables designed for discerning patrons.
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 border border-[#E6DFD5] shadow-sm space-y-5 text-xs text-[#4e4635] leading-relaxed font-body-md">
        <h2 className="font-headline-sm text-xl font-bold text-[#18181B]">The Meaning Behind &quot;Dastan&quot;</h2>
        <p>
          In classical literature and folklore, a <em>Dastan</em> (داستان) is an epic tale of adventure, love, chivalry, and shared triumph. We believe going out in the modern world shouldn&apos;t be a transactional checklist. When you step into a Dastan Experience, you are not merely an attendee—you are an essential chapter in tonight&apos;s story.
        </p>
        <p>
          Headquartered in Mumbai with enclaves across Delhi-NCR, Bengaluru, Pune, Hyderabad, and Goa, our mission is to revive courtly warmth, elevate culinary mastery, and spark meaningful human connection through the magic of shared experience.
        </p>
      </div>

      {/* Official Brand Patronage & Advertisement Showcase */}
      <div className="pt-2">
        <AdvertisementBox variant="banner" />
      </div>
    </div>
  );
}
