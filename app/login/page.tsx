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
    <main
      dir="rtl"
      className="min-h-screen bg-[#F4F5F7] flex flex-col items-center justify-center p-4 font-cairo"
    >
      <div className="w-full max-w-[400px]">
        {/* WHITE CARD - LIGHT THEME */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-0">

          {/* LOGO INSIDE CARD */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#FFCD11] rounded-lg flex items-center justify-center text-2xl">
                🚜
              </div>
              <span className="text-3xl font-black text-[#1A1A1A] -tracking-[0.5px] font-barlow">
                SHARAKH
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              منصة إدارة المعدات الثقيلة
            </p>
          </div>

          {/* TITLE */}
          <h2 className="text-[#1A1A1A] font-black text-lg mb-6 text-right">
            تسجيل دخول المالك
          </h2>

          {/* ERROR ALERT */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-300 rounded-xl text-red-600 font-bold text-sm text-center">
              ⚠️ {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* EMAIL */}
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                dir="ltr"
                className="w-full h-14 px-4 bg-gray-50 border border-gray-300 rounded-xl text-[#1A1A1A] placeholder-gray-400 focus:bg-white focus:border-[#FFCD11] focus:ring-2 focus:ring-[#FFCD11]/20 outline-none transition-all"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2">
                كلمة المرور
              </label>
              <PasswordInput
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                required
                className="w-full h-14 px-4 bg-gray-50 border border-gray-300 rounded-xl text-[#1A1A1A] placeholder-gray-400 focus:bg-white focus:border-[#FFCD11] focus:ring-2 focus:ring-[#FFCD11]/20 outline-none transition-all"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#FFCD11] text-[#1A1A1A] font-black rounded-xl uppercase tracking-wider hover:bg-yellow-500 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-2"
            >
              {loading ? "جاري التحقق..." : "دخول ←"}
            </button>
          </form>

          {/* SIGN UP LINK */}
          <p className="text-center text-xs text-gray-500 mt-6">
            ليس لديك حساب؟{" "}
            <a href="/register" className="text-[#FFCD11] font-bold hover:opacity-80 transition-opacity">
              سجّل الآن
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
