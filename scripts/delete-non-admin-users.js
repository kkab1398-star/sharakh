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
const ADMIN_EMAIL = 'kkab1398@gmail.com';

async function deleteNonAdminUsers() {
  const adminClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log('🗑️  جاري حذف جميع المستخدمين ما عدا الأدمن...\n');

  try {
    const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers();

    if (listError) {
      console.error('❌ خطأ في جلب المستخدمين:', listError.message);
      return;
    }

    console.log(`📊 وجدنا ${users.length} مستخدم\n`);

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

    console.log('\n✅ تم حذف جميع المستخدمين ما عدا الأدمن بنجاح!');

    // التحقق
    const { data: { users: remainingUsers } } = await adminClient.auth.admin.listUsers();

    console.log(`\n📊 عدد المستخدمين المتبقيين: ${remainingUsers.length}`);
    remainingUsers?.forEach(u => {
      console.log(`   📧 ${u.email}`);
    });
  } catch (err) {
    console.error('❌ خطأ:', err.message);
  }
}

deleteNonAdminUsers().catch(console.error);
