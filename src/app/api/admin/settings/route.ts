import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(_req: Request) {
  try {
    const settings = store.getSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      platformCommissionPct,
      convenienceFeeFixed,
      gstPct,
      razorpayRouteEnabled,
      featuredListingPrice,
      payoutFrequency,
      contactEmail,
      contactPhone,
    } = body;

    // Basic validation
    if (platformCommissionPct !== undefined && (platformCommissionPct < 0 || platformCommissionPct > 50)) {
      return NextResponse.json({ error: 'Commission must be between 0-50%' }, { status: 400 });
    }
    if (gstPct !== undefined && (gstPct < 0 || gstPct > 28)) {
      return NextResponse.json({ error: 'GST must be between 0-28%' }, { status: 400 });
    }

    store.updateSettings({
      ...(platformCommissionPct !== undefined && { platformCommissionPct: Number(platformCommissionPct) }),
      ...(convenienceFeeFixed !== undefined && { convenienceFeeFixed: Number(convenienceFeeFixed) }),
      ...(gstPct !== undefined && { gstPct: Number(gstPct) }),
      ...(razorpayRouteEnabled !== undefined && { razorpayRouteEnabled: Boolean(razorpayRouteEnabled) }),
      ...(featuredListingPrice !== undefined && { featuredListingPrice: Number(featuredListingPrice) }),
      ...(payoutFrequency !== undefined && { payoutFrequency }),
      ...(contactEmail && { contactEmail }),
      ...(contactPhone && { contactPhone }),
    });

    // In Phase 2: Persist to Supabase admin_settings table

    return NextResponse.json({
      success: true,
      message: 'Platform settings updated',
      settings: store.getSettings(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
