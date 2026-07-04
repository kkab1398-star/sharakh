"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CustomerAutocomplete from '@/components/CustomerAutocomplete';
import { currencySymbol } from '@/lib/currency';
import { useDriverLang } from '@/contexts/DriverLangContext';
import { LANG_META, type DriverLang } from '@/lib/driver-i18n';

interface WorkerInfo  { id: string; full_name: string; partner_id: string; currency: string; company_name: string; }
interface Cycle       { id: string; title: string | null; started_at: string; currency: string; total_income: number; total_expenses: number; total_advances: number; net_amount: number; equipment_name?: string | null; }
interface Service     { id: string; name: string; default_price: number | null; currency: string; }
interface ExpenseType { id: string; name: string; is_default: boolean; }
interface RecentTx    { id: string; type: string; amount: number; description: string | null; customer_name: string | null; created_at: string; }
type TxType = 'income' | 'expense' | 'transfer_to_worker';

const DEFAULT_EXPENSE_TYPES: ExpenseType[] = [
  'وقود','تغيير زيت','تشحيم','كفرات','صيانة عامة','غسيل','رسوم ورخص','أخرى',
].map((name, i) => ({ id: `d${i}`, name, is_default: true }));

function ph(cur: string) { return cur === 'SAR' ? '0512345678' : '+971501234567'; }
function validPhone(p: string, cur: string, hint: string) {
  if (!p) return null;
  return (cur === 'SAR' ? /^05\d{8}$/ : /^\+\d{9,14}$/).test(p) ? null : hint;
}

const CI = (extra?: React.CSSProperties): React.CSSProperties => ({
  height: 48, borderRadius: 2, border: '1px solid var(--cat-mid)',
  background: 'var(--cat-black)', color: 'var(--cat-white)',
  padding: '0 12px', fontSize: 15, width: '100%', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit', ...extra,
});

const nextLang: Record<DriverLang, DriverLang> = { ar: 'en', en: 'ur', ur: 'bn', bn: 'ne', ne: 'tl', tl: 'ar' };

const TX_CFG: Record<string, { color: string; icon: string }> = {
  income:             { color: '#FFCD11', icon: '↑' },
  expense:            { color: '#ef4444', icon: '↓' },
  transfer_to_worker: { color: '#3b82f6', icon: '⟳' },
  transfer_to_partner:{ color: '#A0A0A0', icon: '→' },
};

