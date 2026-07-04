import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { getAuthenticatedPartner } from '@/lib/auth';
import { sendTelegramMessage, buildTransactionMessage } from '@/lib/telegram';
import { z } from 'zod';

const TransferSchema = z.object({
  cycle_id:    z.string().uuid(),
  worker_id:   z.string().uuid(),
  amount:      z.number().positive(),
  direction:   z.enum(['to_worker', 'to_partner']),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { partner, error } = await getAuthenticatedPartner();
    if (error) return error;

    const parsed = TransferSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
    }

    const { cycle_id, worker_id, amount, direction, description } = parsed.data;
    const supabase = await createServerClient();

    const { data: cycle } = await supabase
      .from('financial_cycles')
      .select('id, status, title')
      .eq('id', cycle_id)
      .eq('partner_id', partner.id)
      .single();

    if (!cycle) {
      return NextResponse.json({ error: 'Cycle not found' }, { status: 404 });
    }
    if (cycle.status === 'settled') {
      return NextResponse.json({ error: 'Cycle is already settled' }, { status: 409 });
    }

    const type = direction === 'to_worker' ? 'transfer_to_worker' : 'transfer_to_partner';

    const { data: tx, error: dbError } = await supabase
      .from('transactions')
      .insert({
        cycle_id,
        partner_id:  partner.id,
        worker_id,
        type,
        amount,
        description: description ?? (direction === 'to_worker' ? 'سلفة للسائق' : 'تحويل للشريك'),
        recorded_by: 'partner',
      })
      .select()
      .single();

    if (dbError) throw dbError;

    try {
      if (!partner.telegram_chat_id) {
        console.log(`[telegram] لم يُرسل إشعار للتحويل ${tx.id} — الشريك ${partner.id} لم يربط حساب تيليجرام بعد`);
      } else {
        const { data: worker } = await supabase
          .from('workers')
          .select('full_name')
          .eq('id', worker_id)
          .single();

        const sent = await sendTelegramMessage(
          partner.telegram_chat_id,
          buildTransactionMessage({
            type:        tx.type,
            amount:      tx.amount,
            workerName:  worker?.full_name ?? 'غير معروف',
            currency:    partner.currency,
            description: tx.description,
            cycleLabel:  cycle.title ?? `دورة #${cycle.id.slice(0, 8)}`,
          })
        );
        if (!sent) console.error('[POST /api/transfers] فشل إرسال إشعار تيليجرام للتحويل', tx.id);
      }
    } catch (notifyErr) {
      console.error('[POST /api/transfers] خطأ غير متوقع أثناء إرسال الإشعار:', notifyErr);
    }

    return NextResponse.json({ transaction: tx }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/transfers]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
