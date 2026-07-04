"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/PasswordInput";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "فشل تسجيل الدخول");
        return;
      }

      // توجيه مباشر إلى لوحة السوبر أدمن
      router.push("/x7k9-panel-2024");
    } catch (err) {
      setError("خطأ في الخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-yellow-500">ADMIN</h1>
          <p className="text-gray-500 text-sm mt-1">لوحة السوبر أدمن</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="super@sharakh.app"
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور</label>
            <PasswordInput
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              style={{
                width: '100%',
                border: '1px solid rgb(209, 213, 219)',
                borderRadius: '0.5rem',
                padding: '12px 12px',
                fontSize: '0.875rem',
                color: 'rgb(17, 24, 39)',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
          >
            {loading ? "جاري الدخول..." : "دخول →"}
          </button>
        </form>
      </div>
    </main>
  );
}
