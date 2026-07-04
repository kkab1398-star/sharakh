// lib/super-admin.ts
// نقطة الدخول الوحيدة لصلاحيات Service Role الخاصة بلوحة السوبر أدمن.
// كل مسار API تحت /api/admin/* يجب أن يستورد من هنا فقط، وليس من lib/supabase-admin.ts مباشرة.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { notFound } from 'next/navigation';

const SUPER_ADMIN_EMAILS = (process.env.SUPER_ADMIN_EMAILS ?? '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

export function isSuperAdminEmail(email?: string | null): boolean {
  return !!email && SUPER_ADMIN_EMAILS.includes(email.toLowerCase());
}

export function createSuperAdminClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/** للاستخدام داخل Route Handlers (app/api/admin/**) — يُرجع 404 وليس 403 لمن لا يملك الصلاحية */
export async function assertSuperAdmin(): Promise<{ email: string } | NextResponse> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!isSuperAdminEmail(user?.email)) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }
  return { email: user!.email!.toLowerCase() };
}

/** للاستخدام داخل Server Components (layout.tsx / page.tsx تحت x7k9-panel-2024) */
export async function requireSuperAdminPage(): Promise<{ email: string }> {
  // إذا لم تُضبط بيانات اعتماد Supabase، أرجع 404 صامت
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    notFound();
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // إذا لم يكن المستخدم مسجل الدخول أو لا يملك صلاحية، أعد 404
  if (!user?.email || !isSuperAdminEmail(user.email)) {
    notFound();
  }
  return { email: user.email.toLowerCase() };
}

/** يسجّل كل عملية يقوم بها السوبر أدمن — يُستدعى من كل مسار API يُعدّل بيانات */
export async function logAdminAction(params: {
  actor_email: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details?: Record<string, unknown>;
}): Promise<void> {
  const admin = createSuperAdminClient();
  await admin.from('audit_log').insert({
    actor_email: params.actor_email,
    action: params.action,
    target_type: params.target_type ?? null,
    target_id: params.target_id ?? null,
    details: params.details ?? null,
  });
}
