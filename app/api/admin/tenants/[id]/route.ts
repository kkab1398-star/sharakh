import { NextRequest, NextResponse } from 'next/server';
import { assertSuperAdmin, createSuperAdminClient } from '@/lib/super-admin';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await assertSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const admin = createSuperAdminClient();

  const { data: partner, error: partnerError } = await admin
    .from('partners')
    .select('*')
    .eq('id', id)
    .single();

  if (partnerError || !partner) {
    return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
  }

  const { data: workers } = await admin
    .from('workers')
    .select('id, full_name, username, phone, is_active, is_frozen, created_at')
    .eq('partner_id', id);

  const { data: equipment } = await admin
    .from('equipment')
    .select('id')
    .eq('partner_id', id);

  const { data: cycles } = await admin
    .from('financial_cycles')
    .select('id')
    .eq('partner_id', id);

  const { data: auditLogs } = await admin
    .from('audit_log')
    .select('action, target_type, details, created_at')
    .eq('target_id', id)
    .order('created_at', { ascending: false })
    .limit(10);

  const { data: userData } = await admin.auth.admin.getUserById(partner.user_id);

  return NextResponse.json({
    partner: {
      ...partner,
      user_email: userData?.user?.email,
      worker_count: workers?.length ?? 0,
      equipment_count: equipment?.length ?? 0,
      cycle_count: cycles?.length ?? 0,
    },
    workers: workers ?? [],
    recent_actions: auditLogs ?? [],
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await assertSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await req.json();
  const admin = createSuperAdminClient();

  const { data, error } = await admin
    .from('partners')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ partner: data });
}
