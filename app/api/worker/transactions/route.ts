import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { getWorkerSession } from '@/lib/worker-auth';
import { sendTelegramMessage, buildTransactionMessage } from '@/lib/telegram';
import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';

async function recalculateCycleTotals(admin: SupabaseClient, cycleId: string) {
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

const Schema = z.object({
  cycle_id:       z.string().uuid(),
  type:           z.enum(['income', 'expense', 'transfer_to_worker']),
  amount:         z.number().positive(),
  description:    z.string().optional(),
  customer_name:  z.string().optional(),
  customer_phone: z.string().optional(),
  issue_invoice:  z.boolean().optional(),
  service_desc:   z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await getWorkerSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const cycleId = req.nextUrl.searchParams.get('cycle_id');
  const admin   = createAdminClient();

  let query = admin
    .from('transactions')
    .select('*')
    .eq('worker_id', session.worker_id)
    .eq('partner_id', session.partner_id)
    .order('created_at', { ascending: false });

  if (cycleId) query = query.eq('cycle_id', cycleId);

  const { data } = await query;
  return NextResponse.json({ transactions: data ?? [] });
}

export async function POST(req: NextRequest) {
  const session = await getWorkerSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 });

  const { cycle_id, type, amount, description, customer_name, customer_phone, issue_invoice, service_desc } = parsed.data;
  const admin = createAdminClient();

  // تحقق أن الدورة تخص هذا السائق ومفتوحة
  const { data: cycle } = await admin
    .from('financial_cycles')
    .select('id, status, title, currency')
    .eq('id', cycle_id)
    .eq('worker_id', session.worker_id)
    .eq('partner_id', session.partner_id)
    .single();

  if (!cycle) return NextResponse.json({ error: 'الدورة غير موجودة' }, { status: 404 });
  if (cycle.status !== 'open') return NextResponse.json({ error: 'الدورة مقفلة' }, { status: 409 });

  // إنشاء/إيجاد العميل
  let customer_id: string | null = null;
  if (type === 'income' && customer_name && customer_phone) {
    const { data: existing } = await admin
      .from('customers')
      .select('id')
      .eq('partner_id', session.partner_id)
      .eq('phone', customer_phone)
      .maybeSingle();

    if (existing) {
      customer_id = existing.id;
    } else {
      const { data: created } = await admin
        .from('customers')
        .insert({ partner_id: session.partner_id, full_name: customer_name, phone: customer_phone })
        .select('id')
        .single();
      customer_id = created?.id ?? null;
    }
  }

  const { data: tx, error } = await admin
    .from('transactions')
    .insert({
      cycle_id,
      partner_id:     session.partner_id,
      worker_id:      session.worker_id,
      type:           type === 'transfer_to_worker' ? 'transfer_to_worker' : type,
      amount,
      description:    description || null,
      recorded_by:    'worker',
      customer_id,
      customer_name:  customer_name || null,
      customer_phone: customer_phone || null,
    })
    .select()
    .single();

  if (error) {
    console.error('[POST /api/worker/transactions]', error);
    return NextResponse.json({ error: 'فشل حفظ المعاملة' }, { status: 500 });
  }

  // تحديث إجماليات الدورة من الصفر
  await recalculateCycleTotals(admin, cycle_id);

  // إنشاء سجل فاتورة
  if (issue_invoice && type === 'income' && customer_name && customer_phone) {
    await admin.from('invoices').insert({
      partner_id:     session.partner_id,
      worker_id:      session.worker_id,
      cycle_id,
      transaction_id: tx.id,
      customer_id,
      customer_name,
      customer_phone,
      amount,
      description:    service_desc || description || null,
      currency:       cycle.currency ?? 'SAR',
    });
  }

  // إشعار تيليجرام للمالك
  try {
    const { data: partner } = await admin
      .from('partners')
      .select('telegram_chat_id, currency')
      .eq('id', session.partner_id)
      .single();

    if (partner?.telegram_chat_id) {
      let msg = buildTransactionMessage({
        type:        tx.type as any,
        amount:      tx.amount,
        workerName:  session.full_name,
        currency:    partner.currency,
        description: tx.description,
        cycleLabel:  cycle.title ?? `دورة #${cycle_id.slice(0, 8)}`,
      });
      if (customer_name) msg += `\n👤 الزبون: ${customer_name}`;
      if (issue_invoice) msg += '\n🧾 تم إصدار فاتورة';

      await sendTelegramMessage(partner.telegram_chat_id, msg);
    }
  } catch (e) {
    console.error('[worker/transactions] Telegram error:', e);
  }

  return NextResponse.json({ transaction: tx }, { status: 201 });
}
