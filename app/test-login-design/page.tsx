"use client";

import { useState } from "react";
import PasswordInput from "@/components/PasswordInput";

export default function TestLoginDesign() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#1A1A1A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'Cairo', 'Barlow Condensed', sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* لوغو الشركة */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              marginBottom: "16px",
              background: "#FFCD11",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              margin: "0 auto 16px",
            }}
          >
            🚜
          </div>

          {/* اسم الشركة */}
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 900,
              color: "#FFCD11",
              margin: "0 0 8px",
              letterSpacing: "-0.5px",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            شارك للمعدات
          </h1>
          <p style={{ fontSize: "13px", color: "#A0A0A0", margin: 0 }}>
            تسجيل دخول الشركاء
          </p>
        </div>

        {/* البطاقة الرئيسية */}
        <div
          style={{
            background: "#2A2A2A",
            borderRadius: "16px",
            padding: "32px 24px",
            border: "2px solid #3D3D3D",
          }}
        >
          {error && (
            <div
              style={{
                marginBottom: "20px",
                padding: "10px 14px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "2px solid #ef4444",
                borderRadius: "8px",
                color: "#ef4444",
                fontWeight: 700,
                fontSize: "13px",
                textAlign: "center",
              }}
            >
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* البريد الإلكتروني */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#A0A0A0",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                البريد الإلكتروني
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                dir="ltr"
                style={{
                  width: "100%",
                  height: "52px",
                  border: "2px solid #3D3D3D",
                  borderRadius: "8px",
                  padding: "14px 16px",
                  backgroundColor: "#1A1A1A",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#FFCD11";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#3D3D3D";
                }}
              />
            </div>

            {/* حقل كلمة المرور */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#A0A0A0",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                كلمة المرور
              </label>
              <PasswordInput
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                style={{
                  width: "100%",
                  height: "52px",
                  border: "2px solid #3D3D3D",
                  borderRadius: "8px",
                  padding: "14px 16px",
                  backgroundColor: "#1A1A1A",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "#FFCD11";
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "#3D3D3D";
                }}
              />
            </div>

            {/* زر الدخول */}
            <button
              type="submit"
              disabled={loading}
              style={{
                height: "52px",
                backgroundColor: loading ? "#FFCD11CC" : "#FFCD11",
                color: "#1A1A1A",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 900,
                fontFamily: "inherit",
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: "12px",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                boxShadow: loading
                  ? "none"
                  : "0 4px 12px rgba(255, 205, 17, 0.3)",
              }}
              onMouseDown={(e) => {
                if (!loading)
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(0.98)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1)";
              }}
            >
              {loading ? "🔄 جاري الدخول..." : "دخول"}
            </button>
          </form>

          {/* رابط نسيان كلمة المرور */}
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <a
              href="#"
              style={{
                fontSize: "12px",
                color: "#A0A0A0",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#FFCD11";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#A0A0A0";
              }}
            >
              نسيت كلمة المرور؟
            </a>
          </div>
        </div>

        {/* رابط التسجيل الجديد */}
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#A0A0A0",
            marginTop: "24px",
          }}
        >
          ليس لديك حساب؟{" "}
          <a
            href="/register"
            style={{
              color: "#FFCD11",
              fontWeight: 700,
              textDecoration: "none",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = "0.8";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
            }}
          >
            إنشاء حساب
          </a>
        </p>
      </div>
    </main>
  );
}
