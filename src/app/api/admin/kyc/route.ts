import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vendorId, action, rejectionReason } = body;

    if (!vendorId || !['verify', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'vendorId and valid action ("verify" or "reject") are required.' },
        { status: 400 }
      );
    }

    const isVerify = action === 'verify';
    const success = store.verifyVendorKyc(
      vendorId,
      isVerify ? 'verified' : 'rejected',
      rejectionReason
    );

    if (!success) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const updated = store.getVendorById(vendorId);

    return NextResponse.json({
      success: true,
      message: isVerify
        ? `KYC for ${updated?.businessName} approved! Vendor marked as Verified.`
        : `KYC for ${updated?.businessName} rejected. Notification sent to vendor.`,
      vendor: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
