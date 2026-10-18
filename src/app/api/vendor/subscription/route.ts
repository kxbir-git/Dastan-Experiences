import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { SUBSCRIPTION_PLANS } from '@/lib/mock-data';
import { SubscriptionTier } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId') || 'ven-indigo-hospitality';

    const subscription = store.getVendorSubscription(vendorId);
    const plans = SUBSCRIPTION_PLANS;

    return NextResponse.json({
      success: true,
      subscription,
      plans,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vendorId = 'ven-indigo-hospitality', tier } = body;

    if (!tier || !SUBSCRIPTION_PLANS[tier as SubscriptionTier]) {
      return NextResponse.json({ error: 'Valid subscription tier is required' }, { status: 400 });
    }

    const updated = store.updateVendorSubscription(vendorId, tier as SubscriptionTier);

    return NextResponse.json({
      success: true,
      message: `Successfully updated to ${updated.tierName}! Commission cut reduced to ${updated.commissionPct}%.`,
      subscription: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
