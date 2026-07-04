import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { getAuthenticatedPartner } from '@/lib/auth';
import { z } from 'zod';

export async function GET() {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const supabase = await createServerClient();
  const { data } = await supabase
    .from('financial_cycles')
    .select(`
      *,
      worker:workers(id, full_name, username),
      equipment(id, plate_number, model, equipment_type:equipment_types(name))
    `)
    .eq('partner_id', partner.id)
    .order('created_at', { ascending: false });

  return NextResponse.json({ cycles: data ?? [] });
}

const CreateCycleSchema = z.object({
  worker_id:    z.string().uuid(),
  equipment_id: z.string().uuid().optional(),
  title:        z.string().optional(),
  currency:     z.enum(['SAR', 'USD', 'AED', 'KWD']).optional(),
  notes:        z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { partner, error } = await getAuthenticatedPartner();
    if (error) return error;

    const parsed = CreateCycleSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
    }

    const supabase = await createServerClient();

    // التحقق أن السائق تابع لهذا الشريك
    const { data: worker } = await supabase
      .from('workers')
      .select('id')
      .eq('id', parsed.data.worker_id)
      .eq('partner_id', partner.id)
      .eq('is_active', true)
      .single();

    if (!worker) {
      return NextResponse.json({ error: 'Worker not found or inactive' }, { status: 404 });
    }

    const { data: cycle, error: dbError } = await supabase
      .from('financial_cycles')
      .insert({
        ...parsed.data,
        partner_id: partner.id,
        currency:   parsed.data.currency ?? partner.currency,
      })
      .select()
      .single();

    if (dbError) throw dbError;
    return NextResponse.json({ cycle }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/cycles]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
