"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { FinancialCycle, Partner, Worker } from '@/types';
import { currencySymbol } from '@/lib/currency';

function fmt(n: number) { return n.toLocaleString('en-US'); }

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

  const stats = [
    { label: 'إجمالي الدخل',      value: `${fmt(totalIncome)}`, sub: `${settledCycles.length} دورة`, icon: '💰' },
    { label: 'صافي الأرباح',      value: `${fmt(totalNet)}`,    sub: 'بعد المصاريف',              icon: '📈' },
    { label: 'الدورات المفتوحة',  value: openCycles.length,    sub: 'قيد التشغيل',              icon: '⏱️' },
    { label: 'السائقون النشطون',  value: activeWorkers,        sub: `من ${workers.length}`,     icon: '👥' },
  ];

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F5F7' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #FFCD11', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#A0A0A0', fontSize: 13 }}>جاري التحميل...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#F4F5F7', fontFamily: 'Cairo, sans-serif' }}>

      {/* ╔═════════════════════════════════════════════════
          HEADER: Yellow Curved Top with Logo + Title + Menu
          ═════════════════════════════════════════════════╗ */}
      <div style={{
        background: 'linear-gradient(135deg, #FFCD11 0%, #FFD700 100%)',
        paddingTop: '20px',
        paddingBottom: '60px',
        borderBottomLeftRadius: '32px',
        borderBottomRightRadius: '32px',
        boxShadow: '0 8px 24px rgba(255, 205, 17, 0.15)',
        position: 'relative',
      }}>
        <div style={{ paddingLeft: '16px', paddingRight: '16px', maxWidth: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ fontSize: '24px' }}>🚜</div>
            <button style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}>☰</button>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#1A1A1A', margin: '0 0 4px', lineHeight: 1.1 }}>
            أهلاً، {partner?.company_name ?? 'شريك'}
          </h1>
          <p style={{ fontSize: '12px', color: '#1A1A1A', opacity: 0.7, margin: 0 }}>
            {new Date().toLocaleDateString('ar-EG', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* ╔═════════════════════════════════════════════════
          STATS GRID: 2x2 Cards (Overlapping Header)
          ═════════════════════════════════════════════════╗ */}
      <div style={{ paddingLeft: '16px', paddingRight: '16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginTop: '-40px',
          marginBottom: '24px',
          position: 'relative',
          zIndex: 10,
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              border: '1px solid #E5E7EB',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                  {s.label}
                </p>
                <span style={{ fontSize: '20px' }}>{s.icon}</span>
              </div>
              <p style={{ fontSize: '24px', fontWeight: 900, color: '#1A1A1A', margin: '8px 0', fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>
                {s.value}
              </p>
              <p style={{ fontSize: '10px', color: '#A0A0A0', margin: 0 }}>
                {s.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ╔═════════════════════════════════════════════════
          RECENT OPERATIONS SECTION
          ═════════════════════════════════════════════════╗ */}
      <div style={{ paddingLeft: '16px', paddingRight: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#1A1A1A', marginBottom: '12px', marginTop: '0' }}>
          آخر العمليات
        </h2>

        {transactions.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '32px 16px',
            textAlign: 'center',
            border: '1px solid #E5E7EB',
            marginBottom: '20px',
          }}>
            <p style={{ fontSize: '32px', margin: '0 0 8px' }}>📭</p>
            <p style={{ fontSize: '13px', color: '#A0A0A0', margin: 0 }}>لا توجد عمليات بعد</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {transactions.slice(0, 5).map((tx: any) => {
              const worker = workers.find(w => w.id === tx.worker_id);
              const isIncome = tx.type === 'income';
              const color = isIncome ? '#10B981' : '#EF4444';
              const sign = isIncome ? '+' : '-';

              return (
                <div key={tx.id} style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 2px' }}>
                      {worker?.full_name || 'السائق'}
                    </p>
                    <p style={{ fontSize: '11px', color: '#A0A0A0', margin: 0 }}>
                      {tx.description || tx.type}
                    </p>
                  </div>
                  <div style={{ textAlign: 'end', flexShrink: 0, marginLeft: '12px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 900, color: color, margin: '0 0 2px', fontFamily: "'Barlow Condensed', sans-serif" }} dir="ltr">
                      {sign}{fmt(Number(tx.amount))}
                    </p>
                    <p style={{ fontSize: '10px', color: '#A0A0A0', margin: 0 }}>ر.س</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Links */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A', marginBottom: '12px', marginTop: '0' }}>
            إجراءات سريعة
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Link href="/dashboard/cycles/new" style={{
              background: '#FFCD11',
              color: '#1A1A1A',
              padding: '12px 14px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '12px',
              textAlign: 'center',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}>
              + دورة جديدة
            </Link>
            <Link href="/dashboard/drivers/new" style={{
              background: '#FFFFFF',
              color: '#1A1A1A',
              padding: '12px 14px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '12px',
              textAlign: 'center',
              border: '1px solid #E5E7EB',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}>
              + إضافة سائق
            </Link>
            <Link href="/dashboard/cycles" style={{
              background: '#FFFFFF',
              color: '#1A1A1A',
              padding: '12px 14px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '12px',
              textAlign: 'center',
              border: '1px solid #E5E7EB',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}>
              عرض الدورات
            </Link>
            <Link href="/dashboard/settings" style={{
              background: '#FFFFFF',
              color: '#1A1A1A',
              padding: '12px 14px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '12px',
              textAlign: 'center',
              border: '1px solid #E5E7EB',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}>
              الإعدادات
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
