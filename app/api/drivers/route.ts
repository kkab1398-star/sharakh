import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { getAuthenticatedPartner } from '@/lib/auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

export async function GET() {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const supabase = await createServerClient();
  const { data, error: dbError } = await supabase
    .from('workers')
    .select('id, full_name, username, phone, is_active, created_at')
    .eq('partner_id', partner.id)
    .order('created_at', { ascending: false });

  if (dbError) throw dbError;
  return NextResponse.json({ workers: data });
}

const CreateDriverSchema = z.object({
  full_name:         z.string().min(2),
  username:          z.string().min(3).regex(/^[a-zA-Z0-9_]+$/, 'أحرف إنجليزية وأرقام و _ فقط'),
  password:          z.string().min(6),
  profit_percentage: z.number().min(1).max(99),
  phone:             z.string().min(9, 'رقم جوال غير صحيح').regex(/^[0-9+\s-]+$/, 'رقم جوال غير صحيح'),
});

export async function POST(req: NextRequest) {
  try {
    const { partner, error } = await getAuthenticatedPartner();
    if (error) return error;

    const body = await req.json();
    const parsed = CreateDriverSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
    }

    const { full_name, username, password, profit_percentage, phone } = parsed.data;
    const supabase = await createServerClient();

    const { data: existing } = await supabase
      .from('workers')
      .select('id')
      .eq('partner_id', partner.id)
      .eq('username', username)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'اسم المستخدم مستخدم بالفعل' }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const { data: worker, error: workerError } = await supabase
      .from('workers')
      .insert({ partner_id: partner.id, full_name, username, password_hash, phone })
      .select('id, full_name, username, phone, is_active, created_at')
      .single();

    if (workerError) throw workerError;

    await supabase.from('worker_contracts').insert({
      partner_id:        partner.id,
      worker_id:         worker.id,
      profit_percentage,
    });

    return NextResponse.json({ worker }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/drivers]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
