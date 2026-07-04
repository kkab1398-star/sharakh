"use client";

import { useEffect, useState } from 'react';

interface AuditLog {
  id: string;
  actor_email: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: any;
  created_at: string;
}

const ACTION_LABEL: Record<string, string> = {
  'tenant_created': '✨ مشترك جديد',
  'tenant_frozen': '🔒 تجميد حساب',
  'tenant_unfrozen': '🔓 تفعيل حساب',
  'tenant_extended': '📅 تمديد اشتراك',
  'payment_recorded': '💰 دفعة مسجلة',
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/audit-log')
      .then(r => r.json())
      .then(d => setLogs(d.logs ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', marginBottom: 20 }}>سجل العمليات</h1>

      <div style={{ background: '#2A2A2A', borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: 30, textAlign: 'center', color: '#A0A0A0' }}>جاري التحميل...</p>
        ) : logs.length === 0 ? (
          <p style={{ padding: 30, textAlign: 'center', color: '#A0A0A0' }}>لا توجد عمليات مسجلة</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: '#111111' }}>
                {['الإجراء', 'المسؤول', 'النوع', 'التفاصيل', 'التاريخ'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'right', fontSize: 10, color: '#FFCD11', fontWeight: 900 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={log.id} style={{ background: i % 2 === 0 ? '#1A1A1A' : '#111111', borderBottom: '1px solid #3D3D3D' }}>
                  <td style={{ padding: '10px 14px', color: '#fff', fontWeight: 700 }}>
                    {ACTION_LABEL[log.action] || log.action}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#A0A0A0', fontSize: 11 }} dir="ltr">
                    {log.actor_email}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#A0A0A0', fontSize: 11 }}>
                    {log.target_type ?? '—'}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#A0A0A0', fontSize: 11 }}>
                    {log.details && Object.keys(log.details).length > 0 ? JSON.stringify(log.details).slice(0, 40) + '...' : '—'}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#A0A0A0', fontSize: 11 }} dir="ltr">
                    {new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
