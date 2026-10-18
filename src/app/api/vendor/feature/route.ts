import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      vendorId = 'ven-indigo-hospitality',
      listingId,
      listingType, // 'event' | 'dining'
      isAdmin = false,
      isFeatured,
    } = body;

    if (!listingId || !listingType) {
      return NextResponse.json({ error: 'listingId and listingType are required' }, { status: 400 });
    }

    if (isAdmin) {
      if (listingType === 'event') {
        store.toggleFeaturedEvent(listingId, isFeatured);
      } else {
        store.toggleFeaturedRestaurant(listingId, isFeatured);
      }
      return NextResponse.json({
        success: true,
        message: `Listing featured status set to ${isFeatured}`,
      });
    }

    // Vendor usage of subscription credit
    const result = store.useFeaturedCredit(vendorId, listingId, listingType);
    if (!result.success) {
      return NextResponse.json({ error: result.message, remainingCredits: result.remainingCredits }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      remainingCredits: result.remainingCredits,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
