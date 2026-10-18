import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId') || 'ven-indigo-hospitality';
    const vendor = store.getVendorById(vendorId);

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      vendor,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      vendorId = 'ven-indigo-hospitality',
      pan,
      gstin,
      bankName,
      bankAccountNumber,
      bankIfsc,
      bankBeneficiaryName,
      documents = [],
    } = body;

    if (!pan || !bankAccountNumber || !bankIfsc || !bankBeneficiaryName) {
      return NextResponse.json(
        { error: 'PAN, Bank Account Number, IFSC, and Account Holder Name are required.' },
        { status: 400 }
      );
    }

    const success = store.submitVendorKyc(vendorId, {
      pan: pan.trim().toUpperCase(),
      gstin: gstin ? gstin.trim().toUpperCase() : undefined,
      bankName: bankName?.trim(),
      bankAccountNumber: bankAccountNumber.trim(),
      bankIfsc: bankIfsc.trim().toUpperCase(),
      bankBeneficiaryName: bankBeneficiaryName.trim(),
      kycDocuments: documents,
    });

    if (!success) {
      return NextResponse.json({ error: 'Vendor not found to update KYC.' }, { status: 404 });
    }

    const updated = store.getVendorById(vendorId);

    return NextResponse.json({
      success: true,
      message: 'KYC & Bank Details submitted successfully! Sent for Admin review (24-48 hrs).',
      vendor: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
