"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { FinancialCycle } from '@/types';
import { currencySymbol } from '@/lib/currency';

export default function CyclesPage() {
  const [cycles, setCycles] = useState<FinancialCycle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cycles')
      .then(r => r.json())
      .then(d => setCycles(d.cycles ?? []))
      .finally(() => setLoading(false));
  }, []);

  const open    = cycles.filter(c => c.status === 'open');
  const settled = cycles.filter(c => c.status === 'settled');

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#FFFFFF]">الدورات المالية</h1>
          <p className="text-sm text-[#A0A0A0] mt-1">{open.length} مفتوحة · {settled.length} مقفلة</p>
        </div>
        <Link href="/dashboard/cycles/new" className="bg-[#FFCD11] text-[#1A1A1A] px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#FFD700] transition">
          + دورة جديدة
        </Link>
      </div>

      {loading ? (
        <div className="p-8 text-center text-[#A0A0A0]">جاري التحميل...</div>
      ) : cycles.length === 0 ? (
        <div className="bg-[#2A2A2A] rounded-xl shadow-sm border border-[#3D3D3D] p-12 text-center">
          <p className="text-3xl mb-3">💰</p>
          <p className="text-[#A0A0A0] font-medium">لا توجد دورات مالية بعد</p>
          <Link href="/dashboard/cycles/new" className="mt-3 inline-block text-[#FFCD11] text-sm hover:underline">ابدأ الآن</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {cycles.map(cycle => {
            const worker = cycle.worker as any;
            const sym = currencySymbol(cycle.currency ?? 'SAR');
            return (
              <Link
                key={cycle.id}
                href={`/dashboard/cycles/${cycle.id}`}
                className="block bg-[#2A2A2A] rounded-xl shadow-sm border border-[#3D3D3D] p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${cycle.status === 'open' ? 'bg-[#3D3D3D] text-[#FFCD11]' : 'bg-[#1A1A1A] text-[#A0A0A0]'}`}>
                        {cycle.status === 'open' ? 'مفتوحة' : 'مقفلة'}
                      </span>
                      <h3 className="font-bold text-[#FFFFFF]">
                        {cycle.title ?? `دورة ${new Date(cycle.started_at).toLocaleDateString('en-US')}`}
                      </h3>
                    </div>
                    <p className="text-xs text-[#A0A0A0] mt-1">
                      {worker?.full_name ?? '—'} · {new Date(cycle.started_at).toLocaleDateString('en-US')}
                    </p>
                  </div>
                  <div className="text-left space-y-1">
                    <p className="font-black text-[#FFCD11] text-lg">
                      {Number(cycle.total_income).toLocaleString('en-US')} {sym}
                    </p>
                    {cycle.status === 'settled' && (
                      <p className="text-xs text-[#A0A0A0]">
                        صافي: {Number(cycle.net_amount).toLocaleString('en-US')} {sym}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
