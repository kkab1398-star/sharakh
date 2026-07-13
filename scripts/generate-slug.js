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

// دالة لتوليد slug من اسم الشركة
function generateSlug(companyName) {
  // خريطة للأحرف العربية إلى اللاتينية
  const arabicToLatin = {
    'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
    'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm',
    'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ة': 'a', 'ا': 'a',
    'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
    'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's',
  };

  let slug = companyName.toLowerCase().trim();

  // استبدال الأحرف العربية
  for (const [ar, en] of Object.entries(arabicToLatin)) {
    slug = slug.replace(new RegExp(ar, 'g'), en);
  }

  // تحويل المسافات إلى شرطات
  slug = slug.replace(/\s+/g, '-');

  // إزالة الأحرف غير الصالحة (اترك الأرقام والشرطات فقط)
  slug = slug.replace(/[^a-z0-9\-]/g, '');

  // دمج الشرطات المتعددة
  slug = slug.replace(/\-+/g, '-');

  // إزالة الشرطات من البداية والنهاية
  slug = slug.replace(/^\-+|\-+$/g, '');

  return slug || 'unnamed'; // fallback
}

const env = loadEnv();

async function updateSlugs() {
  const adminClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log('🔄 تحديث slugs...\n');

  // جلب جميع الشركاء التي لا تملك slug
  const { data: partners, error } = await adminClient
    .from('partners')
    .select('id, company_name, slug')
    .is('slug', null);

  if (error) {
    console.error('❌ خطأ في جلب الشركاء:', error.message);
    return;
  }

  if (!partners || partners.length === 0) {
    console.log('✅ جميع الشركاء لديهم slugs');
    return;
  }

  console.log(`📌 وجدنا ${partners.length} شريك بدون slug\n`);

  for (const partner of partners) {
    const slug = generateSlug(partner.company_name);

    try {
      const { error: updateError } = await adminClient
        .from('partners')
        .update({ slug })
        .eq('id', partner.id);

      if (updateError) {
        console.error(`❌ ${partner.company_name}: ${updateError.message}`);
      } else {
        console.log(`✅ ${partner.company_name}`);
        console.log(`   Slug: ${slug}\n`);
      }
    } catch (err) {
      console.error(`❌ خطأ: ${err.message}`);
    }
  }

  console.log('\n🎉 تم تحديث جميع الـ slugs!');
}

updateSlugs().catch(console.error);
