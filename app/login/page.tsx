"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PasswordInput from "@/components/PasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: authError, data } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (authError) {
        console.error('Auth error:', authError);
        setError(authError.message || "فشل تسجيل الدخول. تحقق من بيانات الدخول.");
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("فشل تسجيل الدخول");
        setLoading(false);
        return;
      }

      // تحقق من is_first_login
      try {
        const res = await fetch("/api/partners/me");
        if (!res.ok) throw new Error('Failed to fetch partner data');

        const partnerData = await res.json();

        if (partnerData.partner?.is_first_login === true) {
          await new Promise(r => setTimeout(r, 300));
          router.push("/change-password");
        } else {
          await new Promise(r => setTimeout(r, 300));
          router.push("/dashboard");
        }
      } catch (err) {
        console.error('Partner fetch error:', err);
        await new Promise(r => setTimeout(r, 300));
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || "حدث خطأ في الخادم");
      setLoading(false);
    }
  };

  return (
    <main dir="rtl" style={{
      minHeight: '100svh',
      background: '#F4F5F7',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      fontFamily: "'Cairo','Barlow Condensed',sans-serif",
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{
                width: 48,
                height: 48,
                background: '#FFCD11',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
              }}>
                🚜
              </div>
              <span style={{
                fontSize: 32,
                fontWeight: 900,
                color: '#1A1A1A',
                fontFamily: "'Barlow Condensed',sans-serif",
                letterSpacing: '-0.5px',
              }}>
                SHARAKH
              </span>
            </div>
            <p style={{
              color: '#6B7280',
              fontSize: 13,
              margin: 0,
            }}>
              منصة إدارة المعدات الثقيلة
            </p>
          </div>

          {/* Title */}
          <h2 style={{
            color: '#1A1A1A',
            fontWeight: 900,
            fontSize: 18,
            margin: '24px 0 20px',
            textAlign: 'right',
          }}>
            تسجيل دخول المالك
          </h2>

          {/* Error Alert */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #EF4444',
              borderRadius: 12,
              padding: '10px 14px',
              marginBottom: 20,
              color: '#EF4444',
              fontWeight: 700,
              fontSize: 13,
              textAlign: 'center',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            {/* Email Field */}
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
                البريد الإلكتروني
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
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
                كلمة المرور
              </label>
              <PasswordInput
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                required
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
              disabled={loading}
              style={{
                height: 56,
                backgroundColor: '#FFCD11',
                color: '#1A1A1A',
                border: 'none',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 900,
                fontFamily: 'inherit',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 8,
                transition: 'all 200ms ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                opacity: loading ? 0.6 : 1,
                boxShadow: '0 2px 8px rgba(255, 205, 17, 0.2)',
              }}
              onMouseDown={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)';
                }
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              {loading ? "جاري التحقق..." : "دخول ←"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p style={{
            textAlign: 'center',
            fontSize: 12,
            color: '#6B7280',
            marginTop: 16,
            margin: 0,
          }}>
            ليس لديك حساب؟{" "}
            <a href="/register" style={{
              color: '#FFCD11',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'opacity 200ms ease',
            }}>
              سجّل الآن
            </a>
          </p>
        </div>

      </div>
    </main>
  );
}
