import { supabase } from './client';
import { supabaseAdmin } from './admin';
import { EventListing, Restaurant, Booking, AdminSettings } from '@/types';

export interface DatabaseStatus {
  connected: boolean;
  provider: string;
  projectUrl: string;
  latencyMs: number;
  tableCounts: Record<string, number | null>;
  error?: string;
}

/**
 * Checks connectivity to the live Supabase database
 */
export async function checkDatabaseConnection(): Promise<DatabaseStatus> {
  const startTime = Date.now();
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const maskedUrl = rawUrl.replace(/https?:\/\//, '').split('.')[0] + '.supabase.co';

  try {
    const tables = [
      'profiles',
      'vendors',
      'events',
      'ticket_tiers',
      'restaurants',
      'restaurant_offers',
      'bookings',
      'payments',
      'promo_codes',
      'admin_settings',
    ];

    const tableCounts: Record<string, number | null> = {};

    await Promise.all(
      tables.map(async (table) => {
        try {
          const { count, error } = await supabaseAdmin
            .from(table)
            .select('*', { count: 'exact', head: true });
          tableCounts[table] = error ? null : (count ?? 0);
        } catch {
          tableCounts[table] = null;
        }
      })
    );

    const latencyMs = Date.now() - startTime;

    return {
      connected: true,
      provider: 'Supabase PostgreSQL',
      projectUrl: maskedUrl,
      latencyMs,
      tableCounts,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      provider: 'Supabase PostgreSQL',
      projectUrl: maskedUrl,
      latencyMs: Date.now() - startTime,
      tableCounts: {},
      error: errorMsg,
    };
  }
}

/**
 * Fetch all published events with ticket tiers from Supabase
 */
export async function fetchEventsFromSupabase(city?: string): Promise<EventListing[]> {
  try {
    let query = supabase
      .from('events')
      .select('*, ticket_tiers(*), vendors(business_name)')
      .eq('status', 'published');

    if (city && city !== 'All') {
      query = query.ilike('city', city);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((evt) => ({
      id: evt.id,
      vendorId: evt.vendor_id,
      vendorName: evt.vendors?.business_name || 'Verified Vendor',
      title: evt.title,
      slug: evt.slug,
      category: evt.category,
      categoryLabel: evt.category_label || evt.category.toUpperCase(),
      description: evt.description,
      city: evt.city,
      venueName: evt.venue_name,
      venueAddress: evt.venue_address,
      bannerUrl: evt.banner_url,
      galleryUrls: evt.gallery_urls || [],
      startTime: evt.start_time,
      endTime: evt.end_time,
      status: evt.status,
      isFeatured: evt.is_featured,
      startingPrice: Number(evt.starting_price) || 0,
      ticketTiers: (evt.ticket_tiers || []).map((t: any) => ({
        id: t.id,
        name: t.tier_name,
        tierName: t.tier_name,
        price: Number(t.price),
        capacity: Number(t.total_capacity),
        totalCapacity: Number(t.total_capacity),
        soldCount: Number(t.sold_count),
        perks: t.perks || [],
        salesStart: t.sales_start,
        salesEnd: t.sales_end,
      })),
      ageRestriction: evt.age_restriction || '18+',
      termsConditions: evt.terms_conditions || '',
    }));
  } catch (err) {
    console.error('Error fetching events from Supabase:', err);
    return [];
  }
}

/**
 * Fetch all published restaurants with offers from Supabase
 */
export async function fetchRestaurantsFromSupabase(city?: string): Promise<Restaurant[]> {
  try {
    let query = supabase
      .from('restaurants')
      .select('*, restaurant_offers(*), vendors(business_name)')
      .eq('status', 'published');

    if (city && city !== 'All') {
      query = query.ilike('city', city);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((r) => ({
      id: r.id,
      vendorId: r.vendor_id,
      vendorName: r.vendors?.business_name || 'Curated Hospitality Partner',
      name: r.name,
      slug: r.slug,
      socialTableEnabled: r.social_table_enabled ?? true,
      description: r.description || '',
      cuisineTypes: r.cuisine_types || [],
      city: r.city,
      area: r.area,
      address: r.address,
      bannerUrl: r.banner_url || r.images?.[0] || '',
      images: r.images || [],
      rating: Number(r.rating) || 4.5,
      reviewCount: Number(r.review_count) || 0,
      discountPct: Number(r.discount_pct) || 0,
      avgCostForTwo: Number(r.avg_cost_for_two || r.average_cost_for_two) || 2000,
      status: r.status,
      isFeatured: r.is_featured,
      offers: (r.restaurant_offers || []).map((o: any) => ({
        id: o.id,
        restaurantId: o.restaurant_id,
        title: o.title,
        discountPct: Number(o.discount_pct),
        description: o.description || '',
        availableDays: o.available_days || [],
        validFrom: o.valid_from,
        validTo: o.valid_to,
        coverCharge: Number(o.cover_charge) || 0,
        maxCoversPerSlot: Number(o.max_covers_per_slot) || 20,
        isActive: o.is_active,
      })),
    }));
  } catch (err) {
    console.error('Error fetching restaurants from Supabase:', err);
    return [];
  }
}

/**
 * Fetch Admin Settings from Supabase
 */
export async function fetchAdminSettingsFromSupabase(): Promise<Partial<AdminSettings> | null> {
  try {
    const { data, error } = await supabaseAdmin.from('admin_settings').select('*');
    if (error || !data) return null;

    const settings: Record<string, any> = {};
    for (const row of data) {
      if (row.key === 'platform_commission_pct') settings.platformCommissionPct = Number(row.value);
      if (row.key === 'convenience_fee_fixed') settings.convenienceFeeFixed = Number(row.value);
      if (row.key === 'gst_pct') settings.gstPct = Number(row.value);
      if (row.key === 'supported_cities') settings.supportedCities = row.value;
    }
    return settings;
  } catch (err) {
    console.error('Error fetching admin settings from Supabase:', err);
    return null;
  }
}

/**
 * Persist Booking to Supabase
 */
export async function saveBookingToSupabase(booking: Booking): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const record = {
      booking_number: booking.bookingNumber,
      user_id: booking.userId.includes('-') && booking.userId.length === 36 ? booking.userId : 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      booking_type: booking.bookingType,
      event_id: booking.eventId && booking.eventId.includes('-') && booking.eventId.length === 36 ? booking.eventId : null,
      restaurant_id: booking.restaurantId && booking.restaurantId.includes('-') && booking.restaurantId.length === 36 ? booking.restaurantId : null,
      offer_id: booking.offerId && booking.offerId.includes('-') && booking.offerId.length === 36 ? booking.offerId : null,
      tier_id: booking.tierId && booking.tierId.includes('-') && booking.tierId.length === 36 ? booking.tierId : null,
      quantity: booking.quantity,
      booking_date: booking.bookingDate || new Date().toISOString().split('T')[0],
      time_slot: booking.timeSlot || null,
      base_amount: booking.baseAmount,
      discount_amount: booking.discountAmount || 0,
      convenience_fee: booking.convenienceFee,
      gst_amount: booking.gstAmount,
      total_amount: booking.totalAmount,
      status: booking.status === 'confirmed' ? 'confirmed' : 'pending_payment',
      qr_code_hash: booking.qrCodeHash,
      is_social_opted_in: booking.isSocialOptedIn || false,
    };

    const { data, error } = await supabaseAdmin.from('bookings').insert(record).select('id').single();
    if (error) {
      console.warn('Supabase booking insert notice:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('Supabase booking insert exception:', msg);
    return { success: false, error: msg };
  }
}

/**
 * Persist Payment Record to Supabase
 */
export async function savePaymentToSupabase(payment: {
  bookingId?: string;
  orderId: string;
  paymentId: string;
  signature?: string;
  amount: number;
  currency?: string;
  status: 'captured' | 'failed' | 'refunded';
}): Promise<{ success: boolean; error?: string }> {
  try {
    const record = {
      razorpay_order_id: payment.orderId,
      razorpay_payment_id: payment.paymentId,
      razorpay_signature: payment.signature || null,
      amount: payment.amount,
      currency: payment.currency || 'INR',
      status: payment.status,
    };

    // If booking_id is provided and is UUID, include it
    if (payment.bookingId && payment.bookingId.length === 36) {
      (record as any).booking_id = payment.bookingId;
    }

    const { error } = await supabaseAdmin.from('payments').insert(record);
    if (error) {
      console.warn('Supabase payment insert notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Persist an Event and its Ticket Tiers to Supabase
 */
export async function saveEventToSupabase(event: EventListing): Promise<{ success: boolean; eventId?: string; error?: string }> {
  try {
    // Look up or fallback to default verified vendor UUID
    let vendorUuid = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44';
    if (event.vendorId && event.vendorId.includes('-') && event.vendorId.length === 36) {
      vendorUuid = event.vendorId;
    } else {
      const { data: v } = await supabaseAdmin.from('vendors').select('id').limit(1).single();
      if (v?.id) vendorUuid = v.id;
    }

    const eventRecord = {
      vendor_id: vendorUuid,
      title: event.title,
      slug: event.slug,
      category: event.category,
      description: event.description || '',
      city: event.city,
      venue_name: event.venueName,
      venue_address: event.venueAddress || `${event.venueName}, ${event.city}`,
      banner_url: event.bannerUrl,
      gallery_urls: event.galleryUrls || [],
      start_time: event.startTime,
      end_time: event.endTime,
      status: event.status || 'published',
      is_featured: Boolean(event.isFeatured),
      age_restriction: event.ageRestriction || '18+',
      terms_conditions: event.termsConditions || '',
    };

    const { data: createdEvent, error: evError } = await supabaseAdmin
      .from('events')
      .insert(eventRecord)
      .select('id')
      .single();

    if (evError || !createdEvent) {
      console.warn('[Supabase] Event insert notice:', evError?.message);
      return { success: false, error: evError?.message || 'Failed to insert event' };
    }

    const dbEventId = createdEvent.id;

    // Insert Ticket Tiers
    if (event.ticketTiers && event.ticketTiers.length > 0) {
      const tierRecords = event.ticketTiers.map((t) => ({
        event_id: dbEventId,
        tier_name: t.tierName || (t as any).name || 'Standard Pass',
        price: Math.round(Number(t.price) || 0),
        total_capacity: Math.round(Number(t.totalCapacity || (t as any).capacity) || 50),
        sold_count: Math.round(Number(t.soldCount) || 0),
        perks: Array.isArray(t.perks) ? t.perks : [],
      }));

      const { error: tierError } = await supabaseAdmin.from('ticket_tiers').insert(tierRecords);
      if (tierError) {
        console.warn('[Supabase] Ticket tiers insert notice:', tierError.message);
      }
    }

    return { success: true, eventId: dbEventId };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[Supabase] saveEventToSupabase exception:', msg);
    return { success: false, error: msg };
  }
}

/**
 * Update Event Status in Supabase
 */
export async function updateEventStatusInSupabase(
  eventId: string,
  status: EventListing['status']
): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('events')
      .update({ status })
      .or(`id.eq.${eventId},slug.eq.${eventId}`);
    return !error;
  } catch {
    return false;
  }
}

