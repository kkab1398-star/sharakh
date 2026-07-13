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

async function checkFirstLogin() {
  const adminClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log('🔍 التحقق من حقل is_first_login:\n');

  const { data: partners, error } = await adminClient
    .from('partners')
    .select('company_name, is_first_login, user_id');

  if (error) {
    console.error('❌ خطأ:', error.message);
    return;
  }

  partners?.forEach(p => {
    console.log(`🏢 ${p.company_name}`);
    console.log(`   is_first_login: ${p.is_first_login ? '✅ صحيح (يحتاج تغيير كلمة مرور)' : '❌ خاطئ (لا يحتاج تغيير)'}\n`);
  });
}

checkFirstLogin().catch(console.error);
