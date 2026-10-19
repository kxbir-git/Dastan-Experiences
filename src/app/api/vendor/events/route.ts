import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { EventListing, TicketTier } from '@/types';
import { saveEventToSupabase, updateEventStatusInSupabase } from '@/lib/supabase/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
    const all = store.getAllEvents();
    const filtered = vendorId ? all.filter((e) => e.vendorId === vendorId) : all;
    return NextResponse.json({ success: true, events: filtered });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      category,
      categoryLabel,
      city,
      venueName,
      venueAddress,
      description,
      bannerUrl,
      galleryUrls = [],
      startTime,
      endTime,
      ageRestriction = '18+',
      termsConditions = '',
      ticketTiers = [],
      status = 'published', // Default to published so it shows up immediately on customer view!
      isFeatured = false,
      vendorId = 'ven-demo-vendor',
      vendorName = 'Demo Experiences Host',
    } = body;

    if (!title || !venueName || !startTime || !ticketTiers.length) {
      return NextResponse.json(
        { error: 'Title, venue name, start time, and at least one ticket tier are required.' },
        { status: 400 }
      );
    }

    const slug = `${title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50)}-${Date.now()}`;

    const parsedTiers: TicketTier[] = ticketTiers.map((t: any, idx: number) => ({
      id: `tier-${Date.now()}-${idx}`,
      eventId: `evt-${Date.now()}`,
      tierName: t.tierName || t.name || 'General Admission',
      price: Math.max(0, Number(t.price) || 0),
      totalCapacity: Math.max(1, Number(t.totalCapacity || t.capacity) || 50),
      soldCount: 0,
      perks: Array.isArray(t.perks)
        ? t.perks
        : typeof t.perks === 'string'
        ? t.perks.split(',').map((p: string) => p.trim()).filter(Boolean)
        : [],
    }));

    const startingPrice = Math.min(...parsedTiers.map((t) => t.price));

    const newEvent: EventListing = {
      id: `evt-${Date.now()}`,
      vendorId,
      vendorName,
      title: title.trim(),
      slug,
      category: category || 'live_music',
      categoryLabel: categoryLabel || 'Live Experience',
      description: description || '',
      city: city || 'Mumbai',
      venueName: venueName.trim(),
      venueAddress: venueAddress || `${venueName}, ${city}`,
      bannerUrl:
        bannerUrl ||
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      galleryUrls,
      startTime,
      endTime: endTime || startTime,
      status: status || 'published',
      isFeatured: Boolean(isFeatured),
      ageRestriction,
      termsConditions,
      startingPrice,
      ticketTiers: parsedTiers,
    };

    // 1. Add to in-memory store for instant zero-latency UI reactivity
    store.addEvent(newEvent);

    // 2. Persist to Supabase PostgreSQL database
    const dbRes = await saveEventToSupabase(newEvent);
    if (dbRes.success && dbRes.eventId) {
      newEvent.id = dbRes.eventId;
    }

    return NextResponse.json({
      success: true,
      message: 'Event published successfully and is live on customer view!',
      event: newEvent,
    });
  } catch (err: any) {
    console.error('Error in POST /api/vendor/events:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { eventId, status, isFeatured } = body;

    if (!eventId) {
      return NextResponse.json({ error: 'eventId is required' }, { status: 400 });
    }

    if (status) {
      store.updateEventStatus(eventId, status);
      await updateEventStatusInSupabase(eventId, status);
    }

    if (isFeatured !== undefined) {
      store.toggleFeaturedEvent(eventId, isFeatured);
    }

    const updated = store.getEventById(eventId) || store.getEventBySlug(eventId);
    return NextResponse.json({
      success: true,
      message: 'Event status updated successfully',
      event: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update event' },
      { status: 500 }
    );
  }
}
