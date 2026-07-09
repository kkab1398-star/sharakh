import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import { canAccessSystem } from '@/lib/subscription';
import Sidebar from '@/components/layout/Sidebar';
import DashboardLayoutClient from '@/components/layout/DashboardLayoutClient';

async function getPartnerWithSubscription() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: partner } = await supabase
      .from('partners')
      .select('id, company_name, logo_url, currency, locale, phone_primary, phone_wa, subscription_status, plan, trial_ends_at, subscription_ends_at, is_first_login')
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

  // فرض تغيير كلمة المرور عند أول دخول
  if (partner.is_first_login) {
    redirect('/change-password');
  }

  // تحقق من الاشتراك — إذا انتهى أعد التوجيه
  if (!canAccessSystem(partner)) {
    redirect('/trial-expired');
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
