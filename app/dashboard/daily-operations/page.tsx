"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { currencySymbol } from '@/lib/currency';

type Range = 'today' | 'yesterday' | 'week' | 'month';

type TxType = 'income' | 'expense' | 'transfer_to_worker' | 'transfer_to_partner';

const TX_CFG: Record<TxType, { color: string; bg: string; icon: string; label: string }> = {
  income:              { color: '#FFCD11', bg: 'rgba(255,205,17,0.10)',  icon: '↑', label: 'دخل'           },
  expense:             { color: '#ef4444', bg: 'rgba(239,68,68,0.10)',   icon: '↓', label: 'مصروف'         },
  transfer_to_worker:  { color: '#3b82f6', bg: 'rgba(59,130,246,0.10)', icon: '⟳', label: 'سلفة'          },
  transfer_to_partner: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)', icon: '→', label: 'تحويل'         },
};

const RANGE_LABELS: Record<Range, string> = {
  today:     'اليوم',
  yesterday: 'الأمس',
  week:      'آخر 7 أيام',
  month:     'آخر 30 يوم',
};

function fmt(n: number) { return n.toLocaleString('en-US'); }
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

const REFRESH_INTERVAL = 60;

export default function DailyOperationsPage() {
  const [range, setRange]       = useState<Range>('today');
  const [data, setData]         = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown]   = useState(REFRESH_INTERVAL);
  const [pulse, setPulse]       = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await fetch(`/api/daily-operations?range=${range}`);
      const json = await res.json();
      setData(json);
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setCountdown(REFRESH_INTERVAL);
    }
  }, [range]);

  // auto-refresh
  useEffect(() => {
    setLoading(true);
    fetchData();

    intervalRef.current = setInterval(() => fetchData(), REFRESH_INTERVAL * 1000);
    countRef.current    = setInterval(() => setCountdown(c => (c <= 1 ? REFRESH_INTERVAL : c - 1)), 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countRef.current)    clearInterval(countRef.current);
    };
  }, [fetchData]);

  const sym = currencySymbol(data?.workers?.[0]?.transactions?.[0]?.currency ?? 'SAR');

  return (
    <div dir="rtl" style={{ padding: '28px 32px', background: 'var(--cat-black)', minHeight: '100vh', fontFamily: "'Cairo', sans-serif", color: '#fff' }}>

      {/* ══════ HEADER ══════ */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>
            لوحة المتابعة
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            العمليات اليومية
          </h1>
          <p style={{ fontSize: 12, color: '#A0A0A0', margin: 0 }}>{fmtDate(new Date().toISOString())}</p>
        </div>

        {/* Live indicator + countdown + refresh */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* pulse dot */}
            <span style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              background: pulse ? '#fff' : '#22c55e',
              boxShadow: pulse ? '0 0 0 4px rgba(34,197,94,0.5)' : '0 0 0 0px transparent',
              transition: 'all 0.3s',
              display: 'inline-block',
            }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e' }}>مباشر</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#555' }}>التحديث خلال {countdown}ث</span>
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              style={{
                height: 28, padding: '0 12px', fontSize: 11, fontWeight: 700,
                background: 'transparent', color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, border: '1px solid #FFCD11',
                cursor: refreshing ? 'not-allowed' : 'pointer', borderRadius: 0,
                opacity: refreshing ? 0.5 : 1, fontFamily: "'Cairo', sans-serif",
              }}
            >
              {refreshing ? '...' : '🔄 الآن'}
            </button>
          </div>
        </div>
      </div>

      {/* ══════ RANGE FILTERS ══════ */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {(Object.keys(RANGE_LABELS) as Range[]).map(r => (
          <button key={r} onClick={() => setRange(r)} style={{
            height: 34, padding: '0 16px', borderRadius: 0, cursor: 'pointer',
            fontSize: 12, fontWeight: 700, fontFamily: "'Cairo', sans-serif",
            background: range === r ? '#FFCD11' : 'transparent',
            color:      range === r ? '#1A1A1A' : '#FFCD11',
            border:     range === r ? 'none'    : '1px solid #FFCD11',
          }}>
            {RANGE_LABELS[r]}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
          <div style={{ width: 36, height: 36, border: '3px solid #FFCD11', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : (
        <>
          {/* ══════ SUMMARY CARDS ══════ */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 28 }}>
            {[
              { label: 'إجمالي الإيرادات', value: fmt(data?.summary?.total_income   ?? 0) + ' ' + sym, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, icon: '↑' },
              { label: 'إجمالي المصاريف',  value: fmt(data?.summary?.total_expenses ?? 0) + ' ' + sym, color: '#ef4444', icon: '↓' },
              { label: 'عدد العمليات',     value: data?.summary?.operations_count ?? 0,                color: '#3b82f6', icon: '📋' },
              { label: 'سائقون نشطون',    value: data?.summary?.active_workers ?? 0,                  color: '#22c55e', icon: '👷' },
            ].map(s => (
              <div key={s.label} style={{ background: '#2A2A2A', borderTop: `3px solid ${s.color}`, padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
                  <span style={{ fontSize: 13, color: s.color, opacity: 0.7 }}>{s.icon}</span>
                </div>
                <p style={{ fontSize: 24, fontWeight: 900, color: s.color, margin: 0, fontFamily: "'Barlow Condensed', 'Cairo', sans-serif" }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* ══════ WORKERS ══════ */}
          {!data?.workers?.length ? (
            <div style={{ background: '#2A2A2A', padding: '56px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: 42, margin: '0 0 14px' }}>📋</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>لا توجد عمليات</p>
              <p style={{ fontSize: 13, color: '#A0A0A0', margin: 0 }}>
                {range === 'today' ? 'لم يتم تسجيل أي معاملات اليوم' : `لا توجد معاملات في الفترة المختارة`}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {data.workers.map((w: any) => (
                <div key={w.worker_id} style={{ background: '#2A2A2A', borderRadius: 0 }}>

                  {/* Worker header */}
                  <div style={{
                    padding: '16px 20px', borderRight: '4px solid #FFCD11',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    borderBottom: '1px solid #3D3D3D',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 40, height: 40, background: 'rgba(255,205,17,0.12)',
                        color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, fontWeight: 900, fontSize: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {w.worker_name[0]}
                      </div>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 900, color: '#fff', margin: '0 0 2px' }}>{w.worker_name}</p>
                        <p style={{ fontSize: 12, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, margin: 0, fontWeight: 700 }}>🚜 {w.equipment_name}</p>
                      </div>
                    </div>

                    {/* Worker summary */}
                    <div style={{ display: 'flex', gap: 24, flexShrink: 0 }}>
                      {[
                        { label: 'إيرادات', val: w.summary.income,   color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any },
                        { label: 'مصاريف',  val: w.summary.expenses, color: '#ef4444' },
                        { label: 'الصافي',  val: w.summary.net,      color: w.summary.net >= 0 ? '#22c55e' : '#ef4444' },
                      ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: '#555', margin: '0 0 3px', textTransform: 'uppercase' }}>{s.label}</p>
                          <p style={{ fontSize: 16, fontWeight: 900, color: s.color, margin: 0, fontFamily: "'Barlow Condensed', sans-serif" }} dir="ltr">
                            {fmt(s.val)} <span style={{ fontSize: 11 }}>{sym}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transactions */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {w.transactions.map((tx: any, i: number) => {
                      const cfg = TX_CFG[tx.type as TxType] ?? TX_CFG.income;
                      return (
                        <div key={tx.id} style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '12px 20px',
                          background: i % 2 === 0 ? '#1A1A1A' : '#1E1E1E',
                          borderRight: `3px solid ${cfg.color}`,
                          borderBottom: i < w.transactions.length - 1 ? '1px solid rgba(61,61,61,0.5)' : 'none',
                        }}>
                          {/* type icon */}
                          <div style={{
                            width: 30, height: 30, background: cfg.bg, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, fontWeight: 900, color: cfg.color,
                          }}>
                            {cfg.icon}
                          </div>

                          {/* label + description */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                              <span style={{ fontSize: 10, fontWeight: 900, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                {cfg.label}
                              </span>
                              {tx.customer_name && (
                                <span style={{ fontSize: 11, color: '#fff', background: 'rgba(255,255,255,0.06)', padding: '1px 7px' }}>
                                  {tx.customer_name}
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: 12, color: '#555', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {tx.description || tx.customer_phone || '—'}
                            </p>
                          </div>

                          {/* amount + time */}
                          <div style={{ textAlign: 'end', flexShrink: 0 }}>
                            <p style={{
                              fontSize: 16, fontWeight: 900, margin: '0 0 2px',
                              color: tx.type === 'expense' ? '#ef4444' : cfg.color,
                              fontFamily: "'Barlow Condensed', sans-serif",
                            }} dir="ltr">
                              {tx.type === 'expense' ? '−' : '+'}{fmt(tx.amount)} {sym}
                            </p>
                            <p style={{ fontSize: 11, color: '#A0A0A0', margin: 0 }} dir="ltr">
                              {fmtTime(tx.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
