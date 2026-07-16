'use client';

import { UberCard, UberButton } from '@/components/ui';
import { colors } from '@/lib/design-system';

export default function PartnerDashboard() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg.light }}>
      {/* MAIN CONTENT */}
      <div className="p-8">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold" style={{ color: colors.text.primary }}>
            🚚 Partner Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage your equipment and drivers</p>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <UberCard className="p-6">
            <div className="text-sm font-semibold" style={{ color: colors.text.secondary }}>
              Active Equipment
            </div>
            <div className="text-3xl font-bold mt-3" style={{ color: colors.uberYellow }}>
              12
            </div>
          </UberCard>

          <UberCard className="p-6">
            <div className="text-sm font-semibold" style={{ color: colors.text.secondary }}>
              Active Drivers
            </div>
            <div className="text-3xl font-bold mt-3" style={{ color: colors.uberBlue }}>
              8
            </div>
          </UberCard>

          <UberCard className="p-6">
            <div className="text-sm font-semibold" style={{ color: colors.text.secondary }}>
              Daily Income
            </div>
            <div className="text-3xl font-bold mt-3" style={{ color: colors.success }}>
              $1,450
            </div>
          </UberCard>

          <UberCard className="p-6">
            <div className="text-sm font-semibold" style={{ color: colors.text.secondary }}>
              Monthly Earnings
            </div>
            <div className="text-3xl font-bold mt-3" style={{ color: colors.uberBlack }}>
              $38,200
            </div>
          </UberCard>
        </div>

        {/* ACTION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UberCard className="p-6 flex flex-col items-center text-center">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-lg font-bold" style={{ color: colors.text.primary }}>
              Add Driver
            </h3>
            <p className="text-sm mt-2" style={{ color: colors.text.secondary }}>
              Register a new driver
            </p>
            <UberButton variant="primary" size="md" className="mt-4 w-full">
              + Add Driver
            </UberButton>
          </UberCard>

          <UberCard className="p-6 flex flex-col items-center text-center">
            <div className="text-4xl mb-4">🏗️</div>
            <h3 className="text-lg font-bold" style={{ color: colors.text.primary }}>
              Add Equipment
            </h3>
            <p className="text-sm mt-2" style={{ color: colors.text.secondary }}>
              Register new equipment
            </p>
            <UberButton variant="primary" size="md" className="mt-4 w-full">
              + Add Equipment
            </UberButton>
          </UberCard>

          <UberCard className="p-6 flex flex-col items-center text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-bold" style={{ color: colors.text.primary }}>
              View Reports
            </h3>
            <p className="text-sm mt-2" style={{ color: colors.text.secondary }}>
              Analytics and insights
            </p>
            <UberButton variant="secondary" size="md" className="mt-4 w-full">
              View Reports
            </UberButton>
          </UberCard>
        </div>
      </div>
    </div>
  );
}
