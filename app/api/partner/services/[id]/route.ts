import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedPartner } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase-admin';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const admin = createAdminClient();

  const { data, error: dbErr } = await admin
    .from('services')
    .update(body)
    .eq('id', id)
    .eq('partner_id', partner.id)
    .select()
    .single();

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json({ service: data });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const { id } = await params;
  const admin = createAdminClient();

  await admin.from('services').delete().eq('id', id).eq('partner_id', partner.id);
  return NextResponse.json({ ok: true });
}
