"use client";

import { useEffect, useState } from 'react';

interface Service    { id: string; name: string; default_price: number | null; currency: string; is_active: boolean; }
interface ExpenseType{ id: string; name: string; is_default: boolean; is_active: boolean; }

const INPUT: React.CSSProperties = {
  height: 44, background: '#1A1A1A', border: '1px solid #3D3D3D',
  color: '#fff', padding: '0 12px', fontSize: 13, outline: 'none',
  borderRadius: 0, width: '100%', boxSizing: 'border-box', fontFamily: "'Cairo', sans-serif",
};
const BTN_ADD: React.CSSProperties = {
  height: 44, padding: '0 18px', background: '#FFCD11', color: '#1A1A1A',
  border: 'none', fontWeight: 900, fontSize: 13, cursor: 'pointer',
  whiteSpace: 'nowrap', borderRadius: 0, fontFamily: "'Cairo', sans-serif",
};
const CARD: React.CSSProperties = { background: '#2A2A2A', borderRadius: 4, marginBottom: 20 };
const CARD_HEAD: React.CSSProperties = {
  padding: '14px 20px', borderBottom: '1px solid #3D3D3D',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [expTypes, setExpTypes] = useState<ExpenseType[]>([]);
  const [loading, setLoading]   = useState(true);
  const [currency, setCurrency] = useState('SAR');

  const [svcName,   setSvcName]   = useState('');
  const [svcPrice,  setSvcPrice]  = useState('');
  const [svcSaving, setSvcSaving] = useState(false);

  const [expName,   setExpName]   = useState('');
  const [expSaving, setExpSaving] = useState(false);

  const load = async () => {
    const [sRes, eRes, pRes] = await Promise.all([
      fetch('/api/partner/services'),
      fetch('/api/partner/expense-types'),
      fetch('/api/partners/me'),
    ]);
    const [sd, ed, pd] = await Promise.all([sRes.json(), eRes.json(), pRes.json()]);
    setServices(sd.services ?? []);
    setExpTypes(ed.expense_types ?? []);
    setCurrency(pd.partner?.currency ?? 'SAR');
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addService = async (e: React.FormEvent) => {
    e.preventDefault(); setSvcSaving(true);
    await fetch('/api/partner/services', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: svcName, default_price: svcPrice ? Number(svcPrice) : undefined, currency }),
    });
    setSvcName(''); setSvcPrice(''); await load(); setSvcSaving(false);
  };

  const toggleService = async (id: string, is_active: boolean) => {
    await fetch(`/api/partner/services/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: !is_active }) });
    await load();
  };

  const deleteService = async (id: string) => {
    if (!confirm('حذف هذه الخدمة؟')) return;
    await fetch(`/api/partner/services/${id}`, { method: 'DELETE' }); await load();
  };

  const addExpType = async (e: React.FormEvent) => {
    e.preventDefault(); setExpSaving(true);
    await fetch('/api/partner/expense-types', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: expName }),
    });
    setExpName(''); await load(); setExpSaving(false);
  };

  const toggleExpType = async (id: string, is_active: boolean, is_default: boolean) => {
    if (is_default) return;
    await fetch(`/api/partner/expense-types/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: !is_active }) });
    await load();
  };

  const deleteExpType = async (id: string, is_default: boolean) => {
    if (is_default) return;
    if (!confirm('حذف هذا النوع؟')) return;
    await fetch(`/api/partner/expense-types/${id}`, { method: 'DELETE' }); await load();
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', background: 'var(--cat-black)' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #FFCD11', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div dir="rtl" style={{ padding: 32, background: 'var(--cat-black)', minHeight: '100vh', fontFamily: "'Cairo', sans-serif", color: '#fff', maxWidth: 720 }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>إعدادات العمليات</p>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>الخدمات والمصاريف</h1>
        <p style={{ fontSize: 12, color: '#A0A0A0', marginTop: 4 }}>الخدمات تظهر للسائق عند تسجيل إيراد — أنواع المصاريف تظهر في قائمة المصروف</p>
      </div>

      {/* ══════ قسم الخدمات ══════ */}
      <div style={CARD}>
        <div style={CARD_HEAD}>
          <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>🔧 الخدمات والأسعار</span>
          <span style={{ fontSize: 11, color: '#A0A0A0' }}>{services.filter(s => s.is_active).length} مفعّل</span>
        </div>
        <div style={{ padding: 20 }}>
          {/* إضافة */}
          <form onSubmit={addService} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input required value={svcName} onChange={e => setSvcName(e.target.value)}
              placeholder="اسم الخدمة (مثل: نقل بضاعة)" style={{ ...INPUT, flex: 2 }}
              onFocus={e => (e.target.style.border = '1px solid #FFCD11')}
              onBlur={e => (e.target.style.border = '1px solid #3D3D3D')} />
            <input type="number" min="0" step="0.01" value={svcPrice} onChange={e => setSvcPrice(e.target.value)}
              placeholder={`السعر (${currency})`} style={{ ...INPUT, flex: 1 }} dir="ltr"
              onFocus={e => (e.target.style.border = '1px solid #FFCD11')}
              onBlur={e => (e.target.style.border = '1px solid #3D3D3D')} />
            <button type="submit" disabled={svcSaving} style={BTN_ADD}>
              {svcSaving ? '...' : '+ إضافة'}
            </button>
          </form>

          {/* القائمة */}
          {services.length === 0 ? (
            <p style={{ fontSize: 13, color: '#A0A0A0', textAlign: 'center', padding: '24px 0' }}>
              لا توجد خدمات — أضف أول خدمة أعلاه
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {services.map(s => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', background: '#1A1A1A',
                  borderRight: `3px solid ${s.is_active ? '#FFCD11' : '#3D3D3D'}`,
                  opacity: s.is_active ? 1 : 0.5,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>{s.name}</p>
                    {s.default_price && (
                      <p style={{ fontSize: 11, color: '#A0A0A0', margin: '2px 0 0' }} dir="ltr">
                        {Number(s.default_price).toLocaleString('en-US')} {s.currency}
                      </p>
                    )}
                  </div>
                  <button onClick={() => toggleService(s.id, s.is_active)} style={{
                    height: 30, padding: '0 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', borderRadius: 0,
                    background: 'transparent',
                    color:  s.is_active ? '#22c55e' : '#A0A0A0',
                    border: s.is_active ? '1px solid #22c55e' : '1px solid #3D3D3D',
                  }}>
                    {s.is_active ? '✓ مفعّل' : 'معطّل'}
                  </button>
                  <button onClick={() => deleteService(s.id)} style={{
                    height: 30, padding: '0 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', borderRadius: 0,
                    background: 'transparent', color: '#ef4444', border: '1px solid #ef4444',
                  }}>
                    حذف
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══════ قسم أنواع المصاريف ══════ */}
      <div style={CARD}>
        <div style={CARD_HEAD}>
          <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>📤 أنواع المصاريف</span>
          <span style={{ fontSize: 11, color: '#A0A0A0' }}>{expTypes.length} نوع</span>
        </div>
        <div style={{ padding: 20 }}>
          {/* إضافة */}
          <form onSubmit={addExpType} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input required value={expName} onChange={e => setExpName(e.target.value)}
              placeholder="نوع مخصص (مثل: كراء معدة)" style={INPUT}
              onFocus={e => (e.target.style.border = '1px solid #FFCD11')}
              onBlur={e => (e.target.style.border = '1px solid #3D3D3D')} />
            <button type="submit" disabled={expSaving} style={BTN_ADD}>
              {expSaving ? '...' : '+ إضافة'}
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {expTypes.map(et => (
              <div key={et.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', background: '#1A1A1A',
                borderRight: `3px solid ${et.is_active ? (et.is_default ? '#3D3D3D' : '#FFCD11') : '#1A1A1A'}`,
                opacity: et.is_active ? 1 : 0.5,
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>{et.name}</p>
                  {et.is_default && (
                    <span style={{ fontSize: 10, color: '#A0A0A0', background: '#2A2A2A', padding: '1px 6px' }}>افتراضي</span>
                  )}
                </div>
                {!et.is_default && (
                  <>
                    <button onClick={() => toggleExpType(et.id, et.is_active, et.is_default)} style={{
                      height: 30, padding: '0 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', borderRadius: 0,
                      background: 'transparent',
                      color:  et.is_active ? '#22c55e' : '#A0A0A0',
                      border: et.is_active ? '1px solid #22c55e' : '1px solid #3D3D3D',
                    }}>
                      {et.is_active ? '✓ مفعّل' : 'معطّل'}
                    </button>
                    <button onClick={() => deleteExpType(et.id, et.is_default)} style={{
                      height: 30, padding: '0 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', borderRadius: 0,
                      background: 'transparent', color: '#ef4444', border: '1px solid #ef4444',
                    }}>
                      حذف
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
