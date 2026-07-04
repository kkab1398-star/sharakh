import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedPartner } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase-admin';

const BUCKET   = 'logos';
const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED  = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

export async function POST(req: NextRequest) {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const formData = await req.formData();
  const file     = formData.get('logo') as File | null;

  if (!file) return NextResponse.json({ error: 'لم يتم إرسال ملف' }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: 'الحجم أكبر من 2MB' }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: 'نوع الملف غير مدعوم' }, { status: 400 });

  const ext    = file.name.split('.').pop() ?? 'png';
  const path   = `${partner.id}/logo.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const admin = createAdminClient();

  const { error: upErr } = await admin.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(path);

  // حفظ الرابط في قاعدة البيانات
  await admin.from('partners').update({ logo_url: publicUrl }).eq('id', partner.id);

  return NextResponse.json({ logo_url: publicUrl });
}

export async function DELETE() {
  const { partner, error } = await getAuthenticatedPartner();
  if (error) return error;

  const admin = createAdminClient();

  // حذف كل الصيغ المحتملة
  for (const ext of ['png', 'jpg', 'jpeg', 'webp', 'svg']) {
    await admin.storage.from(BUCKET).remove([`${partner.id}/logo.${ext}`]);
  }

  await admin.from('partners').update({ logo_url: null }).eq('id', partner.id);
  return NextResponse.json({ ok: true });
}
