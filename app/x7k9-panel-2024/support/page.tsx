"use client";

import { useState } from 'react';

interface SupportAction {
  id: string;
  partner_id: string;
  partner_name: string;
  action: 'impersonate' | 'contact' | 'ticket';
  timestamp: string;
  status: 'pending' | 'completed';
}

export default function SupportPage() {
  const [actions, setActions] = useState<SupportAction[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    partner_id: '',
    partner_name: '',
    action: 'impersonate' as 'impersonate' | 'contact' | 'ticket',
    message: '',
  });

  const handleAddAction = () => {
    if (!formData.partner_id || !formData.partner_name) return;

    const newAction: SupportAction = {
      id: Date.now().toString(),
      partner_id: formData.partner_id,
      partner_name: formData.partner_name,
      action: formData.action,
      timestamp: new Date().toLocaleString('ar-SA'),
      status: 'completed',
    };

    setActions([newAction, ...actions]);
    setShowModal(false);
    setFormData({ partner_id: '', partner_name: '', action: 'impersonate', message: '' });
  };

  const actionLabels: Record<string, string> = {
    impersonate: '👤 محاكاة المستخدم',
    contact: '📞 التواصل المباشر',
    ticket: '🎫 فتح تذكرة دعم',
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>الدعم الفني</h1>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: '#FFCD11', color: '#1A1A1A', border: 'none', padding: '8px 16px',
            cursor: 'pointer', fontSize: 13, fontWeight: 900, borderRadius: 2,
          }}
        >
          + إجراء دعم جديد
        </button>
      </div>

      {/* الإحصائيات */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'محاكاة المستخدمين', count: actions.filter(a => a.action === 'impersonate').length, color: '#FFCD11' },
          { label: 'التواصلات المباشرة', count: actions.filter(a => a.action === 'contact').length, color: '#22c55e' },
          { label: 'التذاكر المفتوحة', count: actions.filter(a => a.action === 'ticket').length, color: '#3b82f6' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#2A2A2A', borderRadius: 3, padding: 16 }}>
            <p style={{ fontSize: 28, fontWeight: 900, color: stat.color, margin: '0 0 8px 0', fontFamily: "'Barlow Condensed', sans-serif" }}>
              {stat.count}
            </p>
            <p style={{ fontSize: 11, color: '#A0A0A0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* جدول الإجراءات */}
      <div style={{ background: '#2A2A2A', borderRadius: 3, overflow: 'hidden' }}>
        {actions.length === 0 ? (
          <p style={{ padding: 30, textAlign: 'center', color: '#A0A0A0' }}>لا توجد إجراءات دعم</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: '#111111' }}>
                {['الإجراء', 'اسم الشريك', 'النوع', 'التاريخ', 'الحالة'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'right', fontSize: 10, color: '#FFCD11', fontWeight: 900 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {actions.map((action, i) => (
                <tr key={action.id} style={{ background: i % 2 === 0 ? '#1A1A1A' : '#111111', borderBottom: '1px solid #3D3D3D' }}>
                  <td style={{ padding: '10px 14px', color: '#fff', fontWeight: 700 }}>
                    {actionLabels[action.action]}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#A0A0A0', fontSize: 11 }}>
                    {action.partner_name}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#A0A0A0', fontSize: 11 }}>
                    {action.action === 'impersonate' ? 'محاكاة' : action.action === 'contact' ? 'اتصال' : 'تذكرة'}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#A0A0A0', fontSize: 11 }} dir="ltr">
                    {action.timestamp}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#22c55e', fontSize: 11 }}>
                    ✓ مكتمل
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div
            style={{
              position: 'fixed', left: 0, top: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.5)', zIndex: 999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={() => setShowModal(false)}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: '#2A2A2A', borderRadius: 4, padding: 24,
                maxWidth: 500, width: '100%', border: '1px solid #3D3D3D',
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#FFCD11', marginBottom: 16 }}>
                إجراء دعم جديد
              </h2>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#A0A0A0', marginBottom: 6 }}>
                  اسم الشريك
                </label>
                <input
                  placeholder="أبو نايف للمقاولات"
                  value={formData.partner_name}
                  onChange={e => setFormData({ ...formData, partner_name: e.target.value })}
                  style={{
                    width: '100%', padding: '8px 12px', background: '#1A1A1A',
                    border: '1px solid #3D3D3D', color: '#fff', fontSize: 12, borderRadius: 2,
                  }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#A0A0A0', marginBottom: 6 }}>
                  رقم الشريك (UUID)
                </label>
                <input
                  placeholder="xxxx-xxxx-xxxx-xxxx"
                  value={formData.partner_id}
                  onChange={e => setFormData({ ...formData, partner_id: e.target.value })}
                  style={{
                    width: '100%', padding: '8px 12px', background: '#1A1A1A',
                    border: '1px solid #3D3D3D', color: '#fff', fontSize: 12, borderRadius: 2,
                  }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#A0A0A0', marginBottom: 6 }}>
                  نوع الإجراء
                </label>
                <select
                  value={formData.action}
                  onChange={e => setFormData({ ...formData, action: e.target.value as any })}
                  style={{
                    width: '100%', padding: '8px 12px', background: '#1A1A1A',
                    border: '1px solid #3D3D3D', color: '#fff', fontSize: 12, borderRadius: 2,
                  }}
                >
                  <option value="impersonate">محاكاة المستخدم</option>
                  <option value="contact">التواصل المباشر</option>
                  <option value="ticket">فتح تذكرة دعم</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={handleAddAction}
                  style={{
                    flex: 1, padding: '10px 16px', background: '#FFCD11', color: '#1A1A1A',
                    border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 900, borderRadius: 2,
                  }}
                >
                  إضافة الإجراء
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
