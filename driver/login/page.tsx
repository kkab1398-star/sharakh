"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function DriverLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // محاكاة سريعة لتسجيل الدخول (سيتم ربطها بـ Supabase لاحقاً)
    setTimeout(() => {
      if (username === "ahmed" && password === "123456") {
        // إذا نجح الدخول، يتم توجيهه إلى شاشة العمليات
        router.push("/driver");
      } else {
        setError("بيانات الدخول غير صحيحة، يرجى مراجعة مالك المعدة.");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col justify-center p-6 dir-rtl font-sans text-white">
      <div className="w-full max-w-sm mx-auto">
        
        {/* الترويسة والشعار الافتراضي */}
        <div className="text-center mb-10">
          <div className="bg-blue-600 text-white w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
            <span className="text-3xl">🚜</span>
          </div>
          <h1 className="text-2xl font-black text-gray-100">بوابة السائقين</h1>
          <p className="text-gray-400 text-sm mt-2">منصة شراكة لإدارة العمليات اليومية</p>
        </div>

        {/* نموذج تسجيل الدخول */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
          
          {error && (
            <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">اسم المستخدم</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                className="w-full bg-gray-900 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
                dir="ltr"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">كلمة المرور</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-900 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
                dir="ltr"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 transition duration-300 disabled:opacity-50 mt-4 shadow-lg shadow-blue-900/50"
            >
              {loading ? "جاري التحقق..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          إذا نسيت بيانات الدخول، تواصل مع إدارة الحركة أو المالك.
        </p>
      </div>
    </main>
  );
}