"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDriverLang } from '@/contexts/DriverLangContext';
import { LANG_META, type DriverLang } from '@/lib/driver-i18n';

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
      minHeight: '100svh', background: 'var(--cat-black)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: meta.fontFamily,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚜</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--cat-yellow)', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, letterSpacing: '-0.5px', margin: '0 0 6px' }}>
            SHARAKH OPS
          </h1>
          <div style={{ width: 48, height: 3, background: 'var(--cat-yellow)', margin: '0 auto 8px' }} />
          <p style={{ color: 'var(--cat-muted)', fontSize: 12, margin: 0 }}>{m.login.subtitle}</p>
        </div>

        {/* Language Selector */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 28 }}>
          {(Object.values(LANG_META) as typeof LANG_META[DriverLang][]).map(lm => (
            <button key={lm.code} onClick={() => setLang(lm.code)} style={{
              padding: '4px 12px', borderRadius: 0, fontSize: 12, fontWeight: 700,
              border: lang === lm.code ? '2px solid var(--cat-yellow)' : '1px solid var(--cat-mid)',
              background: lang === lm.code ? 'var(--cat-yellow)' : 'transparent',
              color: lang === lm.code ? 'var(--cat-black)' : 'var(--cat-muted)',
              cursor: 'pointer', fontFamily: lm.fontFamily, transition: 'all 0.15s',
            }}>
              {lm.label}
            </button>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: 'var(--cat-gray)', border: '1px solid var(--cat-mid)', borderTop: '3px solid var(--cat-yellow)', borderRadius: 2, padding: 28 }}>
          {!partnerId && (
            <div className="cat-alert-error" style={{ marginBottom: 20 }}>⚠️ {m.login.noLink}</div>
          )}
          {error && (
            <div className="cat-alert-error" style={{ marginBottom: 20 }}>{error}</div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="cat-label">{m.login.username}</label>
              <input type="text" required value={username} onChange={e => setUsername(e.target.value)}
                placeholder={m.login.usernamePlaceholder} dir="ltr" className="cat-input" />
            </div>
            <div>
              <label className="cat-label">{m.login.password}</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder={m.login.passwordPlaceholder} dir="ltr" className="cat-input" />
            </div>
            <button type="submit" disabled={loading || !partnerId}
              className="cat-btn cat-btn-primary cat-btn-full" style={{ marginTop: 8 }}>
              {loading ? m.login.submitting : m.login.submit}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--cat-muted)', marginTop: 20 }}>
          {m.login.forgotPassword}
        </p>
      </div>
    </main>
  );
}
