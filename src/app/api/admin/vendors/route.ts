import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  try {
    const vendors = store.getVendors();
    const enriched = vendors.map((v) => {
      const sub = store.getVendorSubscription(v.id);
      const payouts = store.getPayoutRecords(v.id);
      const totalEarned = payouts.reduce((sum, p) => sum + p.grossBookingsGmv, 0);
      const commissionPaid = payouts.reduce((sum, p) => sum + p.commissionDeducted, 0);

      return {
        ...v,
        subscription: sub,
        effectiveCommissionPct: v.commissionOverridePct ?? sub.commissionPct ?? store.getSettings().platformCommissionPct,
        totalGmv: totalEarned,
        totalCommissionPaid: commissionPaid,
        payoutMethod: v.razorpayAccountId && store.getSettings().razorpayRouteEnabled ? 'razorpay_route' : 'manual_ledger_neft',
      };
    });

    return NextResponse.json({
      success: true,
      vendors: enriched,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      businessName,
      businessType = 'event_organizer',
      ownerName,
      email,
      phone,
      city = 'Mumbai',
      upiId,
      commissionOverridePct,
    } = body;

    if (!businessName || !ownerName) {
      return NextResponse.json({ error: 'Business name and Owner name are required' }, { status: 400 });
    }

    const newId = `vnd_${Date.now()}`;
    const newVendor = {
      id: newId,
      userId: `usr_vnd_${Date.now()}`,
      businessName,
      businessType,
      city,
      upiId: upiId || undefined,
      isVerified: true,
      kycStatus: 'verified' as const,
      kycVerifiedAt: new Date().toISOString(),
      commissionOverridePct: commissionOverridePct ? Number(commissionOverridePct) : 10,
    };

    store.addVendor(newVendor);

    return NextResponse.json({
      success: true,
      message: `Vendor ${businessName} registered successfully!`,
      vendor: newVendor,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { vendorId, updates } = body;

    if (!vendorId || !updates) {
      return NextResponse.json({ error: 'vendorId and updates are required' }, { status: 400 });
    }

    // Validate commission rate if present
    if (updates.commissionOverridePct !== undefined) {
      const rate = Number(updates.commissionOverridePct);
      if (isNaN(rate) || rate < 0 || rate > 50) {
        return NextResponse.json({ error: 'Commission rate must be between 0% and 50%' }, { status: 400 });
      }
      updates.commissionOverridePct = rate;
    }

    const success = store.updateVendor(vendorId, updates);
    if (!success) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const updated = store.getVendorById(vendorId);
    return NextResponse.json({
      success: true,
      message: `Updated settings for ${updated?.businessName}`,
      vendor: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
