'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ProIcon } from '@/components/ui/ProIcon';
import { ProfessionalEquipmentIcons, ProfessionalFormIcons } from '@/lib/professional-icons';

type Role = 'partner' | 'driver' | null;

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>(null);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (role === 'partner') {
        if (!email.trim() || !password.trim()) {
          setError('يرجى ملء جميع الحقول');
          setLoading(false);
          return;
        }

        const { error: authError, data } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (authError) {
          setError(authError.message || 'البريد أو كلمة المرور غير صحيحة');
          setLoading(false);
          return;
        }

        if (!data.user) {
          setError('فشل تسجيل الدخول');
          setLoading(false);
          return;
        }

        try {
          const res = await fetch('/api/partners/me');
          if (!res.ok) throw new Error('Failed to fetch partner data');

          const partnerData = await res.json();

          if (partnerData.partner?.is_first_login === true) {
            await new Promise(r => setTimeout(r, 300));
            router.push('/change-password');
          } else {
            await new Promise(r => setTimeout(r, 300));
            router.push('/dashboard');
          }
        } catch (err) {
          await new Promise(r => setTimeout(r, 300));
          router.push('/dashboard');
        }
      } else if (role === 'driver') {
        if (!username.trim() || !password.trim()) {
          setError('يرجى ملء جميع الحقول');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/auth/worker/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username.trim(), password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'اسم المستخدم أو كلمة المرور غير صحيحة');
          setLoading(false);
          return;
        }

        sessionStorage.setItem('worker', JSON.stringify(data.worker));
        await new Promise(r => setTimeout(r, 300));
        router.push('/driver');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في الخادم');
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-5 py-6 font-cairo">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #94A3B8; }
      `}</style>

      <div className="w-full max-w-[380px]">

        {/* === الشعار === */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#2563EB] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-[0_8px_30px_rgb(37,99,235,0.25)]">
            <ProIcon
              icon={<ProfessionalEquipmentIcons.construction style={{ width: 36, height: 36, color: '#FFFFFF' }} />}
              size="2xl"
              color="white"
            />
          </div>
          <div className="text-[28px] font-black text-[#0F172A] mb-1 tracking-tight">
            شراكة
          </div>
          <div className="text-[13px] text-[#64748B] leading-relaxed">
            نظام إدارة المعدات والشراكات
          </div>
        </div>

        {/* === البطاقة البيضاء === */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">

          {/* === اختيار الدور === */}
          <div className={role ? 'mb-6' : 'mb-2'}>
            <div className="text-xs font-semibold text-[#64748B] text-center mb-3 tracking-wide uppercase">
              اختر نوع حسابك
            </div>

            <div className="flex gap-3">
              {/* بطاقة المالك */}
              <button
                type="button"
                onClick={() => { setRole('partner'); setError(''); }}
                className={`flex-1 h-[90px] rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all p-0 ${
                  role === 'partner'
                    ? 'border-2 border-[#2563EB] bg-blue-50 scale-[1.02]'
                    : 'border-2 border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <ProIcon
                  icon={<ProfessionalEquipmentIcons.engineering style={{ width: 26, height: 26, color: role === 'partner' ? '#2563EB' : '#94A3B8' }} />}
                  size="lg"
                />
                <div>
                  <div className={`text-sm font-bold text-center ${role === 'partner' ? 'text-[#2563EB]' : 'text-[#64748B]'}`}>
                    مالك
                  </div>
                  <div className={`text-[11px] text-center ${role === 'partner' ? 'text-[#2563EB]' : 'text-slate-400'}`}>
                    شريك
                  </div>
                </div>
              </button>

              {/* بطاقة السائق */}
              <button
                type="button"
                onClick={() => { setRole('driver'); setError(''); }}
                className={`flex-1 h-[90px] rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all p-0 ${
                  role === 'driver'
                    ? 'border-2 border-[#2563EB] bg-blue-50 scale-[1.02]'
                    : 'border-2 border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <ProIcon
                  icon={<ProfessionalEquipmentIcons.truck style={{ width: 26, height: 26, color: role === 'driver' ? '#2563EB' : '#94A3B8' }} />}
                  size="lg"
                />
                <div className={`text-sm font-bold text-center ${role === 'driver' ? 'text-[#2563EB]' : 'text-[#64748B]'}`}>
                  سائق
                </div>
              </button>
            </div>
          </div>

          {/* === النموذج === */}
          {role && (
            <form onSubmit={handleLogin} style={{ animation: 'fadeIn 0.3s ease' }}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-[#EF4444] rounded-xl px-4 py-3 text-[13px] mb-4 text-center font-semibold">
                  ⚠️ {error}
                </div>
              )}

              {role === 'partner' && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[#64748B] mb-1.5 tracking-wide uppercase">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    dir="ltr"
                    required
                    className="w-full h-14 rounded-xl border border-slate-200 bg-slate-50 text-[#0F172A] text-[15px] px-4 outline-none transition-all focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              )}

              {role === 'driver' && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[#64748B] mb-1.5 tracking-wide uppercase">
                    اسم المستخدم
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="أدخل اسم المستخدم"
                    dir="ltr"
                    required
                    className="w-full h-14 rounded-xl border border-slate-200 bg-slate-50 text-[#0F172A] text-[15px] px-4 outline-none transition-all focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              )}

              <div className="mb-6">
                <label className="block text-xs font-semibold text-[#64748B] mb-1.5 tracking-wide uppercase">
                  كلمة المرور
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin(e as any)}
                    placeholder="••••••••"
                    required
                    className="flex-1 h-14 rounded-xl border border-slate-200 bg-slate-50 text-[#0F172A] text-[15px] px-4 outline-none transition-all focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="bg-transparent border-none cursor-pointer p-2 flex-shrink-0"
                  >
                    <ProIcon
                      icon={showPassword
                        ? <ProfessionalFormIcons.visibility style={{ width: 20, height: 20, color: '#2563EB' }} />
                        : <ProfessionalFormIcons.visibilityOff style={{ width: 20, height: 20, color: '#94A3B8' }} />
                      }
                      size="md"
                    />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full h-14 rounded-xl text-white text-base font-bold flex items-center justify-center gap-2 transition-colors ${
                  loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#2563EB] hover:bg-[#1D4ED8] cursor-pointer'
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-[18px] h-[18px] border-2 border-white border-t-transparent rounded-full inline-block flex-shrink-0" style={{ animation: 'spin 0.8s linear infinite' }} />
                    <span>جاري الدخول...</span>
                  </>
                ) : (
                  <>
                    <ProIcon
                      icon={role === 'partner'
                        ? <ProfessionalEquipmentIcons.engineering style={{ width: 20, height: 20 }} />
                        : <ProfessionalEquipmentIcons.truck style={{ width: 20, height: 20 }} />
                      }
                      size="md"
                      color="white"
                    />
                    <span>{role === 'partner' ? 'دخول كمالك' : 'دخول كسائق'}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
