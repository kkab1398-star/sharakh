"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Equipment } from '@/types';

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState<'all' | 'active' | 'inactive'>('all');

  const load = () => {
    setLoading(true);
    fetch('/api/equipment')
      .then(r => r.json())
      .then(d => setEquipment(d.equipment ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered =
    filter === 'active'   ? equipment.filter(e => e.is_active)  :
    filter === 'inactive' ? equipment.filter(e => !e.is_active) :
    equipment;

  const counts = {
    all:      equipment.length,
    active:   equipment.filter(e => e.is_active).length,
    inactive: equipment.filter(e => !e.is_active).length,
  };

  return (
    <div dir="rtl" style={{ padding: 32, background: 'var(--cat-black)', minHeight: '100vh', fontFamily: "'Cairo', sans-serif", color: '#fff' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>إدارة الأسطول</p>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>المعدات</h1>
          <p style={{ fontSize: 12, color: '#A0A0A0', marginTop: 4 }}>{equipment.length} معدة مسجّلة</p>
        </div>
        <Link href="/dashboard/equipment/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 44, padding: '0 20px', background: '#FFCD11',
          color: '#1A1A1A', fontWeight: 900, fontSize: 13,
          textDecoration: 'none', borderRadius: 0, whiteSpace: 'nowrap',
        }}>
          + إضافة معدة
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'الإجمالي',  value: counts.all,      color: '#FFCD11' },
          { label: 'نشطة',      value: counts.active,   color: '#22c55e' },
          { label: 'غير نشطة', value: counts.inactive, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} style={{ background: '#2A2A2A', borderTop: `3px solid ${s.color}`, borderRadius: 4, padding: '16px 18px' }}>
            <p style={{ fontSize: 32, fontWeight: 900, color: s.color, textShadow: s.color === '#FFCD11' ? 'var(--yellow-shadow)' : undefined, WebkitTextStroke: s.color === '#FFCD11' ? 'var(--yellow-stroke)' : undefined, margin: '0 0 4px', fontFamily: "'Barlow Condensed', sans-serif" } as React.CSSProperties}>{s.value}</p>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#A0A0A0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {([
          { key: 'all',      label: `الكل (${counts.all})`          },
          { key: 'active',   label: `نشطة (${counts.active})`       },
          { key: 'inactive', label: `غير نشطة (${counts.inactive})` },
        ] as const).map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            height: 34, padding: '0 14px', borderRadius: 0, cursor: 'pointer',
            fontSize: 11, fontWeight: 700,
            background: filter === f.key ? '#FFCD11' : 'transparent',
            color:      filter === f.key ? '#1A1A1A' : '#A0A0A0',
            border:     filter === f.key ? 'none'    : '1px solid #3D3D3D',
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
        <div style={{ background: '#2A2A2A', borderRadius: 4, padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>🚜</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>لا توجد معدات</p>
          <Link href="/dashboard/equipment/new" style={{ fontSize: 13, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, fontWeight: 700, textDecoration: 'none' }}>
            أضف أول معدة ←
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {filtered.map(eq => {
            const worker = eq.assigned_worker as any;
            return (
              <div key={eq.id} style={{
                background: '#2A2A2A', borderRadius: 4,
                borderTop: `3px solid ${eq.is_active ? '#FFCD11' : '#3D3D3D'}`,
                padding: 20, display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                {/* Top: icon + status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: 48, height: 48, background: '#1A1A1A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, borderRight: `3px solid ${eq.is_active ? '#FFCD11' : '#3D3D3D'}`,
                  }}>
                    🚜
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 900, padding: '3px 10px', letterSpacing: '0.06em',
                    color:       eq.is_active ? '#22c55e' : '#ef4444',
                    background:  eq.is_active ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                  }}>
                    {eq.is_active ? 'نشطة' : 'غير نشطة'}
                  </span>
                </div>

                {/* Info */}
                <div>
                  <p style={{ fontSize: 16, fontWeight: 900, color: '#fff', margin: '0 0 4px' }}>
                    {eq.model ?? 'معدة بدون اسم'}
                  </p>
                  <p style={{ fontSize: 11, color: '#A0A0A0', margin: 0 }}>
                    {(eq.equipment_type as any)?.name ?? 'نوع غير محدد'}
                    {eq.manufacture_year && ` · ${eq.manufacture_year}`}
                  </p>
                </div>

                {/* Plate */}
                {eq.plate_number && (
                  <div style={{ background: '#1A1A1A', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: '#A0A0A0', fontWeight: 700 }}>لوحة</span>
                    <span style={{ fontSize: 13, fontWeight: 900, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, fontFamily: 'monospace' }} dir="ltr">{eq.plate_number}</span>
                  </div>
                )}

                {/* Worker + Link */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 12, borderTop: '1px solid #3D3D3D', marginTop: 'auto' }}>
                  {worker ? (
                    <>
                      <div style={{
                        width: 30, height: 30, background: 'rgba(255,205,17,0.12)',
                        color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, fontWeight: 900, fontSize: 13,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {worker.full_name[0]}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', margin: 0 }}>{worker.full_name}</p>
                        <p style={{ fontSize: 10, color: '#A0A0A0', margin: 0 }}>السائق المعيّن</p>
                      </div>
                    </>
                  ) : (
                    <p style={{ fontSize: 11, color: '#A0A0A0', flex: 1 }}>👤 لا يوجد سائق معيّن</p>
                  )}
                  <Link href={`/dashboard/equipment/${eq.id}`} style={{
                    fontSize: 11, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, fontWeight: 700, textDecoration: 'none', flexShrink: 0,
                  }}>
                    تفاصيل ←
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
