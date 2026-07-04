import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';
import { getAuthenticatedPartner } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const { id } = await params;
  const supabase = await createServerClient();

  // التحقق أن المعاملة تابعة لهذا الشريك وأن الدورة مفتوحة
  const { data: tx } = await supabase
    .from('transactions')
    .select('id, cycle_id, financial_cycles(status)')
    .eq('id', id)
    .eq('partner_id', partner.id)
    .single();

  if (!tx) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }

  const cyclesRaw = tx.financial_cycles;
  const cycles = (Array.isArray(cyclesRaw) ? cyclesRaw[0] : cyclesRaw) as { status: string } | null;
  if (cycles?.status === 'settled') {
    return NextResponse.json({ error: 'Cannot delete from a settled cycle' }, { status: 409 });
  }

  const cycleId = tx.cycle_id as string;
  await supabase.from('transactions').delete().eq('id', id);

  // أعِد حساب إجماليات الدورة بعد الحذف
  const admin = createAdminClient();
  const { data: rows } = await admin.from('transactions').select('type, amount').eq('cycle_id', cycleId);
  const t = (rows ?? []).reduce(
    (acc, r) => {
      const n = Number(r.amount);
      if (r.type === 'income') acc.income += n;
      else if (r.type === 'expense') acc.expenses += n;
      else if (r.type === 'transfer_to_worker') acc.advances += n;
      return acc;
    },
    { income: 0, expenses: 0, advances: 0 }
  );
  await admin.from('financial_cycles').update({
    total_income: t.income, total_expenses: t.expenses,
    total_advances: t.advances, net_amount: t.income - t.expenses - t.advances,
  }).eq('id', cycleId);

  return new NextResponse(null, { status: 204 });
}
