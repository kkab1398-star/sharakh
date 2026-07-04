"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Partner {
  id: string;
  company_name: string;
  subscription_status: string;
  plan: string | null;
  phone_primary: string | null;
  is_frozen: boolean;
  created_at: string;
  worker_count: number;
  status_badge: string;
  days_remaining: number | null;
}

interface DetailedPartner extends Partner {
  workers: any[];
  recent_actions: any[];
}

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  trial:   { bg: 'rgba(255,205,17,0.1)', text: '#FFCD11' },
  active:  { bg: 'rgba(34,197,94,0.1)', text: '#22c55e' },
  expired: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' },
};

export default function TenantsPage() {
  const [partners, setPartners]       = useState<Partner[]>([]);
  const [search, setSearch]           = useState('');
  const [status, setStatus]           = useState('all');
  const [loading, setLoading]         = useState(true);
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<DetailedPartner | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (status !== 'all') params.append('status', status);
    if (search) params.append('search', search);

    fetch(`/api/admin/tenants?${params}`)
      .then(r => r.json())
      .then(d => setPartners(d.partners ?? []))
      .finally(() => setLoading(false));
  }, [search, status]);

  const loadPartnerDetails = async (id: string) => {
    const res = await fetch(`/api/admin/tenants/${id}`);
    const data = await res.json();
    setSelectedPartner(data);
  };

  useEffect(() => {
    if (selectedId) loadPartnerDetails(selectedId);
  }, [selectedId]);

  const handleAction = async (action: string, extraData = {}) => {
    if (!selectedId) return;
    const res = await fetch(`/api/admin/tenants/${selectedId}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...extraData }),
    });
    if (res.ok) {
      await loadPartnerDetails(selectedId);
      const updated = partners.map(p =>
        p.id === selectedId ? { ...p, is_frozen: action === 'freeze' } : p
      );
      setPartners(updated);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', marginBottom: 20 }}>المشتركون</h1>

      {/* البحث والفلاتر */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="ابحث بالاسم أو الهاتف..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            height: 44, padding: '0 14px', background: '#2A2A2A', border: '1px solid #3D3D3D',
            color: '#fff', fontSize: 13, fontFamily: 'Cairo, sans-serif', borderRadius: 3,
          }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'active', 'trial', 'expiring', 'expired', 'frozen'].map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              style={{
                padding: '8px 12px', background: status === s ? '#FFCD11' : '#2A2A2A',
                color: status === s ? '#1A1A1A' : '#A0A0A0', border: 'none', cursor: 'pointer',
                fontSize: 11, fontWeight: 700, borderRadius: 2, textTransform: 'uppercase',
              }}
            >
              {s === 'all' ? 'الكل' : s === 'active' ? 'نشط' : s === 'trial' ? 'تجريبي' : s === 'expiring' ? 'أوشك' : s === 'expired' ? 'منتهي' : 'مجمد'}
            </button>
          ))}
        </div>
      </div>

      {/* الجدول */}
      <div style={{ background: '#2A2A2A', borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: 30, textAlign: 'center', color: '#A0A0A0' }}>جاري التحميل...</p>
        ) : partners.length === 0 ? (
          <p style={{ padding: 30, textAlign: 'center', color: '#A0A0A0' }}>لا توجد مشتركون</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: '#111111' }}>
                {['الشركة', 'الحالة', 'السائقون', 'المتبقي', 'التاريخ', ''].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'right', fontSize: 10, color: '#FFCD11', fontWeight: 900 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {partners.map((p, i) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  style={{
                    background: i % 2 === 0 ? '#1A1A1A' : '#111111', borderBottom: '1px solid #3D3D3D',
                    cursor: 'pointer',
                  }}
                >
                  <td style={{ padding: '10px 14px', color: '#fff', fontWeight: 700 }}>{p.company_name}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      background: STATUS_COLOR[p.status_badge]?.bg ?? 'transparent',
                      color: STATUS_COLOR[p.status_badge]?.text ?? '#A0A0A0',
                      padding: '2px 8px', fontSize: 10, fontWeight: 700,
                    }}>
                      {p.status_badge}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#A0A0A0', textAlign: 'center' }}>{p.worker_count}</td>
                  <td style={{ padding: '10px 14px', color: p.days_remaining !== null && p.days_remaining <= 3 ? '#ef4444' : '#A0A0A0' }}>
                    {p.days_remaining !== null ? `${p.days_remaining}d` : '∞'}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#A0A0A0', fontSize: 11 }} dir="ltr">
                    {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>{p.is_frozen ? '🔒' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Drawer التفاصيل */}
      {selectedId && selectedPartner && (
        <div style={{
          position: 'fixed', right: 0, top: 0, bottom: 0, width: 400, background: '#2A2A2A',
          borderLeft: '3px solid #FFCD11', zIndex: 1000, display: 'flex', flexDirection: 'column',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.4)', overflowY: 'auto',
        }}>
          <div style={{ padding: 16, borderBottom: '1px solid #3D3D3D', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 16, fontWeight: 900, color: '#FFCD11', margin: 0 }}>{selectedPartner.company_name}</h2>
            <button
              onClick={() => setSelectedId(null)}
              style={{ background: 'transparent', border: 'none', color: '#A0A0A0', cursor: 'pointer', fontSize: 18 }}
            >
              ✕
            </button>
          </div>

          <div style={{ padding: 16, flex: 1 }}>
            {/* البيانات الأساسية */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 10, color: '#FFCD11', textTransform: 'uppercase', fontWeight: 900, marginBottom: 8 }}>البيانات</p>
              <div style={{ fontSize: 12, color: '#A0A0A0', lineHeight: 1.8 }}>
                <p>الهاتف: {selectedPartner.phone_primary ?? '—'}</p>
                <p>الحالة: <span style={{ color: STATUS_COLOR[selectedPartner.status_badge]?.text }}>{selectedPartner.status_badge}</span></p>
                <p>الخطة: {selectedPartner.plan ?? '—'}</p>
              </div>
            </div>

            {/* الأزرار */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
              <button
                onClick={() => handleAction(selectedPartner.is_frozen ? 'unfreeze' : 'freeze')}
                style={{
                  padding: '8px 12px', background: selectedPartner.is_frozen ? '#22c55e' : '#ef4444',
                  color: '#fff', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
                  borderRadius: 2,
                }}
              >
                {selectedPartner.is_frozen ? '🔓 تفعيل' : '🔒 تجميد'}
              </button>
              <button
                onClick={() => handleAction('extend', { days_to_add: 30 })}
                style={{
                  padding: '8px 12px', background: '#FFCD11', color: '#1A1A1A', border: 'none',
                  cursor: 'pointer', fontSize: 11, fontWeight: 700, borderRadius: 2,
                }}
              >
                📅 تمديد 30 يوم
              </button>
            </div>

            {/* السائقون */}
            {selectedPartner.workers.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 10, color: '#FFCD11', textTransform: 'uppercase', fontWeight: 900, marginBottom: 8 }}>السائقون ({selectedPartner.workers.length})</p>
                <div style={{ fontSize: 11, color: '#A0A0A0', lineHeight: 1.8 }}>
                  {selectedPartner.workers.slice(0, 5).map(w => (
                    <p key={w.id} style={{ marginBottom: 4 }}>
                      {w.full_name} {w.is_active ? '✓' : '✕'} {w.is_frozen ? '🔒' : ''}
                    </p>
                  ))}
                  {selectedPartner.workers.length > 5 && <p style={{ color: '#666' }}>+{selectedPartner.workers.length - 5} آخرون</p>}
                </div>
              </div>
            )}

            {/* آخر العمليات */}
            {selectedPartner.recent_actions.length > 0 && (
              <div>
                <p style={{ fontSize: 10, color: '#FFCD11', textTransform: 'uppercase', fontWeight: 900, marginBottom: 8 }}>آخر 10 عمليات</p>
                <div style={{ fontSize: 10, color: '#A0A0A0', lineHeight: 1.6 }}>
                  {selectedPartner.recent_actions.map((a, i) => (
                    <p key={i} style={{ marginBottom: 4, borderBottom: '1px solid #3D3D3D', paddingBottom: 4 }}>
                      {a.action} — {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay إغلاق الـ drawer */}
      {selectedId && (
        <div
          onClick={() => setSelectedId(null)}
          style={{
            position: 'fixed', left: 0, top: 0, right: 400, bottom: 0, background: 'rgba(0,0,0,0.3)',
            zIndex: 999, cursor: 'pointer',
          }}
        />
      )}
    </div>
  );
}
