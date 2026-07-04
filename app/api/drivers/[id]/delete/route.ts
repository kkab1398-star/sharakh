import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { getAuthenticatedPartner } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { partner, error } = await getAuthenticatedPartner();
    if (error) return error;

    const { id } = await params;
    const supabase = await createServerClient();

    // 1. تحقق من وجود السائق وملكيته
    const { data: worker, error: workerError } = await supabase
      .from('workers')
      .select('id, full_name, partner_id')
      .eq('id', id)
      .eq('partner_id', partner.id)
      .single();

    if (workerError || !worker) {
      return NextResponse.json({ error: 'السائق غير موجود' }, { status: 404 });
    }

    // 2. تحقق من عدم وجود دورة مالية مفتوحة للسائق
    const { data: openCycles, error: cycleError } = await supabase
      .from('financial_cycles')
      .select('id')
      .eq('worker_id', id)
      .eq('status', 'open');

    if (openCycles && openCycles.length > 0) {
      return NextResponse.json(
        { error: `لا يمكن حذف السائق - لديه ${openCycles.length} دورة مالية مفتوحة. أقفلها أولاً.` },
        { status: 409 }
      );
    }

    // 3. حذف (soft delete) - ضبط is_active = false بدل الحذف النهائي
    const { error: updateError } = await supabase
      .from('workers')
      .update({ is_active: false })
      .eq('id', id);

    if (updateError) throw updateError;

    // 4. حذف العقود للسائق
    await supabase
      .from('worker_contracts')
      .delete()
      .eq('worker_id', id);

    return NextResponse.json({
      success: true,
      message: `تم حذف ${worker.full_name} بنجاح`,
    });
  } catch (err) {
    console.error('[POST /api/drivers/:id/delete]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
