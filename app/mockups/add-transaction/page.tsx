'use client';

import { useState } from 'react';

export default function AddTransactionMockup() {
  const [type, setType] = useState('income');

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F4F5F7',
      display: 'flex',
      alignItems: 'flex-end',
      fontFamily: 'Cairo, sans-serif',
      padding: '20px 0',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '390px',
        background: '#FFFFFF',
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
        boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.12)',
        padding: '20px 16px 32px',
        maxHeight: '90vh',
        overflowY: 'auto',
        animation: 'slideUp 0.3s ease-out',
      }}>
        <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

        <div style={{
          width: '40px',
          height: '4px',
          background: '#E5E7EB',
          borderRadius: '2px',
          margin: '0 auto 16px',
        }} />

        <h2 style={{
          fontSize: '20px',
          fontWeight: 900,
          color: '#1A1A1A',
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          إضافة عملية
        </h2>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* TYPE SELECTOR */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              color: '#1A1A1A',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px',
            }}>
              نوع العملية
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { value: 'income', label: '📈 دخل' },
                { value: 'expense', label: '📉 مصروف' },
              ].map(opt => (
                <label key={opt.value} style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="radio"
                    name="type"
                    value={opt.value}
                    checked={type === opt.value}
                    onChange={() => setType(opt.value)}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    padding: '12px 14px',
                    border: type === opt.value ? '2px solid #FFCD11' : '2px solid #E5E7EB',
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '12px',
                    color: type === opt.value ? '#1A1A1A' : '#A0A0A0',
                    background: type === opt.value ? '#FFFBF0' : '#F9FAFB',
                    transition: 'all 0.2s',
                  }}>
                    {opt.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* AMOUNT */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              color: '#1A1A1A',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px',
            }}>
              المبلغ (ر.س)
            </label>
            <input
              type="number"
              defaultValue="850"
              placeholder="0.00"
              step="0.01"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                fontSize: '14px',
                fontFamily: "'Barlow Condensed', sans-serif",
                background: '#F9FAFB',
                color: '#1A1A1A',
                textAlign: 'left',
                direction: 'ltr',
              }}
            />
            <p style={{ fontSize: '11px', color: '#A0A0A0', marginTop: '4px' }}>
              أدخل المبلغ بالريال السعودي
            </p>
          </div>

          {/* CATEGORY */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              color: '#1A1A1A',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px',
            }}>
              الفئة
            </label>
            <select style={{
              width: '100%',
              padding: '12px 14px',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Cairo, sans-serif',
              background: '#F9FAFB',
              color: '#1A1A1A',
            }}>
              <option value="">اختر الفئة...</option>
              <option value="trip">نقل/رحلة</option>
              <option value="fuel">وقود</option>
              <option value="maintenance">صيانة</option>
              <option value="toll">رسوم</option>
              <option value="other">أخرى</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              color: '#1A1A1A',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px',
            }}>
              الوصف
            </label>
            <textarea
              defaultValue="نقل حي الملز - العاصمة"
              placeholder="أدخل وصف العملية..."
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                fontSize: '14px',
                fontFamily: 'Cairo, sans-serif',
                background: '#F9FAFB',
                color: '#1A1A1A',
                resize: 'vertical',
                minHeight: '80px',
              }}
            />
            <p style={{ fontSize: '11px', color: '#A0A0A0', marginTop: '4px' }}>
              اختياري: أضف ملاحظات عن العملية
            </p>
          </div>

          {/* DATE */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              color: '#1A1A1A',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px',
            }}>
              التاريخ والوقت
            </label>
            <input
              type="datetime-local"
              defaultValue="2026-07-13T14:45"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                fontSize: '14px',
                fontFamily: 'Cairo, sans-serif',
                background: '#F9FAFB',
                color: '#1A1A1A',
              }}
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: '#FFCD11',
              color: '#1A1A1A',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 900,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginTop: '20px',
            }}
          >
            ✓ حفظ العملية
          </button>
          <button
            type="button"
            style={{
              width: '100%',
              padding: '12px',
              background: '#F0F0F0',
              color: '#A0A0A0',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            إلغاء
          </button>
        </form>
      </div>
    </div>
  );
}
