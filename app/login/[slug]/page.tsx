"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/PasswordInput";

export default function PartnerLoginBySlugPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [partnerData, setPartnerData] = useState<any>(null);

  // جلب بيانات الشريك من slug
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    const fetchPartner = async () => {
      try {
        const res = await fetch(`/api/partners/by-slug/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setPartnerData(data.partner);
        } else {
          // إعادة توجيه إلى /login إذا كان slug غير موجود
          setTimeout(() => router.push("/login"), 2000);
        }
      } catch (err) {
        console.error("Error fetching partner:", err);
        setTimeout(() => router.push("/login"), 2000);
      }
    };

    fetchPartner();
  }, [params.slug, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/partner/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "فشل تسجيل الدخول");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("خطأ في الخادم");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !partnerData) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-gray-50 p-4"
        dir="rtl"
      >
        <div className="text-center">
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-gray-50 p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        {/* لوغو الشركة */}
        {partnerData.logo_url && (
          <div className="text-center mb-6">
            <img
              src={partnerData.logo_url}
              alt={partnerData.company_name}
              className="h-16 mx-auto"
            />
          </div>
        )}

        {/* اسم الشركة */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-black mb-2"
            style={{ color: partnerData.theme_color || "#FFCD11" }}
          >
            {partnerData.company_name}
          </h1>
          <p className="text-gray-500 text-sm">تسجيل دخول الشركاء</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@example.com"
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 text-sm focus:outline-none focus:ring-2"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              كلمة المرور
            </label>
            <PasswordInput
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="كلمة المرور"
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 text-sm focus:outline-none focus:ring-2"
              style={{
                width: "100%",
                border: "1px solid rgb(209, 213, 219)",
                borderRadius: "0.5rem",
                padding: "12px 12px",
                fontSize: "0.875rem",
                color: "rgb(17, 24, 39)",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-black font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            style={{
              backgroundColor: partnerData.theme_color || "#FFCD11",
              minHeight: "52px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          ليس لديك حساب؟{" "}
          <a
            href="/register"
            className="font-bold hover:underline"
            style={{ color: partnerData.theme_color || "#FFCD11" }}
          >
            إنشاء حساب
          </a>
        </p>
      </div>
    </main>
  );
}
