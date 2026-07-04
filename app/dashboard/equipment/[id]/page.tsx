"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Equipment {
  id: string;
  model: string | null;
  plate_number: string | null;
  manufacture_year: number | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  equipment_type: { id: string; name: string; name_en: string } | null;
  assigned_worker: { id: string; full_name: string; username: string } | null;
}

interface Worker { id: string; full_name: string; username: string; }
interface EquipmentType { id: string; name: string; name_en: string; }

const INPUT: React.CSSProperties = {
  height: 44, background: '#1A1A1A', border: '1px solid #3D3D3D',
  color: '#fff', padding: '0 12px', fontSize: 13, outline: 'none',
  borderRadius: 0, width: '100%', boxSizing: 'border-box', fontFamily: "'Cairo', sans-serif",
};
const LABEL: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: '#A0A0A0', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em' };

export default function EquipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [eq, setEq]           = useState<Equipment | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [types, setTypes]     = useState<EquipmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');

  const [form, setForm] = useState({
    model: '',
    plate_number: '',
    manufacture_year: '',
    equipment_type_id: '',
    assigned_worker_id: '',
    notes: '',
    is_active: true,
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/equipment/${id}`).then(r => r.json()),
      fetch('/api/drivers').then(r => r.json()),
      fetch('/api/equipment-types').then(r => r.json()),
    ]).then(([ed, wd, td]) => {
      const e: Equipment = ed.equipment;
      setEq(e);
      setWorkers(wd.workers ?? []);
      setTypes(td.equipment_types ?? []);
      setForm({
        model:              e.model ?? '',
        plate_number:       e.plate_number ?? '',
        manufacture_year:   e.manufacture_year?.toString() ?? '',
        equipment_type_id:  e.equipment_type?.id ?? '',
        assigned_worker_id: e.assigned_worker?.id ?? '',
        notes:              e.notes ?? '',
        is_active:          e.is_active,
      });
    }).finally(() => setLoading(false));
  }, [id]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(''); setSaved(false);
    const body: Record<string, unknown> = {
      model:              form.model || null,
      plate_number:       form.plate_number || null,
      manufacture_year:   form.manufacture_year ? Number(form.manufacture_year) : null,
      equipment_type_id:  form.equipment_type_id || null,
      assigned_worker_id: form.assigned_worker_id || null,
      notes:              form.notes || null,
      is_active:          form.is_active,
    };
    const res = await fetch(`/api/equipment/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      const d = await res.json();
      setError(d.error ?? 'حدث خطأ');
    }
    setSaving(false);
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    (e.target.style.border = '1px solid #FFCD11');
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    (e.target.style.border = '1px solid #3D3D3D');

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', background: 'var(--cat-black)' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #FFCD11', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!eq) return (
    <div style={{ padding: 32, background: 'var(--cat-black)', minHeight: '100vh', color: '#fff', direction: 'rtl' }}>
      <p style={{ color: '#ef4444' }}>المعدة غير موجودة.</p>
      <Link href="/dashboard/equipment" style={{ color: '#FFCD11', fontWeight: 700 }}>← العودة للمعدات</Link>
    </div>
  );

  return (
    <div dir="rtl" style={{ padding: 32, background: 'var(--cat-black)', minHeight: '100vh', fontFamily: "'Cairo', sans-serif", color: '#fff', maxWidth: 640 }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <Link href="/dashboard/equipment" style={{ fontSize: 12, color: '#A0A0A0', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
          ← العودة
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#FFCD11', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>تفاصيل المعدة</p>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0 }}>{eq.model ?? 'معدة بدون اسم'}</h1>
            {eq.plate_number && (
              <p style={{ fontSize: 13, fontWeight: 700, color: '#FFCD11', fontFamily: 'monospace', marginTop: 4 }} dir="ltr">{eq.plate_number}</p>
            )}
          </div>
          <span style={{
            fontSize: 11, fontWeight: 900, padding: '4px 14px',
            color:      eq.is_active ? '#22c55e' : '#ef4444',
            background: eq.is_active ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
          }}>
            {eq.is_active ? 'نشطة' : 'غير نشطة'}
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div style={{ background: '#2A2A2A', borderRadius: 4, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>الموديل / الاسم</label>
              <input value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))}
                placeholder="مثل: كاتربيلر 320" style={INPUT} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div>
              <label style={LABEL}>رقم اللوحة</label>
              <input value={form.plate_number} onChange={e => setForm(f => ({ ...f, plate_number: e.target.value }))}
                placeholder="أ ب ج 1234" style={INPUT} dir="ltr" onFocus={focusStyle} onBlur={blurStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>نوع المعدة</label>
              <select value={form.equipment_type_id} onChange={e => setForm(f => ({ ...f, equipment_type_id: e.target.value }))}
                style={{ ...INPUT, cursor: 'pointer' }} onFocus={focusStyle} onBlur={blurStyle}>
                <option value="">— غير محدد —</option>
                {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label style={LABEL}>سنة الصنع</label>
              <input type="number" min="1900" max="2100" value={form.manufacture_year}
                onChange={e => setForm(f => ({ ...f, manufacture_year: e.target.value }))}
                placeholder="2020" style={INPUT} dir="ltr" onFocus={focusStyle} onBlur={blurStyle} />
            </div>
          </div>

          <div>
            <label style={LABEL}>السائق المعيّن</label>
            <select value={form.assigned_worker_id} onChange={e => setForm(f => ({ ...f, assigned_worker_id: e.target.value }))}
              style={{ ...INPUT, cursor: 'pointer' }} onFocus={focusStyle} onBlur={blurStyle}>
              <option value="">— بدون سائق —</option>
              {workers.map(w => <option key={w.id} value={w.id}>{w.full_name} (@{w.username})</option>)}
            </select>
          </div>

          <div>
            <label style={LABEL}>ملاحظات</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="أي ملاحظات إضافية..." rows={3}
              style={{ ...INPUT, height: 'auto', padding: '10px 12px', resize: 'vertical' } as React.CSSProperties}
              onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          {/* Toggle active */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8, borderTop: '1px solid #3D3D3D' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', flex: 1 }}>حالة المعدة</span>
            <button type="button" onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))} style={{
              height: 34, padding: '0 16px', borderRadius: 0, cursor: 'pointer',
              fontSize: 12, fontWeight: 700, background: 'transparent',
              color:  form.is_active ? '#22c55e' : '#ef4444',
              border: form.is_active ? '1px solid #22c55e' : '1px solid #ef4444',
            }}>
              {form.is_active ? '✓ نشطة' : '✕ غير نشطة'}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid #ef4444', padding: '12px 16px', fontSize: 13, color: '#ef4444' }}>
            {error}
          </div>
        )}

        {saved && (
          <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid #22c55e', padding: '12px 16px', fontSize: 13, color: '#22c55e' }}>
            ✓ تم الحفظ بنجاح
          </div>
        )}

        <button type="submit" disabled={saving} style={{
          height: 48, background: '#FFCD11', color: '#1A1A1A',
          border: 'none', fontWeight: 900, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer',
          borderRadius: 0, opacity: saving ? 0.7 : 1, fontFamily: "'Cairo', sans-serif",
        }}>
          {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
        </button>
      </form>

      <p style={{ fontSize: 11, color: '#555', marginTop: 20, textAlign: 'center' }}>
        أُضيفت في {new Date(eq.created_at).toLocaleDateString('ar-SA')}
      </p>
    </div>
  );
}
