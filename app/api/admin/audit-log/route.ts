import { NextResponse } from 'next/server';
import { assertSuperAdmin, createSuperAdminClient } from '@/lib/super-admin';

export async function GET() {
  const auth = await assertSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  const admin = createSuperAdminClient();

  const { data: logs } = await admin
    .from('audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return NextResponse.json({ logs: logs ?? [] });
}
