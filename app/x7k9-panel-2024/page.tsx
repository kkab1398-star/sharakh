"use client";

import { useEffect, useState } from 'react';

interface AdminPartner {
  id: string;
  company_name: string;
  created_at: string;
  subscription_status: string;
  plan: string | null;
  trial_ends_at: string | null;
  subscription_ends_at: string | null;
  phone_primary: string | null;
  telegram_chat_id: string | null;
  worker_count: number;
}

const STATUS_COLOR: Record<string, string> = {
  trial:     '#FFCD11',
  active:    '#22c55e',
  expired:   '#ef4444',
  cancelled: '#A0A0A0',
};

function daysUntil(date: string | null): number | null {
  if (!date) return null;
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000);
}

export default function SuperAdminPanel() {
  const [partners, setPartners] = useState<AdminPartner[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [editing, setEditing]   = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ subscription_status: '', plan: '', days: '' });
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState('');

  const load = () => {
    setLoading(true);
    fetch('/api/admin/partners')
      .then(r => { if (r.status === 403) throw new Error('403'); return r.json(); })
      .then(d => { setPartners(d.partners ?? []); setLoading(false); })
      .catch(e => { setError(e.message === '403' ? 'غير مصرح لك' : 'خطأ في التحميل'); setLoading(false); });
  };

  useEffect(load, []);

  const startEdit = (p: AdminPartner) => {
    const dr = p.subscription_status === 'trial'
      ? daysUntil(p.trial_ends_at)
      : daysUntil(p.subscription_ends_at);
    setEditing(p.id);
    setEditForm({
      subscription_status: p.subscription_status,
      plan:                p.plan ?? 'basic',
      days:                String(dr ?? 30),
    });
  };

  const saveEdit = async (partnerId: string) => {
    setSaving(true);
    const days = parseInt(editForm.days) || 30;
    const endDate = new Date(Date.now() + days * 86_400_000).toISOString();

    const body: Record<string, string> = {
      partner_id: partnerId,
      subscription_status: editForm.subscription_status,
      plan: editForm.plan,
    };
    if (editForm.subscription_status === 'trial') body.trial_ends_at = endDate;
    else body.subscription_ends_at = endDate;

    const res = await fetch('/api/admin/partners', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) { setEditing(null); load(); }
    setSaving(false);
  };

  const filtered = partners.filter(p =>
    p.company_name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone_primary?.includes(search)
  );

  const stats = {
    total:   partners.length,
    active:  partners.filter(p => p.subscription_status === 'active').length,
    trial:   partners.filter(p => p.subscription_status === 'trial').length,
    expired: partners.filter(p => p.subscription_status === 'expired').length,
  };

  return (
    <main style={{ minHeight: '100svh', background: '#111111', fontFamily: "'Cairo', sans-serif", direction: 'rtl', padding: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, borderBottom: '3px solid #FFCD11', paddingBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#FFCD11', margin: 0, letterSpacing: '-0.5px' }}>
            SHARAKH — SUPER ADMIN
          </h1>
          <p style={{ fontSize: 11, color: '#A0A0A0', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            x7k9-panel-2024
          </p>
        </div>
        <button onClick={load} style={{ height: 36, padding: '0 16px', background: '#FFCD11', color: '#1A1A1A', border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: 12, fontFamily: "'Cairo', sans-serif" }}>
          تحديث
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px 16px', marginBottom: 20, fontSize: 14, fontWeight: 700 }}>
          {error}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'إجمالي الشركاء', value: stats.total,   color: '#FFFFFF' },
          { label: 'اشتراكات نشطة',  value: stats.active,  color: '#22c55e' },
          { label: 'حسابات تجريبية', value: stats.trial,   color: '#FFCD11' },
          { label: 'منتهية الصلاحية',value: stats.expired, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} style={{ background: '#2A2A2A', borderTop: `3px solid ${s.color}`, borderRadius: 4, padding: '16px 14px' }}>
            <p style={{ fontSize: 28, fontWeight: 900, color: s.color, margin: '0 0 4px', fontFamily: "'Barlow Condensed', sans-serif" }}>{s.value}</p>
            <p style={{ fontSize: 10, color: '#A0A0A0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="بحث بالاسم أو الهاتف..."
          style={{ height: 44, width: '100%', maxWidth: 320, background: '#2A2A2A', border: '1px solid #3D3D3D', color: '#FFFFFF', padding: '0 12px', fontSize: 13, fontFamily: "'Cairo', sans-serif", outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: '#A0A0A0', textAlign: 'center', padding: 60 }}>جاري التحميل...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#2A2A2A', borderBottom: '2px solid #FFCD11' }}>
                {['الشركة', 'الحالة', 'الخطة', 'السائقون', 'المتبقي', 'تيليجرام', 'الانضمام', 'إجراء'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'right', fontSize: 10, fontWeight: 900, color: '#FFCD11', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const dr = p.subscription_status === 'trial'
                  ? daysUntil(p.trial_ends_at)
                  : daysUntil(p.subscription_ends_at);
                const isEditing = editing === p.id;
                const rowBg = i % 2 === 0 ? '#1A1A1A' : '#111111';

                return (
                  <tr key={p.id} style={{ background: rowBg, borderBottom: '1px solid #2A2A2A' }}>
                    <td style={{ padding: '12px 14px', color: '#FFFFFF', fontWeight: 700 }}>
                      {p.company_name}
                      {p.phone_primary && <div style={{ fontSize: 10, color: '#A0A0A0', marginTop: 2 }} dir="ltr">{p.phone_primary}</div>}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {isEditing ? (
                        <select value={editForm.subscription_status} onChange={e => setEditForm(f => ({ ...f, subscription_status: e.target.value }))}
                          style={{ height: 32, background: '#2A2A2A', border: '1px solid #FFCD11', color: '#FFFFFF', fontSize: 12, fontFamily: "'Cairo', sans-serif", padding: '0 8px' }}>
                          {['trial','active','expired','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span style={{ fontSize: 10, fontWeight: 900, color: STATUS_COLOR[p.subscription_status] ?? '#A0A0A0', background: `${STATUS_COLOR[p.subscription_status]}18`, padding: '3px 8px', letterSpacing: '0.06em' }}>
                          {p.subscription_status}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {isEditing ? (
                        <select value={editForm.plan} onChange={e => setEditForm(f => ({ ...f, plan: e.target.value }))}
                          style={{ height: 32, background: '#2A2A2A', border: '1px solid #3D3D3D', color: '#FFFFFF', fontSize: 12, fontFamily: "'Cairo', sans-serif", padding: '0 8px' }}>
                          {['basic','pro','enterprise'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span style={{ color: '#FFCD11', fontWeight: 700 }}>{p.plan ?? '—'}</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#FFFFFF', textAlign: 'center' }}>{p.worker_count}</td>
                    <td style={{ padding: '12px 14px' }}>
                      {isEditing ? (
                        <input type="number" min="1" max="3650" value={editForm.days} onChange={e => setEditForm(f => ({ ...f, days: e.target.value }))}
                          style={{ width: 70, height: 32, background: '#2A2A2A', border: '1px solid #3D3D3D', color: '#FFFFFF', fontSize: 12, padding: '0 8px', textAlign: 'center' }} />
                      ) : (
                        <span style={{ color: dr !== null && dr <= 3 ? '#ef4444' : '#A0A0A0', fontWeight: 700 }}>
                          {dr !== null ? `${dr}d` : '∞'}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: 16 }}>{p.telegram_chat_id ? '✅' : '—'}</span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#A0A0A0', fontSize: 11, whiteSpace: 'nowrap' }} dir="ltr">
                      {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                    </td>
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => saveEdit(p.id)} disabled={saving}
                            style={{ height: 30, padding: '0 12px', background: '#22c55e', color: '#111', border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: 11, fontFamily: "'Cairo', sans-serif" }}>
                            {saving ? '...' : 'حفظ'}
                          </button>
                          <button onClick={() => setEditing(null)}
                            style={{ height: 30, padding: '0 10px', background: 'transparent', color: '#A0A0A0', border: '1px solid #3D3D3D', cursor: 'pointer', fontSize: 11, fontFamily: "'Cairo', sans-serif" }}>
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(p)}
                          style={{ height: 30, padding: '0 12px', background: 'transparent', color: '#FFCD11', border: '1px solid #FFCD11', cursor: 'pointer', fontWeight: 700, fontSize: 11, fontFamily: "'Cairo', sans-serif" }}>
                          تعديل
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && !loading && (
            <p style={{ textAlign: 'center', color: '#A0A0A0', padding: 40, fontSize: 14 }}>لا توجد نتائج</p>
          )}
        </div>
      )}
    </main>
  );
}
