import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/supabase/db';

export async function GET() {
  try {
    const status = await checkDatabaseConnection();
    return NextResponse.json(status, {
      status: status.connected ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        connected: false,
        provider: 'Supabase PostgreSQL',
        error: msg,
      },
      { status: 500 }
    );
  }
}
