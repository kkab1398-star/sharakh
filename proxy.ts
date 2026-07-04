import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_FOLDER = 'x7k9-panel-2024';

const SUPER_ADMIN_EMAILS = (process.env.SUPER_ADMIN_EMAILS ?? '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

export async function proxy(request: NextRequest) {
  // إذا لم تُضبط بيانات اعتماد Supabase، اسمح بمرور الطلب
  // (سيتعطل في route handlers والتطبيق لاحقاً بطريقة واضحة)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const adminPath = process.env.SUPER_ADMIN_SECRET_PATH || ADMIN_FOLDER;
  const email = user?.email?.toLowerCase();
  const isSuperAdmin = !!email && SUPER_ADMIN_EMAILS.includes(email);
  const secretPathMatchesFolder = adminPath === ADMIN_FOLDER;

  if (!isSuperAdmin || !secretPathMatchesFolder) {
    // 404 صامت وليس 403 أو redirect لتسجيل الدخول — لا نكشف حتى بوجود اللوحة
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/x7k9-panel-2024/:path*', '/api/admin/:path*'],
};
