require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '../../..', '.env.local');
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
    console.error('Error:', error.message);
    return;
  }

  console.log(`📊 عدد المستخدمين: ${users.length}\n`);
  users.forEach(user => {
    console.log(`📧 ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email Confirmed: ${user.email_confirmed_at ? 'نعم' : 'لا'}`);
    console.log(`   Created: ${user.created_at}\n`);
  });
}

checkUsers().catch(console.error);
