import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';
import { getAuthenticatedPartner } from '@/lib/auth';
import { sendTelegramMessage, buildTransactionMessage } from '@/lib/telegram';
import { z } from 'zod';

async function recalculateCycleTotals(cycleId: string) {
  const admin = createAdminClient();
  const { data: rows } = await admin
    .from('transactions')
    .select('type, amount')
    .eq('cycle_id', cycleId);

  const t = (rows ?? []).reduce(
    (acc, r) => {
      const n = Number(r.amount);
      if (r.type === 'income')              acc.income   += n;
      else if (r.type === 'expense')        acc.expenses += n;
      else if (r.type === 'transfer_to_worker') acc.advances += n;
      return acc;
    },
    { income: 0, expenses: 0, advances: 0 }
  );

  await admin.from('financial_cycles').update({
    total_income:   t.income,
    total_expenses: t.expenses,
    total_advances: t.advances,
    net_amount:     t.income - t.expenses - t.advances,
  }).eq('id', cycleId);
}

export async function GET(req: NextRequest) {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const { searchParams } = req.nextUrl;
  const cycle_id = searchParams.get('cycle_id');

  const supabase = await createServerClient();
  let query = supabase
    .from('transactions')
    .select('*')
    .eq('partner_id', partner.id)
    .order('created_at', { ascending: false });

  if (cycle_id) query = query.eq('cycle_id', cycle_id);

  const { data, error: dbError } = await query;
  if (dbError) throw dbError;

  return NextResponse.json({ transactions: data ?? [] });
}

const CreateTransactionSchema = z.object({
  cycle_id:       z.string().uuid(),
  worker_id:      z.string().uuid(),
  type:           z.enum(['income', 'expense', 'transfer_to_partner', 'transfer_to_worker']),
  amount:         z.number().positive(),
  description:    z.string().optional(),
  customer_name:  z.string().optional(),
  customer_phone: z.string().optional(),
  issue_invoice:  z.boolean().optional(),
  service_desc:   z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { partner, error } = await getAuthenticatedPartner();
    if (error) return error;

    const parsed = CreateTransactionSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
    }

    const { customer_name, customer_phone, issue_invoice, service_desc, ...txData } = parsed.data;
    const supabase = await createServerClient();
    const admin    = createAdminClient();

    const { data: cycle } = await supabase
      .from('financial_cycles')
      .select('id, status, title, currency')
      .eq('id', txData.cycle_id)
      .eq('partner_id', partner.id)
      .single();

    if (!cycle) return NextResponse.json({ error: 'Cycle not found' }, { status: 404 });
    if (cycle.status === 'settled') return NextResponse.json({ error: 'Cannot add transactions to a settled cycle' }, { status: 409 });

    // إنشاء/إيجاد سجل العميل إن كانت المعاملة دخلاً وبُدّلت بيانات زبون
    let customer_id: string | null = null;
    if (txData.type === 'income' && customer_name && customer_phone) {
      const { data: existing } = await admin
        .from('customers')
        .select('id')
        .eq('partner_id', partner.id)
        .eq('phone', customer_phone)
        .maybeSingle();

      if (existing) {
        customer_id = existing.id;
      } else {
        const { data: created } = await admin
          .from('customers')
          .insert({ partner_id: partner.id, full_name: customer_name, phone: customer_phone })
          .select('id')
          .single();
        customer_id = created?.id ?? null;
      }
    }

    const { data: tx, error: dbError } = await supabase
      .from('transactions')
      .insert({
        ...txData,
        partner_id:     partner.id,
        recorded_by:    'partner',
        customer_id,
        customer_name:  customer_name || null,
        customer_phone: customer_phone || null,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // تحديث إجماليات الدورة
    await recalculateCycleTotals(txData.cycle_id);

    // إنشاء سجل فاتورة إن طُلب ذلك
    if (issue_invoice && txData.type === 'income' && customer_name && customer_phone) {
      await admin.from('invoices').insert({
        partner_id:     partner.id,
        worker_id:      txData.worker_id,
        cycle_id:       txData.cycle_id,
        transaction_id: tx.id,
        customer_id,
        customer_name,
        customer_phone,
        amount:         txData.amount,
        description:    service_desc || txData.description || null,
        currency:       cycle.currency ?? partner.currency,
      });
    }

    // إشعار تيليجرام
    try {
      if (partner.telegram_chat_id) {
        const { data: worker } = await supabase
          .from('workers')
          .select('full_name')
          .eq('id', tx.worker_id)
          .single();

        let msg = buildTransactionMessage({
          type:        tx.type,
          amount:      tx.amount,
          workerName:  worker?.full_name ?? 'غير معروف',
          currency:    partner.currency,
          description: tx.description,
          cycleLabel:  cycle.title ?? `دورة #${cycle.id.slice(0, 8)}`,
        });

        if (customer_name) {
          msg += `\n👤 الزبون: ${customer_name}`;
          if (customer_phone) msg += ` (${customer_phone})`;
        }
        if (issue_invoice) msg += '\n🧾 تم إصدار فاتورة';

        await sendTelegramMessage(partner.telegram_chat_id, msg);
      }
    } catch (notifyErr) {
      console.error('[POST /api/transactions] خطأ في إشعار تيليجرام:', notifyErr);
    }

    return NextResponse.json({ transaction: tx }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/transactions]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
