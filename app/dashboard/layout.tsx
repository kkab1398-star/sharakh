import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import { canAccessSystem } from '@/lib/subscription';
import { cssVarsString } from '@/lib/tenant-theme';
import Sidebar from '@/components/layout/Sidebar';

async function getPartnerWithSubscription() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: partner } = await supabase
      .from('partners')
      .select('id, company_name, logo_url, currency, locale, phone_primary, phone_wa, subscription_status, plan, trial_ends_at, subscription_ends_at')
      .eq('user_id', user.id)
      .single();

    return partner ?? null;
  } catch {
    return null;
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const partner = await getPartnerWithSubscription();

  if (!partner) redirect('/login');

  // تحقق من الاشتراك — إذا انتهى أعد التوجيه
  if (!canAccessSystem(partner)) {
    redirect('/trial-expired');
  }

  const themeVars = cssVarsString({});

  return (
    <div
      style={{
        display: 'flex', minHeight: '100vh',
        background: 'var(--bg)',
        fontFamily: "'Cairo','Barlow Condensed',sans-serif",
        ['--tenant-primary' as string]:  '#FFCD11',
        ['--tenant-bg' as string]:       '#111111',
        ['--tenant-surface' as string]:  '#2A2A2A',
        ['--tenant-text' as string]:     '#FFFFFF',
        ['--tenant-muted' as string]:    '#A0A0A0',
      } as React.CSSProperties}
      dir="rtl"
    >
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh', background: 'var(--bg)' }}>
        {children}
      </main>
    </div>
  );
}
