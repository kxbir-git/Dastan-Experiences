'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  Upload,
  Link2,
  Shield,
  Layers,
  Power,
  RotateCcw,
} from 'lucide-react';
import { store } from '@/lib/store';
import { SponsorCampaign } from '@/types';
import { INITIAL_SPONSORS } from '@/lib/mock-data';

const PRESET_SPONSOR_IMAGES = [
  {
    name: 'Taj Heritage Palace',
    url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Vintage Wine & Cellar',
    url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Luxury Sitar & Ghazal Soirée',
    url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Grand Royal Haveli Banquet',
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Intimate Jazz Lounge',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
  },
];

const LOGO_ICONS = [
  { id: 'castle', label: 'Heritage Castle / Palace' },
  { id: 'wine_bar', label: 'Wine & Spirits' },
  { id: 'star', label: 'Luxury Star' },
  { id: 'diamond', label: 'Bespoke Diamond' },
  { id: 'verified', label: 'Verified Badge' },
  { id: 'auto_awesome', label: 'Magic Sparkle' },
];

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<SponsorCampaign[]>(() => {
    if (typeof store?.getSponsors === 'function') {
      return store.getSponsors();
    }
    return INITIAL_SPONSORS;
  });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [sponsorName, setSponsorName] = useState('');
  const [tagline, setTagline] = useState('Official Hospitality Partner');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('LUXURY PARTNER');
  const [perk, setPerk] = useState('Complimentary Privilege for Dastan Patrons');
  const [ctaText, setCtaText] = useState('Explore Privilege');
  const [ctaHref, setCtaHref] = useState('/events');
  const [imageUrl, setImageUrl] = useState(PRESET_SPONSOR_IMAGES[0].url);
  const [logoIcon, setLogoIcon] = useState('castle');
  const [isActive, setIsActive] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const reloadData = () => {
    if (typeof store?.getSponsors === 'function') {
      setSponsors([...store.getSponsors()]);
    } else {
      setSponsors([...INITIAL_SPONSORS]);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setSponsorName('');
    setTagline('Official Luxury Partner');
    setTitle('');
    setDescription('');
    setBadge('LUXURY PARTNER');
    setPerk('Complimentary Welcome Privilege for VIP Passholders');
    setCtaText('Explore Showcase');
    setCtaHref('/events');
    setImageUrl(PRESET_SPONSOR_IMAGES[0].url);
    setLogoIcon('castle');
    setIsActive(true);
    setShowModal(true);
  };

  const openEditModal = (sp: SponsorCampaign) => {
    setEditingId(sp.id);
    setSponsorName(sp.sponsor);
    setTagline(sp.tagline);
    setTitle(sp.title);
    setDescription(sp.description);
    setBadge(sp.badge);
    setPerk(sp.perk);
    setCtaText(sp.ctaText);
    setCtaHref(sp.ctaHref);
    setImageUrl(sp.image);
    setLogoIcon(sp.logo || 'castle');
    setIsActive(sp.isActive !== false);
    setShowModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Please upload an image smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorName.trim() || !title.trim() || !imageUrl.trim()) {
      alert('Please fill in Sponsor Name, Campaign Title, and Sponsor Image.');
      return;
    }

    if (editingId) {
      // Update existing
      store.updateSponsor(editingId, {
        sponsor: sponsorName.trim(),
        tagline: tagline.trim(),
        title: title.trim(),
        description: description.trim(),
        badge: badge.trim().toUpperCase(),
        perk: perk.trim(),
        ctaText: ctaText.trim(),
        ctaHref: ctaHref.trim(),
        image: imageUrl.trim(),
        logo: logoIcon,
        isActive,
      });
      setFeedback(`Sponsor '${sponsorName}' updated successfully!`);
    } else {
      // Add new
      const newSponsor: SponsorCampaign = {
        id: `spn-${Date.now()}`,
        sponsor: sponsorName.trim(),
        tagline: tagline.trim(),
        title: title.trim(),
        description: description.trim(),
        badge: badge.trim().toUpperCase(),
        perk: perk.trim(),
        ctaText: ctaText.trim(),
        ctaHref: ctaHref.trim(),
        image: imageUrl.trim(),
        logo: logoIcon,
        isActive,
        createdAt: new Date().toISOString(),
      };
      store.addSponsor(newSponsor);
      setFeedback(`New Sponsor '${sponsorName}' banner created & published!`);
    }

    setShowModal(false);
    reloadData();
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleToggleActive = (id: string, current: boolean) => {
    store.updateSponsor(id, { isActive: !current });
    reloadData();
    setFeedback(`Sponsor status changed.`);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the sponsor banner for "${name}"?`)) {
      store.deleteSponsor(id);
      reloadData();
      setFeedback(`Sponsor "${name}" deleted.`);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset to standard initial sponsors?')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('dastan_sponsors');
      }
      INITIAL_SPONSORS.forEach((s) => {
        if (!store.getSponsorById(s.id)) {
          store.addSponsor(s);
        }
      });
      reloadData();
      setFeedback('Reset to default sponsors.');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const activeCount = sponsors.filter((s) => s.isActive !== false).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#251a00] via-[#3a2903] to-[#18181B] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-[#c59a27]/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#ffdf9a] text-xs font-label-mono-sm uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Commercial &amp; Brand Partnerships</span>
            </div>
            <h1 className="font-display-lg text-2xl sm:text-4xl font-bold tracking-tight">
              Sponsor &amp; Ad Banners Management
            </h1>
            <p className="font-body-md text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
              Add, update or upload sponsor images and brand campaigns directly from here. Changes reflect instantly on the Homepage Hero pill, Featured Spotlight Banner, About page, and Event details page without touching code.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleResetDefaults}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white border border-white/20 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              title="Reset default sponsors"
              type="button"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={openCreateModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c59a27] to-[#ffdf9a] text-[#251a00] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              type="button"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Sponsor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Feedback */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E6DFD5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#c59a27]/10 text-[#775a00] border border-[#c59a27]/30 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-label-mono-sm text-[#807663] uppercase tracking-wider">
              Total Campaigns
            </div>
            <div className="text-2xl font-bold text-[#18181B] font-display-sm">
              {sponsors.length}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E6DFD5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <Power className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-label-mono-sm text-[#807663] uppercase tracking-wider">
              Active on Site
            </div>
            <div className="text-2xl font-bold text-emerald-700 font-display-sm">
              {activeCount} Live
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E6DFD5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#c5d4fd]/40 text-[#4f5e81] border border-[#4f5e81]/30 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-label-mono-sm text-[#807663] uppercase tracking-wider">
              Display Locations
            </div>
            <div className="text-sm font-bold text-[#18181B]">
              Hero Pill • Banner • Sidebar
            </div>
          </div>
        </div>
      </div>

      {/* Sponsors List & Live Previews */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-lg font-bold text-[#18181B] flex items-center gap-2">
            <span>Configured Sponsor Banners</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#f5f3ef] text-[#775a00] font-label-mono-sm">
              {sponsors.length}
            </span>
          </h2>
          <Link
            href="/"
            target="_blank"
            className="text-xs font-semibold text-[#775a00] hover:underline flex items-center gap-1"
          >
            <span>View Live on Homepage</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {sponsors.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#E6DFD5] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#807663] flex items-center justify-center mx-auto">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="font-headline-sm text-base font-bold text-[#18181B]">No Sponsor Banners Yet</h3>
            <p className="text-xs text-[#71717A] max-w-sm mx-auto">
              Click &quot;Add New Sponsor&quot; to create your first brand showcase or upload custom sponsor images.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-2 px-4 py-2 rounded-xl bg-[#775a00] text-white text-xs font-bold"
            >
              Add First Sponsor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {sponsors.map((sp) => {
              const active = sp.isActive !== false;
              return (
                <div
                  key={sp.id}
                  className={`rounded-3xl bg-white border transition-all overflow-hidden shadow-sm hover:shadow-md ${
                    active ? 'border-[#E6DFD5]' : 'border-dashed border-slate-300 opacity-70'
                  }`}
                >
                  <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Thumbnail Image */}
                    <div className="lg:col-span-3">
                      <div className="relative rounded-2xl overflow-hidden aspect-16/10 border border-[#E6DFD5] bg-[#FAF7F2] group shadow-inner">
                        <img
                          src={sp.image}
                          alt={sp.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[9px] font-bold text-white uppercase tracking-wider">
                          {sp.badge}
                        </div>
                        <div className="absolute bottom-2 left-2 right-2 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            active ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white'
                          }`}>
                            {active ? '● LIVE' : '○ PAUSED'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="lg:col-span-6 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-label-mono-sm text-xs font-bold text-[#775a00] uppercase tracking-wider">
                          {sp.sponsor}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-[#807663] font-medium">{sp.tagline}</span>
                      </div>

                      <h3 className="font-headline-sm text-lg font-bold text-[#18181B]">
                        {sp.title}
                      </h3>

                      <p className="font-body-sm text-xs text-[#71717A] line-clamp-2 leading-relaxed">
                        {sp.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E6DFD5] text-[11px] text-[#775a00] font-semibold">
                          <span className="material-symbols-outlined text-[15px]">card_membership</span>
                          <span>{sp.perk}</span>
                        </span>
                        <span className="text-xs text-[#807663]">
                          CTA: <strong className="text-[#18181B]">{sp.ctaText}</strong> ({sp.ctaHref})
                        </span>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E6DFD5]">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(sp.id, active)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{active ? 'Banner Active' : 'Banner Paused'}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(sp)}
                          className="p-2 rounded-xl bg-[#FAF7F2] text-[#4e4635] hover:text-[#775a00] hover:bg-[#efeeea] border border-[#E6DFD5] transition-colors cursor-pointer"
                          title="Edit Sponsor Details & Image"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(sp.id, sp.sponsor)}
                          className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                          title="Delete Sponsor Banner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E6DFD5] overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E6DFD5] bg-[#FAF7F2] flex items-center justify-between">
              <div>
                <h3 className="font-headline-sm text-xl font-bold text-[#18181B]">
                  {editingId ? 'Edit Sponsor Banner' : 'Add New Sponsor Banner'}
                </h3>
                <p className="text-xs text-[#807663] mt-0.5">
                  Directly configure the brand name, campaign image, and perks shown on the website.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#E6DFD5] text-[#807663] hover:text-[#18181B] flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Row 1: Sponsor Name & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1 font-label-mono-sm uppercase">
                    Brand / Sponsor Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    placeholder="e.g. Taj Heritage Palaces"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD5] bg-[#FAF7F2] text-xs text-[#18181B] focus:outline-none focus:border-[#775a00] focus:bg-white transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1 font-label-mono-sm uppercase">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Official Hospitality Partner"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD5] bg-[#FAF7F2] text-xs text-[#18181B] focus:outline-none focus:border-[#775a00] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Campaign Title */}
              <div>
                <label className="block text-xs font-bold text-[#18181B] mb-1 font-label-mono-sm uppercase">
                  Campaign Headline / Soirée Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Royal Sufi & Nizami Banquet at Falaknuma Palace"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD5] bg-[#FAF7F2] text-xs text-[#18181B] focus:outline-none focus:border-[#775a00] focus:bg-white transition-all font-bold"
                />
              </div>

              {/* Row 3: Description */}
              <div>
                <label className="block text-xs font-bold text-[#18181B] mb-1 font-label-mono-sm uppercase">
                  Description / Story
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the sponsored experience or brand showcase..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6DFD5] bg-[#FAF7F2] text-xs text-[#18181B] focus:outline-none focus:border-[#775a00] focus:bg-white transition-all resize-none"
                />
              </div>

              {/* IMAGE UPLOAD & PREVIEW SECTION */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#c59a27]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#775a00] font-label-mono-sm uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    <span>Sponsor Banner Image *</span>
                  </label>
                  <span className="text-[11px] text-[#807663]">
                    Upload from device or paste image URL
                  </span>
                </div>

                {/* Upload or URL Controls */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/banner-image.jpg"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-[#E6DFD5] bg-white text-xs text-[#18181B] focus:outline-none focus:border-[#775a00]"
                  />

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-white border border-[#c59a27] text-[#775a00] hover:bg-[#ffdf9a]/20 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                </div>

                {/* Quick Presets Picker */}
                <div>
                  <div className="text-[10px] font-bold text-[#807663] uppercase tracking-wider mb-1.5">
                    Or Pick from Curated Luxury Presets:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_SPONSOR_IMAGES.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setImageUrl(preset.url)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                          imageUrl === preset.url
                            ? 'bg-[#775a00] text-white font-bold'
                            : 'bg-white border border-[#E6DFD5] text-[#4e4635] hover:bg-[#efeeea]'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Image Preview */}
                {imageUrl && (
                  <div className="relative rounded-xl overflow-hidden aspect-16/8 border border-[#E6DFD5] bg-black">
                    <img
                      src={imageUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      onError={() => {
                        console.warn('Image failed to load');
                      }}
                    />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm text-[10px] text-white flex items-center gap-1.5">
                      <Eye className="w-3 h-3 text-[#ffdf9a]" />
                      <span>Live Banner Image Preview</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Row 4: Perks & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1 font-label-mono-sm uppercase">
                    Patron Benefit / Perk
                  </label>
                  <input
                    type="text"
                    value={perk}
                    onChange={(e) => setPerk(e.target.value)}
                    placeholder="e.g. Complimentary Sommelier Pairing"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6DFD5] bg-[#FAF7F2] text-xs text-[#18181B] focus:outline-none focus:border-[#775a00] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1 font-label-mono-sm uppercase">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. LUXURY PARTNER"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6DFD5] bg-[#FAF7F2] text-xs text-[#18181B] focus:outline-none focus:border-[#775a00] focus:bg-white transition-all uppercase"
                  />
                </div>
              </div>

              {/* Row 5: CTA Text & Href */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1 font-label-mono-sm uppercase">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="e.g. Claim Patron Privilege"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6DFD5] bg-[#FAF7F2] text-xs text-[#18181B] focus:outline-none focus:border-[#775a00] focus:bg-white transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1 font-label-mono-sm uppercase">
                    Target Link (URL or Route)
                  </label>
                  <input
                    type="text"
                    value={ctaHref}
                    onChange={(e) => setCtaHref(e.target.value)}
                    placeholder="e.g. /events or https://partner.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6DFD5] bg-[#FAF7F2] text-xs text-[#18181B] focus:outline-none focus:border-[#775a00] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#18181B]">Activate Banner Immediately</div>
                  <div className="text-[11px] text-[#807663]">
                    Display this sponsor on the homepage and across all platform locations.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    isActive ? 'bg-[#775a00]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E6DFD5]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E6DFD5] text-xs font-bold text-[#4e4635] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c59a27] to-[#775a00] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingId ? 'Save Changes' : 'Publish Sponsor Banner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
