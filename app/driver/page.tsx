'use client';

import { UberCard, UberButton } from '@/components/ui';
import { colors } from '@/lib/design-system';

export default function DriverDashboard() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg.light }}>
      {/* MAIN CONTENT - with bottom padding for BottomNav */}
      <div className="p-4 md:p-8 pb-24">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: colors.text.primary }}>
            👤 Driver Portal
          </h1>
          <p className="text-gray-600 mt-2">Your earnings and activities</p>
        </div>

        {/* BALANCE CARD - PROMINENT */}
        <UberCard className="p-6 mb-8" style={{
          backgroundImage: `linear-gradient(135deg, ${colors.uberBlue}, ${colors.uberBlack})`,
          color: colors.text.white,
        }}>
          <div>
            <div className="text-sm font-semibold opacity-90">Available Balance</div>
            <div className="text-4xl font-bold mt-3">
              $2,450
            </div>
            <div className="text-xs mt-4 opacity-75">
              Last updated: Today at 2:30 PM
            </div>
          </div>
        </UberCard>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <UberCard className="p-4">
            <div className="text-xs font-semibold" style={{ color: colors.text.secondary }}>
              Today's Earnings
            </div>
            <div className="text-2xl font-bold mt-2" style={{ color: colors.success }}>
              +$180
            </div>
          </UberCard>

          <UberCard className="p-4">
            <div className="text-xs font-semibold" style={{ color: colors.text.secondary }}>
              Total Trips
            </div>
            <div className="text-2xl font-bold mt-2" style={{ color: colors.uberBlack }}>
              42
            </div>
          </UberCard>
        </div>

        {/* RECENT TRANSACTIONS */}
        <UberCard className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold" style={{ color: colors.text.primary }}>
              Recent Transactions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { type: 'Income', amount: '+$85', time: '2 hours ago', status: 'success' },
              { type: 'Expense', amount: '-$25', time: '5 hours ago', status: 'danger' },
              { type: 'Income', amount: '+$120', time: 'Yesterday', status: 'success' },
            ].map((tx, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 rounded-lg"
                style={{ backgroundColor: colors.bg.gray }}
              >
                <div>
                  <div style={{ color: colors.text.primary }} className="font-semibold">
                    {tx.type}
                  </div>
                  <div className="text-xs" style={{ color: colors.text.secondary }}>
                    {tx.time}
                  </div>
                </div>
                <div
                  style={{ color: tx.status === 'success' ? colors.success : colors.danger }}
                  className="font-bold"
                >
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>

          <UberButton variant="secondary" size="md" className="w-full mt-4">
            View All Transactions
          </UberButton>
        </UberCard>
      </div>
    </div>
  );
}
