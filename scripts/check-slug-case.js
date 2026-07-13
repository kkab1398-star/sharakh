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

async function checkSlugCase() {
  const adminClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log('🔍 التحقق من slugs:\n');

  const { data: partners } = await adminClient
    .from('partners')
    .select('company_name, slug');

  partners?.forEach(p => {
    console.log(`🏢 ${p.company_name}`);
    console.log(`   Slug: "${p.slug}"`);
    console.log(`   Lowercase: "${p.slug?.toLowerCase()}"`);
    console.log(`   Match "lensedit"? ${p.slug?.toLowerCase() === 'lensedit' ? '✅' : '❌'}\n`);
  });

  // اختبر الـ API
  console.log('\n🧪 اختبار الـ API:\n');

  const adminApi = createAdminClient();
  const { data, error } = await adminApi
    .from('partners')
    .select('*')
    .eq('slug', 'lensedit');

  console.log('Result:', data);
  if (error) console.log('Error:', error.message);
}

function createAdminClient() {
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

checkSlugCase().catch(console.error);
