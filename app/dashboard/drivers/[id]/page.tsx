"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Worker, Equipment } from '@/types';

type WorkerDetail = Worker & {
  worker_contracts?: { id: string; profit_percentage: number; effective_from: string; effective_to: string | null }[];
};

export default function DriverDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [worker,        setWorker]        = useState<WorkerDetail | null>(null);
  const [currentEq,     setCurrentEq]     = useState<Equipment | null>(null);
  const [availableEq,   setAvailableEq]   = useState<Equipment[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [picking,       setPicking]       = useState(false);
  const [selectedEqId,  setSelectedEqId]  = useState('');
  const [busy,          setBusy]          = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch(`/api/drivers/${id}`).then(r => r.json()),
      fetch('/api/equipment').then(r => r.json()),
    ]).then(([dData, eData]) => {
      setWorker(dData.worker ?? null);
      const allEq: Equipment[] = eData.equipment ?? [];
      setCurrentEq(allEq.find(e => e.assigned_worker_id === id) ?? null);
      setAvailableEq(allEq.filter(e => e.is_active && !e.assigned_worker_id));
    }).finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const confirmSwitch = async () => {
    if (!selectedEqId) return;
    setBusy(true);

    // 1) أزل السائق عن المعدة القديمة (إن وجدت)
    if (currentEq) {
      await fetch(`/api/equipment/${currentEq.id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ assigned_worker_id: null }),
      });
    }

    // 2) عيّن المعدة الجديدة لهذا السائق
    await fetch(`/api/equipment/${selectedEqId}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ assigned_worker_id: id }),
    });

    setBusy(false);
    setPicking(false);
    setSelectedEqId('');
    load();
  };

  const removeEquipment = async () => {
    if (!currentEq) return;
    if (!confirm(`هل تريد إلغاء عهدة "${currentEq.model ?? 'المعدة'}" عن ${worker?.full_name}؟`)) return;
    setBusy(true);
    await fetch(`/api/equipment/${currentEq.id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ assigned_worker_id: null }),
    });
    setBusy(false);
    load();
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="p-8 text-center text-slate-400" dir="rtl">
        السائق غير موجود
      </div>
    );
  }

  const contract = worker.worker_contracts?.[0];

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6" dir="rtl">

      <button onClick={() => router.back()} className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1">
        ← رجوع
      </button>

      {/* بطاقة السائق */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center text-xl font-black">
            {worker.full_name[0]}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800">{worker.full_name}</h1>
            <p className="text-sm text-slate-400 font-mono">@{worker.username}</p>
          </div>
          <span className={`mr-auto px-3 py-1 rounded-full text-xs font-bold ${
            !worker.is_active ? 'bg-red-100 text-red-600' :
            worker.is_frozen  ? 'bg-blue-100 text-blue-700' :
                                 'bg-emerald-100 text-emerald-700'
          }`}>
            {!worker.is_active ? 'معطّل' : worker.is_frozen ? 'مجمّد' : 'نشط'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400 mb-1">رقم الجوال</p>
            <p className="font-bold text-slate-700 font-mono" dir="ltr">{worker.phone ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">نسبة السائق من الأرباح</p>
            <p className="font-bold text-blue-600">{contract ? `${contract.profit_percentage}%` : '—'}</p>
          </div>
        </div>
      </div>

      {/* المعدة الحالية */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-slate-700 text-sm">المعدة في العهدة</h2>
          <button
            onClick={() => { setPicking(true); setSelectedEqId(''); }}
            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition"
          >
            🔄 {currentEq ? 'تبديل المعدة' : 'تعيين معدة'}
          </button>
        </div>

        {currentEq ? (
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-xl">
              🚜
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800">{currentEq.model ?? 'معدة'}</p>
              <p className="text-xs text-slate-400">
                {(currentEq.equipment_type as any)?.name}
                {currentEq.plate_number && ` · ${currentEq.plate_number}`}
              </p>
            </div>
            <button
              onClick={removeEquipment}
              disabled={busy}
              className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
            >
              إلغاء العهدة
            </button>
          </div>
        ) : (
          <p className="text-sm text-slate-400 bg-slate-50 rounded-xl p-4 text-center">
            لا توجد معدة في عهدة هذا السائق حالياً
          </p>
        )}
      </div>

      {/* نافذة اختيار/تبديل المعدة */}
      {picking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setPicking(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-black text-slate-800 mb-1">
              {currentEq ? 'تبديل المعدة' : 'تعيين معدة'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">اختر معدة متاحة لإسنادها لـ {worker.full_name}</p>

            {availableEq.length === 0 ? (
              <p className="text-sm text-slate-400 bg-slate-50 rounded-xl p-4 text-center">
                لا توجد معدات متاحة حالياً (كل المعدات إما بعهدة سائقين آخرين أو لا توجد معدات مضافة).{' '}
                <a href="/dashboard/equipment/new" className="text-blue-600 underline">أضف معدة جديدة</a>
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {availableEq.map(eq => (
                  <button key={eq.id} type="button"
                    onClick={() => setSelectedEqId(eq.id)}
                    className={`w-full px-4 py-3 rounded-xl text-sm text-right border-2 transition flex items-center gap-3 ${
                      selectedEqId === eq.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                        : 'border-slate-100 text-slate-700 hover:border-slate-200'
                    }`}>
                    <span className="text-lg">🚜</span>
                    <div>
                      <p className="font-bold">{eq.model ?? 'معدة'}</p>
                      <p className="text-xs opacity-60 font-normal">
                        {(eq.equipment_type as any)?.name}
                        {eq.plate_number && ` · ${eq.plate_number}`}
                      </p>
                    </div>
                    {selectedEqId === eq.id && <span className="mr-auto text-blue-500">✓</span>}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2 mt-5">
              <button onClick={() => setPicking(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition">
                إلغاء
              </button>
              <ConfirmAndSwitchButton
                disabled={!selectedEqId || busy}
                workerName={worker.full_name}
                fromEquipment={currentEq}
                toEquipment={availableEq.find(e => e.id === selectedEqId) ?? null}
                onConfirm={confirmSwitch}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfirmAndSwitchButton({
  disabled, workerName, fromEquipment, toEquipment, onConfirm,
}: {
  disabled: boolean;
  workerName: string;
  fromEquipment: Equipment | null;
  toEquipment: Equipment | null;
  onConfirm: () => void;
}) {
  const handleClick = () => {
    if (!toEquipment) return;
    const msg = fromEquipment
      ? `هل تريد نقل عهدة ${workerName} من "${fromEquipment.model ?? 'المعدة الحالية'}" إلى "${toEquipment.model ?? 'المعدة الجديدة'}"؟`
      : `هل تريد إسناد "${toEquipment.model ?? 'هذه المعدة'}" إلى ${workerName}؟`;
    if (confirm(msg)) onConfirm();
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
    >
      تأكيد
    </button>
  );
}
