import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { z } from 'zod';

const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      console.error('[Partner Login] Validation failed:', parsed.error.issues);
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    const { email, password } = parsed.data;
    console.log('[Partner Login] Attempting login for:', email);

    const supabase = await createServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('[Partner Login] Auth error:', {
        message: error.message,
        status: error.status,
        code: error.code,
      });
      return NextResponse.json({ error: error.message || 'Invalid credentials' }, { status: 401 });
    }

    if (!data.user) {
      console.error('[Partner Login] No user returned from auth');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('[Partner Login] Auth successful for user:', data.user.id);

    const { data: partner, error: partnerError } = await supabase
      .from('partners')
      .select('id, company_name, user_id, slug')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (partnerError) {
      console.error('[Partner Login] Partner query error:', {
        message: partnerError.message,
        code: partnerError.code,
      });
    }

    if (!partner) {
      console.error('[Partner Login] Partner not found for user_id:', data.user.id);
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    console.log('[Partner Login] Success for:', partner.company_name);

    return NextResponse.json({
      partner: {
        ...partner,
        user_email: data.user.email,
      },
      session: data.session,
    });

  } catch (err) {
    console.error('[POST /api/auth/partner/login]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
