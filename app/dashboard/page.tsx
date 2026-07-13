"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import type { FinancialCycle, Partner, Worker } from '@/types';
import { currencySymbol } from '@/lib/currency';

function fmt(n: number) { return n.toLocaleString('en-US'); }

const CHART_TOOLTIP = {
  contentStyle: { background: '#2A2A2A', border: '1px solid #3D3D3D', borderRadius: 2, fontSize: 12, color: '#fff' },
  labelStyle:   { color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, fontWeight: 700 },
};

export default function DashboardPage() {
  const [cycles, setCycles]   = useState<FinancialCycle[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    Promise.all([
      fetch('/api/cycles').then(r => r.json()),
      fetch('/api/drivers').then(r => r.json()),
      fetch('/api/partners/me').then(r => r.json()),
      fetch('/api/transactions?limit=10').then(r => r.json()),
    ]).then(([c, d, p, t]) => {
      setCycles(c.cycles ?? []);
      setWorkers(d.workers ?? []);
      setPartner(p.partner ?? null);
      setTransactions(t.transactions ?? []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const openCycles    = cycles.filter(c => c.status === 'open');
  const settledCycles = cycles.filter(c => c.status === 'settled');
  const totalIncome   = settledCycles.reduce((s, c) => s + Number(c.total_income), 0);
  const totalNet      = settledCycles.reduce((s, c) => s + Number(c.net_amount), 0);
  const activeWorkers = workers.filter(w => w.is_active).length;
  const sym = currencySymbol(partner?.currency ?? 'SAR');

  const chartData = settledCycles.slice(0, 6).reverse().map((c, i) => ({
    name:   c.title ?? `#${i + 1}`,
    دخل:    Number(c.total_income),
    مصاريف: Number(c.total_expenses),
    صافي:   Number(c.net_amount),
  }));

  const stats = [
    { label: 'إجمالي الدخل',      value: `${fmt(totalIncome)} ${sym}`, sub: `${settledCycles.length} دورة مقفلة` },
    { label: 'صافي الأرباح',      value: `${fmt(totalNet)} ${sym}`,    sub: 'بعد المصاريف'                        },
    { label: 'الدورات المفتوحة',  value: openCycles.length,        sub: 'قيد التشغيل'                        },
    { label: 'السائقون النشطون',  value: activeWorkers,            sub: `من ${workers.length} سائق`          },
  ];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--cat-yellow)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: 'var(--cat-muted)', fontSize: 13 }}>جاري التحميل...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div dir="rtl" style={{ padding: '24px', background: 'var(--bg)', minHeight: '100vh', color: 'var(--cat-white)', maxWidth: '1400px', margin: '0 auto' }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--cat-yellow)', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--cat-white)', letterSpacing: '-0.5px' }}>لوحة التحكم</h1>
        </div>
        <Link href="/dashboard/cycles/new" className="cat-btn cat-btn-primary" style={{ fontSize: 14, padding: '0 20px' }}>
          + دورة جديدة
        </Link>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: 'var(--cat-gray)', borderTop: '3px solid var(--cat-yellow)', borderRadius: 8, padding: '20px', }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--cat-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>{s.label}</p>
            <p style={{ fontSize: typeof s.value === 'number' ? 36 : 24, fontWeight: 900, color: 'var(--cat-yellow)', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)', lineHeight: 1, marginBottom: 6, fontFamily: "'Barlow Condensed', var(--font-primary)" } as React.CSSProperties}>{s.value}</p>
            <p style={{ fontSize: 11, color: 'var(--cat-muted)' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Charts ── */}
      {chartData.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 32 }}>
          {/* Area Chart */}
          <div style={{ background: 'var(--cat-gray)', borderRadius: 2, padding: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--cat-yellow)', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>تحليل الدورات المالية</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gY" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#FFCD11" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#FFCD11" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3D3D3D" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#A0A0A0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#A0A0A0' }} />
                <Tooltip {...CHART_TOOLTIP} formatter={(v: any) => `${fmt(v)} ${sym}`} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#A0A0A0' }} />
                <Area type="monotone" dataKey="دخل"  stroke="#FFCD11" fill="url(#gY)" strokeWidth={2} />
                <Area type="monotone" dataKey="صافي" stroke="#22c55e" fill="url(#gG)"  strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div style={{ background: 'var(--cat-gray)', borderRadius: 2, padding: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--cat-yellow)', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>دخل / مصاريف</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3D3D3D" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#A0A0A0' }} />
                <YAxis tick={{ fontSize: 10, fill: '#A0A0A0' }} />
                <Tooltip {...CHART_TOOLTIP} formatter={(v: any) => `${fmt(v)} ${sym}`} />
                <Bar dataKey="دخل"    fill="#FFCD11" radius={[2,2,0,0]} />
                <Bar dataKey="مصاريف" fill="#ef4444"  radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Open Cycles + Quick Actions ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>

        {/* الدورات المفتوحة */}
        <div style={{ background: 'var(--cat-gray)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'var(--cat-dark)', borderBottom: '2px solid var(--cat-yellow)' }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--cat-yellow)', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, textTransform: 'uppercase', letterSpacing: '0.1em' }}>الدورات المفتوحة</span>
            <Link href="/dashboard/cycles" style={{ fontSize: 11, color: 'var(--cat-muted)', textDecoration: 'none', fontWeight: 700 }}>عرض الكل ←</Link>
          </div>
          {openCycles.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <p style={{ fontSize: 32, marginBottom: 12 }}>📭</p>
              <p style={{ color: 'var(--cat-muted)', fontSize: 13 }}>لا توجد دورات مفتوحة</p>
              <Link href="/dashboard/cycles/new" style={{ color: 'var(--cat-yellow)', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginTop: 8 }}>ابدأ دورة جديدة ←</Link>
            </div>
          ) : (
            <table className="cat-table">
              <thead>
                <tr>
                  <th>السائق</th>
                  <th>الدورة</th>
                  <th>الدخل</th>
                </tr>
              </thead>
              <tbody>
                {openCycles.slice(0, 5).map(cycle => {
                  const worker = (cycle as any).worker;
                  return (
                    <tr key={cycle.id} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/dashboard/cycles/${cycle.id}`}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, background: 'var(--cat-yellow)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--cat-black)', fontSize: 14 }}>
                            {worker?.full_name?.[0] ?? '؟'}
                          </div>
                          <span>{worker?.full_name ?? '—'}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--cat-muted)' }}>{cycle.title ?? new Date(cycle.started_at).toLocaleDateString('en-US')}</td>
                      <td style={{ color: 'var(--cat-yellow)', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, fontWeight: 900 }}>{fmt(Number(cycle.total_income))} {sym}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* آخر العمليات */}
        {transactions.length > 0 && (
          <div style={{ background: 'var(--cat-gray)', borderRadius: 2, padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--cat-yellow)', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                آخر العمليات
              </p>
              <Link href="/dashboard/daily-operations" style={{ fontSize: 12, color: 'var(--cat-yellow)', textDecoration: 'none', fontWeight: 700 }}>
                عرض الكل ←
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {transactions.slice(0, 5).map((tx: any) => {
                const typeCfg: Record<string, { icon: string; color: string }> = {
                  income: { icon: '↑', color: '#FFCD11' },
                  expense: { icon: '↓', color: '#ef4444' },
                  transfer_to_worker: { icon: '⟳', color: '#3b82f6' },
                  transfer_to_partner: { icon: '→', color: '#8b5cf6' },
                  driver_to_partner_transfer: { icon: '↩', color: '#10b981' },
                };
                const cfg = typeCfg[tx.type] || { icon: '•', color: '#A0A0A0' };
                const worker = workers.find(w => w.id === tx.worker_id);
                const timeAgo = Math.floor((Date.now() - new Date(tx.created_at).getTime()) / 1000);
                const timeStr = timeAgo < 60 ? 'للتو' :
                               timeAgo < 3600 ? `قبل ${Math.floor(timeAgo / 60)}د` :
                               timeAgo < 86400 ? `قبل ${Math.floor(timeAgo / 3600)}س` :
                               `قبل ${Math.floor(timeAgo / 86400)}ي`;

                return (
                  <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: '#1A1A1A', borderRadius: 2 }}>
                    <span style={{ fontSize: 18, color: cfg.color }}>{cfg.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--cat-white)', margin: '0 0 2px' }}>
                        {worker?.full_name || 'السائق'}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--cat-muted)', margin: 0 }}>
                        {tx.description || 'بدون وصف'}
                      </p>
                    </div>
                    <div style={{ textAlign: 'end', flexShrink: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 900, color: cfg.color, margin: '0 0 2px', fontFamily: "'Barlow Condensed', sans-serif" }} dir="ltr">
                        {fmt(Number(tx.amount))} <span style={{ fontSize: 11 }}>{sym}</span>
                      </p>
                      <p style={{ fontSize: 10, color: 'var(--cat-muted)', margin: 0 }}>{timeStr}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* إجراءات سريعة */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--cat-yellow)', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>إجراءات سريعة</p>
          {[
            { href: '/dashboard/cycles/new',  label: 'دورة مالية جديدة',   icon: '💰' },
            { href: '/dashboard/drivers/new', label: 'إضافة سائق',          icon: '👤' },
            { href: '/dashboard/cycles',      label: 'عرض الدورات',         icon: '📋' },
            { href: '/dashboard/services',    label: 'الخدمات والمصاريف',  icon: '🔧' },
            { href: '/dashboard/settings',    label: 'الإعدادات',           icon: '⚙️' },
          ].map(({ href, label, icon }) => (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', background: 'var(--cat-gray)',
              borderRadius: 2, textDecoration: 'none', color: 'var(--cat-white)',
              fontSize: 13, fontWeight: 700, transition: 'border-right 0.12s',
              borderRight: '3px solid transparent',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderRightColor = 'var(--cat-yellow)'; (e.currentTarget as HTMLElement).style.color = 'var(--cat-yellow)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderRightColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--cat-white)'; }}
            >
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span>{label}</span>
              <span style={{ marginRight: 'auto', color: 'var(--cat-muted)' }}>←</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
