"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Worker } from '@/types';

export default function NewCyclePage() {
  const router = useRouter();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ worker_id: '', title: '', currency: 'SAR', notes: '' });

  useEffect(() => {
    fetch('/api/drivers')
      .then(r => r.json())
      .then(d => setWorkers((d.workers ?? []).filter((w: Worker) => w.is_active)));
  }, []);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.worker_id) { setError('اختر السائق'); return; }
    setLoading(true);
    setError('');

    const res = await fetch('/api/cycles', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'حدث خطأ');
      setLoading(false);
    } else {
      router.push(`/dashboard/cycles/${data.cycle.id}`);
    }
  };

  return (
    <div className="p-8 max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800">دورة مالية جديدة</h1>
        <p className="text-sm text-gray-500 mt-1">ابدأ دورة جديدة لتتبع العمليات</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-bold">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">السائق *</label>
          <select
            required
            value={form.worker_id}
            onChange={e => set('worker_id', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">— اختر السائق —</option>
            {workers.map(w => (
              <option key={w.id} value={w.id}>{w.full_name}</option>
            ))}
          </select>
          {workers.length === 0 && (
            <p className="text-xs text-red-500 mt-1">لا يوجد سائقون نشطون — <a href="/dashboard/drivers/new" className="underline">أضف سائقاً أولاً</a></p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">عنوان الدورة (اختياري)</label>
          <input
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="مثال: يونيو 2026 — اللودر الكبير"
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">العملة</label>
          <select
            value={form.currency}
            onChange={e => set('currency', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="SAR">ريال سعودي (SAR)</option>
            <option value="AED">درهم إماراتي (AED)</option>
            <option value="KWD">دينار كويتي (KWD)</option>
            <option value="USD">دولار أمريكي (USD)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات (اختياري)</label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? 'جاري الإنشاء...' : 'بدء الدورة'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 border border-gray-300 text-gray-600 font-bold py-3 rounded-lg hover:bg-gray-50 transition">
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
