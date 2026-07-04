import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { getWorkerSession } from '@/lib/worker-auth';

export async function GET(req: NextRequest) {
  const session = await getWorkerSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();

  // جلب الدورات المفتوحة أولاً لتصفية الفواتير بها
  const { data: cycles } = await admin
    .from('financial_cycles')
    .select('id')
    .eq('worker_id', session.worker_id)
    .eq('partner_id', session.partner_id)
    .eq('status', 'open');

  const cycleIds = (cycles ?? []).map(c => c.id);
  if (cycleIds.length === 0) return NextResponse.json({ invoices: [] });

  const { data } = await admin
    .from('invoices')
    .select('id, customer_name, customer_phone, amount, description, currency, pdf_url, created_at')
    .eq('worker_id', session.worker_id)
    .in('cycle_id', cycleIds)
    .order('created_at', { ascending: false });

  return NextResponse.json({ invoices: data ?? [] });
}
