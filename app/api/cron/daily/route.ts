import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { getSubscriptionState } from '@/lib/subscription';
import { sendTelegramMessage } from '@/lib/telegram';

// يُستدعى يومياً من Vercel Cron أو أي scheduler خارجي
// الحماية بـ CRON_SECRET في Authorization header

export async function GET(req: NextRequest) {
  const auth   = req.headers.get('authorization') ?? '';
  const secret = process.env.CRON_SECRET;

  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: partners } = await admin
    .from('partners')
    .select('id, company_name, telegram_chat_id, subscription_status, plan, trial_ends_at, subscription_ends_at')
    .not('telegram_chat_id', 'is', null);

  if (!partners?.length) return NextResponse.json({ sent: 0 });

  let sent = 0;

  for (const p of partners) {
    const state = getSubscriptionState(p);
    const dr    = state.days_remaining;
    const chat  = p.telegram_chat_id!;

    // تجريبي — تنبيه عند 7 أيام، 3 أيام، 1 يوم
    if (state.status === 'trial' && dr !== null) {
      if ([7, 3, 1].includes(dr)) {
        const urgent = dr === 1 ? '🚨' : dr === 3 ? '⚠️' : 'ℹ️';
        await sendTelegramMessage(chat,
          `${urgent} <b>تنبيه: ينتهي الحساب التجريبي خلال ${dr} ${dr === 1 ? 'يوم' : 'أيام'}</b>\n` +
          `🏢 ${p.company_name}\n\n` +
          `لمواصلة الخدمة تواصل معنا الآن قبل انقطاع الوصول.`
        );
        sent++;
      }

      // انتهى اليوم
      if (dr === 0) {
        await sendTelegramMessage(chat,
          `🔴 <b>انتهت فترة التجربة اليوم</b>\n` +
          `🏢 ${p.company_name}\n\n` +
          `تم تعطيل الوصول للنظام. تواصل معنا فوراً لإعادة التفعيل.`
        );
        sent++;
      }
    }

    // اشتراك سنوي — تنبيه عند 30 يوم، 7 أيام، 1 يوم
    if (state.status === 'active' && dr !== null) {
      if ([30, 7, 1].includes(dr)) {
        await sendTelegramMessage(chat,
          `📅 <b>تذكير: ينتهي اشتراكك خلال ${dr} ${dr === 1 ? 'يوم' : 'أيام'}</b>\n` +
          `🏢 ${p.company_name} — خطة ${(p.plan ?? 'basic').toUpperCase()}\n\n` +
          `تواصل معنا لتجديد الاشتراك والاستمرار بدون انقطاع.`
        );
        sent++;
      }
    }
  }

  return NextResponse.json({ sent, total: partners.length });
}
