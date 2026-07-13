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

async function checkUsers() {
  const adminClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const { data: { users }, error } = await adminClient.auth.admin.listUsers();

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`📊 عدد المستخدمين: ${users.length}\n`);
  users.forEach(user => {
    console.log(`📧 ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email Confirmed: ${user.email_confirmed_at ? 'نعم ✅' : 'لا ❌'}`);
    console.log(`   Created: ${user.created_at}\n`);
  });

  // التحقق من جدول partners
  console.log('\n===== جدول Partners =====\n');
  const { data: partners, error: partnersError } = await adminClient
    .from('partners')
    .select('*');

  if (partnersError) {
    console.error('❌ خطأ في جلب partners:', partnersError.message);
  } else {
    console.log(`📊 عدد الشركاء: ${partners?.length || 0}\n`);
    if (partners && partners.length > 0) {
      partners.forEach(p => {
        console.log(`🏢 ${p.company_name || 'N/A'}`);
        console.log(`   User ID: ${p.user_id}`);
        console.log(`   Slug: ${p.slug}`);
        console.log(`   Created: ${p.created_at}\n`);
      });
    } else {
      console.log('❌ لا توجد شركاء في قاعدة البيانات\n');
    }
  }
}

checkUsers().catch(console.error);
