"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTenantPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    password: '',
    phone_primary: '',
    subscription_type: 'trial',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [whatsappText, setWhatsappText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'فشل إنشاء الحساب');
        return;
      }

      const { loginLink, slug } = await res.json();

      const trial_end_date = new Date();
      trial_end_date.setDate(trial_end_date.getDate() + 14);
      const dateStr = trial_end_date.toLocaleDateString('ar-SA');

      const msg = `🚀 *مرحباً بك في نظام شراكة* 🚀\n\n` +
        `بيانات دخولك:\n` +
        `📧 البريد: ${formData.email}\n` +
        `🔑 كلمة المرور: ${formData.password}\n` +
        `🔗 الرابط: ${loginLink}\n\n` +
        `📋 الخطوات الأولى:\n` +
        `1️⃣ الإعدادات ← أضف بيانات شركتك\n` +
        `2️⃣ المعدات ← سجل معداتك\n` +
        `3️⃣ السائقون ← أضف فريقك\n` +
        `4️⃣ الدورات ← ابدأ العمل\n` +
        `5️⃣ تيليجرام ← استقبل التنبيهات\n\n` +
        `⏱️ فترة التجربة: ${formData.subscription_type === 'trial' ? `14 يوم (ينتهي في ${dateStr})` : 'سنة كاملة'}\n` +
        `✅ بيانات الحساب محفوظة تلقائياً\n\n` +
        `📞 للدعم: wa.me/966500000000`;

      setWhatsappText(msg);
      setSuccess(`تم إنشاء حساب ${formData.company_name} بنجاح!`);
      setFormData({ company_name: '', email: '', password: '', phone_primary: '', subscription_type: 'trial' });
    } catch (err) {
      setError('خطأ في الخادم');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(whatsappText);
    alert('تم نسخ الرسالة');
  };

  const openWhatsApp = () => {
    const phone = formData.phone_primary.replace(/\D/g, '');
    const num = phone.startsWith('966') ? phone : `966${phone.substring(1)}`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(whatsappText)}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', marginBottom: 20 }}>إضافة مشترك جديد</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 1000 }}>
        {/* النموذج */}
        <div style={{ background: '#2A2A2A', borderRadius: 3, padding: 20 }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '12px 14px', marginBottom: 16, fontSize: 13, borderRadius: 2 }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '12px 14px', marginBottom: 16, fontSize: 13, borderRadius: 2 }}>
                ✓ {success}
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#FFCD11', marginBottom: 6, textTransform: 'uppercase' }}>اسم الشركة</label>
              <input
                type="text"
                required
                value={formData.company_name}
                onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="مثال: أبو نايف للمقاولات"
                style={{
                  width: '100%', padding: '10px 12px', background: '#1A1A1A', border: '1px solid #3D3D3D',
                  color: '#fff', fontSize: 13, borderRadius: 2, fontFamily: 'Cairo, sans-serif',
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#FFCD11', marginBottom: 6, textTransform: 'uppercase' }}>البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="owner@example.com"
                style={{
                  width: '100%', padding: '10px 12px', background: '#1A1A1A', border: '1px solid #3D3D3D',
                  color: '#fff', fontSize: 13, borderRadius: 2,
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#FFCD11', marginBottom: 6, textTransform: 'uppercase' }}>كلمة المرور الأولية</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="كلمة قوية"
                style={{
                  width: '100%', padding: '10px 12px', background: '#1A1A1A', border: '1px solid #3D3D3D',
                  color: '#fff', fontSize: 13, borderRadius: 2,
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#FFCD11', marginBottom: 6, textTransform: 'uppercase' }}>رقم الجوال (واتساب)</label>
              <input
                type="tel"
                value={formData.phone_primary}
                onChange={e => setFormData({ ...formData, phone_primary: e.target.value })}
                placeholder="0501234567"
                style={{
                  width: '100%', padding: '10px 12px', background: '#1A1A1A', border: '1px solid #3D3D3D',
                  color: '#fff', fontSize: 13, borderRadius: 2,
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#FFCD11', marginBottom: 6, textTransform: 'uppercase' }}>نوع الاشتراك</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {['trial', 'paid'].map(type => (
                  <label key={type} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="subscription_type"
                      value={type}
                      checked={formData.subscription_type === type}
                      onChange={e => setFormData({ ...formData, subscription_type: e.target.value })}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: 13, color: '#A0A0A0' }}>
                      {type === 'trial' ? '🆓 تجريبي (14 يوم)' : '💳 سنوي مدفوع'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px 16px', background: loading ? '#999' : '#FFCD11',
                color: '#1A1A1A', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 14, fontWeight: 900, borderRadius: 2,
              }}
            >
              {loading ? 'جاري الإنشاء...' : '✓ إنشاء الحساب'}
            </button>
          </form>
        </div>

        {/* رسالة واتساب */}
        {whatsappText && (
          <div style={{ background: '#2A2A2A', borderRadius: 3, padding: 20, display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 11, fontWeight: 900, color: '#FFCD11', marginBottom: 12, textTransform: 'uppercase' }}>رسالة واتساب جاهزة</p>
            <div style={{
              background: '#1A1A1A', padding: 12, borderRadius: 2, flex: 1,
              fontSize: 11, color: '#A0A0A0', lineHeight: 1.8, fontFamily: 'monospace', marginBottom: 12,
              whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            }}>
              {whatsappText}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                onClick={copyToClipboard}
                style={{
                  padding: '10px 12px', background: '#3D3D3D', color: '#FFCD11', border: 'none',
                  cursor: 'pointer', fontSize: 12, fontWeight: 700, borderRadius: 2,
                }}
              >
                📋 نسخ الرسالة
              </button>
              <button
                onClick={openWhatsApp}
                style={{
                  padding: '10px 12px', background: '#22c55e', color: '#fff', border: 'none',
                  cursor: 'pointer', fontSize: 12, fontWeight: 700, borderRadius: 2,
                }}
              >
                💬 فتح واتساب
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
