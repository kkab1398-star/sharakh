import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { getWorkerSession } from '@/lib/worker-auth';

export async function GET(req: NextRequest) {
  const session = await getWorkerSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: cycles } = await admin
    .from('financial_cycles')
    .select('id, title, status, started_at, currency, total_income, total_expenses, total_advances, net_amount')
    .eq('worker_id', session.worker_id)
    .eq('partner_id', session.partner_id)
    .eq('status', 'open')
    .order('started_at', { ascending: false })
    .limit(5);

  return NextResponse.json({ cycles: cycles ?? [] });
}
