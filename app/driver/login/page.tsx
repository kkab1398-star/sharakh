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
      minHeight: '100svh',
      background: '#F4F5F7',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      fontFamily: meta.fontFamily,
    }}>
      <div style={{ width: '90%', maxWidth: 400 }}>

        {/* WHITE CARD - LIGHT THEME */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 24,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          padding: 32,
          border: 'none',
        }}>

          {/* Logo INSIDE Card */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              marginBottom: 16,
              background: '#FFCD11',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              margin: '0 auto 16px',
            }}>
              🚜
            </div>
            <h1 style={{
              fontSize: 22,
              fontWeight: 900,
              color: '#1A1A1A',
              letterSpacing: '-0.5px',
              margin: '0 0 8px',
              fontFamily: meta.fontFamily,
            }}>
              SHARAKH OPS
            </h1>
            <p style={{
              color: '#A0A0A0',
              fontSize: 13,
              margin: 0,
            }}>
              {m.login.subtitle}
            </p>
          </div>

          {/* Language Selector */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            justifyContent: 'center',
            marginBottom: 24,
          }}>
            {(Object.values(LANG_META) as typeof LANG_META[DriverLang][]).map(lm => (
              <button
                key={lm.code}
                onClick={() => setLang(lm.code)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  minHeight: 40,
                  border: lang === lm.code ? '2px solid #FFCD11' : '1px solid #E5E7EB',
                  background: lang === lm.code ? '#FFCD11' : '#F9FAFB',
                  color: lang === lm.code ? '#1A1A1A' : '#6B7280',
                  cursor: 'pointer',
                  fontFamily: lm.fontFamily,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {lm.label}
              </button>
            ))}
          </div>

          {/* Error Alert */}
          {(!partnerId || error) && (
            <div style={{
              marginBottom: 20,
              padding: '10px 14px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #EF4444',
              borderRadius: 12,
              color: '#EF4444',
              fontWeight: 700,
              fontSize: 13,
              textAlign: 'center',
            }}>
              ⚠️ {error || m.login.noLink}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            {/* Username Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 700,
                color: '#1A1A1A',
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                {m.login.username}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder={m.login.usernamePlaceholder}
                dir="ltr"
                style={{
                  width: '100%',
                  height: 56,
                  border: '1px solid #E5E7EB',
                  borderRadius: 12,
                  padding: '0 16px',
                  backgroundColor: '#F9FAFB',
                  color: '#1A1A1A',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'all 200ms ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#FFCD11';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 205, 17, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 700,
                color: '#1A1A1A',
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                {m.login.password}
              </label>
              <PasswordInput
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={m.login.passwordPlaceholder}
                dir="ltr"
                style={{
                  width: '100%',
                  height: 56,
                  border: '1px solid #E5E7EB',
                  borderRadius: 12,
                  padding: '0 16px',
                  backgroundColor: '#F9FAFB',
                  color: '#1A1A1A',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'all 200ms ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#FFCD11';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 205, 17, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !partnerId}
              style={{
                height: 56,
                backgroundColor: loading || !partnerId ? '#FFCD11' : '#FFCD11',
                color: '#1A1A1A',
                border: 'none',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 900,
                fontFamily: 'inherit',
                cursor: loading || !partnerId ? 'not-allowed' : 'pointer',
                marginTop: 8,
                transition: 'all 200ms ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                opacity: loading || !partnerId ? 0.6 : 1,
                boxShadow: '0 2px 8px rgba(255, 205, 17, 0.2)',
              }}
              onMouseDown={(e) => {
                if (!loading && partnerId) {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)';
                }
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              {loading ? '🔄 ' + m.login.submitting : m.login.submit}
            </button>
          </form>

          {/* Forgot Password Link */}
          <p style={{
            textAlign: 'center',
            fontSize: 12,
            color: '#6B7280',
            marginTop: 16,
            margin: 0,
          }}>
            {m.login.forgotPassword}
          </p>
        </div>

      </div>
    </main>
  );
}
