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
        <h1 className="text-2xl font-black text-[#FFFFFF]">دورة مالية جديدة</h1>
        <p className="text-sm text-[#A0A0A0] mt-1">ابدأ دورة جديدة لتتبع العمليات</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-bold">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#2A2A2A] rounded-xl shadow-sm border border-[#3D3D3D] p-6 space-y-5">
        <div>
          <label className="block text-sm font-bold text-[#A0A0A0] mb-2">السائق *</label>
          <select
            required
            value={form.worker_id}
            onChange={e => set('worker_id', e.target.value)}
            className="w-full border border-[#3D3D3D] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFCD11] bg-[#1A1A1A] text-[#FFFFFF]"
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
          <label className="block text-sm font-bold text-[#A0A0A0] mb-2">عنوان الدورة (اختياري)</label>
          <input
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="مثال: يونيو 2026 — اللودر الكبير"
            className="w-full border border-[#3D3D3D] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFCD11] bg-[#1A1A1A] text-[#FFFFFF]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#A0A0A0] mb-2">العملة</label>
          <select
            value={form.currency}
            onChange={e => set('currency', e.target.value)}
            className="w-full border border-[#3D3D3D] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFCD11] bg-[#1A1A1A] text-[#FFFFFF]"
          >
            <option value="SAR">ريال سعودي (SAR)</option>
            <option value="AED">درهم إماراتي (AED)</option>
            <option value="KWD">دينار كويتي (KWD)</option>
            <option value="USD">دولار أمريكي (USD)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#A0A0A0] mb-2">ملاحظات (اختياري)</label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            className="w-full border border-[#3D3D3D] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFCD11] resize-none bg-[#1A1A1A] text-[#FFFFFF]"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="flex-1 bg-[#FFCD11] text-[#1A1A1A] font-bold py-3 rounded-lg hover:bg-[#FFD700] transition disabled:opacity-50">
            {loading ? 'جاري الإنشاء...' : 'بدء الدورة'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 border border-[#3D3D3D] text-[#A0A0A0] font-bold py-3 rounded-lg hover:bg-[#1A1A1A] transition">
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
