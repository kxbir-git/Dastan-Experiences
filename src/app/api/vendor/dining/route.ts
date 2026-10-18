import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { Restaurant, RestaurantOffer } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
    const all = store.getAllRestaurants();
    const restaurants = vendorId ? all.filter((r) => r.vendorId === vendorId) : all;

    return NextResponse.json({
      success: true,
      restaurants,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create_restaurant') {
      const {
        vendorId = 'ven-indigo-hospitality',
        vendorName = 'Indigo Experiences Mumbai',
        name,
        description,
        cuisineTypes,
        city,
        area,
        address,
        images,
        avgCostForTwo,
        socialTableEnabled = true,
        offers = [],
      } = body;

      if (!name || !city || !area || !address) {
        return NextResponse.json(
          { error: 'Name, City, Area, and Address are required.' },
          { status: 400 }
        );
      }

      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 50) + `-${Date.now().toString().slice(-4)}`;

      const restaurantId = `rest-${Date.now()}`;

      const createdOffers: RestaurantOffer[] = offers.map((o: any, idx: number) => ({
        id: `off-${Date.now()}-${idx}`,
        restaurantId,
        title: o.title || `${o.discountPct}% OFF Table Booking`,
        discountPct: Number(o.discountPct) || 15,
        description: o.description || 'Exclusive dining discount for Dastan patrons.',
        availableDays: o.availableDays?.length ? o.availableDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        validFrom: o.validFrom || '12:00',
        validTo: o.validTo || '23:00',
        coverCharge: Number(o.coverCharge) || 0,
        maxCoversPerSlot: Number(o.maxCoversPerSlot) || 20,
        isActive: true,
      }));

      const newRestaurant: Restaurant = {
        id: restaurantId,
        vendorId,
        vendorName,
        name,
        slug,
        description: description || 'Artisanal culinary destination featuring bespoke seasonal menus.',
        cuisineTypes: cuisineTypes?.length ? cuisineTypes : ['Modern Indian', 'Culinary Storytelling'],
        city,
        area,
        address,
        images: images?.length
          ? images
          : [
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
            ],
        avgCostForTwo: Number(avgCostForTwo) || 2200,
        rating: 4.8,
        reviewCount: 1,
        status: 'pending_approval',
        isFeatured: false,
        socialTableEnabled: Boolean(socialTableEnabled),
        offers: createdOffers,
      };

      store.addRestaurant(newRestaurant);

      return NextResponse.json({
        success: true,
        message: 'Restaurant listing and initial deals created! Submitted for Admin Moderation.',
        restaurant: newRestaurant,
      });
    }

    if (action === 'add_deal') {
      const {
        restaurantId,
        title,
        discountPct,
        description,
        availableDays,
        validFrom,
        validTo,
        coverCharge,
        maxCoversPerSlot,
      } = body;

      if (!restaurantId || !discountPct) {
        return NextResponse.json(
          { error: 'restaurantId and discountPct are required.' },
          { status: 400 }
        );
      }

      const newOffer: RestaurantOffer = {
        id: `off-${Date.now()}`,
        restaurantId,
        title: title || `${discountPct}% OFF Tasting Menu`,
        discountPct: Number(discountPct),
        description: description || 'Special dining deal for patrons reserving via Dastan.',
        availableDays: availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        validFrom: validFrom || '12:00',
        validTo: validTo || '23:30',
        coverCharge: Number(coverCharge) || 0,
        maxCoversPerSlot: Number(maxCoversPerSlot) || 20,
        isActive: true,
      };

      const success = store.addRestaurantOffer(restaurantId, newOffer);

      if (!success) {
        return NextResponse.json({ error: 'Restaurant not found.' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Deal "${newOffer.title}" successfully added!`,
        offer: newOffer,
      });
    }

    if (action === 'toggle_deal') {
      const { restaurantId, offerId } = body;
      const success = store.toggleRestaurantOffer(restaurantId, offerId);
      if (!success) {
        return NextResponse.json({ error: 'Offer or Restaurant not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Deal status updated!' });
    }

    if (action === 'delete_deal') {
      const { restaurantId, offerId } = body;
      const success = store.deleteRestaurantOffer(restaurantId, offerId);
      if (!success) {
        return NextResponse.json({ error: 'Offer or Restaurant not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Deal deleted.' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
