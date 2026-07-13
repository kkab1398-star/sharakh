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

async function checkSchema() {
  const adminClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log('📊 الأعمدة في جدول partners:\n');

  // استعلام لجلب تعريف الجدول
  const { data, error } = await adminClient
    .rpc('exec_sql', {
      sql: `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'partners' ORDER BY ordinal_position`
    });

  if (error) {
    console.error('❌ خطأ:', error.message);

    // محاولة بديلة - جلب سجل واحد والتحقق من الأعمدة
    const { data: partners } = await adminClient
      .from('partners')
      .select('*')
      .limit(1);

    if (partners && partners.length > 0) {
      console.log('✅ الأعمدة (من البيانات الفعلية):');
      console.log(Object.keys(partners[0]).join('\n'));
    }
  } else {
    console.log('✅ الأعمدة:');
    data?.forEach(col => {
      console.log(`${col.column_name} (${col.data_type})`);
    });
  }
}

checkSchema().catch(console.error);
