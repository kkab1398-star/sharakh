import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { getAuthenticatedPartner } from '@/lib/auth';

export async function GET() {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const admin = createAdminClient();

  // جلب كل الفواتير مع بيانات العميل
  const { data: invoices } = await admin
    .from('invoices')
    .select('id, customer_id, customer_name, customer_phone, amount, currency, created_at, worker_id')
    .eq('partner_id', partner.id)
    .order('created_at', { ascending: false });

  const rows = invoices ?? [];

  // ── ملخص ──
  const total_revenue   = rows.reduce((s, r) => s + Number(r.amount), 0);
  const avg_invoice     = rows.length ? total_revenue / rows.length : 0;
  const nowMs           = Date.now();
  const monthStart      = new Date();
  monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const new_this_month  = rows.filter(r => new Date(r.created_at) >= monthStart).length;

  // ── تجميع حسب العميل ──
  const map = new Map<string, {
    id: string; name: string; phone: string;
    count: number; total: number; last_at: string;
  }>();

  for (const inv of rows) {
    const key = inv.customer_phone ?? inv.customer_name ?? inv.id;
    if (!map.has(key)) {
      map.set(key, {
        id:     inv.customer_id ?? key,
        name:   inv.customer_name ?? '—',
        phone:  inv.customer_phone ?? '',
        count:  0, total: 0,
        last_at: inv.created_at,
      });
    }
    const c = map.get(key)!;
    c.count++;
    c.total += Number(inv.amount);
    if (inv.created_at > c.last_at) c.last_at = inv.created_at;
  }

  const all = Array.from(map.values()).sort((a, b) => b.total - a.total);
  const maxTotal = all[0]?.total ?? 1;

  const enrich = (c: typeof all[0], rank: number) => ({
    ...c,
    percentage_of_total: maxTotal > 0 ? Math.round((c.total / maxTotal) * 100) : 0,
    rank,
    days_since: Math.floor((nowMs - new Date(c.last_at).getTime()) / 86400000),
  });

  const top_customers    = all.slice(0, 5).map((c, i) => enrich(c, i + 1));
  const least_active     = [...all]
    .sort((a, b) => new Date(a.last_at).getTime() - new Date(b.last_at).getTime())
    .slice(0, 5)
    .map((c, i) => enrich(c, i + 1));

  // ── أكثر 10 عملاء للرسم البياني ──
  const chart_top10 = all.slice(0, 10).map(c => ({ name: c.name, total: c.total }));

  // ── النشاط الشهري — آخر 6 أشهر ──
  const monthly: Record<string, { month: string; invoices_count: number; total_amount: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1); d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('ar-SA', { month: 'short', year: '2-digit' });
    monthly[key] = { month: label, invoices_count: 0, total_amount: 0 };
  }
  for (const inv of rows) {
    const d = new Date(inv.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (monthly[key]) {
      monthly[key].invoices_count++;
      monthly[key].total_amount += Number(inv.amount);
    }
  }
  const monthly_activity = Object.values(monthly);

  // ── قائمة كاملة ──
  const all_customers = all.map((c, i) => enrich(c, i + 1));

  return NextResponse.json({
    summary: {
      total_customers:   map.size,
      new_this_month,
      total_revenue,
      avg_invoice_value: Math.round(avg_invoice),
    },
    top_customers,
    least_active,
    chart_top10,
    monthly_activity,
    all_customers,
  });
}
