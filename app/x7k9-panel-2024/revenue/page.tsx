"use client";

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Payment {
  id: string;
  partner_id: string;
  partner_name: string;
  amount: number;
  method: string;
  reference_number: string | null;
  payment_date: string;
  status: string;
  created_at: string;
}

function fmt(n: number) { return n.toLocaleString('en-US'); }

export default function RevenuePage() {
  const [payments, setPayments]       = useState<Payment[]>([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [formData, setFormData]       = useState({
    partner_id: '', amount: '', method: 'transfer', reference_number: '', payment_date: '', note: '',
  });

  useEffect(() => {
    fetch('/api/admin/payments')
      .then(r => r.json())
      .then(d => setPayments(d.payments ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleAddPayment = async () => {
    const res = await fetch('/api/admin/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        amount: parseFloat(formData.amount),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setPayments([data.payment, ...payments]);
      setShowModal(false);
      setFormData({ partner_id: '', amount: '', method: 'transfer', reference_number: '', payment_date: '', note: '' });
    }
  };

  const monthlyData = (() => {
    const map: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map[key] = 0;
    }
    for (const p of payments) {
      const d = new Date(p.payment_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (map.hasOwnProperty(key)) map[key] += p.amount;
    }
    return Object.entries(map).map(([k, v]) => ({
      month: new Date(k + '-01').toLocaleDateString('ar-SA', { month: 'short' }),
      total: v,
    }));
  })();

  const total = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>الإيرادات</h1>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: '#FFCD11', color: '#1A1A1A', border: 'none', padding: '8px 16px',
            cursor: 'pointer', fontSize: 13, fontWeight: 900, borderRadius: 2,
          }}
        >
          + تسجيل دفعة جديدة
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* الرسم البياني */}
        <div style={{ background: '#2A2A2A', borderRadius: 3, padding: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 900, color: '#FFCD11', textTransform: 'uppercase', marginBottom: 14 }}>الإيرادات الشهرية</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3D3D3D" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#A0A0A0' }} />
              <YAxis tick={{ fontSize: 11, fill: '#A0A0A0' }} />
              <Tooltip
                contentStyle={{ background: '#111111', border: '1px solid #3D3D3D', fontSize: 12, color: '#fff' }}
                formatter={(v: any) => `${fmt(v)} ر.س`}
              />
              <Bar dataKey="total" fill="#FFCD11" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* الملخص */}
        <div style={{ background: '#2A2A2A', borderRadius: 3, padding: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 900, color: '#FFCD11', textTransform: 'uppercase', marginBottom: 14 }}>الملخص</p>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#FFCD11', marginBottom: 8, fontFamily: 'Barlow Condensed' }}>
            {fmt(total)}
          </div>
          <p style={{ fontSize: 11, color: '#A0A0A0', margin: 0 }}>إجمالي الدخل</p>
          <div style={{ marginTop: 16, fontSize: 12, color: '#A0A0A0', lineHeight: 1.8 }}>
            <p>{payments.length} معاملة</p>
            <p>متوسط: {fmt(payments.length > 0 ? total / payments.length : 0)} ر.س</p>
          </div>
        </div>
      </div>

      {/* جدول المدفوعات */}
      <div style={{ background: '#2A2A2A', borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: 30, textAlign: 'center', color: '#A0A0A0' }}>جاري التحميل...</p>
        ) : payments.length === 0 ? (
          <p style={{ padding: 30, textAlign: 'center', color: '#A0A0A0' }}>لا توجد مدفوعات</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: '#111111' }}>
                {['الشركة', 'المبلغ', 'الطريقة', 'الرقم المرجعي', 'التاريخ'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'right', fontSize: 10, color: '#FFCD11', fontWeight: 900 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={p.id} style={{ background: i % 2 === 0 ? '#1A1A1A' : '#111111', borderBottom: '1px solid #3D3D3D' }}>
                  <td style={{ padding: '10px 14px', color: '#fff', fontWeight: 700 }}>{p.partner_name}</td>
                  <td style={{ padding: '10px 14px', color: '#FFCD11', fontWeight: 900 }}>{fmt(p.amount)} ر.س</td>
                  <td style={{ padding: '10px 14px', color: '#A0A0A0', fontSize: 11 }}>
                    {p.method === 'transfer' ? 'تحويل' : p.method === 'cash' ? 'نقداً' : 'بطاقة'}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#A0A0A0' }} dir="ltr">{p.reference_number ?? '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#A0A0A0', fontSize: 11 }} dir="ltr">
                    {new Date(p.payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal إضافة دفعة */}
      {showModal && (
        <>
          <div style={{
            position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} onClick={() => setShowModal(false)}>
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: '#2A2A2A', borderRadius: 4, padding: 24, maxWidth: 500, width: '100%',
                border: '1px solid #3D3D3D',
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#FFCD11', marginBottom: 16 }}>تسجيل دفعة جديدة</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <input
                  placeholder="رقم الشريك (UUID)"
                  value={formData.partner_id}
                  onChange={e => setFormData({ ...formData, partner_id: e.target.value })}
                  style={{ padding: '8px 12px', background: '#1A1A1A', border: '1px solid #3D3D3D', color: '#fff', fontSize: 12, borderRadius: 2 }}
                />
                <input
                  type="number"
                  placeholder="المبلغ"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  style={{ padding: '8px 12px', background: '#1A1A1A', border: '1px solid #3D3D3D', color: '#fff', fontSize: 12, borderRadius: 2 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <select
                  value={formData.method}
                  onChange={e => setFormData({ ...formData, method: e.target.value })}
                  style={{ padding: '8px 12px', background: '#1A1A1A', border: '1px solid #3D3D3D', color: '#fff', fontSize: 12, borderRadius: 2 }}
                >
                  <option value="transfer">تحويل بنكي</option>
                  <option value="cash">نقداً</option>
                  <option value="card">بطاقة</option>
                </select>
                <input
                  type="date"
                  value={formData.payment_date}
                  onChange={e => setFormData({ ...formData, payment_date: e.target.value })}
                  style={{ padding: '8px 12px', background: '#1A1A1A', border: '1px solid #3D3D3D', color: '#fff', fontSize: 12, borderRadius: 2 }}
                />
              </div>

              <input
                placeholder="الرقم المرجعي (اختياري)"
                value={formData.reference_number}
                onChange={e => setFormData({ ...formData, reference_number: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', background: '#1A1A1A', border: '1px solid #3D3D3D', color: '#fff', fontSize: 12, borderRadius: 2, marginBottom: 12 }}
              />

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={handleAddPayment}
                  style={{
                    flex: 1, padding: '10px 16px', background: '#FFCD11', color: '#1A1A1A',
                    border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 900, borderRadius: 2,
                  }}
                >
                  حفظ الدفعة
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1, padding: '10px 16px', background: 'transparent', color: '#A0A0A0',
                    border: '1px solid #3D3D3D', cursor: 'pointer', fontSize: 13, borderRadius: 2,
                  }}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
