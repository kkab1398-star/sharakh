import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { getAuthenticatedPartner } from '@/lib/auth';
import { z } from 'zod';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const { id } = await params;
  const supabase = await createServerClient();

  const { data: worker, error: dbError } = await supabase
    .from('workers')
    .select(`
      id, full_name, username, phone, is_active, created_at,
      worker_contracts(id, profit_percentage, effective_from, effective_to)
    `)
    .eq('partner_id', partner.id)
    .eq('id', id)
    .single();

  if (dbError || !worker) {
    return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
  }

  return NextResponse.json({ worker });
}

const UpdateDriverSchema = z.object({
  full_name:         z.string().min(2).optional(),
  phone:             z.string().optional(),
  profit_percentage: z.number().min(1).max(99).optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { partner, error } = await getAuthenticatedPartner();
    if (error) return error;

    const { id } = await params;
    const body = await req.json();
    const parsed = UpdateDriverSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
    }

    const { profit_percentage, ...workerData } = parsed.data;
    const supabase = await createServerClient();

    const { data: worker, error: dbError } = await supabase
      .from('workers')
      .update(workerData)
      .eq('id', id)
      .eq('partner_id', partner.id)
      .select()
      .single();

    if (dbError || !worker) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    }

    if (profit_percentage !== undefined) {
      await supabase.from('worker_contracts').insert({
        partner_id:        partner.id,
        worker_id:         id,
        profit_percentage,
        effective_from:    new Date().toISOString().split('T')[0],
      });
    }

    return NextResponse.json({ worker });
  } catch (err) {
    console.error('[PUT /api/drivers/:id]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
