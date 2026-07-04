import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { getAuthenticatedPartner } from '@/lib/auth';
import { calculateSettlement } from '@/lib/calculations';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { partner, error } = await getAuthenticatedPartner();
    if (error) return error;

    const { id } = await params;
    const supabase = await createServerClient();

    // 1. جلب الدورة والتحقق من ملكيتها وأنها مفتوحة
    const { data: cycle, error: cycleError } = await supabase
      .from('financial_cycles')
      .select('*')
      .eq('id', id)
      .eq('partner_id', partner.id)
      .single();

    if (cycleError || !cycle) {
      return NextResponse.json({ error: 'Cycle not found' }, { status: 404 });
    }

    if (cycle.status === 'settled') {
      return NextResponse.json({ error: 'Cycle already settled' }, { status: 409 });
    }

    // 2. جلب العقد (النسبة) الساري للسائق
    const { data: contract, error: contractError } = await supabase
      .from('worker_contracts')
      .select('*')
      .eq('partner_id', partner.id)
      .eq('worker_id', cycle.worker_id)
      .lte('effective_from', new Date().toISOString().split('T')[0])
      .or('effective_to.is.null,effective_to.gte.' + new Date().toISOString().split('T')[0])
      .order('effective_from', { ascending: false })
      .limit(1)
      .single();

    if (contractError || !contract) {
      return NextResponse.json({ error: 'No active contract found for this worker' }, { status: 400 });
    }

    // 3. جلب كل معاملات الدورة
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('cycle_id', id);

    if (txError) throw txError;

    // 4. تطبيق خوارزمية التسوية
    const result = calculateSettlement(
      transactions ?? [],
      contract,
      id,
      cycle.currency
    );

    // 5. تحديث الدورة بنتائج التسوية وإغلاقها
    const { data: settled, error: updateError } = await supabase
      .from('financial_cycles')
      .update({
        status:           'settled',
        settled_at:       new Date().toISOString(),
        total_income:     result.total_income,
        total_expenses:   result.total_expenses,
        net_amount:       result.net_amount,
        partner_share:    result.partner_share,
        worker_share:     result.worker_share,
        worker_transfers: result.worker_transfers,
        partner_transfers: result.partner_transfers,
        worker_net:       result.worker_net,
        partner_net:      result.partner_net,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ cycle: settled, settlement: result });

  } catch (err) {
    console.error('[POST /api/cycles/:id/settle]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
