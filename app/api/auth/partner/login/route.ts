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
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const supabase = await createServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const { data: partner } = await supabase
      .from('partners')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    return NextResponse.json({ partner, session: data.session });

  } catch (err) {
    console.error('[POST /api/auth/partner/login]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
