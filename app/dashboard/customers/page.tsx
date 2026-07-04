"use client";

import { useEffect, useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, Legend,
} from 'recharts';

type SortKey = 'all' | 'top' | 'least' | 'newest';

const CARD: React.CSSProperties = { background: '#2A2A2A', borderRadius: 0 };
const LABEL: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '0.08em' };

function fmt(n: number) { return Number(n).toLocaleString('en-US'); }
function daysBadge(days: number) {
  if (days === 0) return { text: 'اليوم', color: '#22c55e' };
  if (days === 1) return { text: 'الأمس', color: '#22c55e' };
  if (days <= 7)  return { text: `${days} أيام`, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any };
  if (days <= 30) return { text: `${days} يوماً`, color: '#f59e0b' };
  return { text: `${days} يوماً`, color: '#ef4444' };
}

export default function CustomersPage() {
  const [data, setData]         = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [sort, setSort]         = useState<SortKey>('all');
  const [drawer, setDrawer]     = useState<any>(null);

  useEffect(() => {
    fetch('/api/customers/analytics')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!data?.all_customers) return [];
    let list = [...data.all_customers];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c: any) =>
        c.name.toLowerCase().includes(q) || c.phone.includes(q)
      );
    }
    if (sort === 'top')    list = [...list].sort((a: any, b: any) => b.total - a.total);
    if (sort === 'least')  list = [...list].sort((a: any, b: any) => b.days_since - a.days_since);
    if (sort === 'newest') list = [...list].sort((a: any, b: any) => a.days_since - b.days_since);
    return list;
  }, [data, search, sort]);

  const sym = 'ر.س';

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', background: 'var(--cat-black)' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #FFCD11', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const s = data?.summary ?? {};
  const hasData = (data?.all_customers?.length ?? 0) > 0;

  return (
    <div dir="rtl" style={{ padding: '28px 32px', background: 'var(--cat-black)', minHeight: '100vh', fontFamily: "'Cairo', sans-serif", color: '#fff', position: 'relative' }}>

      {/* ══ HEADER ══ */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>إدارة العلاقات</p>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.5px' }}>العملاء</h1>
          <p style={{ fontSize: 12, color: '#A0A0A0', margin: 0 }}>عملاء مسجّلون من خلال الفواتير والمعاملات</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* search */}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#555', fontSize: 14 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو الجوال..."
              style={{
                height: 40, paddingRight: 36, paddingLeft: 14, width: 240,
                background: '#2A2A2A', border: '2px solid #FFCD11',
                color: '#fff', fontSize: 13, outline: 'none', borderRadius: 0,
                fontFamily: "'Cairo', sans-serif",
              }}
            />
          </div>
          {/* badge count */}
          <div style={{ background: '#FFCD11', color: '#1A1A1A', fontWeight: 900, fontSize: 14, padding: '6px 16px' }}>
            {s.total_customers ?? 0} عميل
          </div>
        </div>
      </div>

      {!hasData ? (
        /* ── Empty state ── */
        <div style={{ background: '#2A2A2A', padding: '64px 24px', textAlign: 'center', marginTop: 24 }}>
          <p style={{ fontSize: 52, margin: '0 0 16px' }}>👥</p>
          <p style={{ fontSize: 17, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>لا يوجد عملاء بعد</p>
          <p style={{ fontSize: 13, color: '#A0A0A0', margin: 0, maxWidth: 340, marginInline: 'auto' }}>
            ستظهر هنا تلقائياً عند إصدار أول فاتورة أو تسجيل معاملة دخل مع بيانات زبون
          </p>
        </div>
      ) : (
        <>
          {/* ══ SUMMARY CARDS ══ */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 28 }}>
            {[
              { label: 'إجمالي العملاء',    value: s.total_customers,  color: '#FFCD11', icon: '👥',  unit: '' },
              { label: 'عملاء هذا الشهر',  value: s.new_this_month,   color: '#22c55e', icon: '📈',  unit: '' },
              { label: 'إجمالي الإيرادات', value: fmt(s.total_revenue), color: '#FFCD11', icon: '💰', unit: ' ' + sym },
              { label: 'متوسط الفاتورة',   value: fmt(s.avg_invoice_value), color: '#3b82f6', icon: '📊', unit: ' ' + sym },
            ].map(c => (
              <div key={c.label} style={{ background: '#2A2A2A', borderTop: `3px solid ${c.color}`, padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={LABEL}>{c.label}</span>
                  <span style={{ fontSize: 14, opacity: 0.6 }}>{c.icon}</span>
                </div>
                <p style={{ fontSize: 26, fontWeight: 900, color: c.color, textShadow: c.color === '#FFCD11' ? 'var(--yellow-shadow)' : undefined, WebkitTextStroke: c.color === '#FFCD11' ? 'var(--yellow-stroke)' : undefined, margin: 0, fontFamily: "'Barlow Condensed','Cairo',sans-serif" } as React.CSSProperties}>
                  {c.value}{c.unit}
                </p>
              </div>
            ))}
          </div>

          {/* ══ TOP + LEAST ACTIVE ══ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>

            {/* Top customers */}
            <div style={CARD}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #3D3D3D', borderRight: '4px solid #FFCD11', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#fff' }}>🏆 أكثر العملاء تعاملاً</span>
              </div>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(data.top_customers ?? []).map((c: any) => {
                  const db = daysBadge(c.days_since);
                  return (
                    <div key={c.id} style={{ background: '#1A1A1A', padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 900, color: '#1A1A1A', background: '#FFCD11', padding: '1px 7px', flexShrink: 0 }}>
                          #{c.rank}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 900, color: '#fff', margin: 0 }}>{c.name}</p>
                          <p style={{ fontSize: 11, color: '#A0A0A0', margin: 0 }} dir="ltr">{c.phone}</p>
                        </div>
                        <div style={{ textAlign: 'end', flexShrink: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 900, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, margin: 0 }}>{fmt(c.total)} {sym}</p>
                          <p style={{ fontSize: 10, color: '#A0A0A0', margin: 0 }}>{c.count} فاتورة</p>
                        </div>
                      </div>
                      {/* progress bar */}
                      <div style={{ height: 4, background: '#2A2A2A', marginBottom: 6 }}>
                        <div style={{ height: '100%', width: `${c.percentage_of_total}%`, background: '#FFCD11', transition: 'width 0.6s' }} />
                      </div>
                      <p style={{ fontSize: 10, color: db.color, margin: 0 }}>آخر تعامل: منذ {db.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Least active */}
            <div style={CARD}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #3D3D3D', borderRight: '4px solid #3b82f6', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#fff' }}>💤 عملاء يحتاجون متابعة</span>
              </div>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(data.least_active ?? []).map((c: any) => {
                  const db = daysBadge(c.days_since);
                  return (
                    <div key={c.id} style={{ background: '#1A1A1A', padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 900, color: '#fff', background: '#3b82f6', padding: '1px 7px', flexShrink: 0 }}>
                          #{c.rank}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 900, color: '#fff', margin: 0 }}>{c.name}</p>
                          <p style={{ fontSize: 11, color: '#A0A0A0', margin: 0 }} dir="ltr">{c.phone}</p>
                        </div>
                        <div style={{ textAlign: 'end', flexShrink: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 900, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, margin: 0 }}>{fmt(c.total)} {sym}</p>
                          <p style={{ fontSize: 10, color: '#A0A0A0', margin: 0 }}>{c.count} فاتورة</p>
                        </div>
                      </div>
                      <div style={{ height: 4, background: '#2A2A2A', marginBottom: 6 }}>
                        <div style={{ height: '100%', width: `${c.percentage_of_total}%`, background: '#3b82f6', transition: 'width 0.6s' }} />
                      </div>
                      <p style={{ fontSize: 10, color: db.color, margin: 0 }}>
                        آخر تعامل: منذ {db.text}
                        {c.days_since >= 30 && <span style={{ marginRight: 8, color: '#ef4444', fontWeight: 700 }}>⚠ 30+ يوم</span>}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ══ CHARTS ══ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>

            {/* Bar chart — top 10 */}
            <div style={{ ...CARD, padding: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 900, color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>
                💰 توزيع الإيرادات حسب العميل
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.chart_top10 ?? []} layout="vertical" margin={{ right: 16 }}>
                  <XAxis type="number" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fill: '#A0A0A0', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1A1A1A', border: '1px solid #3D3D3D', borderRadius: 0, color: '#fff', fontSize: 12 }}
                    formatter={(v: any) => [`${fmt(v)} ${sym}`, 'الإيراد']}
                  />
                  <Bar dataKey="total" radius={0} maxBarSize={18}>
                    {(data.chart_top10 ?? []).map((_: any, i: number) => (
                      <Cell key={i} fill={i === 0 ? '#FFCD11' : `rgba(255,205,17,${0.85 - i * 0.07})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line chart — monthly */}
            <div style={{ ...CARD, padding: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 900, color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>
                📈 نشاط العملاء - آخر 6 أشهر
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.monthly_activity ?? []} margin={{ right: 16 }}>
                  <CartesianGrid stroke="#2A2A2A" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#A0A0A0', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1A1A1A', border: '1px solid #3D3D3D', borderRadius: 0, color: '#fff', fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#A0A0A0' }} />
                  <Line type="monotone" dataKey="invoices_count" name="عدد الفواتير" stroke="#FFCD11" strokeWidth={2} dot={{ fill: '#FFCD11', r: 3 }} />
                  <Line type="monotone" dataKey="total_amount"   name="إجمالي المبالغ" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ══ FULL LIST ══ */}
          <div style={CARD}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #3D3D3D', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#fff' }}>📋 قائمة العملاء الكاملة</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {([
                  { key: 'all',    label: 'الكل'           },
                  { key: 'top',    label: 'الأكثر تعاملاً'  },
                  { key: 'least',  label: 'الأقل نشاطاً'   },
                  { key: 'newest', label: 'الأحدث'         },
                ] as const).map(f => (
                  <button key={f.key} onClick={() => setSort(f.key)} style={{
                    height: 30, padding: '0 12px', borderRadius: 0, cursor: 'pointer',
                    fontSize: 11, fontWeight: 700, fontFamily: "'Cairo', sans-serif",
                    background: sort === f.key ? '#FFCD11' : 'transparent',
                    color:      sort === f.key ? '#1A1A1A' : '#A0A0A0',
                    border:     sort === f.key ? 'none'    : '1px solid #3D3D3D',
                  }}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: '36px 24px', textAlign: 'center' }}>
                <p style={{ fontSize: 32, margin: '0 0 10px' }}>🔍</p>
                <p style={{ fontSize: 13, color: '#A0A0A0', margin: 0 }}>لا توجد نتائج للبحث</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* header row */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: 12, padding: '10px 20px', background: '#111', borderBottom: '1px solid #2A2A2A' }}>
                  {['العميل', 'الفواتير', 'الإجمالي', 'أول تعامل', 'آخر تعامل', ''].map(h => (
                    <span key={h} style={{ ...LABEL }}>{h}</span>
                  ))}
                </div>
                {filtered.map((c: any, i: number) => {
                  const db = daysBadge(c.days_since);
                  return (
                    <div key={c.id} style={{
                      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
                      gap: 12, padding: '13px 20px', alignItems: 'center',
                      background: i % 2 === 0 ? '#2A2A2A' : '#252525',
                      borderBottom: '1px solid #1A1A1A',
                    }}>
                      {/* avatar + name */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <div style={{
                          width: 34, height: 34, background: 'rgba(255,205,17,0.12)',
                          color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, fontWeight: 900, fontSize: 14, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {c.name[0]}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                          <p style={{ fontSize: 11, color: '#A0A0A0', margin: 0 }} dir="ltr">{c.phone}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#A0A0A0' }}>{c.count}</span>
                      <span style={{ fontSize: 13, fontWeight: 900, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any }}>{fmt(c.total)} {sym}</span>
                      <span style={{ fontSize: 11, color: '#555' }}>—</span>
                      <span style={{ fontSize: 11, color: db.color, fontWeight: 700 }}>منذ {db.text}</span>
                      <button
                        onClick={() => setDrawer(c)}
                        style={{
                          height: 30, padding: '0 12px', fontSize: 11, fontWeight: 700,
                          background: 'transparent', color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, border: '1px solid #FFCD11',
                          cursor: 'pointer', borderRadius: 0, fontFamily: "'Cairo', sans-serif", whiteSpace: 'nowrap',
                        }}
                      >
                        تفاصيل ←
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ══ DRAWER ══ */}
      {drawer && (
        <>
          <div
            onClick={() => setDrawer(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }}
          />
          <div style={{
            position: 'fixed', top: 0, left: 0, bottom: 0, width: 420,
            background: '#1A1A1A', borderRight: '3px solid #FFCD11',
            zIndex: 50, overflowY: 'auto', padding: 28,
            fontFamily: "'Cairo', sans-serif",
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: 0 }}>{drawer.name}</h2>
              <button onClick={() => setDrawer(null)} style={{ background: 'transparent', border: 'none', color: '#A0A0A0', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            {/* info */}
            <div style={{ background: '#2A2A2A', padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'رقم الجوال', value: drawer.phone, dir: 'ltr' },
                  { label: 'عدد الفواتير', value: `${drawer.count} فاتورة` },
                  { label: 'إجمالي المدفوع', value: `${fmt(drawer.total)} ${sym}` },
                  { label: 'آخر تعامل', value: `منذ ${daysBadge(drawer.days_since).text}` },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#A0A0A0', fontWeight: 700 }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }} dir={(row as any).dir}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* progress */}
            <div style={{ background: '#2A2A2A', padding: 16 }}>
              <p style={{ ...LABEL, marginBottom: 10 }}>نسبة الإيراد مقارنةً بالأعلى</p>
              <div style={{ height: 8, background: '#1A1A1A' }}>
                <div style={{ height: '100%', width: `${drawer.percentage_of_total}%`, background: '#FFCD11', transition: 'width 0.8s' }} />
              </div>
              <p style={{ fontSize: 11, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, fontWeight: 700, margin: '8px 0 0' }}>{drawer.percentage_of_total}%</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
