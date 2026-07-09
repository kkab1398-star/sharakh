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
  background: '#2A2A2A', borderTop: '3px solid #FFCD11', borderRadius: 3, padding: '16px 18px',
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
      <div style={{ padding: 60, textAlign: 'center', color: '#A0A0A0' }}>جاري التحميل...</div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px 16px', fontSize: 13, fontWeight: 700 }}>
          {error || 'خطأ غير متوقع'}
        </div>
      </div>
    );
  }

  const { stats, alerts, open_cycles, monthly_revenue } = data;

  const statCards = [
    { label: 'إجمالي المشتركين',   value: stats.total_partners,  color: '#FFFFFF' },
    { label: 'مشتركون نشطون',      value: stats.active_partners, color: '#22c55e' },
    { label: 'في فترة تجريبية',    value: stats.trial_partners,  color: '#FFCD11' },
    { label: 'الدخل هذا الشهر',    value: `${fmt(stats.revenue_this_month)} ر.س`, color: '#FFCD11' },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', marginBottom: 4 }}>Command Center</h1>
      <p style={{ fontSize: 12, color: '#A0A0A0', marginBottom: 20 }}>كيف حال عملك اليوم؟</p>

      {/* أ) بطاقات إحصائية */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {statCards.map(s => (
          <div key={s.label} style={CARD_STYLE}>
            <p style={{ fontSize: 26, fontWeight: 900, color: s.color, fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 4, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 10, color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ب) تنبيهات */}
      {(alerts.expiring_soon.length > 0 || alerts.expired.length > 0) && (
        <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {alerts.expired.map(p => (
            <Link key={p.id} href={`/x7k9-panel-2024/tenants?id=${p.id}`} style={{
              display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
              background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: 3,
              padding: '9px 14px', fontSize: 12.5, fontWeight: 700, color: '#ef4444',
            }}>
              🔴 <span>{p.company_name} — انتهى اشتراكه</span>
            </Link>
          ))}
          {alerts.expiring_soon.map(p => (
            <Link key={p.id} href={`/x7k9-panel-2024/tenants?id=${p.id}`} style={{
              display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
              background: 'rgba(255,205,17,0.1)', border: '1px solid #FFCD11', borderRadius: 3,
              padding: '9px 14px', fontSize: 12.5, fontWeight: 700, color: '#FFCD11',
            }}>
              ⚠️ <span>{p.company_name} — باقي {p.days_remaining === 0 ? 'أقل من يوم' : p.days_remaining === 1 ? 'يوم واحد' : `${p.days_remaining} أيام`}</span>
            </Link>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>

        {/* ج) الدورات المفتوحة الآن */}
        <div style={{ background: '#2A2A2A', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', background: '#111111', borderBottom: '2px solid #FFCD11' }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#FFCD11', textTransform: 'uppercase', letterSpacing: '0.08em' }}>الدورات المفتوحة الآن</span>
          </div>
          {open_cycles.length === 0 ? (
            <p style={{ padding: 30, textAlign: 'center', color: '#A0A0A0', fontSize: 13 }}>لا توجد دورات مفتوحة حالياً</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#1A1A1A' }}>
                  {['الشركة / البريد', 'الحالة', 'السائقون', 'آخر نشاط', 'الإيراد', ''].map(h => (
                    <th key={h} style={{ padding: '8px 10px', textAlign: h === '' ? 'center' : 'right', fontSize: 9.5, color: '#FFCD11', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {open_cycles.map((c, i) => {
                  const statusColors: Record<string, { bg: string; text: string }> = {
                    trial:   { bg: 'rgba(255,205,17,0.1)', text: '#FFCD11' },
                    active:  { bg: 'rgba(34,197,94,0.1)', text: '#22c55e' },
                    expired: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' },
                    frozen:  { bg: 'rgba(107,114,128,0.1)', text: '#6b7280' },
                  };
                  const sc = statusColors[c.status_badge] || { bg: '#3D3D3D', text: '#A0A0A0' };
                  return (
                    <tr key={c.partner_id} style={{ background: i % 2 === 0 ? '#1A1A1A' : '#111111', borderBottom: '1px solid #3D3D3D' }}>
                      <td style={{ padding: '8px 10px', color: '#FFFFFF', fontWeight: 700 }}>
                        <div style={{ fontSize: 12 }}>{c.company_name}</div>
                        <div style={{ fontSize: 10, color: '#888', marginTop: 2 }} dir="ltr">{c.email}</div>
                      </td>
                      <td style={{ padding: '6px 10px' }}>
                        <span style={{ background: sc.bg, color: sc.text, padding: '3px 7px', fontSize: 9, fontWeight: 700, borderRadius: 2, whiteSpace: 'nowrap' }}>
                          {c.status_badge === 'trial' ? '🟡 تجريبي' : c.status_badge === 'active' ? '🟢 نشط' : c.status_badge === 'expired' ? '🔴 منتهي' : c.status_badge === 'frozen' ? '⚫ مجمد' : c.status_badge}
                        </span>
                      </td>
                      <td style={{ padding: '8px 10px', color: '#A0A0A0', textAlign: 'center' }}>{c.worker_count}</td>
                      <td style={{ padding: '8px 10px', color: '#A0A0A0', fontSize: 11 }} dir="ltr">{new Date(c.last_activity).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                      <td style={{ padding: '8px 10px', color: '#FFCD11', fontWeight: 900, textAlign: 'center' }}>{fmt(c.revenue)}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <Link href={`/x7k9-panel-2024/tenants?id=${c.partner_id}`} style={{ fontSize: 11, color: '#FFCD11', textDecoration: 'none', fontWeight: 700, cursor: 'pointer', padding: '4px 8px', background: 'rgba(255,205,17,0.1)', borderRadius: 2, display: 'inline-block' }}>→</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* د) رسم بياني: الإيرادات الشهرية */}
        <div style={{ background: '#2A2A2A', borderRadius: 3, padding: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 900, color: '#FFCD11', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>الإيرادات — آخر 6 أشهر</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthly_revenue}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFCD11" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FFCD11" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3D3D3D" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#A0A0A0' }} />
              <YAxis tick={{ fontSize: 11, fill: '#A0A0A0' }} />
              <Tooltip
                contentStyle={{ background: '#111111', border: '1px solid #3D3D3D', borderRadius: 2, fontSize: 12, color: '#fff' }}
                labelStyle={{ color: '#FFCD11', fontWeight: 700 }}
                formatter={(v) => [`${fmt(Number(v))} ر.س`, 'الإيراد']}
              />
              <Area type="monotone" dataKey="total" stroke="#FFCD11" fill="url(#rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
