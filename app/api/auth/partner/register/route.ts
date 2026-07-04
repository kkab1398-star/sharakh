import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { z } from 'zod';

const RegisterSchema = z.object({
  email:        z.string().email(),
  password:     z.string().min(8),
  company_name: z.string().min(2),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { email, password, company_name } = parsed.data;
    const admin = createAdminClient();

    // ننشئ المستخدم عبر العميل الإداري ونؤكد بريده تلقائياً،
    // حتى لا تتعطل العملية بانتظار تأكيد بريد لن يصل أو لن يُفتح فوراً
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      const isDuplicate = authError?.message?.toLowerCase().includes('already');
      return NextResponse.json(
        { error: isDuplicate ? 'هذا البريد مسجّل بالفعل' : (authError?.message || 'فشل إنشاء الحساب') },
        { status: isDuplicate ? 409 : 400 }
      );
    }

    // الإدراج عبر العميل الإداري (service role) يتجاوز RLS تماماً،
    // فلا يعتمد على وجود جلسة (session) عند هذه اللحظة
    const { data: partner, error: partnerError } = await admin
      .from('partners')
      .insert({
        user_id:      authData.user.id,
        company_name,
        currency:     'SAR',
        locale:       'ar',
        theme:        'light',
      })
      .select()
      .single();

    if (partnerError) {
      // لا نترك مستخدم Auth يتيماً بلا partner — نحذفه فوراً عند فشل الإدراج
      await admin.auth.admin.deleteUser(authData.user.id);
      console.error('[POST /api/auth/partner/register] partner insert failed:', partnerError);
      return NextResponse.json(
        { error: 'فشل إنشاء حساب الشريك' },
        { status: 500 }
      );
    }

    return NextResponse.json({ partner }, { status: 201 });

  } catch (err) {
    console.error('[POST /api/auth/partner/register]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
