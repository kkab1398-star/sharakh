'use client';

import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card, HeaderCard } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function DriversPage() {
  const drivers = [
    {
      id: 1,
      name: 'Ahmed Al-Mansouri',
      status: 'active',
      rides: 342,
      rating: 4.8,
      earnings: '$18,540',
      joinDate: '2024-01-15',
    },
    {
      id: 2,
      name: 'Mohammed Al-Dosary',
      status: 'active',
      rides: 128,
      rating: 4.6,
      earnings: '$7,230',
      joinDate: '2024-03-22',
    },
    {
      id: 3,
      name: 'Khalid Al-Otaibi',
      status: 'suspended',
      rides: 45,
      rating: 3.2,
      earnings: '$1,890',
      joinDate: '2024-05-10',
    },
    {
      id: 4,
      name: 'Fahad Al-Shammari',
      status: 'active',
      rides: 267,
      rating: 4.9,
      earnings: '$15,640',
      joinDate: '2024-02-01',
    },
  ];

  return (
    <MainLayout>
      <HeaderCard
        title="Drivers"
        description="Manage all your drivers"
        action={
          <Button variant="primary" size="md" asChild>
            <Link href="/dashboard/add-driver">➕ Add Driver</Link>
          </Button>
        }
      />

      {/* Search & Filter */}
      <div className="mb-6">
        <Input
          placeholder="Search drivers by name or email..."
          type="text"
        />
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver) => (
          <Link key={driver.id} href={`/dashboard/drivers/${driver.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#FFCD11] bg-opacity-10 flex items-center justify-center text-xl flex-shrink-0">
                  👤
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{driver.name}</h3>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${
                      driver.status === 'active'
                        ? 'bg-[#10B981] bg-opacity-20 text-[#10B981]'
                        : 'bg-[#EF4444] bg-opacity-20 text-[#EF4444]'
                    }`}
                  >
                    {driver.status === 'active' ? '🟢 Active' : '🔴 Suspended'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b border-[#2A3A4A]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B92A1]">Total Rides</span>
                  <span className="font-semibold text-white">{driver.rides}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B92A1]">Rating</span>
                  <span className="font-semibold text-white">⭐ {driver.rating}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B92A1]">Earnings</span>
                  <span className="font-semibold text-white">{driver.earnings}</span>
                </div>
              </div>

              <p className="text-xs text-[#8B92A1] mb-3">
                Joined {new Date(driver.joinDate).toLocaleDateString()}
              </p>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" fullWidth>
                  📋 View
                </Button>
                <Button variant="ghost" size="sm" fullWidth>
                  ✏️ Edit
                </Button>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <p className="text-xs text-[#8B92A1] font-semibold mb-2">ACTIVE DRIVERS</p>
          <p className="text-2xl font-bold text-[#FFCD11]">24</p>
          <p className="text-xs text-[#10B981] mt-2">↑ 2 this month</p>
        </Card>
        <Card>
          <p className="text-xs text-[#8B92A1] font-semibold mb-2">TOTAL RIDES</p>
          <p className="text-2xl font-bold text-[#FFCD11]">2,847</p>
          <p className="text-xs text-[#10B981] mt-2">↑ 12% growth</p>
        </Card>
        <Card>
          <p className="text-xs text-[#8B92A1] font-semibold mb-2">AVG RATING</p>
          <p className="text-2xl font-bold text-[#FFCD11]">4.6</p>
          <p className="text-xs text-[#10B981] mt-2">⭐ Excellent</p>
        </Card>
        <Card>
          <p className="text-xs text-[#8B92A1] font-semibold mb-2">TOTAL EARNINGS</p>
          <p className="text-2xl font-bold text-[#FFCD11]">$318K</p>
          <p className="text-xs text-[#10B981] mt-2">↑ 18% YoY</p>
        </Card>
      </div>
    </MainLayout>
  );
}