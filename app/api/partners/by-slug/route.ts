import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    console.log('[GET /api/partners/by-slug] Looking for slug:', slug);

    // استخدم Admin client لجلب بيانات الشريك
    const adminClient = createAdminClient();

    // جلب بيانات الشريك من الـ slug
    const { data: partner, error } = await adminClient
      .from('partners')
      .select('id, company_name, logo_url, theme, slug, user_id')
      .eq('slug', slug.toLowerCase())
      .maybeSingle();

    console.log('[GET /api/partners/by-slug] Query result:', { partner, error });

    if (error || !partner) {
      console.error('[GET /api/partners/by-slug] Partner not found:', error?.message);
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    console.log('[GET /api/partners/by-slug] Found partner:', partner.company_name);

    // جلب البريد الإلكتروني من auth.users باستخدام user_id
    let email: string | null = null;
    if (partner.user_id) {
      try {
        const adminClient = createAdminClient();
        const { data: { user }, error: userError } = await adminClient.auth.admin.getUserById(partner.user_id);

        if (!userError && user?.email) {
          email = user.email;
          console.log('[GET /api/partners/by-slug] Email found:', email);
        } else {
          console.warn('[GET /api/partners/by-slug] Could not fetch email:', userError?.message);
        }
      } catch (err) {
        console.error('[GET /api/partners/by-slug] Error fetching user email:', err);
      }
    }

    // إرجاع بيانات الشريك مع البريد الإلكتروني
    return NextResponse.json({
      partner: {
        ...partner,
        email: email, // أضفنا البريد الإلكتروني هنا
      }
    });
  } catch (err) {
    console.error('[GET /api/partners/by-slug]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
