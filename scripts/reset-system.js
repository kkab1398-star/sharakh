const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// قراءة متغيرات البيئة من .env.local
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
const ADMIN_EMAIL = 'kkab1398@gmail.com';

async function createAdminClient() {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('❌ بيانات Supabase غير موجودة في .env.local');
    process.exit(1);
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

async function resetDatabase() {
  console.log('🔴 بدء تصفير النظام...\n');

  const adminClient = await createAdminClient();

  // الخطوة 1: حذف البيانات من قاعدة البيانات
  console.log('📊 الخطوة 1: حذف البيانات من قاعدة البيانات...');

  const tablesToDelete = [
    'invoices',
    'transactions',
    'financial_cycles',
    'worker_contracts',
    'customers',
    'expense_types',
    'services',
    'equipment',
    'equipment_types',
    'workers',
  ];

  for (const table of tablesToDelete) {
    try {
      const { count, error } = await adminClient
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) {
        console.warn(`⚠️  ${table}: ${error.message}`);
      } else {
        console.log(`✅ تم حذف جدول ${table} (${count} صف)`);
      }
    } catch (err) {
      console.warn(`⚠️  خطأ في ${table}: ${err.message}`);
    }
  }

  // حذف الشركاء ما عدا الأدمن
  console.log('\n🤝 حذف الشركاء ما عدا الأدمن...');
  try {
    const { data: adminUser, error: adminError } = await adminClient
      .from('auth.users')
      .select('id')
      .eq('email', ADMIN_EMAIL)
      .single();

    if (!adminError && adminUser) {
      const { count, error } = await adminClient
        .from('partners')
        .delete()
        .neq('user_id', adminUser.id);

      if (error) {
        console.warn(`⚠️  ${error.message}`);
      } else {
        console.log(`✅ تم حذف الشركاء (${count} صف)`);
      }
    }
  } catch (err) {
    console.warn(`⚠️  خطأ في حذف الشركاء: ${err.message}`);
  }

  // الخطوة 2: حذف حسابات Auth ما عدا الأدمن
  console.log('\n🔐 الخطوة 2: حذف حسابات Supabase Auth...');

  try {
    const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers();

    if (listError) {
      console.error('❌ خطأ في جلب المستخدمين:', listError.message);
      return;
    }

    console.log(`📌 وجدنا ${users.length} مستخدم\n`);

    for (const user of users) {
      if (user.email === ADMIN_EMAIL) {
        console.log(`✅ محفوظ: ${user.email} (الأدمن)`);
      } else {
        try {
          await adminClient.auth.admin.deleteUser(user.id);
          console.log(`🗑️  تم حذف: ${user.email}`);
        } catch (err) {
          console.error(`❌ فشل حذف ${user.email}:`, err.message);
        }
      }
    }
  } catch (err) {
    console.error('❌ خطأ في حذف المستخدمين:', err.message);
    return;
  }

  // الخطوة 3: التحقق
  console.log('\n✔️  الخطوة 3: التحقق من النتائج...\n');

  try {
    // التحقق من عدد الشركاء
    const { count: partnersCount, error: partnersError } = await adminClient
      .from('partners')
      .select('*', { count: 'exact', head: true });

    if (!partnersError) {
      console.log(`📌 عدد الشركاء المتبقيين: ${partnersCount}`);
    }

    // التحقق من المستخدمين المتبقيين
    const { data: { users: remainingUsers }, error: usersError } = await adminClient.auth.admin.listUsers();

    if (!usersError) {
      console.log(`📌 عدد المستخدمين المتبقيين: ${remainingUsers.length}`);
      remainingUsers.forEach(user => {
        console.log(`   📧 ${user.email}`);
      });
    }

    console.log('\n✅ تم تصفير النظام بنجاح!');
    console.log(`✅ الأدمن محفوظ: ${ADMIN_EMAIL}`);
  } catch (err) {
    console.error('❌ خطأ في التحقق:', err.message);
  }
}

resetDatabase().catch(console.error);
