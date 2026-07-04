import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { getAuthenticatedPartner } from '@/lib/auth';
import { z } from 'zod';

export async function GET() {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;
  return NextResponse.json({ partner });
}

const UpdatePartnerSchema = z.object({
  company_name:     z.string().min(2).optional(),
  phone_primary:    z.string().optional(),
  phone_wa:         z.string().optional(),
  telegram_chat_id: z.string().optional(),
  currency:         z.enum(['SAR', 'USD', 'AED', 'KWD']).optional(),
  locale:           z.enum(['ar', 'en']).optional(),
  theme:            z.enum(['light', 'dark']).optional(),
  address:          z.string().optional(),
  instagram:        z.string().optional(),
  x_account:          z.string().optional(),
  snapchat:         z.string().optional(),
});

export async function PUT(req: NextRequest) {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const body = await req.json();
  const parsed = UpdatePartnerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
  }

  const supabase = await createServerClient();
  const { data, error: dbError } = await supabase
    .from('partners')
    .update(parsed.data)
    .eq('id', partner.id)
    .select()
    .single();

  if (dbError) throw dbError;
  return NextResponse.json({ partner: data });
}
