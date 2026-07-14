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

  const { data: partners, error: partnersError } = await admin
    .from('partners')
    .select('id, company_name, created_at, subscription_status, plan, trial_ends_at, subscription_ends_at, phone_primary, telegram_chat_id, user_id');

  if (partnersError) {
    console.error('[GET /api/admin/tenants] Partners query error:', partnersError);
    return NextResponse.json({ error: 'Failed to fetch partners', details: partnersError.message }, { status: 500 });
  }

  if (!partners || partners.length === 0) return NextResponse.json({ partners: [] });

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

    // استخرج slug من البريد الإلكتروني - أول 4 حروف فقط
    const prefix = email.split('@')[0];
    const lettersOnly = prefix.replace(/[^a-zA-Z]/g, '').toLowerCase();
    let slug = lettersOnly.slice(0, 4);

    // تحقق من تكرار slug وأضف رقم إذا لزم الأمر
    let finalSlug = slug;
    let counter = 2;
    while (true) {
      const { data: existing, error } = await admin
        .from('partners')
        .select('id')
        .eq('slug', finalSlug)
        .maybeSingle();

      if (!existing) break;
      finalSlug = `${slug}${counter}`;
      counter++;
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
        slug: finalSlug,
        subscription_status: subscription_type === 'paid' ? 'active' : 'trial',
        plan: 'basic',
        trial_ends_at: subscription_type === 'paid' ? null : trial_ends_at.toISOString(),
        subscription_ends_at: subscription_type === 'paid' ? new Date(Date.now() + 365 * 86400000).toISOString() : null,
        is_first_login: true,
      })
      .select()
      .single();

    if (partnerError) {
      await admin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: partnerError.message }, { status: 500 });
    }

    // أضف أنواع المصاريف الافتراضية الثمانية
    const defaultExpenseTypes = [
      { name: 'وقود', icon: '⛽', color: '#FF6B6B' },
      { name: 'صيانة', icon: '🔧', color: '#4ECDC4' },
      { name: 'رسوم جمركية', icon: '📋', color: '#45B7D1' },
      { name: 'توصيل', icon: '📦', color: '#FFA502' },
      { name: 'مخالفات', icon: '⚠️', color: '#EF4444' },
      { name: 'تأمين', icon: '🛡️', color: '#1DA1F2' },
      { name: 'أخرى', icon: '📝', color: '#95E1D3' },
      { name: 'رسوم إدارية', icon: '💼', color: '#AA96DA' },
    ];

    await admin
      .from('expense_types')
      .insert(
        defaultExpenseTypes.map(type => ({
          partner_id: partner.id,
          name: type.name,
          icon: type.icon,
          color: type.color,
          display_order: defaultExpenseTypes.indexOf(type),
        }))
      );

    await logAdminAction({
      actor_email: auth.email,
      action: 'tenant_created',
      target_type: 'partner',
      target_id: partner.id,
      details: { company_name, subscription_type, slug: finalSlug },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sharakh.vercel.app';
    const loginLink = `${appUrl}/login/${finalSlug}`;

    return NextResponse.json({
      partner: { ...partner, slug: finalSlug },
      loginLink,
      slug: finalSlug,
    }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/tenants]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
