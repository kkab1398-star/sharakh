const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jwekgsjmcacbhunjudwi.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3ZWtnc2ptY2FjYmh1bmp1ZHdpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjUzODExMSwiZXhwIjoyMDk4MTE0MTExfQ.QxAIZT_bLuE_Dzy-0RGG1pz47biznb0UaAlJVkUdnmU';

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const EMAIL = 'kkab1398@gmail.com';
const NEW_PASSWORD = 'AdminPass@123456';

async function resetPassword() {
  try {
    console.log('🔄 Resetting password for:', EMAIL);

    // احصل على user بالبريد الإلكتروني
    const { data: { users }, error: usersError } = await admin.auth.admin.listUsers();

    if (usersError) {
      console.error('❌ Error listing users:', usersError);
      return;
    }

    const user = users.find(u => u.email === EMAIL);

    if (!user) {
      console.error('❌ User not found:', EMAIL);
      return;
    }

    console.log('✓ Found user:', user.id);

    // غيّر كلمة المرور
    const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
      password: NEW_PASSWORD
    });

    if (updateError) {
      console.error('❌ Error updating password:', updateError);
      return;
    }

    console.log('✅ Password reset successfully!');
    console.log('📝 New password:', NEW_PASSWORD);
    console.log('🔗 Login at: http://localhost:3000/admin/login');

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

resetPassword();
