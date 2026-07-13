"use client";

import { useState } from "react";

export default function TestDriverDesign() {
  const [showForm, setShowForm] = useState(false);
  const currency = "SAR";
  const sym = "﷼";

  return (
    <div
      style={{
        fontFamily: "'Cairo', 'Barlow Condensed', sans-serif",
        background: "#1A1A1A",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ═══════════════════════════════════════
          HEADER
      ═══════════════════════════════════════ */}
      <header
        style={{
          background: "#111111",
          borderBottom: "3px solid #FFCD11",
          padding: "12px 16px",
          position: "sticky",
          top: 0,
          zIndex: 20,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 8,
          height: "60px",
        }}
      >
        {/* LEFT: avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#FFCD11",
              color: "#1A1A1A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            أ
          </div>
          <p
            style={{
              fontSize: 14,
              fontWeight: 900,
              color: "#FFFFFF",
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: "-0.3px",
            }}
          >
            أحمد السائق
          </p>
        </div>

        {/* CENTER: company name */}
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#FFCD11",
            textShadow: "none",
            margin: 0,
            textAlign: "center",
            whiteSpace: "nowrap",
            letterSpacing: "0.02em",
          }}
        >
          شارك
        </p>

        {/* RIGHT: icons */}
        <div
          style={{
            display: "flex",
            gap: 6,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <button
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#FFFFFF",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 0,
              padding: "4px 8px",
              cursor: "pointer",
              fontFamily: "inherit",
              lineHeight: 1,
            }}
          >
            خروج
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          maxWidth: 430,
          margin: "0 auto",
          paddingBottom: 100,
          width: "100%",
          overflowY: "auto",
        }}
      >
        {/* CURRENT CYCLE CARD */}
        <div
          style={{
            margin: "16px 16px 0",
            background: "#2A2A2A",
            borderRight: "4px solid #FFCD11",
            borderRadius: 4,
            padding: 16,
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#FFCD11",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: "0 0 6px",
            }}
          >
            الدورة الحالية
          </p>
          <p
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: "#FFFFFF",
              margin: "0 0 4px",
              letterSpacing: "-0.3px",
            }}
          >
            دورة اليوم
          </p>
          <p style={{ fontSize: 13, color: "#A0A0A0", margin: 0 }}>
            🚜 معدات الحفر
          </p>
        </div>

        {/* 4 STAT CARDS (2x2 grid) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            margin: "12px 16px 0",
          }}
        >
          {/* Income */}
          <div
            style={{
              background: "#2A2A2A",
              borderRadius: 4,
              borderTop: "3px solid #FFCD11",
              padding: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#A0A0A0",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: 0,
                }}
              >
                الدخل
              </p>
              <span
                style={{
                  fontSize: 18,
                  color: "#FFCD11",
                  fontWeight: 900,
                }}
              >
                ↑
              </span>
            </div>
            <p
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#FFCD11",
                margin: 0,
                fontFamily: "'Barlow Condensed', inherit",
                letterSpacing: "-0.5px",
              }}
              dir="ltr"
            >
              7,300
            </p>
            <p style={{ fontSize: 10, color: "#A0A0A0", margin: "2px 0 0" }}>
              {sym}
            </p>
          </div>

          {/* Expenses */}
          <div
            style={{
              background: "#2A2A2A",
              borderRadius: 4,
              borderTop: "3px solid #ef4444",
              padding: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#A0A0A0",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: 0,
                }}
              >
                المصاريف
              </p>
              <span style={{ fontSize: 18, color: "#ef4444", fontWeight: 900 }}>
                ↓
              </span>
            </div>
            <p
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#FFFFFF",
                margin: 0,
                fontFamily: "'Barlow Condensed', inherit",
                letterSpacing: "-0.5px",
              }}
              dir="ltr"
            >
              150
            </p>
            <p style={{ fontSize: 10, color: "#A0A0A0", margin: "2px 0 0" }}>
              {sym}
            </p>
          </div>

          {/* Advances */}
          <div
            style={{
              background: "#2A2A2A",
              borderRadius: 4,
              borderTop: "3px solid #3b82f6",
              padding: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#A0A0A0",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: 0,
                }}
              >
                السلف
              </p>
              <span style={{ fontSize: 18, color: "#3b82f6", fontWeight: 900 }}>
                ⟳
              </span>
            </div>
            <p
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#FFFFFF",
                margin: 0,
                fontFamily: "'Barlow Condensed', inherit",
                letterSpacing: "-0.5px",
              }}
              dir="ltr"
            >
              0
            </p>
            <p style={{ fontSize: 10, color: "#A0A0A0", margin: "2px 0 0" }}>
              {sym}
            </p>
          </div>

          {/* Net */}
          <div
            style={{
              background: "#2A2A2A",
              borderRadius: 4,
              borderTop: "3px solid #22c55e",
              padding: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#A0A0A0",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: 0,
                }}
              >
                الصافي
              </p>
              <span style={{ fontSize: 18, color: "#22c55e", fontWeight: 900 }}>
                =
              </span>
            </div>
            <p
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#22c55e",
                margin: 0,
                fontFamily: "'Barlow Condensed', inherit",
                letterSpacing: "-0.5px",
              }}
              dir="ltr"
            >
              7,150
            </p>
            <p style={{ fontSize: 10, color: "#A0A0A0", margin: "2px 0 0" }}>
              {sym}
            </p>
          </div>
        </div>

        {/* RECENT TRANSACTIONS */}
        <div style={{ margin: "16px 16px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 900,
                color: "#FFFFFF",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              آخر المعاملات
            </p>
            <a
              href="#"
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#FFCD11",
                textDecoration: "none",
              }}
            >
              عرض الكل ›
            </a>
          </div>

          {/* Transaction items */}
          {[
            {
              type: "income",
              label: "دخل",
              desc: "عمل النقل",
              amount: 500,
              color: "#FFCD11",
              icon: "↑",
            },
            {
              type: "expense",
              label: "مصروف",
              desc: "وقود",
              amount: 150,
              color: "#ef4444",
              icon: "↓",
            },
          ].map((tx, i) => (
            <div
              key={i}
              style={{
                background: "#2A2A2A",
                borderRadius: 4,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRight: `3px solid ${tx.color}`,
                marginBottom: 8,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: tx.color,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    margin: "0 0 2px",
                  }}
                >
                  {tx.label}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "#A0A0A0",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tx.desc}
                </p>
              </div>
              <div
                style={{
                  textAlign: "end",
                  flexShrink: 0,
                  paddingLeft: 12,
                }}
              >
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 900,
                    color: tx.color,
                    margin: "0 0 2px",
                    fontFamily: "'Barlow Condensed', inherit",
                  }}
                  dir="ltr"
                >
                  {tx.type === "income" ? "+" : "-"}
                  {tx.amount} {sym}
                </p>
                <p style={{ fontSize: 10, color: "#A0A0A0", margin: 0 }}>
                  10:30
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          BOTTOM NAVIGATION
      ═══════════════════════════════════════ */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "70px",
          background: "#111111",
          borderTop: "3px solid #FFCD11",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          zIndex: 40,
          paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        }}
      >
        {/* Home */}
        <button
          style={{
            flex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#FFCD11",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <span style={{ fontSize: 20, marginBottom: 4 }}>🏠</span>
          الرئيسية
        </button>

        {/* Transactions */}
        <button
          style={{
            flex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#A0A0A0",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <span style={{ fontSize: 20, marginBottom: 4 }}>📝</span>
          المعاملات
        </button>

        {/* Central + Button */}
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "#FFCD11",
            color: "#1A1A1A",
            border: "none",
            cursor: "pointer",
            fontWeight: 900,
            fontSize: 28,
            fontFamily: "inherit",
            position: "absolute",
            bottom: 14,
            boxShadow: "0 4px 12px rgba(255, 205, 17, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          +
        </button>

        {/* Invoices */}
        <button
          style={{
            flex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#A0A0A0",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <span style={{ fontSize: 20, marginBottom: 4 }}>🧾</span>
          الفواتير
        </button>

        {/* Language */}
        <button
          style={{
            flex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#A0A0A0",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <span style={{ fontSize: 20, marginBottom: 4 }}>🌐</span>
          EN
        </button>
      </nav>

      {/* BOTTOM SHEET FORM OVERLAY */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.7)",
          }}
          onClick={() => setShowForm(false)}
        >
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              background: "#2A2A2A",
              borderTop: "3px solid #FFCD11",
              maxHeight: "85vh",
              borderRadius: "20px 20px 0 0",
              display: "flex",
              flexDirection: "column",
              zIndex: 51,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "12px 0 4px",
              }}
            >
              <div
                style={{ width: 40, height: 3, background: "#FFCD11" }}
              />
            </div>

            <div style={{ padding: "0 16px 60px", textAlign: "center" }}>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: "#FFFFFF",
                  margin: "16px 0 24px",
                  textTransform: "uppercase",
                }}
              >
                إضافة معاملة جديدة
              </h2>
              <p style={{ color: "#A0A0A0", fontSize: 14 }}>
                سيتم فتح نموذج إضافة المعاملات هنا
              </p>
            </div>

            {/* Fixed Save Button */}
            <button
              onClick={() => setShowForm(false)}
              style={{
                position: "fixed",
                bottom: 16,
                left: 16,
                right: 16,
                height: 56,
                borderRadius: 8,
                border: "none",
                background: "#FFCD11",
                color: "#1A1A1A",
                fontWeight: 900,
                fontSize: 16,
                fontFamily: "inherit",
                cursor: "pointer",
                boxShadow: "0 -4px 20px rgba(255, 205, 17, 0.3)",
              }}
            >
              💾 حفظ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
