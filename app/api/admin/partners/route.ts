import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createServerClient } from '@/lib/supabase-server';
import { z } from 'zod';

const SUPER_ADMIN_EMAILS = (process.env.SUPER_ADMIN_EMAILS ?? '').split(',').map(e => e.trim());

async function assertSuperAdmin(): Promise<{ email: string } | NextResponse> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email || !SUPER_ADMIN_EMAILS.includes(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return { email: user.email };
}

export async function GET() {
  const result = await assertSuperAdmin();
  if (result instanceof NextResponse) return result;

  const admin = createAdminClient();
  const { data: partners } = await admin
    .from('partners')
    .select('id, company_name, created_at, subscription_status, plan, trial_ends_at, subscription_ends_at, phone_primary, telegram_chat_id')
    .order('created_at', { ascending: false });

  // عدد السائقين لكل شريك
  const { data: workerCounts } = await admin
    .from('workers')
    .select('partner_id');

  const countMap: Record<string, number> = {};
  for (const w of workerCounts ?? []) {
    countMap[w.partner_id] = (countMap[w.partner_id] ?? 0) + 1;
  }

  const enriched = (partners ?? []).map(p => ({
    ...p,
    worker_count: countMap[p.id] ?? 0,
  }));

  return NextResponse.json({ partners: enriched });
}

const UpdateSchema = z.object({
  partner_id:           z.string().uuid(),
  subscription_status:  z.enum(['trial', 'active', 'expired', 'cancelled']).optional(),
  plan:                 z.enum(['basic', 'pro', 'enterprise']).optional(),
  subscription_ends_at: z.string().optional(),
  trial_ends_at:        z.string().optional(),
});

export async function PUT(req: NextRequest) {
  const result = await assertSuperAdmin();
  if (result instanceof NextResponse) return result;

  const body   = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed' }, { status: 400 });

  const { partner_id, ...updates } = parsed.data;
  const admin = createAdminClient();

  const { data, error } = await admin
    .from('partners')
    .update(updates)
    .eq('id', partner_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ partner: data });
}
