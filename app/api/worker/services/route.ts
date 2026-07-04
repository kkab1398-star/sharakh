import { NextRequest, NextResponse } from 'next/server';
import { getWorkerSession } from '@/lib/worker-auth';
import { createAdminClient } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  const session = await getWorkerSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { data } = await admin
    .from('services')
    .select('id, name, default_price, currency')
    .eq('partner_id', session.partner_id)
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  return NextResponse.json({ services: data ?? [] });
}
