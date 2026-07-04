import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedPartner } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase-admin';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const admin = createAdminClient();

  // لا يمكن تعديل الأنواع الافتراضية
  const { data: existing } = await admin.from('expense_types').select('is_default').eq('id', id).single();
  if (existing?.is_default && body.name !== undefined) {
    return NextResponse.json({ error: 'لا يمكن تعديل الأنواع الافتراضية' }, { status: 403 });
  }

  const { data, error: dbErr } = await admin
    .from('expense_types')
    .update(body)
    .eq('id', id)
    .eq('partner_id', partner.id)
    .select()
    .single();

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json({ expense_type: data });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const { id } = await params;
  const admin = createAdminClient();

  // لا يمكن حذف الأنواع الافتراضية
  const { data: existing } = await admin.from('expense_types').select('is_default').eq('id', id).single();
  if (existing?.is_default) return NextResponse.json({ error: 'لا يمكن حذف الأنواع الافتراضية' }, { status: 403 });

  await admin.from('expense_types').delete().eq('id', id).eq('partner_id', partner.id);
  return NextResponse.json({ ok: true });
}
