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

async function checkDuplicates() {
  const adminClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log('🔍 البحث عن slugs المكررة:\n');

  const { data: partners, error } = await adminClient
    .from('partners')
    .select('id, company_name, slug, user_id');

  if (error) {
    console.error('❌ خطأ:', error.message);
    return;
  }

  // تجميع حسب slug
  const slugGroups = {};
  partners?.forEach(p => {
    if (!slugGroups[p.slug]) {
      slugGroups[p.slug] = [];
    }
    slugGroups[p.slug].push(p);
  });

  // البحث عن المكررات
  for (const [slug, items] of Object.entries(slugGroups)) {
    if (items.length > 1) {
      console.log(`⚠️  DUPLICATE: slug="${slug}" يوجد ${items.length} سجل:\n`);
      items.forEach((p, i) => {
        console.log(`   ${i + 1}. ID: ${p.id}`);
        console.log(`      اسم: ${p.company_name}`);
        console.log(`      User ID: ${p.user_id}\n`);
      });
    }
  }

  console.log('\n✅ انتهى البحث');
}

checkDuplicates().catch(console.error);
