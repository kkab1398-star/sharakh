import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isSuperAdminEmail } from '@/lib/super-admin';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    const { email, password } = parsed.data;

    // تحقق من أن البريد هو Super Admin
    if (!isSuperAdminEmail(email)) {
      console.warn(`[admin/login] 🚫 UNAUTHORIZED ATTEMPT from: ${email} (IP: ${req.headers.get('x-forwarded-for') || 'unknown'})`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // حاول تسجيل الدخول عبر Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      // البريد صحيح لكن كلمة المرور خاطئة = محاولة اختراق مريبة
      console.error(`[admin/login] 🚨 SUSPECTED ATTACK: Correct email (${email}) with WRONG PASSWORD (IP: ${req.headers.get('x-forwarded-for') || 'unknown'})`);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // تسجيل دخول ناجح
    console.log(`[admin/login] ✅ Super Admin logged in successfully: ${email} (IP: ${req.headers.get('x-forwarded-for') || 'unknown'})`);

    const response = NextResponse.json({ user: data.user, session: data.session });

    // حفظ session في cookies بصيغة Supabase SSR القياسية
    if (data.session) {
      // Supabase expects the session as stringified JSON
      response.cookies.set('sb-jwekgsjmcacbhunjudwi-auth-token', JSON.stringify({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
        expires_at: data.session.expires_at,
        token_type: data.session.token_type,
      }), {
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: false,
        path: '/',
      });
    }

    return response;
  } catch (err) {
    console.error('[admin/login]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
