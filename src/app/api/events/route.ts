import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { fetchEventsFromSupabase } from '@/lib/supabase/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || undefined;
    const category = searchParams.get('category') || undefined;

    // 1. Try fetching from Supabase for latest persistent events
    try {
      const dbEvents = await fetchEventsFromSupabase(city === 'All' ? undefined : city);
      if (dbEvents && dbEvents.length > 0) {
        dbEvents.forEach((evt) => {
          if (!store.getEventById(evt.id) && !store.getEventBySlug(evt.slug)) {
            store.addEvent(evt);
          }
        });
      }
    } catch (e) {
      // Graceful fallback to memory store if database is unreachable
      console.warn('[Events API] Supabase fetch fallback to store:', e);
    }

    const events = store.getEvents(city, category);
    return NextResponse.json({
      success: true,
      events,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
