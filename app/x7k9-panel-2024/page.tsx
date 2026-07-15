"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface DashboardData {
  stats: {
    total_partners: number;
    active_partners: number;
    trial_partners: number;
    revenue_this_month: number;
  };
  alerts: {
    expiring_soon: { id: string; company_name: string; days_remaining: number }[];
    expired: { id: string; company_name: string }[];
  };
  open_cycles: {
    partner_id: string;
    company_name: string;
    email: string;
    subscription_status: string;
    status_badge: string;
    worker_count: number;
    last_activity: string;
    revenue: number;
  }[];
  monthly_revenue: { month: string; total: number }[];
}

function fmt(n: number) { return n.toLocaleString('en-US'); }

const CARD_STYLE: React.CSSProperties = {
  background: '#FFFFFF', borderRadius: 16, border: '1px solid #F1F5F9',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '16px 18px',
};

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  trial:   { bg: '#FEF9C3', text: '#CA8A04', label: '🟡 تجريبي' },
  active:  { bg: '#DCFCE7', text: '#16A34A', label: '🟢 نشط' },
  expired: { bg: '#FEE2E2', text: '#DC2626', label: '🔴 منتهي' },
  frozen:  { bg: '#F1F5F9', text: '#64748B', label: '⚫ مجمد' },
};

