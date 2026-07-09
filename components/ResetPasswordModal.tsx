"use client";

import { useState } from "react";

interface ResetPasswordModalProps {
  isOpen: boolean;
  driverId: string;
  driverName: string;
  onClose: () => void;
  onSuccess: (newPassword: string) => void;
}

export default function ResetPasswordModal({
  isOpen,
  driverId,
  driverName,
  onClose,
  onSuccess,
}: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/drivers/${driverId}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "فشل تحديث كلمة المرور");
        setLoading(false);
        return;
      }

      onSuccess(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswords(false);
    } catch (err) {
      setError("خطأ في الاتصال");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setShowPasswords(false);
    onClose();
  };

  const inp =
    "w-full border border-[#3D3D3D] rounded-lg px-3 py-2.5 text-[#FFFFFF] text-sm focus:outline-none focus:ring-2 focus:ring-[#FFCD11] placeholder-[#A0A0A0] bg-[#1A1A1A]";

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
      onClick={handleClose}
    >
      <div
        style={{
          background: "#1A1A1A",
          border: "2px solid #FFCD11",
          borderRadius: "8px",
          padding: "28px 24px",
          maxWidth: "450px",
          width: "100%",
          position: "relative",
          direction: "rtl",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* زر الإغلاق */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "transparent",
            border: "none",
            color: "#A0A0A0",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        {/* رأس الـ modal */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 900, color: "#FFFFFF", margin: 0 }}>
            إعادة تعيين كلمة المرور
          </h2>
          <p style={{ fontSize: "13px", color: "#A0A0A0", margin: "4px 0 0" }}>
            للسائق: {driverName}
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px 12px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid #ef4444",
              borderRadius: "6px",
              color: "#ef4444",
              fontSize: "12px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* كلمة المرور الجديدة */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "#A0A0A0", display: "block", marginBottom: "4px" }}>
              كلمة المرور الجديدة *
            </label>
            <div style={{ position: "relative" }}>
              <input
                required
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="6 أحرف على الأقل"
                className={inp}
                style={{ paddingLeft: "36px" }}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                style={{
                  position: "absolute",
                  left: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "#A0A0A0",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                {showPasswords ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* تأكيد كلمة المرور */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "#A0A0A0", display: "block", marginBottom: "4px" }}>
              تأكيد كلمة المرور *
            </label>
            <input
              required
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="أعد إدخال كلمة المرور"
              className={inp}
            />
          </div>

          {/* الأزرار */}
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                flex: 1,
                padding: "10px 16px",
                background: "#3D3D3D",
                color: "#A0A0A0",
                border: "none",
                borderRadius: "6px",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              style={{
                flex: 1,
                padding: "10px 16px",
                background: "#FFCD11",
                color: "#1A1A1A",
                border: "none",
                borderRadius: "6px",
                fontWeight: 900,
                fontSize: "12px",
                cursor: "pointer",
                opacity: loading || !newPassword || !confirmPassword ? 0.5 : 1,
              }}
            >
              {loading ? "جاري..." : "تحديث"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
