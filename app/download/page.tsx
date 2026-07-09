'use client';

import React from 'react';

export default function DownloadPage() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/نظام_إدارة_الحاويات.xlsx';
    link.download = 'نظام_إدارة_الحاويات.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0D1B2A 0%, #003D82 100%)',
      fontFamily: 'Calibri, Arial, sans-serif',
      direction: 'rtl',
    }}>
      <div style={{
        textAlign: 'center',
        padding: '60px 40px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '15px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        maxWidth: '600px',
        width: '90%',
      }}>
        {/* العنوان الرئيسي */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#003D82',
          marginBottom: '10px',
          margin: '0 0 10px 0',
        }}>
          📊 نظام إدارة الحاويات
        </h1>

        {/* الوصف */}
        <p style={{
          fontSize: '16px',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.6',
        }}>
          نظام احترافي متقدم لإدارة الحاويات والشحنات
        </p>

        {/* معلومات الملف */}
        <div style={{
          background: '#F0F5FF',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '30px',
          border: '2px solid #0066CC',
        }}>
          <p style={{
            fontSize: '14px',
            color: '#003D82',
            margin: '8px 0',
          }}>
            <strong>📄 اسم الملف:</strong> نظام_إدارة_الحاويات.xlsx
          </p>
          <p style={{
            fontSize: '14px',
            color: '#003D82',
            margin: '8px 0',
          }}>
            <strong>📊 الحجم:</strong> ~14 KB
          </p>
          <p style={{
            fontSize: '14px',
            color: '#003D82',
            margin: '8px 0',
          }}>
            <strong>📋 المحتوى:</strong> 7 أوراق احترافية + 15 حاوية تجريبية
          </p>
        </div>

        {/* الميزات */}
        <div style={{
          textAlign: 'right',
          marginBottom: '30px',
          background: '#F9F9F9',
          padding: '20px',
          borderRadius: '10px',
        }}>
          <h3 style={{
            fontSize: '16px',
            color: '#003D82',
            marginBottom: '15px',
          }}>
            ✨ الميزات:
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: '0',
            margin: '0',
            textAlign: 'right',
          }}>
            <li style={{
              fontSize: '14px',
              color: '#333',
              margin: '8px 0',
              paddingRight: '20px',
            }}>
              ✅ لوحة تحكم ديناميكية مع KPI Cards
            </li>
            <li style={{
              fontSize: '14px',
              color: '#333',
              margin: '8px 0',
              paddingRight: '20px',
            }}>
              ✅ قاعدة بيانات منظمة (15 حاوية)
            </li>
            <li style={{
              fontSize: '14px',
              color: '#333',
              margin: '8px 0',
              paddingRight: '20px',
            }}>
              ✅ نظام تصاريح متقدم
            </li>
            <li style={{
              fontSize: '14px',
              color: '#333',
              margin: '8px 0',
              paddingRight: '20px',
            }}>
              ✅ تقارير وإحصائيات شاملة
            </li>
            <li style={{
              fontSize: '14px',
              color: '#333',
              margin: '8px 0',
              paddingRight: '20px',
            }}>
              ✅ شهادات استقبال وتسليم
            </li>
            <li style={{
              fontSize: '14px',
              color: '#333',
              margin: '8px 0',
              paddingRight: '20px',
            }}>
              ✅ تصميم RTL عربي 100%
            </li>
          </ul>
        </div>

        {/* زر التنزيل */}
        <button
          onClick={handleDownload}
          style={{
            background: 'linear-gradient(135deg, #0066CC 0%, #003D82 100%)',
            color: 'white',
            border: 'none',
            padding: '16px 50px',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0, 102, 204, 0.4)',
            width: '100%',
            marginBottom: '15px',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
            (e.target as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(0, 102, 204, 0.6)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
            (e.target as HTMLButtonElement).style.boxShadow = '0 4px 15px rgba(0, 102, 204, 0.4)';
          }}
        >
          📥 تنزيل الملف
        </button>

        {/* معلومة إضافية */}
        <p style={{
          fontSize: '12px',
          color: '#999',
          marginTop: '20px',
        }}>
          💡 بعد التنزيل، استخدم Microsoft Excel أو أي برنامج شبيه لفتح الملف
        </p>
      </div>
    </div>
  );
}
