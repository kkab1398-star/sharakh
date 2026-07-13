"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { currencySymbol } from '@/lib/currency';
import { useDriverLang } from '@/contexts/DriverLangContext';

interface WorkerInfo { id: string; full_name: string; partner_id: string; currency: string; company_name: string; }
interface Cycle { id: string; title: string | null; started_at: string; currency: string; total_income: number; total_expenses: number; total_advances: number; net_amount: number; }
interface RecentTx { id: string; type: string; amount: number; description: string | null; customer_name: string | null; created_at: string; }

function fmt(n: number) { return n.toLocaleString('en-US'); }

export default function DriverHome() {
  const router = useRouter();
  const { m, dir } = useDriverLang();

  const [worker, setWorker] = useState<WorkerInfo | null>(null);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selCycle, setSelCycle] = useState('');
  const [recentTxs, setRecentTxs] = useState<RecentTx[]>([]);

  const cur = cycles.find(c => c.id === selCycle);
  const currency = cur?.currency ?? worker?.currency ?? 'SAR';
  const sym = currencySymbol(currency);

  const loadCycles = useCallback(async () => {
    const r = await fetch('/api/worker/cycles');
    if (r.status === 401) { router.replace('/driver/login'); return; }
    const d = await r.json();
    const ls = d.cycles ?? [];
    setCycles(ls);
    if (ls.length && !selCycle) setSelCycle(ls[0].id);
    return ls;
  }, [router, selCycle]);

  const loadRecentTxs = useCallback(async (cycleId: string) => {
    try {
      const r = await fetch(`/api/worker/transactions?cycle_id=${cycleId}`);
      const d = await r.json();
      setRecentTxs((d.transactions ?? []).slice(0, 5));
    } catch {}
  }, []);

  useEffect(() => {
    try { const s = sessionStorage.getItem('worker'); if (s) setWorker(JSON.parse(s)); } catch {}
    loadCycles().then(ls => {
      if (ls?.length) loadRecentTxs(ls[0].id);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F5F7' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚜</div>
        <p style={{ color: '#A0A0A0', fontSize: '13px' }}>جاري التحميل...</p>
      </div>
    </div>
  );

  const firstLetter = worker?.full_name?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif', minHeight: '100svh', background: '#F4F5F7' }}>

      {/* ╔════════════════════════════════════════════════════
          HEADER: Yellow Top Bar
          ════════════════════════════════════════════════════╗ */}
      <header style={{
        background: 'linear-gradient(135deg, #FFCD11 0%, #FFD700 100%)',
        padding: '12px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
        boxShadow: '0 4px 12px rgba(255, 205, 17, 0.2)',
      }}>
        {/* LEFT: Logo/Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#FFFFFF',
            color: '#1A1A1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 900,
            flexShrink: 0,
          }}>
            {firstLetter}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
              {worker?.full_name ?? '—'}
            </p>
            <p style={{ fontSize: '10px', color: '#1A1A1A', opacity: 0.7, margin: 0 }}>
              نشط
            </p>
          </div>
        </div>

        {/* CENTER: Company Name */}
        <p style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A1A', margin: 0, textAlign: 'center', flex: 1 }}>
          {worker?.company_name ?? ''}
        </p>

        {/* RIGHT: Notification */}
        <button style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
          🔔
        </button>
      </header>

      <div style={{ maxWidth: '430px', margin: '0 auto', paddingBottom: '100px', width: '100%', overflowY: 'auto' }}>

        {cycles.length === 0 ? (
          <div style={{
            margin: '40px 16px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '16px',
            padding: '40px 20px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '36px', margin: '0 0 12px' }}>📭</p>
            <p style={{ fontWeight: 700, color: '#1A1A1A', fontSize: '15px', margin: 0 }}>لا توجد دورات</p>
            <p style={{ fontSize: '13px', color: '#A0A0A0', marginTop: '6px', margin: '6px 0 0' }}>
              تواصل مع الشريك لبدء دورة جديدة
            </p>
          </div>
        ) : cur && (
          <>
            {/* ╔════════════════════════════════════════════════════
                DRIVER BALANCE CARD: Primary Focus
                ════════════════════════════════════════════════════╗ */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              margin: '16px',
              padding: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                  ميزان السائق
                </p>
                <div style={{
                  background: '#10B981',
                  color: '#FFFFFF',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 700,
                }}>
                  نشط
                </div>
              </div>
              <p style={{ fontSize: '32px', fontWeight: 900, color: '#1A1A1A', margin: '0 0 6px', fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>
                {fmt(Number(cur.net_amount))}
              </p>
              <p style={{ fontSize: '11px', color: '#A0A0A0', margin: 0 }}>
                {sym} | {cur.title ?? 'دورة'}
              </p>
            </div>

            {/* ╔════════════════════════════════════════════════════
                4 STATS CARDS: Income, Expenses, Advances, Net
                ════════════════════════════════════════════════════╗ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '0 16px 20px' }}>
              {/* Income */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                padding: '12px',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                  الدخل
                </p>
                <p style={{ fontSize: '20px', fontWeight: 900, color: '#10B981', margin: '0 0 4px', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {fmt(Number(cur.total_income))}
                </p>
                <p style={{ fontSize: '10px', color: '#A0A0A0', margin: 0 }}>
                  ↑ {sym}
                </p>
              </div>

              {/* Expenses */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                padding: '12px',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                  المصاريف
                </p>
                <p style={{ fontSize: '20px', fontWeight: 900, color: '#EF4444', margin: '0 0 4px', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {fmt(Number(cur.total_expenses))}
                </p>
                <p style={{ fontSize: '10px', color: '#A0A0A0', margin: 0 }}>
                  ↓ {sym}
                </p>
              </div>

              {/* Advances */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                padding: '12px',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                  السلف
                </p>
                <p style={{ fontSize: '20px', fontWeight: 900, color: '#3B82F6', margin: '0 0 4px', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {fmt(Number(cur.total_advances ?? 0))}
                </p>
                <p style={{ fontSize: '10px', color: '#A0A0A0', margin: 0 }}>
                  ⟳ {sym}
                </p>
              </div>

              {/* Net */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                padding: '12px',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                  الصافي
                </p>
                <p style={{ fontSize: '20px', fontWeight: 900, color: '#FFCD11', margin: '0 0 4px', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {fmt(Number(cur.net_amount))}
                </p>
                <p style={{ fontSize: '10px', color: '#A0A0A0', margin: 0 }}>
                  = {sym}
                </p>
              </div>
            </div>

            {/* ╔════════════════════════════════════════════════════
                RECENT TRANSACTIONS
                ════════════════════════════════════════════════════╗ */}
            <div style={{ margin: '0 16px 20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 900, color: '#1A1A1A', margin: '0 0 12px' }}>
                آخر المعاملات
              </h3>

              {recentTxs.length === 0 ? (
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  padding: '20px',
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: '13px', color: '#A0A0A0', margin: 0 }}>لا توجد معاملات</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {recentTxs.map(tx => {
                    const isIncome = tx.type === 'income';
                    const color = isIncome ? '#10B981' : '#EF4444';
                    const sign = isIncome ? '+' : '-';

                    return (
                      <div key={tx.id} style={{
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #E5E7EB',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '12px', fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px' }}>
                            {isIncome ? 'دخل' : 'مصروف'}
                          </p>
                          {tx.description && (
                            <p style={{ fontSize: '11px', color: '#A0A0A0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {tx.description}
                            </p>
                          )}
                          {tx.customer_name && (
                            <p style={{ fontSize: '10px', color: '#A0A0A0', margin: '2px 0 0' }}>
                              👤 {tx.customer_name}
                            </p>
                          )}
                        </div>
                        <div style={{ textAlign: 'end', flexShrink: 0, marginLeft: '12px' }}>
                          <p style={{ fontSize: '13px', fontWeight: 900, color, margin: '0 0 2px', fontFamily: "'Barlow Condensed', sans-serif" }} dir="ltr">
                            {sign}{fmt(Number(tx.amount))}
                          </p>
                          <p style={{ fontSize: '9px', color: '#A0A0A0', margin: 0 }}>
                            {new Date(tx.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ╔════════════════════════════════════════════════════
          BOTTOM NAVIGATION with FAB
          ════════════════════════════════════════════════════╗ */}
      {cycles.length > 0 && (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '72px',
          background: '#FFFFFF',
          borderTop: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 40,
          paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.04)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
        }}>
          {/* Home */}
          <button
            onClick={() => window.location.href = '/driver'}
            style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#1A1A1A',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: '20px', marginBottom: '4px' }}>🏠</span>
            الرئيسية
          </button>

          {/* Transactions */}
          <button
            onClick={() => window.location.href = '/driver/transactions'}
            style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#A0A0A0',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: '20px', marginBottom: '4px' }}>📋</span>
            المعاملات
          </button>

          {/* FAB: Add Transaction */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
          }}>
            <Link href="/driver" style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#FFCD11',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(255, 205, 17, 0.3)',
              cursor: 'pointer',
              border: '4px solid #FFFFFF',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              +
            </Link>
          </div>

          {/* Invoices */}
          <button
            onClick={() => window.location.href = '/driver/invoices'}
            style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#A0A0A0',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: '20px', marginBottom: '4px' }}>🧾</span>
            الفواتير
          </button>

          {/* Profile/Menu */}
          <button
            style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#A0A0A0',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: '20px', marginBottom: '4px' }}>👤</span>
            الملف
          </button>
        </nav>
      )}

    </div>
  );
}
