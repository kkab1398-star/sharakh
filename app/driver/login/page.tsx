"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDriverLang } from '@/contexts/DriverLangContext';
import { LANG_META, type DriverLang } from '@/lib/driver-i18n';
import PasswordInput from '@/components/PasswordInput';

export default function DriverLoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const partnerId    = searchParams.get('p') ?? '';
  const { lang, setLang, m, dir, meta } = useDriverLang();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    fetch('/api/worker/cycles').then(r => { if (r.ok) router.replace('/driver'); }).catch(() => {});
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerId) { setError(m.login.noLink); return; }
    setLoading(true); setError('');
    try {
      const res  = await fetch('/api/auth/worker/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, partner_id: partnerId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(m.login.errors.invalidCredentials); }
      else { sessionStorage.setItem('worker', JSON.stringify(data.worker)); router.replace('/driver'); }
    } catch { setError(m.login.errors.serverError); }
    finally  { setLoading(false); }
  };

  return (
    <main
      dir={dir}
      className="min-h-screen bg-[#F4F5F7] flex flex-col items-center justify-center p-4"
      style={{ fontFamily: meta.fontFamily }}
    >
      <div className="w-full max-w-[400px]">
        {/* WHITE CARD - LIGHT THEME */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-0">

          {/* LOGO INSIDE CARD */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-[#FFCD11] rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              🚜
            </div>
            <h1 className="text-2xl font-black text-[#1A1A1A] -tracking-[0.5px]">
              SHARAKH OPS
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {m.login.subtitle}
            </p>
          </div>

          {/* LANGUAGE SELECTOR */}
          <div className="flex flex-wrap gap-1 justify-center mb-6">
            {(Object.values(LANG_META) as typeof LANG_META[DriverLang][]).map(lm => (
              <button
                key={lm.code}
                onClick={() => setLang(lm.code)}
                className={`px-3 py-2 rounded-md text-xs font-bold transition-all ${
                  lang === lm.code
                    ? 'bg-[#FFCD11] text-[#1A1A1A] border-2 border-[#FFCD11]'
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}
                style={{ fontFamily: lm.fontFamily }}
              >
                {lm.label}
              </button>
            ))}
          </div>

          {/* ERROR ALERT */}
          {(!partnerId || error) && (
            <div className="mb-6 p-3 bg-red-50 border border-red-300 rounded-xl text-red-600 font-bold text-sm text-center">
              ⚠️ {error || m.login.noLink}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* USERNAME */}
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2">
                {m.login.username}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder={m.login.usernamePlaceholder}
                dir="ltr"
                className="w-full h-14 px-4 bg-gray-50 border border-gray-300 rounded-xl text-[#1A1A1A] placeholder-gray-400 focus:bg-white focus:border-[#FFCD11] focus:ring-2 focus:ring-[#FFCD11]/20 outline-none transition-all"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2">
                {m.login.password}
              </label>
              <PasswordInput
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={m.login.passwordPlaceholder}
                dir="ltr"
                className="w-full h-14 px-4 bg-gray-50 border border-gray-300 rounded-xl text-[#1A1A1A] placeholder-gray-400 focus:bg-white focus:border-[#FFCD11] focus:ring-2 focus:ring-[#FFCD11]/20 outline-none transition-all"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading || !partnerId}
              className="w-full h-14 bg-[#FFCD11] text-[#1A1A1A] font-black rounded-xl uppercase tracking-wider hover:bg-yellow-500 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-2"
            >
              {loading ? `🔄 ${m.login.submitting}` : m.login.submit}
            </button>
          </form>

          {/* FORGOT PASSWORD */}
          <p className="text-center text-xs text-gray-500 mt-4">
            {m.login.forgotPassword}
          </p>
        </div>
      </div>
    </main>
  );
}
