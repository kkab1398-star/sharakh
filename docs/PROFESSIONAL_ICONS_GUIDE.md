# 🎨 نظام الأيقونات الاحترافية - Professional Icons System

## 📋 نظرة عامة

نظام أيقونات شامل احترافي 100% يستخدم أفضل المكتبات العالمية:

- **Radix Icons** - من فريق Vercel (creators of Next.js)
- **Material Design Icons** - من Google

## 🚀 البدء السريع

### التثبيت

```bash
npm install @radix-ui/react-icons @mui/icons-material
```

### الاستخدام الأساسي

```tsx
import { ProIcon, ProIconButton } from '@/components/ui/ProIcon';
import { ProfessionalNavIcons, ProfessionalEquipmentIcons } from '@/lib/professional-icons';

// الأيقونة البسيطة
<ProIcon 
  name="home" 
  size="md" 
  color="primary"
/>

// بطاقة أيقونة مع نص
<ProIconButton 
  icon={<ProfessionalEquipmentIcons.construction />}
  label="المعدات"
  size="lg"
  onClick={() => console.log('clicked')}
/>
```

## 📚 الفئات المتاحة

### 1. الملاحة (Navigation)
```tsx
import { ProfessionalNavIcons } from '@/lib/professional-icons';

ProfessionalNavIcons.home          // الرئيسية
ProfessionalNavIcons.profile       // الملف الشخصي
ProfessionalNavIcons.settings      // الإعدادات
ProfessionalNavIcons.dashboard     // لوحة التحكم
ProfessionalNavIcons.reports       // التقارير
ProfessionalNavIcons.notifications // الإشعارات
```

### 2. المعدات والبناء (Equipment)
```tsx
import { ProfessionalEquipmentIcons } from '@/lib/professional-icons';

ProfessionalEquipmentIcons.construction  // البناء
ProfessionalEquipmentIcons.engineering   // الهندسة
ProfessionalEquipmentIcons.tools         // الأدوات
ProfessionalEquipmentIcons.factory       // المصنع
ProfessionalEquipmentIcons.truck         // الشاحنة
ProfessionalEquipmentIcons.build         // البناء
```

### 3. المالية (Finance)
```tsx
import { ProfessionalFinanceIcons } from '@/lib/professional-icons';

ProfessionalFinanceIcons.income    // الدخل
ProfessionalFinanceIcons.expense   // المصاريف
ProfessionalFinanceIcons.transfer  // التحويل
ProfessionalFinanceIcons.chart     // الرسم البياني
ProfessionalFinanceIcons.wallet    // المحفظة
```

### 4. الإجراءات (Actions)
```tsx
import { ProfessionalActionIcons } from '@/lib/professional-icons';

ProfessionalActionIcons.add        // إضافة
ProfessionalActionIcons.delete     // حذف
ProfessionalActionIcons.edit       // تعديل
ProfessionalActionIcons.view       // عرض
ProfessionalActionIcons.search     // بحث
ProfessionalActionIcons.copy       // نسخ
```

### 5. الحالة (Status)
```tsx
import { ProfessionalStatusIcons } from '@/lib/professional-icons';

ProfessionalStatusIcons.success    // نجاح
ProfessionalStatusIcons.error      // خطأ
ProfessionalStatusIcons.warning    // تحذير
ProfessionalStatusIcons.info       // معلومة
ProfessionalStatusIcons.help       // مساعدة
```

### 6. النماذج (Forms)
```tsx
import { ProfessionalFormIcons } from '@/lib/professional-icons';

ProfessionalFormIcons.email        // البريد
ProfessionalFormIcons.password     // كلمة المرور
ProfessionalFormIcons.calendar     // التاريخ
ProfessionalFormIcons.visibility   // الرؤية
```

## 🎨 الأحجام المتاحة

```tsx
<ProIcon size="xs" />      // 12px
<ProIcon size="sm" />      // 16px
<ProIcon size="md" />      // 20px (الافتراضي)
<ProIcon size="lg" />      // 24px
<ProIcon size="xl" />      // 32px
<ProIcon size="2xl" />     // 48px
<ProIcon size="3xl" />     // 64px
```

## 🎯 الألوان المتاحة (CAT Theme)

