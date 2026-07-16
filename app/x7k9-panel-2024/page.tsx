'use client';

import { UberCard, UberButton } from '@/components/ui';
import { colors } from '@/lib/design-system';

export default function SuperAdminDashboard() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg.light }}>
      {/* MAIN CONTENT */}
      <div className="p-8">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold" style={{ color: colors.text.primary }}>
            🎯 Super Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage all tenants and system</p>
        </div>

        {/* STATS GRID - 2x2 on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* STAT 1 */}
          <UberCard className="p-6">
            <div className="text-sm font-semibold" style={{ color: colors.text.secondary }}>
              Total Tenants
            </div>
            <div className="text-3xl font-bold mt-3" style={{ color: colors.uberBlack }}>
              24
            </div>
            <div className="text-xs mt-2" style={{ color: colors.text.tertiary }}>
              Active subscriptions
            </div>
          </UberCard>

          {/* STAT 2 */}
          <UberCard className="p-6">
            <div className="text-sm font-semibold" style={{ color: colors.text.secondary }}>
              Total Revenue
            </div>
            <div className="text-3xl font-bold mt-3" style={{ color: colors.success }}>
              $45,320
            </div>
            <div className="text-xs mt-2" style={{ color: colors.text.tertiary }}>
              This month
            </div>
          </UberCard>

          {/* STAT 3 */}
          <UberCard className="p-6">
            <div className="text-sm font-semibold" style={{ color: colors.text.secondary }}>
              Active Drivers
            </div>
            <div className="text-3xl font-bold mt-3" style={{ color: colors.uberBlue }}>
              156
            </div>
            <div className="text-xs mt-2" style={{ color: colors.text.tertiary }}>
              Across all tenants
            </div>
          </UberCard>

          {/* STAT 4 */}
          <UberCard className="p-6">
            <div className="text-sm font-semibold" style={{ color: colors.text.secondary }}>
              Pending Issues
            </div>
            <div className="text-3xl font-bold mt-3" style={{ color: colors.danger }}>
              3
            </div>
            <div className="text-xs mt-2" style={{ color: colors.text.tertiary }}>
              Need attention
            </div>
          </UberCard>
        </div>

        {/* RECENT TENANTS TABLE */}
        <UberCard className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold" style={{ color: colors.text.primary }}>
              Recent Tenants
            </h2>
            <UberButton variant="primary" size="md">
              + Add Tenant
            </UberButton>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.gray[100]}` }}>
                  <th className="text-left p-3 font-semibold" style={{ color: colors.text.secondary }}>
                    Company Name
                  </th>
                  <th className="text-left p-3 font-semibold" style={{ color: colors.text.secondary }}>
                    Email
                  </th>
                  <th className="text-left p-3 font-semibold" style={{ color: colors.text.secondary }}>
                    Status
                  </th>
                  <th className="text-left p-3 font-semibold" style={{ color: colors.text.secondary }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Sharakh Co.', email: 'contact@sharakh.com', status: 'Active' },
                  { name: 'Equipment Plus', email: 'admin@eqplus.com', status: 'Active' },
                  { name: 'Fleet Managers', email: 'support@fleet.com', status: 'Pending' },
                ].map((tenant, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${colors.gray[100]}` }}>
                    <td className="p-3" style={{ color: colors.text.primary }}>
                      {tenant.name}
                    </td>
                    <td className="p-3" style={{ color: colors.text.secondary }}>
                      {tenant.email}
                    </td>
                    <td className="p-3">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: tenant.status === 'Active' ? colors.success : colors.warning,
                          color: colors.text.white,
                        }}
                      >
                        {tenant.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <UberButton variant="secondary" size="sm">
                        Edit
                      </UberButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </UberCard>
      </div>
    </div>
  );
}
