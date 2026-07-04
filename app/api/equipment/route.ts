import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { getAuthenticatedPartner } from '@/lib/auth';
import { z } from 'zod';

export async function GET() {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const supabase = await createServerClient();
  const { data } = await supabase
    .from('equipment')
    .select(`
      *,
      equipment_type:equipment_types(id, name, name_en),
      assigned_worker:workers(id, full_name, username)
    `)
    .eq('partner_id', partner.id)
    .order('created_at', { ascending: false });

  return NextResponse.json({ equipment: data ?? [] });
}

const CreateEquipmentSchema = z.object({
  equipment_type_id:  z.string().uuid().optional(),
  assigned_worker_id: z.string().uuid().optional(),
  plate_number:       z.string().optional(),
  model:              z.string().optional(),
  manufacture_year:   z.number().int().min(1900).max(2100).optional(),
  notes:              z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { partner, error } = await getAuthenticatedPartner();
    if (error) return error;

    const parsed = CreateEquipmentSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
    }

    const supabase = await createServerClient();
    const { data, error: dbError } = await supabase
      .from('equipment')
      .insert({ ...parsed.data, partner_id: partner.id })
      .select()
      .single();

    if (dbError) throw dbError;
    return NextResponse.json({ equipment: data }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/equipment]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
