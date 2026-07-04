import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { getAuthenticatedPartner } from '@/lib/auth';
import { z } from 'zod';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const { id } = await params;
  const supabase = await createServerClient();

  const { data, error: dbError } = await supabase
    .from('equipment')
    .select(`
      *,
      equipment_type:equipment_types(id, name, name_en),
      assigned_worker:workers(id, full_name, username)
    `)
    .eq('partner_id', partner.id)
    .eq('id', id)
    .single();

  if (dbError || !data) {
    return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
  }

  return NextResponse.json({ equipment: data });
}

const UpdateEquipmentSchema = z.object({
  equipment_type_id:  z.string().uuid().optional(),
  assigned_worker_id: z.string().uuid().nullable().optional(),
  plate_number:       z.string().optional(),
  model:              z.string().optional(),
  manufacture_year:   z.number().int().optional(),
  notes:              z.string().optional(),
  is_active:          z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { partner, error } = await getAuthenticatedPartner();
    if (error) return error;

    const { id } = await params;
    const parsed = UpdateEquipmentSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    const supabase = await createServerClient();
    const { data, error: dbError } = await supabase
      .from('equipment')
      .update(parsed.data)
      .eq('id', id)
      .eq('partner_id', partner.id)
      .select()
      .single();

    if (dbError || !data) {
      return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
    }

    return NextResponse.json({ equipment: data });
  } catch (err) {
    console.error('[PUT /api/equipment/:id]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
