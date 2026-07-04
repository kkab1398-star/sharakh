"use client";

import { useState } from "react";

interface ShareDriverModalProps {
  isOpen: boolean;
  driver: {
    full_name: string;
    username: string;
    password: string;
    phone?: string;
  } | null;
  partnerSlug?: string | null;
  onClose: () => void;
}

export default function ShareDriverModal({
  isOpen,
  driver,
  partnerSlug,
  onClose,
}: ShareDriverModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !driver) return null;

  // بناء رابط الدخول
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sharakh.vercel.app";
  const loginLink = partnerSlug
    ? `${appUrl}/login/${partnerSlug}`
    : `${appUrl}/driver/login`;

  // بناء رسالة الواتساب
  const whatsappMessage = `مرحباً ${driver.full_name} 👋

تم تسجيلك في نظام شراكة لإدارة المعدات

🔗 رابط دخولك:
${loginLink}

👤 اسم المستخدم:
${driver.username}

🔑 كلمة المرور:
${driver.password}

⚠️ احتفظ بهذه البيانات ولا تشاركها مع أحد`;

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!driver.phone) {
      alert("لا يوجد رقم جوال - انسخ الرسالة وأرسلها يدوياً");
      return;
    }

    let phoneNumber = driver.phone.replace(/\D/g, "");
    if (!phoneNumber.startsWith("966") && phoneNumber.startsWith("5")) {
      phoneNumber = "966" + phoneNumber.substring(1);
    }
    if (!phoneNumber.startsWith("966")) {
      phoneNumber = "966" + phoneNumber;
    }

    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#1A1A1A",
          border: "2px solid #FFCD11",
          borderRadius: "8px",
          padding: "32px 28px",
          maxWidth: "500px",
          width: "100%",
          position: "relative",
          direction: "rtl",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: "transparent",
            border: "none",
            color: "#A0A0A0",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        {/* رسالة النجاح */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>✅</div>
          <h2 style={{ fontSize: "18px", fontWeight: 900, color: "#22c55e", margin: 0 }}>
            تم إضافة السائق بنجاح
          </h2>
          <p style={{ fontSize: "13px", color: "#A0A0A0", margin: "6px 0 0" }}>
            {driver.full_name}
          </p>
        </div>

        {/* بطاقة الرسالة */}
        <div
          style={{
            background: "#2A2A2A",
            border: "1px solid #3D3D3D",
            borderRadius: "6px",
            padding: "16px",
            marginBottom: "20px",
            fontSize: "12px",
            lineHeight: "1.6",
            color: "#A0A0A0",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {whatsappMessage}
        </div>

        {/* الأزرار */}
        <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
          {driver.phone && (
            <button
              onClick={handleWhatsApp}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#25D366",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: 900,
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              💬 فتح واتساب
            </button>
          )}

          <button
            onClick={handleCopy}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "transparent",
              color: "#FFCD11",
              border: "1px solid #FFCD11",
              borderRadius: "6px",
              fontWeight: 900,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            {copied ? "✓ تم النسخ" : "📋 نسخ الرسالة"}
          </button>

          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "#3D3D3D",
              color: "#A0A0A0",
              border: "none",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
