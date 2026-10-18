import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { ListingStatus } from '@/types';

export async function GET() {
  try {
    const events = store.getAllEvents();
    const restaurants = store.getAllRestaurants();

    return NextResponse.json({
      success: true,
      events,
      restaurants,
      pendingEventsCount: events.filter((e) => e.status === 'pending_approval').length,
      pendingRestaurantsCount: restaurants.filter((r) => r.status === 'pending_approval').length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, id, status, feedback } = body;

    if (!type || !id || !status) {
      return NextResponse.json(
        { error: 'type ("event" | "dining"), id, and status are required' },
        { status: 400 }
      );
    }

    const success = store.updateListingModeration(
      type as 'event' | 'dining',
      id,
      status as ListingStatus
    );

    if (!success) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `${type === 'event' ? 'Event' : 'Restaurant'} status updated to "${status}". ${
        feedback ? `Vendor note: ${feedback}` : ''
      }`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
