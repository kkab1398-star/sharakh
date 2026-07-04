import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedPartner } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase-admin';
import { z } from 'zod';

const Schema = z.object({ name: z.string().min(1) });

export async function GET() {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const admin = createAdminClient();
  const { data } = await admin
    .from('expense_types')
    .select('*')
    .eq('partner_id', partner.id)
    .order('sort_order', { ascending: true });

  return NextResponse.json({ expense_types: data ?? [] });
}

export async function POST(req: NextRequest) {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 });

  const admin = createAdminClient();

  // احسب sort_order (بعد الافتراضية)
  const { count } = await admin.from('expense_types').select('*', { count: 'exact', head: true }).eq('partner_id', partner.id);
  const { data, error: dbErr } = await admin
    .from('expense_types')
    .insert({ name: parsed.data.name, partner_id: partner.id, is_default: false, is_active: true, sort_order: (count ?? 0) + 100 })
    .select()
    .single();

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json({ expense_type: data });
}
