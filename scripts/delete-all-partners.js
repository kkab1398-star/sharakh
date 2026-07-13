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

async function deleteAllPartners() {
  const adminClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log('🗑️  جاري حذف جميع المشتركين...\n');

  try {
    // جلب جميع الشركاء أولاً
    const { data: partners, error: fetchError } = await adminClient
      .from('partners')
      .select('id, company_name, user_id');

    if (fetchError) {
      console.error('❌ خطأ في جلب الشركاء:', fetchError.message);
      return;
    }

    if (!partners || partners.length === 0) {
      console.log('✅ لا توجد شركاء لحذفها');
      return;
    }

    console.log(`📊 وجدنا ${partners.length} شريك\n`);

    // حذف جميع الشركاء
    for (const partner of partners) {
      const { error: deleteError } = await adminClient
        .from('partners')
        .delete()
        .eq('id', partner.id);

      if (deleteError) {
        console.error(`❌ فشل حذف ${partner.company_name}:`, deleteError.message);
      } else {
        console.log(`🗑️  تم حذف: ${partner.company_name}`);
      }
    }

    console.log('\n✅ تم حذف جميع الشركاء بنجاح!');

    // التحقق
    const { count } = await adminClient
      .from('partners')
      .select('*', { count: 'exact', head: true });

    console.log(`\n📊 عدد الشركاء المتبقيين: ${count || 0}`);
  } catch (err) {
    console.error('❌ خطأ:', err.message);
  }
}

deleteAllPartners().catch(console.error);
