// lib/routes.ts
// ملف مركزي لكل روابط النظام
// عدّل هنا فقط ويتغير في كل مكان

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const ROUTES = {
  // روابط الشريك
  partner: {
    login: (slug: string) => `${APP_URL}/login/${slug}`,
    dashboard: `${APP_URL}/dashboard`,
    register: `${APP_URL}/register`,
  },

  // روابط السائق — هذا هو الرابط الصحيح الوحيد
  driver: {
    login: `${APP_URL}/driver/login`,
    loginWithPartner: (partnerId: string) => `${APP_URL}/driver/login?p=${partnerId}`,
    home: `${APP_URL}/driver`,
  },

  // روابط Super Admin
  admin: {
    panel: `${APP_URL}/x7k9-panel-2024`,
  },
} as const;

// دالة مساعدة لبناء رسالة واتساب السائق
export function buildDriverWhatsAppMessage(params: {
  driverName: string;
  companyName: string;
  username: string;
  password?: string;
  partnerId?: string;
}): string {
  console.log('[lib/routes.ts] buildDriverWhatsAppMessage params:', {
    driverName: params.driverName,
    companyName: params.companyName,
    username: params.username,
    partnerId: params.partnerId,
    hasPassword: !!params.password,
  });

  const driverLoginUrl = params.partnerId
    ? ROUTES.driver.loginWithPartner(params.partnerId)
    : ROUTES.driver.login;

  console.log('[lib/routes.ts] Generated driverLoginUrl:', driverLoginUrl);

  let message = `مرحباً ${params.driverName} 👋

تم تسجيلك في نظام شراكة لإدارة المعدات

🔗 رابط دخولك:
${driverLoginUrl}

👤 اسم المستخدم:
${params.username}`;

  if (params.password) {
    message += `

🔑 كلمة المرور:
${params.password}`;
  }

  message += `

⚠️ احتفظ بهذه البيانات ولا تشاركها مع أحد`;

  return message;
}

// دالة مساعدة لبناء رابط واتساب السائق
export function buildDriverWhatsAppURL(params: {
  driverName: string;
  companyName: string;
  username: string;
  password?: string;
  phone: string;
  partnerId?: string;
}): string {
  const message = buildDriverWhatsAppMessage(params);
  const cleanPhone = params.phone.replace(/[^0-9]/g, '');
  const phone = cleanPhone.startsWith('0')
    ? '966' + cleanPhone.slice(1)
    : cleanPhone.startsWith('966')
      ? cleanPhone
      : '966' + cleanPhone;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// دالة مساعدة لبناء رسالة واتساب المشترك الجديد
export function buildPartnerWhatsAppMessage(params: {
  companyName: string;
  email: string;
  password: string;
  slug: string;
  trialDays?: number;
}): string {
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + (params.trialDays || 14));
  const dateStr = trialEndDate.toLocaleDateString('ar-SA');

  const message = `🚀 مرحباً بك في نظام شراكة 🚀

بيانات دخولك:
📧 البريد: ${params.email}
🔑 كلمة المرور: ${params.password}
🔗 الرابط: ${ROUTES.partner.login(params.slug)}

📋 الخطوات الأولى:
1️⃣ الإعدادات ← أضف بيانات شركتك
2️⃣ المعدات ← سجّل معداتك
3️⃣ السائقون ← أضف فريقك
4️⃣ الدورات ← ابدأ العمل
5️⃣ تيليجرام ← استقبل التنبيهات

⏱️ فترة التجربة: 14 يوم (ينتهي في ${dateStr})
✅ بيانات الحساب محفوظة تلقائياً

⚠️ هذه البيانات سرية - لا تشاركها مع أحد`;

  return message;
}

// دالة مساعدة لبناء رابط واتساب المشترك الجديد
export function buildPartnerWhatsAppURL(params: {
  companyName: string;
  email: string;
  password: string;
  slug: string;
  phone: string;
  trialDays?: number;
}): string {
  const message = buildPartnerWhatsAppMessage({
    companyName: params.companyName,
    email: params.email,
    password: params.password,
    slug: params.slug,
    trialDays: params.trialDays,
  });

  const cleanPhone = params.phone.replace(/[^0-9]/g, '');
  const phone = cleanPhone.startsWith('0')
    ? '966' + cleanPhone.slice(1)
    : cleanPhone.startsWith('966')
      ? cleanPhone
      : '966' + cleanPhone;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
