import { NextRequest, NextResponse } from 'next/server';
import { assertSuperAdmin, createSuperAdminClient, logAdminAction } from '@/lib/super-admin';
import { getSubscriptionState } from '@/lib/subscription';

export async function GET(req: NextRequest) {
  const auth = await assertSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  const admin = createSuperAdminClient();
  const { searchParams } = req.nextUrl;

  const status = searchParams.get('status');
  const search = searchParams.get('search')?.toLowerCase() ?? '';

  const { data: partners } = await admin
    .from('partners')
    .select('id, company_name, created_at, subscription_status, plan, trial_ends_at, subscription_ends_at, phone_primary, is_frozen, telegram_chat_id');

  if (!partners) return NextResponse.json({ partners: [] });

  const { data: workerCounts } = await admin
    .from('workers')
    .select('partner_id');

  const countMap: Record<string, number> = {};
  for (const w of workerCounts ?? []) {
    countMap[w.partner_id] = (countMap[w.partner_id] ?? 0) + 1;
  }

  let filtered = partners.map(p => {
    const state = getSubscriptionState(p);
    return {
      ...p,
      worker_count: countMap[p.id] ?? 0,
      status_badge: state.status,
      days_remaining: state.days_remaining,
    };
  });

  if (status && status !== 'all') {
    const statusMap: Record<string, (p: typeof filtered[0]) => boolean> = {
      active:     p => p.status_badge === 'active',
      trial:      p => p.status_badge === 'trial',
      expiring:   p => p.days_remaining !== null && p.days_remaining >= 0 && p.days_remaining <= 3,
      expired:    p => p.status_badge === 'expired',
      frozen:     p => p.is_frozen,
    };
    if (statusMap[status]) filtered = filtered.filter(statusMap[status]);
  }

  if (search) {
    filtered = filtered.filter(p =>
      p.company_name.toLowerCase().includes(search) ||
      (p.phone_primary?.includes(search) ?? false)
    );
  }

  return NextResponse.json({ partners: filtered });
}

export async function POST(req: NextRequest) {
  const auth = await assertSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  const admin = createSuperAdminClient();

  const { email, password, company_name, phone_primary, subscription_type } = body;

  if (!email || !password || !company_name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const trial_ends_at = new Date();
    trial_ends_at.setDate(trial_ends_at.getDate() + 14);

    const { data: partner, error: partnerError } = await admin
      .from('partners')
      .insert({
        user_id: authData.user.id,
        company_name,
        phone_primary: phone_primary ?? null,
        currency: 'SAR',
        locale: 'ar',
        theme: 'light',
        subscription_status: subscription_type === 'paid' ? 'active' : 'trial',
        plan: 'basic',
        trial_ends_at: subscription_type === 'paid' ? null : trial_ends_at.toISOString(),
        subscription_ends_at: subscription_type === 'paid' ? new Date(Date.now() + 365 * 86400000).toISOString() : null,
      })
      .select()
      .single();

    if (partnerError) {
      await admin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: partnerError.message }, { status: 500 });
    }

    await logAdminAction({
      actor_email: auth.email,
      action: 'tenant_created',
      target_type: 'partner',
      target_id: partner.id,
      details: { company_name, subscription_type },
    });

    return NextResponse.json({ partner }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/tenants]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