export default function DriverHome() {
  const router = useRouter();
  const { m, dir, lang, setLang, meta } = useDriverLang();

  const [worker, setWorker]       = useState<WorkerInfo | null>(null);
  const [cycles, setCycles]       = useState<Cycle[]>([]);
  const [loading, setLoading]     = useState(true);
  const [selCycle, setSelCycle]   = useState('');
  const [recentTxs, setRecentTxs] = useState<RecentTx[]>([]);
  const [showForm, setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]     = useState(false);
  const [btnSuccess, setBtnSuccess] = useState(false);
  const [services, setServices]   = useState<Service[]>([]);
  const [expTypes, setExpTypes]   = useState<ExpenseType[]>(DEFAULT_EXPENSE_TYPES);
  const [form, setForm] = useState({
    type: 'income' as TxType, amount: '', desc: '',
    cName: '', cPhone: '', invoice: false, svcDesc: '',
    serviceId: '', expenseType: '', customExpense: '',
  });
  const [phoneErr, setPhoneErr] = useState<string | null>(null);

  const cur      = cycles.find(c => c.id === selCycle);
  const currency = cur?.currency ?? worker?.currency ?? 'SAR';
  const sym      = currencySymbol(currency);

  const loadCycles = useCallback(async () => {
    const r = await fetch('/api/worker/cycles');
    if (r.status === 401) { router.replace('/driver/login'); return; }
    const d  = await r.json();
    const ls: Cycle[] = d.cycles ?? [];
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
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!showForm) return;
    fetch('/api/worker/services').then(r => r.json()).then(d => setServices(d.services ?? []));
    fetch('/api/worker/expense-types').then(r => r.json()).then(d => setExpTypes(d.expense_types?.length ? d.expense_types : DEFAULT_EXPENSE_TYPES));
  }, [showForm]);

  const resetForm = () => {
    setForm({ type: 'income', amount: '', desc: '', cName: '', cPhone: '', invoice: false, svcDesc: '', serviceId: '', expenseType: '', customExpense: '' });
    setPhoneErr(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.cPhone) {
      const err = validPhone(form.cPhone, currency, currency === 'SAR' ? m.form.phoneHintSAR : m.form.phoneHintIntl);
      if (err) { setPhoneErr(err); return; }
    }
    let finalDesc: string | undefined;
    if (form.type === 'expense') finalDesc = form.expenseType === 'أخرى' ? (form.customExpense || undefined) : (form.expenseType || undefined);
    else finalDesc = form.desc || undefined;

    setSubmitting(true);
    try {
      const r = await fetch('/api/worker/transactions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cycle_id: selCycle, amount: Number(form.amount), type: form.type, description: finalDesc, customer_name: form.cName || undefined, customer_phone: form.cPhone || undefined, issue_invoice: form.invoice, service_desc: form.svcDesc || undefined }),
      });
      if (r.ok) {
        setBtnSuccess(true);
        setTimeout(() => {
          setBtnSuccess(false);
          setSuccess(true); setShowForm(false); resetForm();
          loadCycles().then(ls => { if (ls?.length) loadRecentTxs(ls[0].id); });
          setTimeout(() => setSuccess(false), 3000);
        }, 1000);
      } else { const d = await r.json(); alert(d.error ?? 'Error'); }
    } finally { setSubmitting(false); }
  };

  const TX: { type: TxType; label: string }[] = [
    { type: 'income',             label: m.form.types.income             },
    { type: 'expense',            label: m.form.types.expense            },
    { type: 'transfer_to_worker', label: m.form.types.transfer_to_worker },
  ];

  const isDisabled = submitting || !!phoneErr
    || (form.type === 'expense' && form.expenseType === 'أخرى' && !form.customExpense)
    || (form.invoice && (!form.cName || !form.cPhone || !form.svcDesc));

  if (loading) return (
    <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cat-black)', fontFamily: meta.fontFamily }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🚜</div>
        <p style={{ color: 'var(--cat-muted)', fontSize: 13 }}>...</p>
      </div>
    </div>
  );

  const firstLetter = worker?.full_name?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <div style={{ fontFamily: meta.fontFamily, background: 'var(--cat-black)', minHeight: '100svh' }}>

      {/* ═══════════════════════════════════════
          SECTION 1 — HEADER
      ═══════════════════════════════════════ */}
      <header style={{
        background: '#111111',
        borderBottom: '3px solid #FFCD11',
        padding: '10px 16px',
        position: 'sticky', top: 0, zIndex: 20,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: 8,
      }}>
        {/* LEFT: avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: '#FFCD11', color: '#1A1A1A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 900, flexShrink: 0,
          }}>
            {firstLetter}
          </div>
          <p style={{ fontSize: 14, fontWeight: 900, color: '#FFFFFF', margin: 0, lineHeight: 1.2, letterSpacing: '-0.3px' }}>
            {worker?.full_name ?? '—'}
          </p>
        </div>

        {/* CENTER: company name */}
        <p style={{ fontSize: 13, fontWeight: 700, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, margin: 0, textAlign: 'center', whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
          {worker?.company_name ?? ''}
        </p>

        {/* RIGHT: lang toggle + logout */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setLang(nextLang[lang])}
            style={{
              fontSize: 10, fontWeight: 700,
              color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, background: 'transparent',
              border: '1px solid #FFCD11', borderRadius: 0,
              padding: '4px 8px', cursor: 'pointer',
              fontFamily: LANG_META[nextLang[lang]].fontFamily,
              lineHeight: 1,
            }}
          >
            {LANG_META[nextLang[lang]].label}
          </button>
          <button
            onClick={async () => {
              await fetch('/api/auth/worker/logout', { method: 'POST' });
              sessionStorage.removeItem('worker');
              router.replace('/driver/login');
            }}
            style={{
              fontSize: 10, fontWeight: 700,
              color: '#FFFFFF', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 0,
              padding: '4px 8px', cursor: 'pointer', fontFamily: meta.fontFamily,
              lineHeight: 1,
            }}
          >
            {m.nav.logout}
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 430, margin: '0 auto', paddingBottom: 120 }}>

        {success && (
          <div style={{ margin: '12px 16px 0', background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', borderRight: '4px solid #22c55e', padding: '10px 14px', fontSize: 13, fontWeight: 700, color: '#22c55e' }}>
            ✓ {m.form.success}
          </div>
        )}

        {cycles.length === 0 ? (
          <div style={{ margin: 16, background: '#2A2A2A', border: '1px solid var(--cat-mid)', borderRadius: 4, padding: 40, textAlign: 'center', marginTop: 40 }}>
            <p style={{ fontSize: 36, margin: '0 0 12px' }}>📭</p>
            <p style={{ fontWeight: 700, color: '#FFFFFF', fontSize: 15 }}>{m.home.noCycles}</p>
            <p style={{ fontSize: 13, color: 'var(--cat-muted)', marginTop: 6 }}>{m.home.noCyclesHint}</p>
          </div>
        ) : cur && (
          <>
            {/* ═══════════════════════════════════════
                SECTION 2 — CURRENT CYCLE CARD
            ═══════════════════════════════════════ */}
            <div style={{
              margin: '16px 16px 0',
              background: '#2A2A2A',
              borderRight: '4px solid #FFCD11',
              borderRadius: 4,
              padding: 16,
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>
                {m.home.currentCycle}
              </p>
              <p style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
                {cur.title ?? m.home.defaultCycleTitle}
              </p>
              <p style={{ fontSize: 13, color: '#A0A0A0', margin: '0 0 4px' }} dir="ltr">
                {new Date(cur.started_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
              {cur.equipment_name && (
                <p style={{ fontSize: 13, color: '#FFFFFF', margin: 0 }}>
                  🚜 {cur.equipment_name}
                </p>
              )}
            </div>

            {/* ═══════════════════════════════════════
                SECTION 3 — 4 STAT CARDS (2-col grid)
            ═══════════════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '12px 16px 0' }}>
              {/* Income */}
              <div style={{ background: '#2A2A2A', borderRadius: 4, borderTop: '3px solid #FFCD11', padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{m.home.income}</p>
                  <span style={{ fontSize: 18, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, fontWeight: 900 }}>↑</span>
                </div>
                <p style={{ fontSize: 26, fontWeight: 900, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, margin: 0, fontFamily: "'Barlow Condensed', inherit", letterSpacing: '-0.5px' }} dir="ltr">
                  {Number(cur.total_income).toLocaleString('en-US')}
                </p>
                <p style={{ fontSize: 10, color: '#A0A0A0', margin: '2px 0 0' }}>{sym}</p>
              </div>

              {/* Expenses */}
              <div style={{ background: '#2A2A2A', borderRadius: 4, borderTop: '3px solid #ef4444', padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{m.home.expenses}</p>
                  <span style={{ fontSize: 18, color: '#ef4444', fontWeight: 900 }}>↓</span>
                </div>
                <p style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', margin: 0, fontFamily: "'Barlow Condensed', inherit", letterSpacing: '-0.5px' }} dir="ltr">
                  {Number(cur.total_expenses).toLocaleString('en-US')}
                </p>
                <p style={{ fontSize: 10, color: '#A0A0A0', margin: '2px 0 0' }}>{sym}</p>
              </div>

              {/* Advances */}
              <div style={{ background: '#2A2A2A', borderRadius: 4, borderTop: '3px solid #3b82f6', padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{m.home.advances ?? 'السلف'}</p>
                  <span style={{ fontSize: 18, color: '#3b82f6', fontWeight: 900 }}>⟳</span>
                </div>
                <p style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', margin: 0, fontFamily: "'Barlow Condensed', inherit", letterSpacing: '-0.5px' }} dir="ltr">
                  {Number(cur.total_advances ?? 0).toLocaleString('en-US')}
                </p>
                <p style={{ fontSize: 10, color: '#A0A0A0', margin: '2px 0 0' }}>{sym}</p>
              </div>

              {/* Net */}
              <div style={{ background: '#2A2A2A', borderRadius: 4, borderTop: '3px solid #22c55e', padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{m.home.net}</p>
                  <span style={{ fontSize: 18, color: '#22c55e', fontWeight: 900 }}>=</span>
                </div>
                <p style={{ fontSize: 26, fontWeight: 900, color: '#22c55e', margin: 0, fontFamily: "'Barlow Condensed', inherit", letterSpacing: '-0.5px' }} dir="ltr">
                  {Number(cur.net_amount).toLocaleString('en-US')}
                </p>
                <p style={{ fontSize: 10, color: '#A0A0A0', margin: '2px 0 0' }}>{sym}</p>
              </div>
            </div>

            {/* ═══════════════════════════════════════
                SECTION 4 — RECENT TRANSACTIONS
            ═══════════════════════════════════════ */}
            <div style={{ margin: '16px 16px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <p style={{ fontSize: 13, fontWeight: 900, color: '#FFFFFF', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {m.home.recentTx ?? 'آخر المعاملات'}
                </p>
                <Link href="/driver/transactions" style={{ fontSize: 12, fontWeight: 700, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, textDecoration: 'none' }}>
                  {m.home.viewAll ?? 'عرض الكل'} ›
                </Link>
              </div>

              {recentTxs.length === 0 ? (
                <div style={{ background: '#2A2A2A', borderRadius: 4, padding: '24px 16px', textAlign: 'center' }}>
                  <p style={{ fontSize: 13, color: 'var(--cat-muted)', margin: 0 }}>{m.home.noTx ?? 'لا توجد معاملات بعد'}</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} dir={dir}>
                  {recentTxs.map(tx => {
                    const cfg   = TX_CFG[tx.type] ?? { color: 'var(--cat-muted)', icon: '·' };
                    const sign  = tx.type === 'income' ? '+' : '-';
                    const label = m.transactions?.types?.[tx.type as keyof typeof m.transactions.types] ?? tx.type;
                    return (
                      <div key={tx.id} style={{
                        background: '#2A2A2A', borderRadius: 4,
                        padding: '14px 16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        borderRight: `3px solid ${cfg.color}`,
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px' }}>
                            {label}
                          </p>
                          {tx.description   && <p style={{ fontSize: 12, color: 'var(--cat-muted)', margin: '0 0 1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description}</p>}
                          {tx.customer_name && <p style={{ fontSize: 11, color: 'var(--cat-muted)', margin: 0 }}>👤 {tx.customer_name}</p>}
                        </div>
                        <div style={{ textAlign: 'end', flexShrink: 0, paddingRight: dir === 'rtl' ? 0 : 0, paddingLeft: 12 }}>
                          <p style={{ fontSize: 15, fontWeight: 900, color: cfg.color, margin: '0 0 2px', fontFamily: "'Barlow Condensed', inherit" }} dir="ltr">
                            {sign}{Number(tx.amount).toLocaleString('en-US')} {sym}
                          </p>
                          <p style={{ fontSize: 10, color: 'var(--cat-muted)', margin: 0 }} dir="ltr">
                            {new Date(tx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
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

      {/* ═══════════════════════════════════════
          SECTION 5 — FAB
      ═══════════════════════════════════════ */}
      {cycles.length > 0 && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            position: 'fixed', bottom: 76, left: '50%', transform: 'translateX(-50%)',
            width: 200, height: 52, borderRadius: 0,
            background: '#FFCD11', color: '#1A1A1A',
            border: 'none', cursor: 'pointer',
            fontWeight: 900, fontSize: 16, fontFamily: meta.fontFamily,
            textTransform: 'uppercase', letterSpacing: '0.04em',
            boxShadow: '0 4px 20px rgba(255,205,17,0.4)',
            zIndex: 40, whiteSpace: 'nowrap',
          }}
        >
          + {m.home.addTransaction}
        </button>
      )}

      {/* ═══════════════════════════════════════
          BOTTOM SHEET FORM
      ═══════════════════════════════════════ */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
          {/* Backdrop */}
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }}
            onClick={() => { setShowForm(false); resetForm(); }}
          />

          {/* Sheet */}
          <div dir={dir} style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: 'var(--cat-gray)',
            borderTop: '3px solid var(--cat-yellow)',
            maxHeight: '92svh', overflowY: 'auto',
            zIndex: 51,
          }}>
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: 40, height: 3, background: 'var(--cat-yellow)' }} />
            </div>

            <div style={{ padding: '0 16px 140px' }}>
              <h2 style={{ fontSize: 16, fontWeight: 900, color: 'var(--cat-white)', margin: '4px 0 16px', textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
                {m.form.addTransaction}
              </h2>

              <form id="tx-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Transaction type selector */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {TX.map(({ type, label }) => (
                    <button key={type} type="button"
                      onClick={() => setForm(p => ({ ...p, type, invoice: false, expenseType: '', customExpense: '', serviceId: '' }))}
                      style={{
                        padding: '10px 4px', borderRadius: 0, cursor: 'pointer', fontFamily: meta.fontFamily,
                        fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em',
                        border: form.type === type ? '2px solid var(--cat-yellow)' : '1px solid var(--cat-mid)',
                        background: form.type === type ? 'var(--cat-yellow)' : 'var(--cat-black)',
                        color: form.type === type ? 'var(--cat-black)' : 'var(--cat-muted)',
                      }}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Services dropdown (income only) */}
                {form.type === 'income' && services.length > 0 && (
                  <div>
                    <label className="cat-label">نوع الخدمة</label>
                    <select
                      value={form.serviceId}
                      onChange={e => {
                        const s = services.find(x => x.id === e.target.value);
                        setForm(p => ({ ...p, serviceId: e.target.value, amount: s?.default_price?.toString() ?? p.amount, svcDesc: s?.name ?? p.svcDesc }));
                      }}
                      style={CI()}
                    >
                      <option value="">-- اختر خدمة --</option>
                      {services.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name}{s.default_price ? ` (${Number(s.default_price).toLocaleString('en-US')} ${sym})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Amount */}
                <div>
                  <label className="cat-label">{m.form.amount} ({sym})</label>
                  <input
                    required type="number" min="0.01" step="0.01" inputMode="decimal"
                    value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                    placeholder="0.00" dir="ltr"
                    style={CI({ textAlign: 'center', fontSize: 28, fontWeight: 900, height: 60, fontFamily: "'Barlow Condensed', inherit", color: 'var(--cat-yellow)', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any })}
                    onFocus={e => (e.target.style.border = '2px solid var(--cat-yellow)')}
                    onBlur={e => (e.target.style.border = '1px solid var(--cat-mid)')}
                  />
                </div>

                {/* Expense type dropdown */}
                {form.type === 'expense' && (
                  <div>
                    <label className="cat-label">نوع المصروف</label>
                    <select value={form.expenseType} onChange={e => setForm(p => ({ ...p, expenseType: e.target.value, customExpense: '' }))} style={CI()}>
                      <option value="">-- اختر --</option>
                      {expTypes.map(et => <option key={et.id} value={et.name}>{et.name}</option>)}
                    </select>
                    {form.expenseType === 'أخرى' && (
                      <input
                        required value={form.customExpense}
                        onChange={e => setForm(p => ({ ...p, customExpense: e.target.value }))}
                        placeholder="اكتب نوع المصروف..."
                        style={{ ...CI(), marginTop: 8 }}
                        onFocus={e => (e.target.style.border = '2px solid var(--cat-yellow)')}
                        onBlur={e => (e.target.style.border = '1px solid var(--cat-mid)')}
                      />
                    )}
                  </div>
                )}

                {/* Customer section (income only) */}
                {form.type === 'income' && (
                  <div style={{ background: 'var(--cat-black)', border: '1px solid var(--cat-mid)', borderRight: '3px solid var(--cat-yellow)', borderRadius: 2, padding: '14px 14px 10px' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--cat-yellow)', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>
                      👤 {m.form.customerSection}
                    </p>
                    <div style={{ marginBottom: 10 }}>
                      <CustomerAutocomplete label={m.form.customerName} field="name" value={form.cName}
                        onChange={v => setForm(p => ({ ...p, cName: v }))}
                        onSelect={c => setForm(p => ({ ...p, cName: c.full_name, cPhone: c.phone }))}
                        placeholder={m.form.customerNamePlaceholder} />
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <CustomerAutocomplete label={m.form.customerPhone} field="phone" value={form.cPhone}
                        onChange={v => { setForm(p => ({ ...p, cPhone: v })); setPhoneErr(validPhone(v, currency, currency === 'SAR' ? m.form.phoneHintSAR : m.form.phoneHintIntl)); }}
                        onSelect={c => { setForm(p => ({ ...p, cName: c.full_name, cPhone: c.phone })); setPhoneErr(null); }}
                        placeholder={ph(currency)} inputMode="tel" dir="ltr" />
                      {phoneErr && <p style={{ fontSize: 11, color: 'var(--cat-red)', marginTop: 4 }}>{phoneErr}</p>}
                    </div>

                    {/* Invoice toggle */}
                    <div
                      onClick={() => setForm(p => ({ ...p, invoice: !p.invoice }))}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--cat-gray)', border: '1px solid var(--cat-mid)', borderRadius: 2, padding: '10px 12px', cursor: 'pointer' }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--cat-white)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        🧾 {m.form.issueInvoice}
                      </span>
                      <div style={{ width: 44, height: 22, borderRadius: 0, background: form.invoice ? 'var(--cat-yellow)' : 'var(--cat-mid)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                        <div style={{ width: 16, height: 16, background: form.invoice ? 'var(--cat-black)' : 'var(--cat-muted)', position: 'absolute', top: 3, left: form.invoice ? 25 : 3, transition: 'left 0.2s' }} />
                      </div>
                    </div>

                    {form.invoice && (
                      <div style={{ marginTop: 10 }}>
                        <label className="cat-label">{m.form.serviceDesc} *</label>
                        <input required value={form.svcDesc} onChange={e => setForm(p => ({ ...p, svcDesc: e.target.value }))}
                          placeholder={m.form.serviceDescPlaceholder} style={CI()}
                          onFocus={e => (e.target.style.border = '2px solid var(--cat-yellow)')}
                          onBlur={e => (e.target.style.border = '1px solid var(--cat-mid)')}
                        />
                        {!form.cName  && <p style={{ fontSize: 11, color: 'var(--cat-muted)', marginTop: 4 }}>⚠️ {m.form.customerRequired}</p>}
                        {!form.cPhone && <p style={{ fontSize: 11, color: 'var(--cat-muted)', marginTop: 2 }}>⚠️ {m.form.phoneRequired}</p>}
                      </div>
                    )}
                  </div>
                )}

                {/* Note (non-expense) */}
                {form.type !== 'expense' && (
                  <div>
                    <label className="cat-label">{m.form.note}</label>
                    <input value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
                      placeholder={m.form.notePlaceholder} style={CI()}
                      onFocus={e => (e.target.style.border = '2px solid var(--cat-yellow)')}
                      onBlur={e => (e.target.style.border = '1px solid var(--cat-mid)')}
                    />
                  </div>
                )}

              </form>
            </div>
          </div>

          {/* Fixed save button */}
          <button
            form="tx-form" type="submit" disabled={isDisabled || submitting}
            style={{
              position: 'fixed', bottom: 70, left: 16, right: 16,
              height: 56, borderRadius: 0, border: 'none',
              background: btnSuccess ? '#22c55e' : isDisabled ? 'var(--cat-mid)' : '#FFCD11',
              color: isDisabled ? 'var(--cat-muted)' : '#1A1A1A',
              fontWeight: 900, fontSize: 18, fontFamily: "'Cairo', sans-serif",
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              zIndex: 9999,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 -4px 20px rgba(255,205,17,0.3)',
              transition: 'background 0.2s, transform 0.1s',
            }}
            onMouseDown={e => { if (!isDisabled) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)'; }}
            onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          >
            {btnSuccess
              ? '✓ تم الحفظ'
              : submitting
                ? m.form.saving
                : `💾 ${form.invoice ? m.form.saveWithInvoice : m.form.save}`
            }
          </button>
        </div>
      )}

    </div>
  );
}
