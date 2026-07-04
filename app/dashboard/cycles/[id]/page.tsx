"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { FinancialCycle, Transaction, Partner } from '@/types';
import ShareSettlementButton from '@/components/ShareSettlementButton';
import CustomerAutocomplete from '@/components/CustomerAutocomplete';
import { currencySymbol } from '@/lib/currency';

type TxType = Transaction['type'];

const TX_CFG: Record<TxType, { color: string; bg: string; icon: string; label: string }> = {
  income:              { color: '#FFCD11', bg: 'rgba(255,205,17,0.08)',  icon: '↑', label: 'دخل'            },
  expense:             { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   icon: '↓', label: 'مصروف'          },
  transfer_to_worker:  { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', icon: '⟳', label: 'سلفة للسائق'   },
  transfer_to_partner: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', icon: '→', label: 'تحويل للشريك'  },
};

const INPUT: React.CSSProperties = {
  height: 44, background: '#111111', border: '1px solid #3D3D3D',
  color: '#fff', padding: '0 12px', fontSize: 13, outline: 'none',
  borderRadius: 0, width: '100%', boxSizing: 'border-box', fontFamily: "'Cairo', sans-serif",
};
const LABEL: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, color: '#A0A0A0', marginBottom: 6,
  display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em',
};
const focus = (e: React.FocusEvent<any>) => (e.target.style.border = '1px solid #FFCD11');
const blur  = (e: React.FocusEvent<any>) => (e.target.style.border = '1px solid #3D3D3D');

function fmt(n: number) { return n.toLocaleString('en-US'); }

