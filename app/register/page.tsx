"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/partner/register", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password, company_name: companyName }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "حدث خطأ في التسجيل");
      setLoading(false);
      return;
    }

    // تسجيل دخول تلقائي بعد التسجيل
    const loginRes = await fetch("/api/auth/partner/login", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password }),
    });

    if (loginRes.ok) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-lg p-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-blue-600">شراكة</h1>
          <p className="text-gray-500 text-sm mt-1">إنشاء حساب جديد</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">اسم الشركة أو المؤسسة *</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              placeholder="شركة النقل الذهبي"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              dir="ltr"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور *</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="8 أحرف على الأقل"
              dir="ltr"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          لديك حساب؟{" "}
          <a href="/login" className="text-blue-600 font-bold hover:underline">سجّل دخولك</a>
        </p>
      </div>
    </main>
  );
}
