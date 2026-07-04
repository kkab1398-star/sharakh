const TELEGRAM_API = 'https://api.telegram.org';

export async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error('[telegram] TELEGRAM_BOT_TOKEN غير مهيأ — تم تجاهل الإرسال');
    return false;
  }
  if (!chatId) {
    console.error('[telegram] لا يوجد chat_id لهذا الشريك — تم تجاهل الإرسال');
    return false;
  }

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('[telegram] فشل الإرسال:', res.status, body);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[telegram] خطأ في الاتصال بـ Telegram API:', err);
    return false;
  }
}

const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

interface TelegramUpdate {
  message?: {
    text?: string;
    chat: { id: number };
  };
}

export async function findChatIdByCode(code: string): Promise<string | null> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/getUpdates?limit=100`);
    if (!res.ok) return null;

    const data = await res.json();
    const updates: TelegramUpdate[] = data.result ?? [];

    const target = code.toUpperCase();

    // نبحث من الأحدث للأقدم عن رسالة تطابق الرمز،
    // إما كرسالة نصية مباشرة "CODE" أو كرابط بدء تلقائي "/start CODE"
    for (let i = updates.length - 1; i >= 0; i--) {
      const raw = updates[i].message?.text?.trim().toUpperCase();
      if (!raw) continue;

      const normalized = raw.startsWith('/START') ? raw.replace('/START', '').trim() : raw;
      if (normalized === target) {
        return String(updates[i].message!.chat.id);
      }
    }
    return null;
  } catch (err) {
    console.error('[telegram] فشل البحث عن رمز الربط:', err);
    return null;
  }
}

export function buildTransactionMessage(params: {
  type: 'income' | 'expense' | 'transfer_to_partner' | 'transfer_to_worker';
  amount: number;
  workerName: string;
  currency: string;
  description?: string | null;
  cycleLabel?: string | null;
}): string {
  const { type, amount, workerName, currency, description, cycleLabel } = params;

  const labels: Record<typeof type, { icon: string; title: string }> = {
    income:               { icon: '💰', title: 'إيراد جديد' },
    expense:              { icon: '🧾', title: 'مصروف جديد' },
    transfer_to_partner:  { icon: '⬅️', title: 'تحويل من السائق إليك' },
    transfer_to_worker:   { icon: '➡️', title: 'سلفة/تحويل للسائق' },
  };

  const { icon, title } = labels[type];

  let msg = `${icon} <b>${title}</b>\n`;
  msg += `👤 السائق: ${workerName}\n`;
  msg += `💵 المبلغ: ${fmt(amount)} ${currency}\n`;
  if (description) msg += `📝 الوصف: ${description}\n`;
  if (cycleLabel)  msg += `📁 الدورة: ${cycleLabel}\n`;
  msg += `🕐 ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}`;

  return msg;
}
