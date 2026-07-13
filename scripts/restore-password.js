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

async function restorePassword() {
  const adminClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const email = 'lens4edit@gmail.com';
  const newPassword = 'm02460246';

  console.log('🔐 إعادة تعيين كلمة المرور الأصلية...\n');

  try {
    const { data, error } = await adminClient.auth.admin.updateUserById(
      'd72e51ee-679e-4174-8e26-0e2c2f36565f',
      { password: newPassword }
    );

    if (error) {
      console.error('❌ خطأ:', error.message);
      return;
    }

    console.log(`✅ تم إعادة تعيين كلمة المرور\n`);
    console.log(`📧 البريد: ${email}`);
    console.log(`🔑 كلمة المرور: ${newPassword}`);
    console.log(`\n✅ تم استعادة كلمة المرور الأصلية`);
  } catch (err) {
    console.error('❌ خطأ:', err.message);
  }
}

restorePassword().catch(console.error);
