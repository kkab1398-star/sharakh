"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDriverLang } from '@/contexts/DriverLangContext';

export default function NewInvoicePage() {
  const router = useRouter();
  const { m, dir, meta } = useDriverLang();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    amount: '',
    currency: 'SAR',
    description: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/worker/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          description: formData.description || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'خطأ في إنشاء الفاتورة');
        return;
      }

      router.push('/driver/invoices');
    } catch (err) {
      setError('خطأ في الخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: meta.fontFamily, background: 'var(--cat-black)', minHeight: '100svh' }}>
      <header style={{ background: 'var(--cat-dark)', borderBottom: '3px solid var(--cat-yellow)', padding: '14px 16px', position: 'sticky', top: 0, zIndex: 10 }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--cat-yellow)',
            fontSize: 24,
            cursor: 'pointer',
            padding: 0,
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          ←
        </button>
        <h1 style={{ fontSize: 16, fontWeight: 900, color: 'var(--cat-white)', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.3px' }}>فاتورة جديدة</h1>
      </header>

      <form onSubmit={handleSubmit} style={{ maxWidth: 430, margin: '0 auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--cat-mid)', borderLeft: '3px solid rgb(239, 68, 68)', borderRadius: 2, padding: 12, color: 'rgb(239, 68, 68)', fontSize: 12, fontWeight: 700 }}>
            {error}
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--cat-yellow)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>اسم العميل *</label>
          <input
            type="text"
            required
            name="customer_name"
            value={formData.customer_name}
            onChange={handleInputChange}
            placeholder="محمد علي"
            style={{
              width: '100%',
              padding: '12px 12px',
              background: 'var(--cat-gray)',
              border: '1px solid var(--cat-mid)',
              borderRadius: 2,
              color: 'var(--cat-white)',
              fontSize: 14,
              fontFamily: meta.fontFamily,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--cat-yellow)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>رقم الجوال *</label>
          <input
            type="tel"
            required
            name="customer_phone"
            value={formData.customer_phone}
            onChange={handleInputChange}
            placeholder="966501234567"
            dir="ltr"
            style={{
              width: '100%',
              padding: '12px 12px',
              background: 'var(--cat-gray)',
              border: '1px solid var(--cat-mid)',
              borderRadius: 2,
              color: 'var(--cat-white)',
              fontSize: 14,
              fontFamily: meta.fontFamily,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--cat-yellow)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>المبلغ *</label>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="1000"
              dir="ltr"
              style={{
                width: '100%',
                padding: '12px 12px',
                background: 'var(--cat-gray)',
                border: '1px solid var(--cat-mid)',
                borderRadius: 2,
                color: 'var(--cat-white)',
                fontSize: 14,
                fontFamily: meta.fontFamily,
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ width: 100 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--cat-yellow)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>العملة</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px 12px',
                background: 'var(--cat-gray)',
                border: '1px solid var(--cat-mid)',
                borderRadius: 2,
                color: 'var(--cat-white)',
                fontSize: 14,
                fontFamily: meta.fontFamily,
                boxSizing: 'border-box',
              }}
            >
              <option value="SAR">SAR</option>
              <option value="AED">AED</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--cat-yellow)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>الوصف (اختياري)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="خدمات النقل والتوصيل"
            rows={3}
            style={{
              width: '100%',
              padding: '12px 12px',
              background: 'var(--cat-gray)',
              border: '1px solid var(--cat-mid)',
              borderRadius: 2,
              color: 'var(--cat-white)',
              fontSize: 14,
              fontFamily: meta.fontFamily,
              boxSizing: 'border-box',
              resize: 'vertical',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px 12px',
            background: 'var(--cat-yellow)',
            color: 'var(--cat-black)',
            border: 'none',
            borderRadius: 2,
            fontSize: 14,
            fontWeight: 900,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontFamily: meta.fontFamily,
            minHeight: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 8,
          }}
        >
          {loading ? '...جاري' : 'إنشاء الفاتورة'}
        </button>
      </form>
    </div>
  );
}
