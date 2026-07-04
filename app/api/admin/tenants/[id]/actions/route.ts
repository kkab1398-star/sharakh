import { NextRequest, NextResponse } from 'next/server';
import { assertSuperAdmin, createSuperAdminClient, logAdminAction } from '@/lib/super-admin';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await assertSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const { action, days_to_add } = await req.json();
  const admin = createSuperAdminClient();

  if (action === 'freeze') {
    const { data, error } = await admin
      .from('partners')
      .update({ is_frozen: true })
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await logAdminAction({
      actor_email: auth.email,
      action: 'tenant_frozen',
      target_type: 'partner',
      target_id: id,
    });

    return NextResponse.json({ partner: data });
  }

  if (action === 'unfreeze') {
    const { data, error } = await admin
      .from('partners')
      .update({ is_frozen: false })
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await logAdminAction({
      actor_email: auth.email,
      action: 'tenant_unfrozen',
      target_type: 'partner',
      target_id: id,
    });

    return NextResponse.json({ partner: data });
  }

  if (action === 'extend' && days_to_add) {
    const { data: partner } = await admin
      .from('partners')
      .select('subscription_status, subscription_ends_at')
      .eq('id', id)
      .single();

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    const current = partner.subscription_ends_at
      ? new Date(partner.subscription_ends_at)
      : new Date();

    const newEnd = new Date(current.getTime() + days_to_add * 86400000);

    const { data, error } = await admin
      .from('partners')
      .update({ subscription_ends_at: newEnd.toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await logAdminAction({
      actor_email: auth.email,
      action: 'tenant_extended',
      target_type: 'partner',
      target_id: id,
      details: { days_added: days_to_add, new_end_date: newEnd.toISOString() },
    });

    return NextResponse.json({ partner: data });
  }

  if (action === 'impersonate') {
    return NextResponse.json({
      impersonate_token: Buffer.from(`${id}:${Date.now()}`).toString('base64'),
    });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
