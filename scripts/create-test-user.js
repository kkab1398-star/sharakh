const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};

  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  });

  return env;
}

const env = loadEnv();

async function createTestUser() {
  const adminClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const testEmail = 'test-sharakh@example.com';
  const testPassword = 'TestPassword123!';

  console.log('🔐 إنشاء مستخدم اختبار جديد...\n');

  try {
    // إنشاء المستخدم عبر Admin API
    const { data: userData, error: userError } = await adminClient.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true, // تأكيد البريد مباشرة
    });

    if (userError) {
      console.error('❌ خطأ في إنشاء المستخدم:', userError.message);
      return;
    }

    console.log(`✅ تم إنشاء المستخدم`);
    console.log(`📧 البريد الإلكتروني: ${testEmail}`);
    console.log(`🔑 كلمة المرور: ${testPassword}`);
    console.log(`👤 User ID: ${userData.user.id}\n`);

    // إنشاء سجل الشريك
    const { data: partner, error: partnerError } = await adminClient
      .from('partners')
      .insert({
        user_id: userData.user.id,
        company_name: 'شركة الاختبار',
        currency: 'SAR',
        locale: 'ar',
        theme: 'light',
      })
      .select()
      .single();

    if (partnerError) {
      console.error('❌ خطأ في إنشاء الشريك:', partnerError.message);
      return;
    }

    console.log('✅ تم إنشاء سجل الشريك');
    console.log(`🏢 اسم الشركة: ${partner.company_name}`);
    console.log(`📍 Slug: ${partner.slug}\n`);

    // اختبار الدخول
    console.log('🧪 اختبار تسجيل الدخول...\n');

    const { data: loginData, error: loginError } = await adminClient.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (loginError) {
      console.error('❌ خطأ في الدخول:', loginError.message);
      return;
    }

    console.log('✅ تم الدخول بنجاح!');
    console.log(`👤 User: ${loginData.user.email}`);
    console.log(`🔐 Session: ${loginData.session ? 'موجودة' : 'غير موجودة'}`);
  } catch (err) {
    console.error('❌ خطأ غير متوقع:', err.message);
  }
}

createTestUser().catch(console.error);
