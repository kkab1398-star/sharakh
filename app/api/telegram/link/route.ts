import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { getAuthenticatedPartner } from '@/lib/auth';
import { findChatIdByCode } from '@/lib/telegram';

export async function POST() {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  if (!process.env.TELEGRAM_BOT_TOKEN) {
    return NextResponse.json({ error: 'لم يتم تهيئة بوت تيليجرام بعد من قبل المطوّر' }, { status: 503 });
  }

  const code = partner.id.slice(0, 8).toUpperCase();
  const chatId = await findChatIdByCode(code);

  if (!chatId) {
    return NextResponse.json(
      { error: 'لم نجد رسالة تحمل هذا الرمز بعد. تأكد أنك أرسلت الرمز كرسالة للبوت ثم اضغط "تحقق" مرة أخرى' },
      { status: 404 }
    );
  }

  const supabase = await createServerClient();
  const { error: dbError } = await supabase
    .from('partners')
    .update({ telegram_chat_id: chatId })
    .eq('id', partner.id);

  if (dbError) {
    return NextResponse.json({ error: 'فشل حفظ الربط' }, { status: 500 });
  }

  return NextResponse.json({ success: true, chat_id: chatId });
}

export async function DELETE() {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const supabase = await createServerClient();
  await supabase.from('partners').update({ telegram_chat_id: null }).eq('id', partner.id);

  return NextResponse.json({ success: true });
}
