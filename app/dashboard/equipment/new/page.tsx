"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Worker } from '@/types';

interface EquipmentType {
  id: string;
  name: string;
  name_en: string | null;
}

export default function NewEquipmentPage() {
  const router = useRouter();

  const [types,   setTypes]   = useState<EquipmentType[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [newType, setNewType] = useState('');
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  const [form, setForm] = useState({
    equipment_type_id:  '',
    model:              '',
    plate_number:       '',
    manufacture_year:   '',
    assigned_worker_id: '',
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/equipment-types').then(r => r.json()),
      fetch('/api/drivers').then(r => r.json()),
    ]).then(([tData, dData]) => {
      setTypes(tData.equipment_types ?? []);
      setWorkers((dData.workers ?? []).filter((w: Worker) => w.is_active && !w.is_frozen));
    });
  }, []);

  const addType = async () => {
    if (!newType.trim()) return;
    const res = await fetch('/api/equipment-types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newType.trim() }),
    });
    const data = await res.json();
    if (data.equipment_type) {
      setTypes(prev => [...prev, data.equipment_type]);
      setForm(f => ({ ...f, equipment_type_id: data.equipment_type.id }));
      setNewType('');
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const body: Record<string, any> = {
      model:        form.model.trim()        || undefined,
      plate_number: form.plate_number.trim() || undefined,
    };
    if (form.equipment_type_id)  body.equipment_type_id  = form.equipment_type_id;
    if (form.assigned_worker_id) body.assigned_worker_id = form.assigned_worker_id;
    if (form.manufacture_year)   body.manufacture_year   = parseInt(form.manufacture_year);

    const res = await fetch('/api/equipment', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) { setError(data.error ?? 'حدث خطأ'); return; }
    router.push('/dashboard/equipment');
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto" dir="rtl">
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-sm text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-1">
          ← رجوع
        </button>
        <h1 className="text-2xl font-black text-slate-800">إضافة معدة جديدة</h1>
        <p className="text-sm text-slate-400 mt-1">أضف معدة وحدّد السائق المسؤول عنها</p>
      </div>

      <form onSubmit={submit} className="space-y-5">

        {/* نوع المعدة */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
          <h2 className="font-black text-slate-700 text-sm">نوع المعدة</h2>

          {types.length > 0 ? (
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">اختر نوعاً</label>
              <div className="grid grid-cols-2 gap-2">
                {types.map(t => (
                  <button type="button" key={t.id}
                    onClick={() => setForm(f => ({ ...f, equipment_type_id: t.id }))}
                    className={`px-4 py-3 rounded-xl text-sm font-bold border-2 text-right transition ${
                      form.equipment_type_id === t.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">لا يوجد أنواع بعد — أضف نوعاً جديداً أدناه</p>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={newType}
              onChange={e => setNewType(e.target.value)}
              placeholder="مثال: شاحنة، حفّارة، رافعة..."
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addType(); } }}
            />
            <button type="button" onClick={addType}
              className="px-4 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition whitespace-nowrap">
              + إضافة نوع
            </button>
          </div>
        </div>

        {/* بيانات المعدة */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
          <h2 className="font-black text-slate-700 text-sm">بيانات المعدة</h2>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">الموديل / الاسم</label>
            <input
              type="text"
              value={form.model}
              onChange={e => setForm(f => ({ ...f, model: e.target.value }))}
              placeholder="مثال: كاتربيلر 320D"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">رقم اللوحة</label>
              <input
                type="text"
                value={form.plate_number}
                onChange={e => setForm(f => ({ ...f, plate_number: e.target.value }))}
                placeholder="مثال: ABC-1234"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">سنة الصنع</label>
              <input
                type="number"
                value={form.manufacture_year}
                onChange={e => setForm(f => ({ ...f, manufacture_year: e.target.value }))}
                placeholder="مثال: 2020"
                min={1950}
                max={2100}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* تعيين السائق */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="font-black text-slate-700 text-sm mb-4">السائق المعيّن (اختياري)</h2>

          {workers.length === 0 ? (
            <p className="text-xs text-slate-400">لا يوجد سائقون نشطون — <a href="/dashboard/drivers/new" className="text-blue-600 underline">أضف سائقاً أولاً</a></p>
          ) : (
            <div className="space-y-2">
              <button type="button"
                onClick={() => setForm(f => ({ ...f, assigned_worker_id: '' }))}
                className={`w-full px-4 py-3 rounded-xl text-sm font-bold border-2 text-right transition flex items-center gap-3 ${
                  !form.assigned_worker_id
                    ? 'border-slate-300 bg-slate-50 text-slate-600'
                    : 'border-slate-100 text-slate-400 hover:border-slate-200'
                }`}>
                <span className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center text-xs">—</span>
                بدون سائق محدد
              </button>

              {workers.map(w => (
                <button type="button" key={w.id}
                  onClick={() => setForm(f => ({ ...f, assigned_worker_id: w.id }))}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-bold border-2 text-right transition flex items-center gap-3 ${
                    form.assigned_worker_id === w.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-100 text-slate-700 hover:border-slate-200'
                  }`}>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
                    form.assigned_worker_id === w.id ? 'bg-blue-200 text-blue-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {w.full_name[0]}
                  </span>
                  <div>
                    <p>{w.full_name}</p>
                    <p className="font-mono font-normal text-xs opacity-60">@{w.username}</p>
                  </div>
                  {form.assigned_worker_id === w.id && <span className="mr-auto text-blue-500">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
            {error}
          </div>
        )}

        <button type="submit" disabled={saving}
          className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black text-sm hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-200">
          {saving ? 'جاري الحفظ...' : 'حفظ المعدة'}
        </button>
      </form>
    </div>
  );
}