export default function SuperAdminCommandCenter() {
  const [data, setData]     = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(d => setData(d))
      .catch(() => setError('تعذّر تحميل بيانات لوحة التحكم'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: '#64748B' }}>جاري التحميل...</div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 12, color: '#DC2626', padding: '12px 16px', fontSize: 13, fontWeight: 700 }}>
          {error || 'خطأ غير متوقع'}
        </div>
      </div>
    );
  }

  const { stats, alerts, open_cycles, monthly_revenue } = data;

  const statCards = [
    { label: 'إجمالي المشتركين',   value: stats.total_partners,  color: '#0F172A', icon: '👥' },
    { label: 'مشتركون نشطون',      value: stats.active_partners, color: '#16A34A', icon: '✅' },
    { label: 'في فترة تجريبية',    value: stats.trial_partners,  color: '#CA8A04', icon: '⏳' },
    { label: 'الدخل هذا الشهر',    value: `${fmt(stats.revenue_this_month)} ر.س`, color: '#2563EB', icon: '💰' },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 4 }}>Command Center</h1>
      <p style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>كيف حال عملك اليوم؟</p>

      {/* أ) بطاقات إحصائية */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 20 }}>
        {statCards.map(s => (
          <div key={s.label} style={CARD_STYLE}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
            </div>
            <p style={{ fontSize: 26, fontWeight: 900, color: s.color, fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 4, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ب) تنبيهات */}
      {(alerts.expiring_soon.length > 0 || alerts.expired.length > 0) && (
        <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {alerts.expired.map(p => (
            <Link key={p.id} href={`/x7k9-panel-2024/tenants?id=${p.id}`} style={{
              display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
              background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 12,
              padding: '9px 14px', fontSize: 12.5, fontWeight: 700, color: '#DC2626',
            }}>
              🔴 <span>{p.company_name} — انتهى اشتراكه</span>
            </Link>
          ))}
          {alerts.expiring_soon.map(p => (
            <Link key={p.id} href={`/x7k9-panel-2024/tenants?id=${p.id}`} style={{
              display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
              background: '#FEFCE8', border: '1px solid #FDE68A', borderRadius: 12,
              padding: '9px 14px', fontSize: 12.5, fontWeight: 700, color: '#CA8A04',
            }}>
              ⚠️ <span>{p.company_name} — باقي {p.days_remaining === 0 ? 'أقل من يوم' : p.days_remaining === 1 ? 'يوم واحد' : `${p.days_remaining} أيام`}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <style>{`
          @media (max-width: 900px) {
            .admin-grid { grid-template-columns: 1fr !important; }
            .admin-table-desktop { display: none !important; }
            .admin-cards-mobile { display: flex !important; }
          }
        `}</style>

        {/* ج) الدورات المفتوحة الآن */}
        <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #F1F5F9', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em' }}>الدورات المفتوحة الآن</span>
          </div>
          {open_cycles.length === 0 ? (
            <p style={{ padding: 30, textAlign: 'center', color: '#64748B', fontSize: 13 }}>لا توجد دورات مفتوحة حالياً</p>
          ) : (
            <>
              {/* Desktop table */}
              <table className="admin-table-desktop" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['الشركة / البريد', 'الحالة', 'السائقون', 'آخر نشاط', 'الإيراد', ''].map(h => (
                      <th key={h} style={{ padding: '8px 10px', textAlign: h === '' ? 'center' : 'right', fontSize: 9.5, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {open_cycles.map((c, i) => {
                    const sc = statusColors[c.status_badge] || { bg: '#F1F5F9', text: '#64748B', label: c.status_badge };
                    return (
                      <tr key={c.partner_id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '8px 10px', color: '#0F172A', fontWeight: 700 }}>
                          <div style={{ fontSize: 12 }}>{c.company_name}</div>
                          <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }} dir="ltr">{c.email}</div>
                        </td>
                        <td style={{ padding: '6px 10px' }}>
                          <span style={{ background: sc.bg, color: sc.text, padding: '3px 8px', fontSize: 9, fontWeight: 700, borderRadius: 6, whiteSpace: 'nowrap' }}>
                            {sc.label}
                          </span>
                        </td>
                        <td style={{ padding: '8px 10px', color: '#64748B', textAlign: 'center' }}>{c.worker_count}</td>
                        <td style={{ padding: '8px 10px', color: '#64748B', fontSize: 11 }} dir="ltr">{new Date(c.last_activity).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                        <td style={{ padding: '8px 10px', color: '#2563EB', fontWeight: 900, textAlign: 'center' }}>{fmt(c.revenue)}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                          <Link href={`/x7k9-panel-2024/tenants?id=${c.partner_id}`} style={{ fontSize: 11, color: '#2563EB', textDecoration: 'none', fontWeight: 700, cursor: 'pointer', padding: '4px 8px', background: '#EFF6FF', borderRadius: 6, display: 'inline-block' }}>→</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Mobile card list */}
              <div className="admin-cards-mobile" style={{ display: 'none', flexDirection: 'column', gap: 10, padding: 14 }}>
                {open_cycles.map((c) => {
                  const sc = statusColors[c.status_badge] || { bg: '#F1F5F9', text: '#64748B', label: c.status_badge };
                  return (
                    <Link key={c.partner_id} href={`/x7k9-panel-2024/tenants?id=${c.partner_id}`} style={{
                      textDecoration: 'none', background: '#FFFFFF', border: '1px solid #F1F5F9',
                      borderRadius: 14, padding: '14px', display: 'block',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{c.company_name}</div>
                        <span style={{ background: sc.bg, color: sc.text, padding: '3px 8px', fontSize: 9, fontWeight: 700, borderRadius: 6, whiteSpace: 'nowrap' }}>
                          {sc.label}
                        </span>
                      </div>
                      <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 10 }} dir="ltr">{c.email}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B' }}>
                        <span>👥 {c.worker_count} سائق</span>
                        <span dir="ltr">{new Date(c.last_activity).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span style={{ color: '#2563EB', fontWeight: 900 }}>{fmt(c.revenue)} ر.س</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* د) رسم بياني: الإيرادات الشهرية */}
        <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #F1F5F9', padding: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 900, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>الإيرادات — آخر 6 أشهر</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthly_revenue}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12, color: '#0F172A' }}
                labelStyle={{ color: '#2563EB', fontWeight: 700 }}
                formatter={(v) => [`${fmt(Number(v))} ر.س`, 'الإيراد']}
              />
              <Area type="monotone" dataKey="total" stroke="#2563EB" fill="url(#rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
