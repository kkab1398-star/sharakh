"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Worker } from '@/types';

type WorkerWithEquipment = Worker & {
  equipment?: { id: string; plate_number: string | null; model: string | null }[];
};
type Status = 'active' | 'frozen' | 'deactivated';

function getStatus(w: WorkerWithEquipment): Status {
  if (!w.is_active) return 'deactivated';
  if (w.is_frozen)  return 'frozen';
  return 'active';
}

const STATUS_CFG: Record<Status, { label: string; color: string; bg: string }> = {
  active:      { label: 'نشط',    color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
  frozen:      { label: 'مجمّد',  color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  deactivated: { label: 'معطّل', color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
};

const S: Record<string, React.CSSProperties> = {
  page:    { padding: '32px', background: 'var(--cat-black)', minHeight: '100vh', color: '#fff', direction: 'rtl', fontFamily: "'Cairo', sans-serif" },
  card:    { background: '#2A2A2A', borderRadius: 4 },
  label:   { fontSize: 11, fontWeight: 700, color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '0.08em' },
};

export default function DriversPage() {
  const [workers, setWorkers] = useState<WorkerWithEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<'all' | Status>('all');
  const [busy, setBusy]       = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/drivers').then(r => r.json()),
      fetch('/api/equipment').then(r => r.json()),
    ]).then(([dData, eData]) => {
      const eq: any[] = eData.equipment ?? [];
      setWorkers((dData.workers ?? []).map((w: Worker) => ({
        ...w,
        equipment: eq.filter(e => e.assigned_worker_id === w.id),
      })));
    }).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const action = async (id: string, endpoint: string) => {
    setBusy(id);
    await fetch(`/api/drivers/${id}/${endpoint}`, { method: 'POST' });
    load();
    setBusy(null);
  };

  const filtered = filter === 'all' ? workers : workers.filter(w => getStatus(w) === filter);
  const counts = {
    all:         workers.length,
    active:      workers.filter(w => getStatus(w) === 'active').length,
    frozen:      workers.filter(w => getStatus(w) === 'frozen').length,
    deactivated: workers.filter(w => getStatus(w) === 'deactivated').length,
  };

  return (
    <div style={S.page}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p style={{ ...S.label, marginBottom: 4 }}>إدارة الكوادر</p>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>السائقون</h1>
          <p style={{ fontSize: 12, color: '#A0A0A0', marginTop: 4 }}>{workers.length} سائق مسجّل</p>
        </div>
        <Link href="/dashboard/drivers/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 44, padding: '0 20px', background: '#FFCD11',
          color: '#1A1A1A', fontWeight: 900, fontSize: 13,
          textDecoration: 'none', borderRadius: 0, whiteSpace: 'nowrap',
        }}>
          + إضافة سائق
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {([
          { key: 'all',         label: `الكل (${counts.all})`          },
          { key: 'active',      label: `نشط (${counts.active})`        },
          { key: 'frozen',      label: `مجمّد (${counts.frozen})`      },
          { key: 'deactivated', label: `معطّل (${counts.deactivated})` },
        ] as const).map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            height: 34, padding: '0 14px', borderRadius: 0, cursor: 'pointer',
            fontSize: 11, fontWeight: 700,
            background:  filter === f.key ? '#FFCD11' : 'transparent',
            color:       filter === f.key ? '#1A1A1A' : '#A0A0A0',
            border:      filter === f.key ? 'none'    : '1px solid #3D3D3D',
          }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #FFCD11', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ ...S.card, padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 36, marginBottom: 12 }}>👤</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>لا يوجد سائقون</p>
          <Link href="/dashboard/drivers/new" style={{ fontSize: 13, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, fontWeight: 700, textDecoration: 'none' }}>
            أضف أول سائق ←
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(worker => {
            const status = getStatus(worker);
            const cfg    = STATUS_CFG[status];
            const isBusy = busy === worker.id;

            return (
              <div key={worker.id} style={{
                ...S.card,
                padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: 16,
                borderRight: `4px solid ${cfg.color}`,
              }}>
                {/* Avatar */}
                <div style={{
                  width: 42, height: 42, borderRadius: 0, flexShrink: 0,
                  background: cfg.bg, color: cfg.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 17, fontWeight: 900,
                }}>
                  {worker.full_name[0]}
                </div>

                {/* الاسم + username */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 900, color: '#fff', margin: '0 0 3px' }}>{worker.full_name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: '#A0A0A0', background: '#1A1A1A', padding: '2px 8px', fontFamily: 'monospace' }}>
                      @{worker.username}
                    </span>
                    {worker.phone && (
                      <span style={{ fontSize: 11, color: '#A0A0A0' }} dir="ltr">{worker.phone}</span>
                    )}
                    {worker.equipment && worker.equipment.length > 0 && (
                      <span style={{ fontSize: 11, color: '#A0A0A0' }}>
                        🚜 {worker.equipment.map(e => e.model ?? e.plate_number ?? '—').join('، ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* الحالة */}
                <div style={{ flexShrink: 0, textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-block', fontSize: 10, fontWeight: 900,
                    color: cfg.color, background: cfg.bg,
                    padding: '4px 10px', letterSpacing: '0.06em',
                  }}>
                    {cfg.label}
                  </span>
                  <p style={{ fontSize: 10, color: '#A0A0A0', margin: '4px 0 0' }}>
                    {new Date(worker.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                  </p>
                </div>

                {/* الإجراءات */}
                <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
                  <Link href={`/dashboard/drivers/${worker.id}`} style={{
                    height: 32, padding: '0 12px', fontSize: 11, fontWeight: 700,
                    background: 'transparent', color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any,
                    border: '1px solid #FFCD11', textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center',
                  }}>
                    تفاصيل
                  </Link>

                  {status === 'active' && (
                    <button disabled={isBusy} onClick={() => action(worker.id, 'freeze')} style={{
                      height: 32, padding: '0 12px', fontSize: 11, fontWeight: 700,
                      background: 'transparent', color: '#3b82f6',
                      border: '1px solid #3b82f6', cursor: 'pointer',
                    }}>
                      {isBusy ? '...' : '❄ تجميد'}
                    </button>
                  )}

                  {status === 'frozen' && (
                    <button disabled={isBusy} onClick={() => action(worker.id, 'unfreeze')} style={{
                      height: 32, padding: '0 12px', fontSize: 11, fontWeight: 700,
                      background: 'transparent', color: '#22c55e',
                      border: '1px solid #22c55e', cursor: 'pointer',
                    }}>
                      {isBusy ? '...' : '✓ رفع التجميد'}
                    </button>
                  )}

                  {worker.is_active && (
                    <button disabled={isBusy} onClick={() => {
                      if (!confirm(`تعطيل ${worker.full_name} نهائياً؟`)) return;
                      action(worker.id, 'deactivate');
                    }} style={{
                      height: 32, padding: '0 12px', fontSize: 11, fontWeight: 700,
                      background: 'transparent', color: '#ef4444',
                      border: '1px solid #ef4444', cursor: 'pointer',
                    }}>
                      {isBusy ? '...' : '✕ تعطيل'}
                    </button>
                  )}

                  {!worker.is_active && (
                    <button disabled={isBusy} onClick={() => action(worker.id, 'activate')} style={{
                      height: 32, padding: '0 12px', fontSize: 11, fontWeight: 700,
                      background: 'transparent', color: '#A0A0A0',
                      border: '1px solid #3D3D3D', cursor: 'pointer',
                    }}>
                      {isBusy ? '...' : '↩ تفعيل'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginTop: 20, flexWrap: 'wrap' }}>
        {Object.entries(STATUS_CFG).map(([key, c]) => (
          <span key={key} style={{ fontSize: 11, color: '#A0A0A0' }}>
            <span style={{ color: c.color, fontWeight: 900 }}>■</span> {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}
