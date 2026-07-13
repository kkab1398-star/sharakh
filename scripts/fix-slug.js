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

async function fixSlug() {
  const adminClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log('🔧 إصلاح slugs...\n');

  const { error: updateError } = await adminClient
    .from('partners')
    .update({ slug: 'test-company' })
    .eq('slug', '-');

  if (updateError) {
    console.error('❌ خطأ:', updateError.message);
  } else {
    console.log('✅ تم تحديث slug إلى: test-company\n');
  }

  // التحقق
  const { data: partners } = await adminClient
    .from('partners')
    .select('company_name, slug');

  partners?.forEach(p => {
    console.log(`🏢 ${p.company_name} → ${p.slug}`);
  });
}

fixSlug().catch(console.error);
