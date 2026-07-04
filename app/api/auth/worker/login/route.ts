import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { signWorkerToken } from '@/lib/worker-auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const Schema = z.object({
  username:   z.string().min(1),
  password:   z.string().min(1),
  partner_id: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    const { username, password, partner_id } = parsed.data;
    const admin = createAdminClient();

    const { data: worker } = await admin
      .from('workers')
      .select('id, full_name, username, password_hash, is_active, is_frozen, partner_id')
      .eq('partner_id', partner_id)
      .eq('username', username)
      .single();

    if (!worker) {
      return NextResponse.json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' }, { status: 401 });
    }
    if (!worker.is_active) {
      return NextResponse.json({ error: 'الحساب موقوف — تواصل مع المالك' }, { status: 403 });
    }
    if (worker.is_frozen) {
      return NextResponse.json({ error: 'الحساب مجمّد مؤقتاً — تواصل مع المالك' }, { status: 403 });
    }

    const valid = await bcrypt.compare(password, worker.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    // جلب عملة الشريك لإرسالها للواجهة
    const { data: partner } = await admin
      .from('partners')
      .select('currency, company_name')
      .eq('id', partner_id)
      .single();

    const token = await signWorkerToken({
      worker_id:  worker.id,
      partner_id: worker.partner_id,
      full_name:  worker.full_name,
    });

    const res = NextResponse.json({
      worker: {
        id:           worker.id,
        full_name:    worker.full_name,
        partner_id:   worker.partner_id,
        currency:     partner?.currency ?? 'SAR',
        company_name: partner?.company_name ?? '',
      },
    });

    res.cookies.set('worker_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 30, // 30 يوم
      path:     '/',
    });

    return res;
  } catch (err) {
    console.error('[POST /api/auth/worker/login]', err);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
