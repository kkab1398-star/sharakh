import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { getWorkerSession } from '@/lib/worker-auth';
import { getAuthenticatedPartner } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  const field = req.nextUrl.searchParams.get('field') ?? 'name'; // 'name' | 'phone'

  if (q.length < 2) {
    return NextResponse.json({ customers: [] });
  }

  // دعم كلا النوعين من المستخدمين: شريك وسائق
  let partner_id: string | null = null;

  const workerSession = await getWorkerSession(req);
  if (workerSession) {
    partner_id = workerSession.partner_id;
  } else {
    const { partner, error } = await getAuthenticatedPartner();
    if (error) return error;
    partner_id = partner.id;
  }

  const admin = createAdminClient();
  const column = field === 'phone' ? 'phone' : 'full_name';

  const { data } = await admin
    .from('customers')
    .select('id, full_name, phone')
    .eq('partner_id', partner_id)
    .ilike(column, `%${q}%`)
    .order('full_name')
    .limit(10);

  return NextResponse.json({ customers: data ?? [] });
}
