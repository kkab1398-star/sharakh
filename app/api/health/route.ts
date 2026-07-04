import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createServerClient();
    const { error } = await supabase.from('partners').select('count').limit(1);

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json(
        { status: 'error', db: 'connection_failed', detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    return NextResponse.json(
      { status: 'error', db: 'unreachable' },
      { status: 500 }
    );
  }
}
