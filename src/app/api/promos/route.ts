import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { PromoCode } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
    const all = searchParams.get('all') === 'true';

    let promos = store.getPromoCodes();
    if (!all) {
      promos = promos.filter((p) => p.isActive);
    }
    if (vendorId) {
      promos = promos.filter((p) => !p.vendorId || p.vendorId === vendorId);
    }

    return NextResponse.json({ success: true, promos });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, code, amount, vendorId, newPromo } = body;

    if (action === 'validate') {
      if (!code) {
        return NextResponse.json({ error: 'Promo code is required' }, { status: 400 });
      }
      const result = store.validatePromoCode(code, Number(amount) || 0, vendorId);
      if (!result.valid) {
        return NextResponse.json({ success: false, error: result.message }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        discountAmount: result.discountAmount,
        message: result.message,
        promo: result.promo,
      });
    }

    if (action === 'create' || newPromo) {
      const data: PromoCode = newPromo || {
        id: `prm-${Date.now()}`,
        code: body.code.toUpperCase().trim(),
        discountType: body.discountType || 'percentage',
        discountValue: Number(body.discountValue) || 10,
        maxDiscountCap: body.maxDiscountCap ? Number(body.maxDiscountCap) : undefined,
        minBookingAmount: body.minBookingAmount ? Number(body.minBookingAmount) : 0,
        vendorId: body.vendorId,
        isActive: body.isActive !== undefined ? body.isActive : true,
        validUntil: body.validUntil || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        usageCount: 0,
      };

      store.addPromoCode(data);
      return NextResponse.json({ success: true, message: `Promo code ${data.code} created!`, promo: data });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, updates } = body;
    if (!id || !updates) {
      return NextResponse.json({ error: 'Missing id or updates' }, { status: 400 });
    }

    const updated = store.updatePromoCode(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Promo code not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Promo code updated' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing promo code id' }, { status: 400 });
    }

    const deleted = store.deletePromoCode(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Promo code not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Promo code deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
