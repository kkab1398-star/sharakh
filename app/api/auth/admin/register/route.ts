import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // تحقق من أن البريد موجود في SUPER_ADMIN_EMAILS
    const SUPER_ADMIN_EMAILS = (process.env.SUPER_ADMIN_EMAILS ?? '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);

    if (!SUPER_ADMIN_EMAILS.includes(email.toLowerCase())) {
      console.log('[admin/register] Unauthorized email:', email);
      return NextResponse.json(
        { error: 'This email is not authorized as Super Admin' },
        { status: 403 }
      );
    }

    // أنشئ حساب Auth فقط (بدون partner)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      const isDuplicate = authError?.message?.toLowerCase().includes('already');
      return NextResponse.json(
        { error: isDuplicate ? 'هذا البريد مسجّل بالفعل' : (authError?.message || 'فشل إنشاء الحساب') },
        { status: isDuplicate ? 409 : 400 }
      );
    }

    // لا ننشئ سجل partner - Super Admin لا يحتاج partner record
    console.log('[admin/register] Super Admin created:', email);

    return NextResponse.json({ user: authData.user }, { status: 201 });
  } catch (err) {
    console.error('[admin/register]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
