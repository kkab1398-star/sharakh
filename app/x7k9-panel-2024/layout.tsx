import { requireSuperAdminPage } from '@/lib/super-admin';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { email } = await requireSuperAdminPage();

  return <AdminLayoutClient email={email}>{children}</AdminLayoutClient>;
}
