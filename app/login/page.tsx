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
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("بريد إلكتروني أو كلمة مرور غير صحيحة.");
      setLoading(false);
      return;
    }

    // تحقق من is_first_login
    try {
      const res = await fetch("/api/partners/me");
      const data = await res.json();

      if (data.partner?.is_first_login === true) {
        router.push("/change-password");
      } else {
        router.push("/dashboard");
      }
    } catch {
      router.push("/dashboard");
    }
  };

  return (
    <main dir="rtl" style={{ minHeight: '100vh', background: 'var(--cat-black)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Cairo','Barlow Condensed',sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, background: 'var(--cat-yellow)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🚜</div>
            <span style={{ fontSize: 36, fontWeight: 900, color: 'var(--cat-yellow)', fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '-0.5px' }}>SHARAKH</span>
          </div>
          <p style={{ color: '#888', fontSize: 13, margin: 0 }}>منصة إدارة المعدات الثقيلة</p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--cat-dark-gray)', borderRadius: 4, border: '2px solid var(--cat-yellow)', padding: 32, boxShadow: '6px 6px 0px var(--cat-black)' }}>
          <h2 style={{ color: 'var(--cat-white)', fontWeight: 900, fontSize: 20, margin: '0 0 24px' }}>تسجيل دخول المالك</h2>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '2px solid var(--cat-red)', borderRadius: 4, padding: '10px 14px', marginBottom: 20, color: 'var(--cat-red)', fontWeight: 700, fontSize: 13, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="cat-label">البريد الإلكتروني</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" dir="ltr" className="cat-input" />
            </div>
            <div>
              <label className="cat-label">كلمة المرور</label>
              <PasswordInput value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" dir="ltr" className="cat-input" required />
            </div>
            <button type="submit" disabled={loading} className="cat-btn cat-btn-primary" style={{ marginTop: 8, width: '100%' }}>
              {loading ? "جاري التحقق..." : "دخول ←"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#555', marginTop: 20 }}>
          ليس لديك حساب؟{" "}
          <a href="/register" style={{ color: 'var(--cat-yellow)', fontWeight: 700, textDecoration: 'none' }}>سجّل الآن</a>
        </p>
      </div>
    </main>
  );
}
