"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Equipment, Partner } from '@/types';
import ShareDriverModal from '@/components/ShareDriverModal';

export default function NewDriverPage() {
  const router = useRouter();
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [savedDriver, setSavedDriver] = useState<any>(null);

  const [form, setForm] = useState({
    full_name:          '',
    username:           '',
    password:           '',
    profit_percentage:  50,
    phone:              '',
    assigned_equipment: '',
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/equipment').then(r => r.json()),
      fetch('/api/partners/me').then(r => r.json()),
    ]).then(([eData, pData]) => {
      setEquipment((eData.equipment ?? []).filter((e: Equipment) => e.is_active && !e.assigned_worker_id));
      setPartner(pData.partner ?? null);
    });
  }, []);

  const set = (k: string, v: string | number) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Create driver
    const res = await fetch('/api/drivers', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        full_name:         form.full_name,
        username:          form.username,
        password:          form.password,
        profit_percentage: Number(form.profit_percentage),
        phone:             form.phone || undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'حدث خطأ');
      setLoading(false);
      return;
    }

    // 2. If equipment selected, assign it
    if (form.assigned_equipment && data.worker?.id) {
      await fetch(`/api/equipment/${form.assigned_equipment}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ assigned_worker_id: data.worker.id }),
      });
    }

    // 3. عرض الـ modal بدل التوجيه المباشر
    setSavedDriver({
      full_name: form.full_name,
      username: form.username,
      password: form.password,
      phone: form.phone,
    });
    setShowModal(true);
    setLoading(false);
  };

  const inp = "w-full border border-[#3D3D3D] rounded-xl px-4 py-3 text-[#FFFFFF] text-sm focus:outline-none focus:ring-2 focus:ring-[#FFCD11] placeholder-[#A0A0A0] bg-[#1A1A1A]";

  const handleCloseModal = () => {
    setShowModal(false);
    router.push('/dashboard/drivers');
  };

  return (
    <div className="p-6 md:p-8 max-w-xl mx-auto" dir="rtl">
      <ShareDriverModal
        isOpen={showModal}
        driver={savedDriver}
        partnerSlug={partner?.slug}
        onClose={handleCloseModal}
      />
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-sm text-[#A0A0A0] hover:text-[#FFFFFF] mb-4 flex items-center gap-1">
          ← رجوع
        </button>
        <h1 className="text-2xl font-black text-[#FFFFFF]">إضافة سائق جديد</h1>
        <p className="text-sm text-[#A0A0A0] mt-1">أنشئ حساباً للسائق وحدّد نسبته من الأرباح</p>
      </div>

      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-bold">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* بيانات الحساب */}
        <div className="bg-[#2A2A2A] rounded-2xl shadow-sm border border-[#3D3D3D] p-5 space-y-4">
          <h2 className="font-black text-[#FFFFFF] text-sm">بيانات الحساب</h2>

          <div>
            <label className="block text-xs font-bold text-[#A0A0A0] mb-2">الاسم الكامل *</label>
            <input required value={form.full_name}
              onChange={e => set('full_name', e.target.value)}
              placeholder="محمد أحمد العمري" className={inp} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#A0A0A0] mb-2">اسم المستخدم *</label>
              <input required value={form.username} dir="ltr"
                onChange={e => set('username', e.target.value.toLowerCase())}
                placeholder="ahmed123" pattern="[a-zA-Z0-9_]+"
                className={inp + " font-mono"} />
              <p className="text-xs text-[#A0A0A0] mt-1">أحرف + أرقام + _ فقط</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#A0A0A0] mb-2">رقم الجوال *</label>
              <input required value={form.phone} dir="ltr"
                onChange={e => set('phone', e.target.value)}
                placeholder="05xxxxxxxx" pattern="[0-9+\s-]{9,}"
                title="أدخل رقم جوال صحيح"
                className={inp} />
              <p className="text-xs text-[#A0A0A0] mt-1">يُستخدم لإرسال الفواتير والإشعارات للسائق</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#A0A0A0] mb-2">كلمة المرور *</label>
            <input required type="password" minLength={6} dir="ltr"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              placeholder="6 أحرف على الأقل"
              className={inp} />
          </div>
        </div>

        {/* نسبة الأرباح */}
        <div className="bg-[#2A2A2A] rounded-2xl shadow-sm border border-[#3D3D3D] p-5">
          <h2 className="font-black text-[#FFFFFF] text-sm mb-4">نسبة الأرباح</h2>

          <div className="flex items-center justify-between mb-3">
            <div className="text-center">
              <p className="text-3xl font-black text-[#FFCD11]">{form.profit_percentage}%</p>
              <p className="text-xs text-[#A0A0A0]">السائق</p>
            </div>
            <div className="text-[#A0A0A0] text-2xl">↔</div>
            <div className="text-center">
              <p className="text-3xl font-black text-[#FFFFFF]">{100 - form.profit_percentage}%</p>
              <p className="text-xs text-[#A0A0A0]">المالك</p>
            </div>
          </div>

          <input type="range" min={1} max={99}
            value={form.profit_percentage}
            onChange={e => set('profit_percentage', Number(e.target.value))}
            className="w-full accent-[#FFCD11] h-2" />
          <div className="flex justify-between text-xs text-[#A0A0A0] mt-2">
            <span>1%</span>
            <span>50%</span>
            <span>99%</span>
          </div>
        </div>

        {/* ربط معدة */}
        <div className="bg-[#2A2A2A] rounded-2xl shadow-sm border border-[#3D3D3D] p-5">
          <h2 className="font-black text-[#FFFFFF] text-sm mb-4">المعدة المرتبطة (اختياري)</h2>

          {equipment.length === 0 ? (
            <p className="text-xs text-[#A0A0A0] bg-[#1A1A1A] rounded-xl p-3">
              لا توجد معدات مضافة بعد — يمكنك إضافة سائق بدون معدة الآن وتعيينها لاحقاً.{' '}
              <a href="/dashboard/equipment/new" className="text-[#FFCD11] underline">أو أضف معدة أولاً</a>
            </p>
          ) : (
            <div className="space-y-2">
              <button type="button"
                onClick={() => set('assigned_equipment', '')}
                className={`w-full px-4 py-3 rounded-xl text-sm text-right border-2 transition flex items-center gap-3 ${
                  !form.assigned_equipment
                    ? 'border-[#3D3D3D] bg-[#1A1A1A] text-[#FFFFFF] font-bold'
                    : 'border-[#3D3D3D] text-[#A0A0A0] hover:border-[#3D3D3D]'
                }`}>
                <span className="w-8 h-8 bg-[#3D3D3D] rounded-lg flex items-center justify-center text-xs">—</span>
                بدون معدة محددة
              </button>

              {equipment.map(eq => (
                <button type="button" key={eq.id}
                  onClick={() => set('assigned_equipment', eq.id)}
                  className={`w-full px-4 py-3 rounded-xl text-sm text-right border-2 transition flex items-center gap-3 ${
                    form.assigned_equipment === eq.id
                      ? 'border-[#FFCD11] bg-[#2A2A2A] text-[#FFCD11] font-bold'
                      : 'border-[#3D3D3D] text-[#FFFFFF] hover:border-[#3D3D3D]'
                  }`}>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${
                    form.assigned_equipment === eq.id ? 'bg-[#3D3D3D]' : 'bg-[#1A1A1A]'
                  }`}>🚜</span>
                  <div className="text-right">
                    <p className="font-bold">{eq.model ?? 'معدة'}</p>
                    <p className="font-normal text-xs opacity-60">
                      {(eq.equipment_type as any)?.name}
                      {eq.plate_number && ` · ${eq.plate_number}`}
                    </p>
                  </div>
                  {form.assigned_equipment === eq.id && <span className="mr-auto text-[#FFCD11]">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-[#FFCD11] text-[#1A1A1A] py-3.5 rounded-xl font-black text-sm hover:bg-[#FFD700] transition disabled:opacity-50 shadow-lg shadow-[#FFCD11]">
          {loading ? 'جاري الحفظ...' : '+ إضافة السائق'}
        </button>
      </form>
    </div>
  );
}
