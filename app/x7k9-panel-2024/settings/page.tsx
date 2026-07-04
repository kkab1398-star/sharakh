"use client";

import { useState } from 'react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    trial_days: '14',
    yearly_price_sar: '9999',
    support_phone: '966500000000',
    support_email: 'support@sharakh.app',
    telegram_enabled: true,
    whatsapp_enabled: true,
  });

  const handleSave = () => {
    localStorage.setItem('admin-settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sections = [
    {
      title: 'الاشتراكات',
      icon: '💳',
      fields: [
        { key: 'trial_days', label: 'أيام الفترة التجريبية', type: 'number' },
        { key: 'yearly_price_sar', label: 'سعر الاشتراك السنوي (ر.س)', type: 'number' },
      ],
    },
    {
      title: 'الدعم والتواصل',
      icon: '📞',
      fields: [
        { key: 'support_phone', label: 'رقم الدعم (واتساب)', type: 'text' },
        { key: 'support_email', label: 'بريد الدعم الإلكتروني', type: 'email' },
      ],
    },
    {
      title: 'التنبيهات',
      icon: '🔔',
      fields: [
        { key: 'telegram_enabled', label: 'تنبيهات تيليجرام', type: 'checkbox' },
        { key: 'whatsapp_enabled', label: 'تنبيهات واتساب', type: 'checkbox' },
      ],
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', marginBottom: 20 }}>الإعدادات</h1>

      {saved && (
        <div style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '12px 14px', marginBottom: 20, fontSize: 13, borderRadius: 2 }}>
          ✓ تم حفظ الإعدادات بنجاح
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 20 }}>
        {sections.map(section => (
          <div key={section.title} style={{ background: '#2A2A2A', borderRadius: 3, padding: 20 }}>
            <h2 style={{ fontSize: 14, fontWeight: 900, color: '#FFCD11', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>{section.icon}</span>
              {section.title}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {section.fields.map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#A0A0A0', marginBottom: 6, textTransform: 'uppercase' }}>
                    {field.label}
                  </label>
                  {field.type === 'checkbox' ? (
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={settings[field.key as keyof typeof settings] as boolean}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            [field.key]: e.target.checked,
                          })
                        }
                        style={{ cursor: 'pointer', width: 18, height: 18 }}
                      />
                      <span style={{ fontSize: 13, color: '#FFFFFF' }}>مفعل</span>
                    </label>
                  ) : (
                    <input
                      type={field.type}
                      value={settings[field.key as keyof typeof settings] as string}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          [field.key]: e.target.value,
                        })
                      }
                      style={{
                        width: '100%', padding: '10px 12px', background: '#1A1A1A', border: '1px solid #3D3D3D',
                        color: '#fff', fontSize: 13, borderRadius: 2, fontFamily: 'Cairo, sans-serif',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 24px', background: '#FFCD11', color: '#1A1A1A',
            border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 900, borderRadius: 2,
          }}
        >
          ✓ حفظ الإعدادات
        </button>
        <button
          onClick={() => setSettings({ trial_days: '14', yearly_price_sar: '9999', support_phone: '966500000000', support_email: 'support@sharakh.app', telegram_enabled: true, whatsapp_enabled: true })}
          style={{
            padding: '10px 24px', background: 'transparent', color: '#A0A0A0',
            border: '1px solid #3D3D3D', cursor: 'pointer', fontSize: 13, borderRadius: 2,
          }}
        >
          ↩️ إعادة تعيين
        </button>
      </div>
    </div>
  );
}
