"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PasswordInput from "@/components/PasswordInput";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // جلب بيانات الشريك
    fetch("/api/partners/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.partner?.is_first_login === false) {
          router.push("/dashboard");
          return;
        }
        setCompanyName(d.partner?.company_name || "");
      });
  }, [router]);

  const validatePassword = (pwd: string): string => {
    if (!pwd) return "كلمة المرور مطلوبة";
    if (pwd.length < 8) return "يجب أن تكون 8 أحرف على الأقل";
    if (!/[A-Z]/.test(pwd)) return "يجب أن تحتوي على حرف كبير";
    if (!/\d/.test(pwd)) return "يجب أن تحتوي على رقم";
    return "";
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPasswordError("");

    // التحقق من كلمة المرور
    const pwdError = validatePassword(password);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }

    // التحقق من تطابق كلمات المرور
    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);

    try {
      // تحديث كلمة المرور في Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message || "فشل تحديث كلمة المرور");
        setLoading(false);
        return;
      }

      // تحديث is_first_login في قاعدة البيانات
      const res = await fetch("/api/partners/me/first-login", {
        method: "POST",
      });

      if (!res.ok) {
        setError("فشل التحديث في قاعدة البيانات");
        setLoading(false);
        return;
      }

      // نجح - توجيه للـ dashboard
      router.push("/dashboard");
    } catch (err) {
      setError("خطأ في الخادم");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return <div />;

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-gray-50 p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        {/* رسالة الترحيب */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-yellow-500 mb-2">🎉</h1>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            مرحباً بك في {companyName || "شراكة"}
          </h2>
          <p className="text-gray-600 text-sm">
            قبل البدء، يجب عليك تغيير كلمة المرور
          </p>
        </div>

        {/* تحذير */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p style={{ fontSize: 13, color: "#1e40af", margin: 0 }}>
            <strong>ℹ️ متطلبات كلمة المرور:</strong>
            <br />✓ 8 أحرف على الأقل
            <br />✓ حرف كبير واحد على الأقل
            <br />✓ رقم واحد على الأقل
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              كلمة المرور الجديدة
            </label>
            <PasswordInput
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) {
                  setPasswordError(validatePassword(e.target.value));
                }
              }}
              placeholder="كلمة قوية"
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
            {passwordError && (
              <p style={{ fontSize: 12, color: "#dc2626", marginTop: 6 }}>
                {passwordError}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              تأكيد كلمة المرور
            </label>
            <PasswordInput
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="أعد إدخال كلمة المرور"
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
            disabled={loading || !password || !confirmPassword}
            className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
            style={{
              minHeight: "52px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? "جاري الحفظ..." : "✓ حفظ وبدء الاستخدام"}
          </button>
        </form>
      </div>
    </main>
  );
}
