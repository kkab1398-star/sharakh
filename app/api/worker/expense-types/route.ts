import { NextRequest, NextResponse } from 'next/server';
import { getWorkerSession } from '@/lib/worker-auth';
import { createAdminClient } from '@/lib/supabase-admin';

const DEFAULTS = ['وقود', 'تغيير زيت', 'تشحيم', 'كفرات', 'صيانة عامة', 'غسيل', 'رسوم ورخص', 'أخرى'];

export async function GET(req: NextRequest) {
  const session = await getWorkerSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { data } = await admin
    .from('expense_types')
    .select('id, name, is_default, sort_order')
    .eq('partner_id', session.partner_id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  // إذا لا توجد أنواع في قاعدة البيانات، نعيد القائمة الافتراضية
  if (!data || data.length === 0) {
    return NextResponse.json({
      expense_types: DEFAULTS.map((name, i) => ({ id: `default-${i}`, name, is_default: true })),
    });
  }

  return NextResponse.json({ expense_types: data });
}
