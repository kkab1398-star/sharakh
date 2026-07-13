'use client';

import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card, StatCard, HeaderCard } from '@/components/ui/Card';

export default function DashboardPage() {
  const stats = [
    {
      icon: '💰',
      label: 'Total Income',
      value: '$12,540',
      change: 12,
      trend: 'up' as const,
    },
    {
      icon: '👥',
      label: 'Active Drivers',
      value: '24',
      change: 5,
      trend: 'up' as const,
    },
    {
      icon: '🚜',
      label: 'Equipment',
      value: '42',
      change: 2,
      trend: 'down' as const,
    },
    {
      icon: '📈',
      label: 'Monthly Profit',
      value: '$8,240',
      change: 18,
      trend: 'up' as const,
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'income',
      amount: '+$450',
      description: 'Ahmed - Equipment Rental',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'expense',
      amount: '-$150',
      description: 'Fuel Supply',
      time: '4 hours ago',
    },
    {
      id: 3,
      type: 'transfer',
      amount: '+$300',
      description: 'Driver Advance Payment',
      time: '1 day ago',
    },
  ];

  return (
    <MainLayout>
      {/* Page Header */}
      <HeaderCard
        title="Dashboard"
        description="Welcome back! Here's your business overview"
        action={
          <Button variant="primary" size="md">
            📊 Generate Report
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
            <Link
              href="/dashboard/transactions"
              className="text-[#FFCD11] text-sm font-semibold hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <Card
                key={tx.id}
                hoverable={false}
                padding="md"
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#FFCD11] bg-opacity-10 flex items-center justify-center text-lg">
                    {tx.type === 'income'
                      ? '↑'
                      : tx.type === 'expense'
                      ? '↓'
                      : '→'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">
                      {tx.description}
                    </p>
                    <p className="text-xs text-[#8B92A1]">{tx.time}</p>
                  </div>
                </div>
                <p
                  className={`text-sm font-bold ${
                    tx.type === 'income'
                      ? 'text-[#10B981]'
                      : 'text-[#EF4444]'
                  }`}
                >
                  {tx.amount}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>

          <div className="space-y-3">
            <Button
              variant="primary"
              fullWidth
              leftIcon="➕"
              asChild
            >
              <Link href="/dashboard/add-driver">Add Driver</Link>
            </Button>

            <Button
              variant="secondary"
              fullWidth
              leftIcon="🚜"
              asChild
            >
              <Link href="/dashboard/equipment">Add Equipment</Link>
            </Button>

            <Button
              variant="ghost"
              fullWidth
              leftIcon="📋"
              asChild
            >
              <Link href="/dashboard/transactions">View Transactions</Link>
            </Button>

            <Button
              variant="ghost"
              fullWidth
              leftIcon="⚙️"
              asChild
            >
              <Link href="/dashboard/settings">Settings</Link>
            </Button>
          </div>

          {/* Info Card */}
          <Card className="mt-6 bg-gradient-to-br from-[#FFCD11]/10 to-[#FFCD11]/5 border-[#FFCD11]/20">
            <div className="flex gap-3">
              <div className="text-2xl flex-shrink-0">💡</div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">
                  Tip of the Day
                </p>
                <p className="text-xs text-[#B8BEC3]">
                  Keep your driver profiles updated for better management and
                  compliance.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
