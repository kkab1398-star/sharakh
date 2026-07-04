import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { getAuthenticatedPartner } from '@/lib/auth';
import { z } from 'zod';

export async function GET() {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const supabase = await createServerClient();
  const { data } = await supabase
    .from('equipment_types')
    .select('*')
    .eq('partner_id', partner.id)
    .order('name');

  return NextResponse.json({ equipment_types: data ?? [] });
}

const CreateTypeSchema = z.object({
  name:    z.string().min(2),
  name_en: z.string().optional(),
  icon:    z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { partner, error } = await getAuthenticatedPartner();
    if (error) return error;

    const parsed = CreateTypeSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    const supabase = await createServerClient();
    const { data, error: dbError } = await supabase
      .from('equipment_types')
      .insert({ ...parsed.data, partner_id: partner.id })
      .select()
      .single();

    if (dbError) throw dbError;
    return NextResponse.json({ equipment_type: data }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/equipment-types]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
