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
    <main dir={dir} style={{
      minHeight: '100svh', background: '#1A1A1A',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: meta.fontFamily,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', marginBottom: 16,
            background: '#FFCD11', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 40, margin: '0 auto 16px',
          }}>🚜</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#FFCD11', letterSpacing: '-0.5px', margin: '0 0 8px', fontFamily: meta.fontFamily }}>
            SHARAKH OPS
          </h1>
          <p style={{ color: '#A0A0A0', fontSize: 13, margin: 0 }}>{m.login.subtitle}</p>
        </div>

        {/* Language Selector */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
          {(Object.values(LANG_META) as typeof LANG_META[DriverLang][]).map(lm => (
            <button key={lm.code} onClick={() => setLang(lm.code)} style={{
              padding: '8px 12px', borderRadius: 4, fontSize: 11, fontWeight: 700, minHeight: 40,
              border: lang === lm.code ? '2px solid #FFCD11' : '1px solid #3D3D3D',
              background: lang === lm.code ? '#FFCD11' : '#1A1A1A',
              color: lang === lm.code ? '#1A1A1A' : '#A0A0A0',
              cursor: 'pointer', fontFamily: lm.fontFamily, transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {lm.label}
            </button>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: '#2A2A2A', border: '2px solid #3D3D3D',
          borderRadius: 16, padding: '32px 24px',
        }}>
          {!partnerId && (
            <div style={{
              marginBottom: 20, padding: '10px 14px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid #ef4444', borderRadius: 8,
              color: '#ef4444', fontWeight: 700, fontSize: 13, textAlign: 'center',
            }}>
              ⚠️ {m.login.noLink}
            </div>
          )}
          {error && (
            <div style={{
              marginBottom: 20, padding: '10px 14px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid #ef4444', borderRadius: 8,
              color: '#ef4444', fontWeight: 700, fontSize: 13, textAlign: 'center',
            }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Username */}
            <div>
              <label style={{
                display: 'block', fontSize: 13, fontWeight: 700, color: '#A0A0A0',
                marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>{m.login.username}</label>
              <input type="text" required value={username} onChange={e => setUsername(e.target.value)}
                placeholder={m.login.usernamePlaceholder} dir="ltr" style={{
                  width: '100%', height: 52, border: '2px solid #3D3D3D', borderRadius: 8,
                  padding: '14px 16px', backgroundColor: '#1A1A1A', color: '#FFFFFF',
                  fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box',
                  outline: 'none', transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#FFCD11')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#3D3D3D')} />
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: 'block', fontSize: 13, fontWeight: 700, color: '#A0A0A0',
                marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>{m.login.password}</label>
              <PasswordInput required value={password} onChange={e => setPassword(e.target.value)}
                placeholder={m.login.passwordPlaceholder} dir="ltr" style={{
                  width: '100%', height: 52, border: '2px solid #3D3D3D', borderRadius: 8,
                  padding: '14px 16px', backgroundColor: '#1A1A1A', color: '#FFFFFF',
                  fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box',
                  outline: 'none', transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#FFCD11')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#3D3D3D')} />
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading || !partnerId}
              style={{
                height: 52, backgroundColor: loading || !partnerId ? '#FFCD11CC' : '#FFCD11',
                color: '#1A1A1A', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 900,
                fontFamily: 'inherit', cursor: loading || !partnerId ? 'not-allowed' : 'pointer',
                marginTop: 12, transition: 'all 0.2s ease', display: 'flex', alignItems: 'center',
                justifyContent: 'center', textTransform: 'uppercase', letterSpacing: '0.05em',
                boxShadow: loading || !partnerId ? 'none' : '0 4px 12px rgba(255, 205, 17, 0.3)',
              }}
              onMouseDown={(e) => {
                if (!loading && partnerId)
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}>
              {loading ? '🔄 ' + m.login.submitting : m.login.submit}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#A0A0A0', marginTop: 24 }}>
          {m.login.forgotPassword}
        </p>
      </div>
    </main>
  );
}
