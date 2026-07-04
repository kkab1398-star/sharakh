import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedPartner } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase-admin';
import { z } from 'zod';

const Schema = z.object({
  name:          z.string().min(1),
  default_price: z.number().positive().optional(),
  currency:      z.string().optional(),
});

export async function GET() {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const admin = createAdminClient();
  const { data } = await admin
    .from('services')
    .select('*')
    .eq('partner_id', partner.id)
    .order('created_at', { ascending: true });

  return NextResponse.json({ services: data ?? [] });
}

export async function POST(req: NextRequest) {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 });

  const admin = createAdminClient();
  const { data, error: dbErr } = await admin
    .from('services')
    .insert({ ...parsed.data, partner_id: partner.id, currency: parsed.data.currency ?? partner.currency })
    .select()
    .single();

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json({ service: data });
}
