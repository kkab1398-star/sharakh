import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';
import { getAuthenticatedPartner } from '@/lib/auth';

// رفع تقرير PDF لدورة مُسوّاة وحفظ رابطه الثابت — يُستدعى مرة واحدة بعد التسوية
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const { id } = await params;
  const supabase = await createServerClient();

  const { data: cycle } = await supabase
    .from('financial_cycles')
    .select('id, status')
    .eq('id', id)
    .eq('partner_id', partner.id)
    .single();

  if (!cycle) {
    return NextResponse.json({ error: 'Cycle not found' }, { status: 404 });
  }
  if (cycle.status !== 'settled') {
    return NextResponse.json({ error: 'لا يمكن إصدار تقرير لدورة غير مُسوّاة' }, { status: 409 });
  }

  const formData = await req.formData();
  const file = formData.get('file');
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: 'لم يتم إرفاق ملف' }, { status: 400 });
  }

  const admin = createAdminClient();
  const path = `${partner.id}/${id}.pdf`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from('reports')
    .upload(path, buffer, { contentType: 'application/pdf', upsert: true });

  if (uploadError) {
    console.error('[POST /api/cycles/:id/report] فشل رفع الملف:', uploadError);
    return NextResponse.json({ error: 'فشل رفع التقرير' }, { status: 500 });
  }

  const { data: publicUrlData } = admin.storage.from('reports').getPublicUrl(path);
  const reportUrl = publicUrlData.publicUrl;

  await supabase.from('financial_cycles').update({ report_url: reportUrl }).eq('id', id);

  return NextResponse.json({ report_url: reportUrl });
}
