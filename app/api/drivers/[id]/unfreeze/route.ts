import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { getAuthenticatedPartner } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const { id } = await params;
  const supabase = await createServerClient();

  const { data, error: dbError } = await supabase
    .from('workers')
    .update({ is_frozen: false })
    .eq('id', id)
    .eq('partner_id', partner.id)
    .select('id, full_name, is_frozen')
    .single();

  if (dbError || !data) {
    return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
  }

  return NextResponse.json({ worker: data });
}
