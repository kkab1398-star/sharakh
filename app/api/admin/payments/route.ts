import { NextRequest, NextResponse } from 'next/server';
import { assertSuperAdmin, createSuperAdminClient, logAdminAction } from '@/lib/super-admin';

export async function GET(req: NextRequest) {
  const auth = await assertSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  const admin = createSuperAdminClient();
  const { searchParams } = req.nextUrl;
  const status = searchParams.get('status');

  let query = admin
    .from('payments')
    .select('*')
    .order('payment_date', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data: payments } = await query;

  const { data: partners } = await admin
    .from('partners')
    .select('id, company_name');

  const partnerMap = new Map((partners ?? []).map(p => [p.id, p.company_name]));

  return NextResponse.json({
    payments: (payments ?? []).map(p => ({
      ...p,
      partner_name: partnerMap.get(p.partner_id) ?? '—',
    })),
  });
}

export async function POST(req: NextRequest) {
  const auth = await assertSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  const {
    partner_id,
    amount,
    currency,
    method,
    reference_number,
    payment_date,
    note,
  } = body;

  if (!partner_id || !amount || !method) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const admin = createSuperAdminClient();

  const { data: payment, error: paymentError } = await admin
    .from('payments')
    .insert({
      partner_id,
      amount,
      currency: currency ?? 'SAR',
      method,
      reference_number: reference_number ?? null,
      payment_date: payment_date ?? new Date().toISOString().split('T')[0],
      note: note ?? null,
      status: 'confirmed',
      created_by: auth.email,
    })
    .select()
    .single();

  if (paymentError) {
    return NextResponse.json({ error: paymentError.message }, { status: 500 });
  }

  const { data: partner } = await admin
    .from('partners')
    .select('subscription_status, subscription_ends_at')
    .eq('id', partner_id)
    .single();

  if (partner?.subscription_status === 'expired' || partner?.subscription_status === 'cancelled') {
    const newEnd = new Date();
    newEnd.setFullYear(newEnd.getFullYear() + 1);

    await admin
      .from('partners')
      .update({
        subscription_status: 'active',
        subscription_ends_at: newEnd.toISOString(),
      })
      .eq('id', partner_id);
  }

  await logAdminAction({
    actor_email: auth.email,
    action: 'payment_recorded',
    target_type: 'payment',
    target_id: payment.id,
    details: { amount, method, partner_id },
  });

  return NextResponse.json({ payment }, { status: 201 });
}