export default function CycleDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [cycle, setCycle]           = useState<FinancialCycle | null>(null);
  const [transactions, setTx]       = useState<Transaction[]>([]);
  const [partner, setPartner]       = useState<Partner | null>(null);
  const [loading, setLoading]       = useState(true);
  const [settling, setSettling]     = useState(false);
  const [addingTx, setAddingTx]     = useState(false);
  const [showTxForm, setShowTxForm] = useState(false);
  const [txError, setTxError]       = useState<string | null>(null);
  const [settlement, setSettlement] = useState<any>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [txForm, setTxForm] = useState({
    type:          'income' as TxType,
    amount:        '',
    description:   '',
    customerName:  '',
    customerPhone: '',
    issueInvoice:  false,
    serviceDesc:   '',
  });

  const load = () => {
    fetch(`/api/cycles/${id}`)
      .then(r => r.json())
      .then(d => { setCycle(d.cycle); setTx(d.transactions ?? []); })
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);
  useEffect(() => {
    fetch('/api/partners/me').then(r => r.json()).then(d => setPartner(d.partner ?? null));
  }, []);

  const sym    = currencySymbol(cycle?.currency ?? partner?.currency ?? 'SAR');
  const isOpen = cycle?.status === 'open';
  const worker = cycle?.worker as any;

  const income    = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const expenses  = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const transfers = transactions.filter(t => t.type === 'transfer_to_worker').reduce((s, t) => s + Number(t.amount), 0);
  const net       = income - expenses;

  function validatePhone(phone: string): string | null {
    if (!phone) return null;
    const currency = cycle?.currency ?? partner?.currency ?? 'SAR';
    if (currency === 'SAR') return /^05\d{8}$/.test(phone) ? null : 'يجب أن يبدأ بـ 05 ويكون 10 أرقام';
    return /^\+\d{9,14}$/.test(phone) ? null : 'صيغة دولية مطلوبة (مثل +971501234567)';
  }

  const addTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxError(null);
    if (txForm.type === 'income' && txForm.customerPhone) {
      const err = validatePhone(txForm.customerPhone);
      if (err) { setPhoneError(err); return; }
    }
    const workerId: string | undefined =
      (cycle?.worker as any)?.id ?? (cycle as any)?.worker_id ?? undefined;
    if (!workerId) { setTxError('لا يمكن تحديد السائق المرتبط بهذه الدورة'); return; }

    setAddingTx(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cycle_id: id, worker_id: workerId,
          type: txForm.type, amount: Number(txForm.amount),
          description:    txForm.description || undefined,
          customer_name:  txForm.type === 'income' ? txForm.customerName || undefined : undefined,
          customer_phone: txForm.type === 'income' ? txForm.customerPhone || undefined : undefined,
          issue_invoice:  txForm.type === 'income' ? txForm.issueInvoice : false,
          service_desc:   txForm.issueInvoice ? txForm.serviceDesc || undefined : undefined,
        }),
      });
      if (res.ok) {
        setTxForm({ type: 'income', amount: '', description: '', customerName: '', customerPhone: '', issueInvoice: false, serviceDesc: '' });
        setPhoneError(null); setShowTxForm(false); load();
      } else {
        const d = await res.json().catch(() => ({}));
        setTxError(d.error ?? `خطأ (${res.status})`);
      }
    } catch { setTxError('فشل الاتصال بالسيرفر'); }
    finally  { setAddingTx(false); }
  };

  const handleSettle = async () => {
    if (!confirm('هل أنت متأكد من إقفال هذه الدورة؟ لن يمكن إضافة معاملات بعد الإقفال.')) return;
    setSettling(true);
    const res = await fetch(`/api/cycles/${id}/settle`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) { setCycle(data.cycle); setSettlement(data.settlement); }
    setSettling(false);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', background: 'var(--cat-black)' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #FFCD11', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!cycle) return (
    <div style={{ padding: 32, background: 'var(--cat-black)', minHeight: '100vh', color: '#fff', direction: 'rtl' }}>
      <p style={{ color: '#ef4444' }}>الدورة غير موجودة.</p>
    </div>
  );

  const isIncome = txForm.type === 'income';

  return (
    <div dir="rtl" style={{ padding: '28px 32px', background: 'var(--cat-black)', minHeight: '100vh', fontFamily: "'Cairo', sans-serif", color: '#fff' }}>

      {/* ══════ HEADER ══════ */}
      <div style={{ marginBottom: 28 }}>
        {/* breadcrumb */}
        <p style={{ fontSize: 11, color: '#555', marginBottom: 10 }}>
          <a href="/dashboard/cycles" style={{ color: '#555', textDecoration: 'none' }}>الدورات المالية</a>
          {' / '}
          <span style={{ color: '#A0A0A0' }}>{cycle.title ?? 'دورة'}</span>
        </p>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            {/* status + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{
                fontSize: 10, fontWeight: 900, padding: '3px 10px', letterSpacing: '0.08em',
                color:      isOpen ? '#3b82f6' : '#22c55e',
                background: isOpen ? 'rgba(59,130,246,0.12)' : 'rgba(34,197,94,0.12)',
                border:     isOpen ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(34,197,94,0.3)',
              }}>
                {isOpen ? 'مفتوحة' : 'مقفلة'}
              </span>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.3px' }}>
                {cycle.title ?? `دورة ${new Date(cycle.started_at).toLocaleDateString('ar-SA')}`}
              </h1>
            </div>

            {/* meta */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#A0A0A0', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ color: '#FFCD11', fontWeight: 900 }}>👤</span>
                {worker?.full_name ?? '—'}
              </span>
              <span style={{ fontSize: 12, color: '#A0A0A0', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ color: '#FFCD11', fontWeight: 900 }}>📅</span>
                بدأت: {new Date(cycle.started_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
              <span style={{ fontSize: 12, color: '#A0A0A0' }}>
                {transactions.length} معاملة
              </span>
            </div>
          </div>

          {/* actions */}
          {isOpen && (
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => setShowTxForm(v => !v)}
                style={{
                  height: 42, padding: '0 20px', borderRadius: 0, cursor: 'pointer',
                  fontSize: 13, fontWeight: 900, fontFamily: "'Cairo', sans-serif",
                  background: showTxForm ? '#2A2A2A' : '#FFCD11',
                  color:      showTxForm ? '#FFCD11' : '#1A1A1A',
                  border:     showTxForm ? '1px solid #FFCD11' : 'none',
                }}
              >
                {showTxForm ? '✕ إغلاق' : '+ معاملة جديدة'}
              </button>
              <button
                onClick={handleSettle}
                disabled={settling || transactions.length === 0}
                style={{
                  height: 42, padding: '0 20px', borderRadius: 0, cursor: settling || transactions.length === 0 ? 'not-allowed' : 'pointer',
                  fontSize: 13, fontWeight: 900, fontFamily: "'Cairo', sans-serif",
                  background: 'transparent', color: '#ef4444',
                  border: '1px solid #ef4444',
                  opacity: settling || transactions.length === 0 ? 0.4 : 1,
                }}
              >
                {settling ? 'جاري الإقفال...' : '⚙ تسوية وإقفال'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ══════ FINANCIAL SUMMARY ══════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'إجمالي الدخل', value: income,    color: '#FFCD11', icon: '↑' },
          { label: 'المصاريف',     value: expenses,   color: '#ef4444', icon: '↓' },
          { label: 'سلف السائق',  value: transfers,  color: '#3b82f6', icon: '⟳' },
          { label: 'الصافي',      value: net,        color: net >= 0 ? '#22c55e' : '#ef4444', icon: '=' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#2A2A2A', borderTop: `3px solid ${s.color}`, padding: '18px 20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: s.color, opacity: 0.7 }}>{s.icon}</span>
            </div>
            <p style={{ fontSize: 26, fontWeight: 900, color: s.color, margin: 0, fontFamily: "'Barlow Condensed', 'Cairo', sans-serif", letterSpacing: '-0.5px' }} dir="ltr">
              {fmt(s.value)}
              <span style={{ fontSize: 13, fontWeight: 700, marginRight: 4 }}>{sym}</span>
            </p>
          </div>
        ))}
      </div>

      {/* ══════ SETTLEMENT RESULT ══════ */}
      {cycle.status === 'settled' && (
        <div style={{ background: '#2A2A2A', borderTop: '3px solid #22c55e', marginBottom: 24, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 18 }}>✅</span>
            <h2 style={{ fontSize: 14, fontWeight: 900, color: '#22c55e', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              نتيجة التسوية النهائية
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* المالك */}
            <div style={{ background: '#1A1A1A', borderRight: '3px solid #8b5cf6', padding: '20px 24px' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>
                المالك ({100 - (settlement?.worker_percentage ?? 0)}%)
              </p>
              <p style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: '0 0 8px', fontFamily: "'Barlow Condensed', sans-serif" }} dir="ltr">
                {fmt(Number(cycle.partner_net))}
                <span style={{ fontSize: 16, marginRight: 6, color: '#A0A0A0' }}>{sym}</span>
              </p>
              <p style={{ fontSize: 11, color: '#A0A0A0', margin: 0 }} dir="ltr">
                الحصة: {fmt(Number(cycle.partner_share))} {sym}
              </p>
            </div>

            {/* السائق */}
            <div style={{ background: '#1A1A1A', borderRight: '3px solid #22c55e', padding: '20px 24px' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>
                السائق ({settlement?.worker_percentage ?? 0}%)
              </p>
              <p style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: '0 0 8px', fontFamily: "'Barlow Condensed', sans-serif" }} dir="ltr">
                {fmt(Number(cycle.worker_net))}
                <span style={{ fontSize: 16, marginRight: 6, color: '#A0A0A0' }}>{sym}</span>
              </p>
              <p style={{ fontSize: 11, color: '#A0A0A0', margin: 0 }} dir="ltr">
                الحصة: {fmt(Number(cycle.worker_share))} {sym} · سلف: {fmt(Number(cycle.worker_transfers))} {sym}
              </p>
            </div>
          </div>

          {partner && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #3D3D3D' }}>
              <ShareSettlementButton
                cycle={cycle}
                partner={partner}
                workerName={worker?.full_name ?? 'السائق'}
                onReportReady={(url) => setCycle(c => c ? { ...c, report_url: url } : c)}
              />
            </div>
          )}
        </div>
      )}

      {/* ══════ ADD TRANSACTION FORM ══════ */}
      {showTxForm && (
        <div style={{ background: '#2A2A2A', borderTop: '3px solid #FFCD11', marginBottom: 24, padding: 24 }}>
          <h3 style={{ fontSize: 12, fontWeight: 900, color: '#FFCD11', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px' }}>
            + معاملة جديدة
          </h3>

          {txError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', padding: '12px 16px', fontSize: 13, color: '#ef4444', marginBottom: 16 }}>
              ⚠️ {txError}
            </div>
          )}

          <form onSubmit={addTransaction} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* النوع + المبلغ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={LABEL}>نوع المعاملة</label>
                <select
                  value={txForm.type}
                  onChange={e => setTxForm(p => ({ ...p, type: e.target.value as TxType, issueInvoice: false }))}
                  style={{ ...INPUT, cursor: 'pointer' }} onFocus={focus} onBlur={blur}
                >
                  <option value="income">↑ دخل</option>
                  <option value="expense">↓ مصروف</option>
                  <option value="transfer_to_worker">⟳ سلفة للسائق</option>
                  <option value="transfer_to_partner">→ تحويل للشريك</option>
                </select>
              </div>
              <div>
                <label style={LABEL}>المبلغ ({sym})</label>
                <input
                  required type="number" min="0.01" step="0.01"
                  value={txForm.amount}
                  onChange={e => setTxForm(p => ({ ...p, amount: e.target.value }))}
                  placeholder="0.00" dir="ltr"
                  style={INPUT} onFocus={focus} onBlur={blur}
                />
              </div>
            </div>

            {/* قسم الزبون — عند الدخل فقط */}
            {isIncome && (
              <div style={{ background: '#111111', border: '1px solid #2A2A2A', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p style={{ fontSize: 10, fontWeight: 900, color: '#FFCD11', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                  معلومات الزبون
                </p>

                <CustomerAutocomplete
                  label="اسم الزبون"
                  field="name"
                  value={txForm.customerName}
                  onChange={v => setTxForm(p => ({ ...p, customerName: v }))}
                  onSelect={c => setTxForm(p => ({ ...p, customerName: c.full_name, customerPhone: c.phone }))}
                  placeholder="اكتب اسم الزبون..."
                />

                <div>
                  <CustomerAutocomplete
                    label="رقم الجوال"
                    field="phone"
                    value={txForm.customerPhone}
                    onChange={v => { setTxForm(p => ({ ...p, customerPhone: v })); setPhoneError(validatePhone(v)); }}
                    onSelect={c => { setTxForm(p => ({ ...p, customerName: c.full_name, customerPhone: c.phone })); setPhoneError(null); }}
                    placeholder={cycle?.currency === 'SAR' ? '0512345678' : '+971501234567'}
                    inputMode="tel" dir="ltr"
                  />
                  {phoneError && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 6 }}>{phoneError}</p>}
                </div>

                {/* toggle فاتورة */}
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <div
                    onClick={() => setTxForm(p => ({ ...p, issueInvoice: !p.issueInvoice }))}
                    style={{
                      width: 38, height: 22, borderRadius: 11, cursor: 'pointer', flexShrink: 0, position: 'relative',
                      background: txForm.issueInvoice ? '#22c55e' : '#3D3D3D', transition: 'background 0.2s',
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 3, width: 16, height: 16, borderRadius: '50%', background: '#fff',
                      left: txForm.issueInvoice ? 19 : 3, transition: 'left 0.2s',
                    }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: txForm.issueInvoice ? '#22c55e' : '#A0A0A0' }}>
                    إصدار فاتورة لهذه المعاملة
                  </span>
                </label>

                {txForm.issueInvoice && (
                  <div>
                    <label style={LABEL}>وصف الخدمة (للفاتورة) *</label>
                    <input
                      required={txForm.issueInvoice}
                      value={txForm.serviceDesc}
                      onChange={e => setTxForm(p => ({ ...p, serviceDesc: e.target.value }))}
                      placeholder="وصف الخدمة المقدّمة..."
                      style={INPUT} onFocus={focus} onBlur={blur}
                    />
                    {txForm.issueInvoice && !txForm.customerName && (
                      <p style={{ fontSize: 11, color: '#f59e0b', marginTop: 6 }}>⚠️ اسم الزبون مطلوب لإصدار الفاتورة</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* الوصف */}
            <div>
              <label style={LABEL}>الوصف (اختياري)</label>
              <input
                value={txForm.description}
                onChange={e => setTxForm(p => ({ ...p, description: e.target.value }))}
                placeholder="وصف المعاملة..."
                style={INPUT} onFocus={focus} onBlur={blur}
              />
            </div>

            {/* أزرار */}
            <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
              <button
                type="submit"
                disabled={addingTx || !!phoneError || (txForm.issueInvoice && (!txForm.customerName || !txForm.customerPhone))}
                style={{
                  height: 44, padding: '0 24px', borderRadius: 0, cursor: addingTx ? 'not-allowed' : 'pointer',
                  fontSize: 13, fontWeight: 900, fontFamily: "'Cairo', sans-serif",
                  background: '#FFCD11', color: '#1A1A1A', border: 'none',
                  opacity: addingTx ? 0.6 : 1,
                }}
              >
                {addingTx ? 'جاري...' : txForm.issueInvoice ? '💾 حفظ وإصدار فاتورة' : '+ إضافة'}
              </button>
              <button
                type="button"
                onClick={() => { setShowTxForm(false); setPhoneError(null); setTxError(null); }}
                style={{
                  height: 44, padding: '0 16px', borderRadius: 0, cursor: 'pointer',
                  fontSize: 13, fontWeight: 700, fontFamily: "'Cairo', sans-serif",
                  background: 'transparent', color: '#A0A0A0', border: '1px solid #3D3D3D',
                }}
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ══════ TRANSACTIONS LIST ══════ */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 12, fontWeight: 900, color: '#A0A0A0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            المعاملات
          </h2>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#A0A0A0', background: '#2A2A2A', padding: '2px 10px' }}>
            {transactions.length}
          </span>
        </div>

        {transactions.length === 0 ? (
          <div style={{ background: '#2A2A2A', padding: '48px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: 36, margin: '0 0 12px' }}>📋</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>لا توجد معاملات بعد</p>
            <p style={{ fontSize: 12, color: '#A0A0A0', margin: 0 }}>اضغط "+ معاملة جديدة" لتسجيل أول معاملة</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {transactions.map((tx, i) => {
              const cfg = TX_CFG[tx.type];
              return (
                <div key={tx.id} style={{
                  background: '#2A2A2A', borderRight: `4px solid ${cfg.color}`,
                  padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  {/* رقم */}
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#555', minWidth: 20, textAlign: 'center' }}>
                    {transactions.length - i}
                  </span>

                  {/* أيقونة النوع */}
                  <div style={{
                    width: 36, height: 36, background: cfg.bg, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 900, color: cfg.color,
                  }}>
                    {cfg.icon}
                  </div>

                  {/* النوع + التفاصيل */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 11, fontWeight: 900, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {cfg.label}
                      </span>
                      {tx.customer_name && (
                        <span style={{ fontSize: 11, color: '#A0A0A0', background: '#1A1A1A', padding: '1px 8px' }}>
                          {tx.customer_name}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.description || (tx.customer_phone
                        ? <span dir="ltr">{tx.customer_phone}</span>
                        : <span>—</span>
                      )}
                    </div>
                  </div>

                  {/* المبلغ + الوقت */}
                  <div style={{ textAlign: 'end', flexShrink: 0 }}>
                    <p style={{
                      fontSize: 18, fontWeight: 900, color: cfg.color, margin: '0 0 3px',
                      fontFamily: "'Barlow Condensed', 'Cairo', sans-serif",
                    }} dir="ltr">
                      {fmt(Number(tx.amount))} <span style={{ fontSize: 12 }}>{sym}</span>
                    </p>
                    <p style={{ fontSize: 11, color: '#555', margin: 0 }} dir="ltr">
                      {new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {' '}
                      {new Date(tx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </p>
                  </div>

                  {/* حذف */}
                  {isOpen && (
                    <button
                      onClick={async () => {
                        if (!confirm('حذف هذه المعاملة؟')) return;
                        await fetch(`/api/transactions/${tx.id}`, { method: 'DELETE' });
                        load();
                      }}
                      title="حذف"
                      style={{
                        background: 'transparent', border: '1px solid transparent', cursor: 'pointer',
                        width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#ef4444', fontSize: 15, flexShrink: 0, opacity: 0.4,
                        transition: 'opacity 0.15s, border-color 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = '0.4'; e.currentTarget.style.borderColor = 'transparent'; }}
                    >
                      🗑
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
