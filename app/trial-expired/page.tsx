"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrialExpiredPage() {
  const router = useRouter();
  const [company, setCompany] = useState('');

  useEffect(() => {
    fetch('/api/partners/me')
      .then(r => r.json())
      .then(d => { if (d.partner) setCompany(d.partner.company_name); })
      .catch(() => {});
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  };

  return (
    <main style={{
      minHeight: '100svh', background: '#111111',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 24, fontFamily: "'Cairo', sans-serif",
      direction: 'rtl',
    }}>
      <div style={{ width: '100%', maxWidth: 460, textAlign: 'center' }}>

        {/* Icon */}
        <div style={{ fontSize: 56, marginBottom: 16 }}>⏳</div>

        {/* Title */}
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#FFCD11', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
          انتهت فترة التجربة
        </h1>
        {company && (
          <p style={{ fontSize: 14, color: '#A0A0A0', margin: '0 0 32px' }}>{company}</p>
        )}

        {/* Card */}
        <div style={{
          background: '#2A2A2A', borderTop: '3px solid #FFCD11',
          borderRadius: 4, padding: 28, marginBottom: 24, textAlign: 'right',
        }}>
          <p style={{ fontSize: 15, color: '#FFFFFF', lineHeight: 1.8, margin: '0 0 20px', fontWeight: 600 }}>
            انتهت فترة التجربة المجانية (14 يوم) لحسابك.
            لمواصلة استخدام النظام وعدم فقدان بياناتك، تواصل معنا لتفعيل الاشتراك.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: '✅', text: 'كل بياناتك محفوظة ولن تُحذف' },
              { icon: '✅', text: 'إعادة التفعيل فورية بعد الدفع' },
              { icon: '✅', text: 'دعم فني مباشر عبر واتساب' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ color: '#22c55e', fontSize: 14 }}>{item.icon}</span>
                <span style={{ fontSize: 13, color: '#A0A0A0' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a
            href="https://wa.me/966500000000?text=أريد تفعيل اشتراك نظام شراكة"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              height: 52, background: '#FFCD11', color: '#1A1A1A',
              fontWeight: 900, fontSize: 15, borderRadius: 0, textDecoration: 'none',
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}
          >
            📲 تواصل معنا لتفعيل الاشتراك
          </a>

          <button
            onClick={logout}
            style={{
              height: 44, background: 'transparent', color: '#A0A0A0',
              border: '1px solid #3D3D3D', borderRadius: 0, cursor: 'pointer',
              fontSize: 13, fontFamily: "'Cairo', sans-serif",
            }}
          >
            تسجيل الخروج
          </button>
        </div>

        <p style={{ marginTop: 24, fontSize: 11, color: '#3D3D3D' }}>
          SHARAKH — نظام إدارة المعدات الثقيلة
        </p>
      </div>
    </main>
  );
}
