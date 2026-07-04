import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { getAuthenticatedPartner } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const range = searchParams.get('range') ?? 'today';

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  let from: Date;
  let to: Date = new Date(now);

  if (range === 'yesterday') {
    from = new Date(todayStart);
    from.setDate(from.getDate() - 1);
    to = new Date(todayStart);
  } else if (range === 'week') {
    from = new Date(now);
    from.setDate(from.getDate() - 7);
    from.setHours(0, 0, 0, 0);
  } else if (range === 'month') {
    from = new Date(now);
    from.setDate(from.getDate() - 30);
    from.setHours(0, 0, 0, 0);
  } else {
    // today
    from = new Date(todayStart);
  }

  const admin = createAdminClient();

  // جلب المعاملات مع بيانات السائق والمعدة والدورة
  const { data: txRows, error: txErr } = await admin
    .from('transactions')
    .select(`
      id, type, amount, currency, description, customer_name, customer_phone, created_at,
      worker:workers!transactions_worker_id_fkey(id, full_name),
      financial_cycles!transactions_cycle_id_fkey(
        id, title,
        equipment:equipment(id, model, plate_number)
      )
    `)
    .eq('partner_id', partner.id)
    .gte('created_at', from.toISOString())
    .lte('created_at', to.toISOString())
    .order('created_at', { ascending: false });

  if (txErr) {
    return NextResponse.json({ error: txErr.message }, { status: 500 });
  }

  const rows = txRows ?? [];

  // ملخص إجمالي
  const total_income   = rows.filter(r => r.type === 'income').reduce((s, r) => s + Number(r.amount), 0);
  const total_expenses = rows.filter(r => r.type === 'expense').reduce((s, r) => s + Number(r.amount), 0);
  const operations_count = rows.length;

  // تجميع حسب السائق
  const workerMap = new Map<string, {
    worker_id: string;
    worker_name: string;
    equipment_name: string;
    transactions: typeof rows;
  }>();

  for (const tx of rows) {
    const w = tx.worker as any;
    if (!w) continue;
    const wid = w.id as string;

    if (!workerMap.has(wid)) {
      const cycle = tx.financial_cycles as any;
      const eq = cycle?.equipment as any;
      const eqName = eq?.model ?? (eq?.plate_number ? `لوحة ${eq.plate_number}` : 'معدة غير محددة');

      workerMap.set(wid, {
        worker_id:    wid,
        worker_name:  w.full_name,
        equipment_name: eqName,
        transactions: [],
      });
    }
    workerMap.get(wid)!.transactions.push(tx);
  }

  const workers = Array.from(workerMap.values()).map(w => {
    const inc = w.transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const exp = w.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    return {
      worker_id:      w.worker_id,
      worker_name:    w.worker_name,
      equipment_name: w.equipment_name,
      summary: { income: inc, expenses: exp, net: inc - exp },
      transactions: w.transactions.map(t => ({
        id:           t.id,
        type:         t.type,
        amount:       Number(t.amount),
        currency:     t.currency,
        description:  t.description,
        customer_name: t.customer_name,
        customer_phone: t.customer_phone,
        created_at:   t.created_at,
      })),
    };
  });

  return NextResponse.json({
    range,
    from: from.toISOString(),
    to:   to.toISOString(),
    summary: {
      total_income,
      total_expenses,
      operations_count,
      active_workers: workerMap.size,
    },
    workers,
  });
}
