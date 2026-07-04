import { createServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import type { Partner } from '@/types';

export async function getAuthenticatedPartner(): Promise<
  { partner: Partner; error: null } | { partner: null; error: NextResponse }
> {
  const supabase = await createServerClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return {
      partner: null,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  const { data: partner, error: partnerError } = await supabase
    .from('partners')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (partnerError || !partner) {
    return {
      partner: null,
      error: NextResponse.json({ error: 'Partner not found' }, { status: 404 }),
    };
  }

  return { partner, error: null };
}
