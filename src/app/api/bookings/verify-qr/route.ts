import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const { qrHash } = await request.json();

    if (!qrHash) {
      return NextResponse.json({ error: 'QR hash is required' }, { status: 400 });
    }

    const result = store.checkInBooking(qrHash);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.message,
          message: result.message,
          alreadyCheckedIn: result.alreadyCheckedIn,
          checkedInAt: result.checkedInAt,
          dailyPass: result.dailyPass,
          booking: result.booking,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      dailyPass: result.dailyPass,
      booking: result.booking,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'QR verification failed' },
      { status: 500 }
    );
  }
}
