'use client';

import React from 'react';
import { ProIcon, ProIconButton, ProIconGroup } from '@/components/ui/ProIcon';
import {
  ProfessionalNavIcons,
  ProfessionalEquipmentIcons,
  ProfessionalFinanceIcons,
  ProfessionalActionIcons,
  ProfessionalStatusIcons,
  ProfessionalUserIcons,
  ProfessionalFormIcons,
} from '@/lib/professional-icons';

// ═══════════════════════════════════════════════════════════════
// 🎯 مثال 1: عناصر الملاحة
// ═══════════════════════════════════════════════════════════════
export function NavigationExample() {
  return (
    <div style={{ padding: '24px', background: '#F5F5F5', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '16px', color: '#1A1A1A', fontSize: '16px', fontWeight: 700 }}>
        🏠 عناصر الملاحة الرئيسية
      </h3>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <ProIconButton
          name="home"
          label="الرئيسية"
          size="lg"
          color="primary"
          onClick={() => console.log('Home clicked')}
        />
        <ProIconButton
          name="dashboard"
          label="لوحة التحكم"
          size="lg"
          color="dark"
          onClick={() => console.log('Dashboard clicked')}
        />
        <ProIconButton
          name="profile"
          label="الملف الشخصي"
          size="lg"
          color="primary"
          onClick={() => console.log('Profile clicked')}
        />
        <ProIconButton
          name="settings"
          label="الإعدادات"
          size="lg"
          color="dark"
          onClick={() => console.log('Settings clicked')}
        />
        <ProIconButton
          name="notifications"
          label="الإشعارات"
          size="lg"
          color="warning"
          badge={5}
          onClick={() => console.log('Notifications clicked')}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🏗️ مثال 2: أيقونات المعدات
// ═══════════════════════════════════════════════════════════════
export function EquipmentExample() {
  return (
    <div style={{ padding: '24px', background: '#F5F5F5', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '16px', color: '#1A1A1A', fontSize: '16px', fontWeight: 700 }}>
        🏗️ أيقونات المعدات الثقيلة
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '8px' }}>
            <ProIcon
              icon={<ProfessionalEquipmentIcons.construction style={{ width: 32, height: 32 }} />}
              size="xl"
              color="primary"
            />
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A' }}>البناء</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '8px' }}>
            <ProIcon
              icon={<ProfessionalEquipmentIcons.engineering style={{ width: 32, height: 32 }} />}
              size="xl"
              color="primary"
            />
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A' }}>الهندسة</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '8px' }}>
            <ProIcon
              icon={<ProfessionalEquipmentIcons.truck style={{ width: 32, height: 32 }} />}
              size="xl"
              color="primary"
            />
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A' }}>الشاحنة</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '8px' }}>
            <ProIcon
              icon={<ProfessionalEquipmentIcons.tools style={{ width: 32, height: 32 }} />}
              size="xl"
              color="primary"
            />
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A' }}>الأدوات</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '8px' }}>
            <ProIcon
              icon={<ProfessionalEquipmentIcons.factory style={{ width: 32, height: 32 }} />}
              size="xl"
              color="primary"
            />
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A' }}>المصنع</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 💰 مثال 3: الحالات المالية
// ═══════════════════════════════════════════════════════════════
export function FinanceExample() {
  const transactions = [
    { type: 'income', label: 'دخل', amount: '+5,000 ر.س', color: 'success' as const },
    { type: 'expense', label: 'مصروف', amount: '-1,200 ر.س', color: 'danger' as const },
    { type: 'transfer', label: 'تحويل', amount: '-2,500 ر.س', color: 'info' as const },
  ];

  return (
    <div style={{ padding: '24px', background: '#F5F5F5', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '16px', color: '#1A1A1A', fontSize: '16px', fontWeight: 700 }}>
        💰 المعاملات المالية
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {transactions.map((tx, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'white',
              borderRadius: '8px',
              border: '1px solid #E0E0E0',
            }}
          >
            <ProIcon
              name={tx.type as any}
              size="lg"
              color={tx.color}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A' }}>
                {tx.label}
              </div>
              <div style={{ fontSize: '12px', color: '#A0A0A0' }}>
                اليوم الساعة 2:30 م
              </div>
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: 700,
              color: tx.color === 'success' ? '#10B981' : tx.color === 'danger' ? '#EF4444' : '#0066CC',
            }}>
              {tx.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ✅ مثال 4: الحالات والتنبيهات
// ═══════════════════════════════════════════════════════════════
export function StatusExample() {
  const statuses = [
    { name: 'success', label: 'نجح', message: 'تم حفظ البيانات بنجاح' },
    { name: 'error', label: 'خطأ', message: 'حدث خطأ أثناء المعالجة' },
    { name: 'warning', label: 'تحذير', message: 'يرجى التحقق من البيانات' },
    { name: 'info', label: 'معلومة', message: 'عملية جديدة تم بدؤها' },
  ];

  return (
    <div style={{ padding: '24px', background: '#F5F5F5', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '16px', color: '#1A1A1A', fontSize: '16px', fontWeight: 700 }}>
        ⚠️ حالات ورسائل
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {statuses.map((status, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: status.name === 'success' ? '#D4EDDA' :
                         status.name === 'error' ? '#F8D7DA' :
                         status.name === 'warning' ? '#FFF3CD' : '#D1ECF1',
              borderRadius: '8px',
              borderLeft: '4px solid ' + (
                status.name === 'success' ? '#28a745' :
                status.name === 'error' ? '#DC3545' :
                status.name === 'warning' ? '#FFC107' : '#17A2B8'
              ),
            }}
          >
            <ProIcon
              name={status.name as any}
              size="md"
              color={
                status.name === 'success' ? 'success' :
                status.name === 'error' ? 'danger' :
                status.name === 'warning' ? 'warning' : 'info'
              }
            />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>
                {status.label}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {status.message}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🎯 مثال 5: شريط الإجراءات (Action Bar)
// ═══════════════════════════════════════════════════════════════
export function ActionBarExample() {
  return (
    <div style={{ padding: '24px', background: '#F5F5F5', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '16px', color: '#1A1A1A', fontSize: '16px', fontWeight: 700 }}>
        🎯 شريط الإجراءات
      </h3>
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '16px',
        background: 'white',
        borderRadius: '8px',
        border: '1px solid #E0E0E0',
      }}>
        <ProIconButton
          name="add"
          title="إضافة جديد"
          size="lg"
          color="primary"
          onClick={() => alert('إضافة')}
        />
        <ProIconButton
          name="edit"
          title="تعديل"
          size="lg"
          color="dark"
          onClick={() => alert('تعديل')}
        />
        <ProIconButton
          name="view"
          title="عرض"
          size="lg"
          color="info"
          onClick={() => alert('عرض')}
        />
        <ProIconButton
          name="delete"
          title="حذف"
          size="lg"
          color="danger"
          onClick={() => alert('حذف')}
        />
        <ProIconButton
          name="copy"
          title="نسخ"
          size="lg"
          color="dark"
          onClick={() => alert('تم النسخ')}
        />
        <ProIconButton
          name="download"
          title="تحميل"
          size="lg"
          color="dark"
          onClick={() => alert('تحميل')}
        />
        <ProIconButton
          name="refresh"
          title="تحديث"
          size="lg"
          color="dark"
          onClick={() => alert('تحديث')}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 👥 مثال 6: إدارة المستخدمين
// ═══════════════════════════════════════════════════════════════
export function UserManagementExample() {
  const users = [
    { name: 'محمد علي', role: 'مالك', status: 'نشط' },
    { name: 'فاطمة أحمد', role: 'سائق', status: 'نشط' },
    { name: 'عمر سالم', role: 'مشرف', status: 'معطل' },
  ];

  return (
    <div style={{ padding: '24px', background: '#F5F5F5', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '16px', color: '#1A1A1A', fontSize: '16px', fontWeight: 700 }}>
        👥 قائمة المستخدمين
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {users.map((user, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'white',
              borderRadius: '8px',
              border: '1px solid #E0E0E0',
            }}
          >
            <ProIcon
              icon={<ProfessionalUserIcons.user style={{ width: 24, height: 24 }} />}
              size="lg"
              color="primary"
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '12px', color: '#A0A0A0' }}>
                {user.role}
              </div>
            </div>
            <ProIcon
              name={user.status === 'نشط' ? 'success' : 'error'}
              size="md"
              color={user.status === 'نشط' ? 'success' : 'danger'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 📋 مثال 7: حالات التحميل
// ═══════════════════════════════════════════════════════════════
export function LoadingExample() {
  return (
    <div style={{ padding: '24px', background: '#F5F5F5', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '16px', color: '#1A1A1A', fontSize: '16px', fontWeight: 700 }}>
        ⏳ حالات التحميل
      </h3>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <ProIcon
            name="refresh"
            size="2xl"
            color="primary"
            animate="spin"
          />
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>
            تدوير
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <ProIcon
            icon={<ProfessionalFinanceIcons.chart style={{ width: 32, height: 32 }} />}
            size="2xl"
            color="dark"
            animate="pulse"
          />
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>
            نبض
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <ProIcon
            name="notifications"
            size="2xl"
            color="warning"
            animate="bounce"
          />
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>
            ارتداد
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🎨 مثال 8: جميع الأحجام والألوان
// ═══════════════════════════════════════════════════════════════
export function SizesAndColorsExample() {
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
  const colors = ['primary', 'dark', 'light', 'success', 'danger', 'warning', 'info'] as const;

  return (
    <div style={{ padding: '24px', background: '#F5F5F5', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '16px', color: '#1A1A1A', fontSize: '16px', fontWeight: 700 }}>
        🎨 الأحجام والألوان
      </h3>

      {/* الأحجام */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px' }}>
          الأحجام:
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          {sizes.map(size => (
            <div key={size} style={{ textAlign: 'center' }}>
              <ProIcon
                name="home"
                size={size}
                color="primary"
              />
              <div style={{ fontSize: '11px', marginTop: '4px', color: '#666' }}>
                {size}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* الألوان */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px' }}>
          الألوان:
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          {colors.map(color => (
            <div key={color} style={{ textAlign: 'center' }}>
              <ProIcon
                name="home"
                size="lg"
                color={color}
              />
              <div style={{ fontSize: '11px', marginTop: '4px', color: '#666' }}>
                {color}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 📦 المكون الرئيسي - عرض جميع الأمثلة
// ═══════════════════════════════════════════════════════════════
export default function IconExamplesPage() {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '32px 24px',
      background: '#FAFAFA',
      fontFamily: "'Cairo', 'Segoe UI', sans-serif",
      direction: 'rtl',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* العنوان */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 900,
            color: '#FFCD11',
            marginBottom: '8px',
          }}>
            🎨 نظام الأيقونات الاحترافي
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#A0A0A0',
          }}>
            8 نماذج عملية لاستخدام ProIcon في تطبيقك
          </p>
        </div>

        {/* الشبكة */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '24px',
        }}>
          <NavigationExample />
          <EquipmentExample />
          <FinanceExample />
          <StatusExample />
          <ActionBarExample />
          <UserManagementExample />
          <LoadingExample />
          <SizesAndColorsExample />
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '48px',
          padding: '24px',
          textAlign: 'center',
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #E0E0E0',
        }}>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
            ✅ نظام أيقونات احترافي 100% من Radix Icons + Material Design
          </p>
          <p style={{ fontSize: '12px', color: '#999' }}>
            لمزيد من المعلومات، راجع: <code style={{ background: '#F5F5F5', padding: '2px 6px', borderRadius: '4px' }}>docs/PROFESSIONAL_ICONS_GUIDE.md</code>
          </p>
        </div>
      </div>
    </div>
  );
}
