import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log('[DEBUG] No user found:', userError?.message);
      return NextResponse.json({
        status: 'not_logged_in',
        error: userError?.message,
        cookies: req.cookies.getAll().map(c => ({ name: c.name, length: c.value.length }))
      });
    }

    const { data: partner, error: partnerError } = await supabase
      .from('partners')
      .select('id, company_name, user_id')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      status: 'logged_in',
      user: {
        id: user.id,
        email: user.email
      },
      partner: partner || null,
      partnerError: partnerError?.message || null
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'error',
      error: err.message
    });
  }
}
