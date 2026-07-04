import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { getAuthenticatedPartner } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { partner, error } = await getAuthenticatedPartner();
    if (error) return error;

    const supabase = await createServerClient();

    // تحديث is_first_login = false
    const { data, error: updateError } = await supabase
      .from('partners')
      .update({ is_first_login: false })
      .eq('id', partner.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ partner: data });
  } catch (err) {
    console.error('[POST /api/partners/me/first-login]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
