import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { getAuthenticatedPartner } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const { id } = await params;
  const supabase = await createServerClient();

  const { data: cycle, error: dbError } = await supabase
    .from('financial_cycles')
    .select(`
      *,
      worker:workers(id, full_name, username, phone),
      equipment(id, plate_number, model, equipment_type:equipment_types(name))
    `)
    .eq('partner_id', partner.id)
    .eq('id', id)
    .single();

  if (dbError || !cycle) {
    return NextResponse.json({ error: 'Cycle not found' }, { status: 404 });
  }

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('cycle_id', id)
    .order('created_at', { ascending: false });

  return NextResponse.json({ cycle, transactions: transactions ?? [] });
}
