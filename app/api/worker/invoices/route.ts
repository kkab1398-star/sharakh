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

export async function POST(req: NextRequest) {
  const session = await getWorkerSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { customer_name, customer_phone, amount, currency, description } = body;

    if (!customer_name || !customer_phone || !amount || !currency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const admin = createAdminClient();

    // جلب دورة مفتوحة للسائق
    const { data: cycles } = await admin
      .from('financial_cycles')
      .select('id')
      .eq('worker_id', session.worker_id)
      .eq('partner_id', session.partner_id)
      .eq('status', 'open')
      .limit(1);

    if (!cycles || cycles.length === 0) {
      return NextResponse.json({ error: 'لا توجد دورة مالية مفتوحة' }, { status: 400 });
    }

    const cycleId = cycles[0].id;

    const { data, error } = await admin
      .from('invoices')
      .insert({
        worker_id: session.worker_id,
        partner_id: session.partner_id,
        cycle_id: cycleId,
        customer_name,
        customer_phone,
        amount: parseFloat(amount),
        currency,
        description: description || null,
      })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ invoice: data }, { status: 201 });
  } catch (err) {
    console.error('[worker/invoices POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