```tsx
<ProIcon color="primary" />   // #FFCD11 (الذهبي الأساسي)
<ProIcon color="dark" />      // #1A1A1A (الأسود الداكن)
<ProIcon color="light" />     // #A0A0A0 (الرمادي الفاتح)
<ProIcon color="success" />   // الأخضر (النجاح)
<ProIcon color="danger" />    // الأحمر (الخطأ)
<ProIcon color="warning" />   // الأصفر (التحذير)
<ProIcon color="info" />      // الأزرق (المعلومة)
<ProIcon color="gray" />      // الرمادي
<ProIcon color="white" />     // الأبيض
```

## ⚙️ خصائص المكون

### ProIcon Props
```tsx
interface ProIconProps {
  name?: ProfessionalIconName;           // اسم الأيقونة
  icon?: React.ReactNode;                 // أيقونة مخصصة
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  color?: 'primary' | 'dark' | 'light' | 'success' | 'danger' | 'warning' | 'info' | 'gray' | 'white';
  variant?: 'solid' | 'outline' | 'ghost';
  className?: string;                    // classes إضافية
  onClick?: () => void;                  // دالة النقر
  disabled?: boolean;                    // تعطيل
  loading?: boolean;                     // حالة التحميل
  animate?: 'none' | 'spin' | 'bounce' | 'pulse'; // animation
  title?: string;                        // نص التمرير
}
```

### ProIconButton Props
```tsx
interface ProIconButtonProps extends ProIconProps {
  label?: string;                        // النص
  badge?: string | number;               // شارة (رقم إخطارات)
}
```

## 💡 أمثلة عملية

### 1. زر مع شارة إخطارات
```tsx
<ProIconButton
  name="notifications"
  badge={5}
  size="lg"
  onClick={() => handleNotifications()}
/>
```

### 2. مجموعة أيقونات
```tsx
<ProIconGroup
  icons={[
    { name: 'add', label: 'إضافة', onClick: () => {} },
    { name: 'edit', label: 'تعديل', onClick: () => {} },
    { name: 'delete', label: 'حذف', onClick: () => {} },
  ]}
  size="lg"
  spacing="normal"
/>
```

### 3. أيقونة بحالة تحميل
```tsx
<ProIcon
  name="refresh"
  loading={isLoading}
  animate="spin"
  color="primary"
/>
```

### 4. أيقونة مخصصة
```tsx
<ProIcon
  icon={<YourCustomIcon />}
  size="2xl"
  color="primary"
  onClick={() => {}}
/>
```

## 🎭 Animation Options

```tsx
// بدون تحريك
<ProIcon animate="none" />

// تدوير
<ProIcon animate="spin" />

// ارتداد
<ProIcon animate="bounce" />

// نبض
<ProIcon animate="pulse" />
```

## 🔐 Accessibility

جميع الأيقونات مزودة بـ:
- `aria-label` للقارئات الصوتية
- `role="img"` أو `role="button"`
- `tabIndex` للملاحة بلوحة المفاتيح
- دعم الحالات المعطلة

## 🎯 معايير الجودة

✅ **احترافي 100%**
- استخدام من قبل Vercel, Google, Microsoft
- تصميم minimal و professional
- NOT طفولي أو بسيط جداً

✅ **أداء عالي**
- Tree-shaking تلقائي
- حجم صغير جداً
- بدون رسوميات ثقيلة

✅ **سهولة الاستخدام**
- واجهة بسيطة وواضحة
- توثيق شامل
- أمثلة عملية

## 📦 البنية

```
lib/
  └── professional-icons.ts          # خريطة الأيقونات
components/
  └── ui/
      └── ProIcon.tsx                # مكونات الأيقونات
docs/
  └── PROFESSIONAL_ICONS_GUIDE.md   # هذا الملف
```

## 🚀 إضافة أيقونات جديدة

لإضافة أيقونة جديدة:

1. استيرد الأيقونة من Radix أو Material
2. أضفها إلى الفئة المناسبة في `lib/professional-icons.ts`
3. استخدمها عبر الخريطة

```tsx
// مثال
export const ProfessionalNewCategory = {
  newIcon: NewIconComponent,
}
```

## 📞 Support

للمساعدة أو الأسئلة:
- شاهد `PROFESSIONAL_ICONS_GUIDE.md`
- ابحث في أمثلة الاستخدام في الكود
- راجع توثيق Radix و Material Design

---

**نسخة:** 1.0  
**آخر تحديث:** يوليو 2026  
**الحالة:** Production Ready ✅
