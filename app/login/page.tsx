'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

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
    <div style={{
      minHeight: '100vh',
      background: '#1A1A1A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
      fontFamily: "'Cairo', 'Segoe UI', sans-serif",
      direction: 'rtl',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        input::placeholder {
          color: #6B6B6B;
        }
      `}</style>

      <div style={{ width: '100%', maxWidth: 380 }}>

        {/* === الشعار === */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64,
            height: 64,
            background: '#FFCD11',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            margin: '0 auto 12px',
            flexShrink: 0,
          }}>
            🏗️
          </div>
          <div style={{
            fontSize: 28,
            fontWeight: 900,
            color: '#FFCD11',
            marginBottom: 4,
            letterSpacing: '-0.5px',
          }}>
            شراكة
          </div>
          <div style={{
            fontSize: 13,
            color: '#A0A0A0',
            lineHeight: 1.5,
          }}>
            نظام إدارة المعدات والشراكات
          </div>
        </div>

        {/* === اختيار الدور === */}
        <div style={{ marginBottom: role ? 24 : 32 }}>
          <div style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#A0A0A0',
            textAlign: 'center',
            marginBottom: 12,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            اختر نوع حسابك
          </div>

          <div style={{
            display: 'flex',
            gap: 12,
          }}>
            {/* بطاقة المالك */}
            <button
              type="button"
              onClick={() => {
                setRole('partner');
                setError('');
              }}
              style={{
                flex: 1,
                height: 90,
                borderRadius: 12,
                border: role === 'partner' ? '2px solid #FFCD11' : '2px solid #3D3D3D',
                background: role === 'partner' ? 'rgba(255,205,17,0.08)' : '#2A2A2A',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: role === 'partner' ? 'scale(1.02)' : 'scale(1)',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                if (role !== 'partner') {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#555555';
                }
              }}
              onMouseLeave={(e) => {
                if (role !== 'partner') {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#3D3D3D';
                }
              }}
            >
              <span style={{ fontSize: 28 }}>👔</span>
              <div>
                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: role === 'partner' ? '#FFCD11' : '#A0A0A0',
                  textAlign: 'center',
                }}>
                  مالك
                </div>
                <div style={{
                  fontSize: 11,
                  color: role === 'partner' ? '#FFCD11' : '#6B6B6B',
                  textAlign: 'center',
                }}>
                  شريك
                </div>
              </div>
            </button>

            {/* بطاقة السائق */}
            <button
              type="button"
              onClick={() => {
                setRole('driver');
                setError('');
              }}
              style={{
                flex: 1,
                height: 90,
                borderRadius: 12,
                border: role === 'driver' ? '2px solid #FFCD11' : '2px solid #3D3D3D',
                background: role === 'driver' ? 'rgba(255,205,17,0.08)' : '#2A2A2A',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: role === 'driver' ? 'scale(1.02)' : 'scale(1)',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                if (role !== 'driver') {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#555555';
                }
              }}
              onMouseLeave={(e) => {
                if (role !== 'driver') {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#3D3D3D';
                }
              }}
            >
              <span style={{ fontSize: 28 }}>🚜</span>
              <div>
                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: role === 'driver' ? '#FFCD11' : '#A0A0A0',
                  textAlign: 'center',
                }}>
                  سائق
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* === النموذج === */}
        {role && (
          <form
            onSubmit={handleLogin}
            style={{
              animation: 'fadeIn 0.3s ease',
            }}
          >
            {/* رسالة الخطأ */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444',
                borderRadius: 8,
                padding: '12px 16px',
                fontSize: 13,
                marginBottom: 16,
                textAlign: 'center',
                fontWeight: 600,
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* حقول المالك */}
            {role === 'partner' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#A0A0A0',
                  marginBottom: 6,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}>
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  dir="ltr"
                  required
                  style={{
                    width: '100%',
                    height: 52,
                    borderRadius: 10,
                    border: '1.5px solid #3D3D3D',
                    background: '#2A2A2A',
                    color: '#FFFFFF',
                    fontSize: 15,
                    padding: '0 16px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    fontFamily: "inherit",
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = '#FFCD11';
                    (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(255,205,17,0.1)';
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = '#3D3D3D';
                    (e.target as HTMLInputElement).style.boxShadow = 'none';
                  }}
                />
              </div>
            )}

            {/* حقول السائق */}
            {role === 'driver' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#A0A0A0',
                  marginBottom: 6,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}>
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  dir="ltr"
                  required
                  style={{
                    width: '100%',
                    height: 52,
                    borderRadius: 10,
                    border: '1.5px solid #3D3D3D',
                    background: '#2A2A2A',
                    color: '#FFFFFF',
                    fontSize: 15,
                    padding: '0 16px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    fontFamily: "inherit",
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = '#FFCD11';
                    (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(255,205,17,0.1)';
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = '#3D3D3D';
                    (e.target as HTMLInputElement).style.boxShadow = 'none';
                  }}
                />
              </div>
            )}

            {/* كلمة المرور */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#A0A0A0',
                marginBottom: 6,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}>
                كلمة المرور
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin(e as any)}
                  placeholder="••••••••"
                  required
                  style={{
                    flex: 1,
                    height: 52,
                    borderRadius: 10,
                    border: '1.5px solid #3D3D3D',
                    background: '#2A2A2A',
                    color: '#FFFFFF',
                    fontSize: 15,
                    padding: '0 16px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    fontFamily: "inherit",
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = '#FFCD11';
                    (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(255,205,17,0.1)';
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = '#3D3D3D';
                    (e.target as HTMLInputElement).style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 20,
                    color: showPassword ? '#FFCD11' : '#A0A0A0',
                    padding: '8px',
                    flexShrink: 0,
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = '#FFCD11';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = showPassword ? '#FFCD11' : '#A0A0A0';
                  }}
                >
                  {showPassword ? '👁️' : '👁‍🗨️'}
                </button>
              </div>
            </div>

            {/* زر الدخول */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: 52,
                borderRadius: 10,
                background: loading ? '#888888' : '#FFCD11',
                color: '#1A1A1A',
                fontSize: 16,
                fontWeight: 900,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "inherit",
                transition: 'opacity 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
              onMouseDown={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
                }
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = '1';
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 18,
                    height: 18,
                    border: '2px solid #1A1A1A',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}/>
                  <span>جاري الدخول...</span>
                </>
              ) : (
                <>
                  {role === 'partner' ? '👔' : '🚜'}
                  <span>{role === 'partner' ? 'دخول كمالك' : 'دخول كسائق'}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
