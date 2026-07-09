import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { getAuthenticatedPartner } from '@/lib/auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const UpdatePasswordSchema = z.object({
  new_password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { partner, error } = await getAuthenticatedPartner();
    if (error) return error;

    const { id } = await params;
    const body = await req.json();
    const parsed = UpdatePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
    }

    const { new_password } = parsed.data;
    const supabase = await createServerClient();

    // تحقق من أن السائق ينتمي للشريك
    const { data: worker, error: checkError } = await supabase
      .from('workers')
      .select('id')
      .eq('id', id)
      .eq('partner_id', partner.id)
      .single();

    if (checkError || !worker) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    }

    // تحديث كلمة المرور
    const password_hash = await bcrypt.hash(new_password, 12);
    const { error: updateError } = await supabase
      .from('workers')
      .update({ password_hash })
      .eq('id', id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, message: 'تم تحديث كلمة المرور بنجاح' });
  } catch (err) {
    console.error('[PUT /api/drivers/:id/password]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
