import { NextResponse } from 'next/server';
import { assertSuperAdmin, createSuperAdminClient } from '@/lib/super-admin';
import { getSubscriptionState } from '@/lib/subscription';

export async function GET() {
  const auth = await assertSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  const admin = createSuperAdminClient();

  const [{ data: partners }, { data: payments }, { data: cycles }] = await Promise.all([
    admin
      .from('partners')
      .select('id, company_name, subscription_status, plan, trial_ends_at, subscription_ends_at, is_frozen, created_at'),
    admin
      .from('payments')
      .select('amount, status, payment_date')
      .eq('status', 'confirmed'),
    admin
      .from('financial_cycles')
      .select('id, partner_id, worker_id, status, started_at, total_income')
      .eq('status', 'open'),
  ]);

  const partnerRows  = partners ?? [];
  const paymentRows  = payments ?? [];
  const openCycles   = cycles ?? [];

  // ── إحصائيات ──
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = {
    total_partners:  partnerRows.length,
    active_partners: partnerRows.filter(p => p.subscription_status === 'active').length,
    trial_partners:  partnerRows.filter(p => p.subscription_status === 'trial').length,
    revenue_this_month: paymentRows
      .filter(p => new Date(p.payment_date) >= monthStart)
      .reduce((s, p) => s + Number(p.amount), 0),
  };

  // ── تنبيهات ──
  const expiring_soon: { id: string; company_name: string; days_remaining: number }[] = [];
  const expired: { id: string; company_name: string }[] = [];

  for (const p of partnerRows) {
    if (p.subscription_status === 'cancelled') continue;
    const state = getSubscriptionState(p);
    if (state.status === 'expired') {
      expired.push({ id: p.id, company_name: p.company_name });
    } else if (state.days_remaining !== null && state.days_remaining >= 0 && state.days_remaining <= 3) {
      expiring_soon.push({ id: p.id, company_name: p.company_name, days_remaining: state.days_remaining });
    }
  }

  // ── الدورات المفتوحة الآن — مجمّعة حسب الشريك ──
  const partnerNameMap = new Map(partnerRows.map(p => [p.id, p.company_name]));
  const grouped = new Map<string, { worker_ids: Set<string>; last_activity: string; revenue: number }>();

  for (const c of openCycles) {
    const g = grouped.get(c.partner_id) ?? { worker_ids: new Set<string>(), last_activity: c.started_at, revenue: 0 };
    g.worker_ids.add(c.worker_id);
    g.revenue += Number(c.total_income ?? 0);
    if (new Date(c.started_at) > new Date(g.last_activity)) g.last_activity = c.started_at;
    grouped.set(c.partner_id, g);
  }

  const open_cycles = Array.from(grouped.entries()).map(([partner_id, g]) => ({
    partner_id,
    company_name:  partnerNameMap.get(partner_id) ?? '—',
    worker_count:  g.worker_ids.size,
    last_activity: g.last_activity,
    revenue:       g.revenue,
  })).sort((a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime());

  // ── الإيرادات الشهرية — آخر 6 أشهر ──
  const monthly: Record<string, { month: string; total: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthly[key] = { month: d.toLocaleDateString('ar-SA', { month: 'short', year: '2-digit' }), total: 0 };
  }
  for (const p of paymentRows) {
    const d = new Date(p.payment_date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (monthly[key]) monthly[key].total += Number(p.amount);
  }
  const monthly_revenue = Object.values(monthly);

  return NextResponse.json({ stats, alerts: { expiring_soon, expired }, open_cycles, monthly_revenue });
}
